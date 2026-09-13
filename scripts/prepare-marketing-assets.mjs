import fs from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { unpackCrewSheet } from './crew-sheet.mjs';
import {
  marketerSequence,
  marketerDelays,
  marketerDuration,
} from '../lib/card-showcase.ts';

const source = 'design/marketing',
  output = 'app/assets/marketing';
await fs.mkdir(output, { recursive: true });
for (const [from, to, w, h] of [
  ['luma-feed-ad', 'feed-luma', 720, 900],
  ['daybreak-feed-ad', 'feed-daybreak', 720, 900],
  ['shorts-athletic-master', 'shorts-master', 540, 960],
]) {
  await sharp(`${source}/${from}.png`)
    .resize(w, h, { fit: 'cover' })
    .webp({ quality: 88, effort: 6 })
    .toFile(`${output}/${to}.webp`);
}
const sheet = await sharp(`${source}/marketer-poses.png`)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 0; i < sheet.data.length; i += 4) {
  const [r, g, b] = sheet.data.subarray(i, i + 3),
    spill = Math.max(0, g - Math.max(r, b) - 6),
    a = Math.max(0, 1 - spill / 190);
  if (a < 0.035) {
    sheet.data.fill(0, i, i + 4);
    continue;
  }
  sheet.data[i] = Math.min(255, Math.round(r / a));
  sheet.data[i + 1] = Math.min(255, Math.max(0, Math.round((g - spill) / a)));
  sheet.data[i + 2] = Math.min(255, Math.round(b / a));
  sheet.data[i + 3] = Math.round(a * 255);
}
const cells = unpackCrewSheet(sheet, { columns: 4, rows: 2, id: 'marketer' }),
  frames = [],
  width = 240,
  height = 320;
const scale = 244 / cells[0].bodyHeight;
await fs.mkdir(`${source}/frames`, { recursive: true });
for (const [i, cell] of cells.entries()) {
  const w = Math.round(cell.width * scale),
    h = Math.round(cell.height * scale),
    left = Math.round(width / 2 - cell.anchorX * scale),
    top = height - 10 - h;
  assert.ok(
    left >= 0 && top >= 0 && left + w <= width,
    'Complete marketer must fit',
  );
  const cut = await sharp(cell.rgba, {
    raw: { width: cell.width, height: cell.height, channels: 4 },
  })
    .resize(w, h)
    .png()
    .toBuffer();
  const frame = await sharp({
    create: { width, height, channels: 4, background: '#00000000' },
  })
    .composite([{ input: cut, left, top }])
    .png()
    .toBuffer();
  frames.push(frame);
  await fs.writeFile(`${source}/frames/${i}.png`, frame);
}
await sharp({
  create: { width: width * 8, height, channels: 4, background: '#00000000' },
})
  .composite(frames.map((input, i) => ({ input, left: i * width, top: 0 })))
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile(`${output}/marketer-sprite.webp`);
const raw = await Promise.all(
  marketerSequence.map((i) => sharp(frames[i]).raw().toBuffer()),
);
const gif = await sharp(Buffer.concat(raw), {
  raw: {
    width,
    height: height * marketerSequence.length,
    pageHeight: height,
    channels: 4,
  },
})
  .gif({ loop: 0, delay: marketerDelays, colours: 256, dither: 0.2, effort: 7 })
  .toBuffer();
await fs.mkdir('design/archive/public/images/marketing', { recursive: true });
await fs.writeFile('design/archive/public/images/marketing/marketer.gif', gif);
const meta = await sharp(gif, { animated: true }).metadata();
assert.equal(meta.pages, marketerSequence.length);
await fs.writeFile(
  `${source}/animation.json`,
  JSON.stringify(
    {
      width,
      height,
      sequence: marketerSequence,
      delays: marketerDelays,
      loop: true,
      duration: marketerDuration,
      gifBytes: gif.length,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `Marketing artworks and ${meta.pages}-frame marketer GIF ready (${gif.length} bytes).`,
);
