import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { unpackCrewSheet } from './crew-sheet.mjs';

// Format the controlled chroma intermediates into aligned, transparent poses.
// Keep the original photographs intact; never synthesize movement by rotation.
const source = 'design/people-motion';
const output = 'app/assets/people-motion';
const width = 240, height = 320;
const sequence = [0,1,2,3,4,5,6,7,6,5,4,3,2,1,0];
const delays = [770,140,140,140,140,140,140,3360,210,210,210,210,210,210,770];
await fs.mkdir(output, { recursive: true });
await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const manifest = {};
for (const id of ['designer', 'web']) {
  const sheet = await sharp(`${source}/${id}-presentation-chroma.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = 0; i < sheet.data.length; i += 4) {
    const [r, g, b] = sheet.data.subarray(i, i + 3);
    const spill = Math.max(0, g - Math.max(r, b) - 6);
    const a = Math.max(0, 1 - spill / 190);
    if (a < .035) { sheet.data.fill(0, i, i + 4); transparent++; continue; }
    sheet.data[i] = Math.min(255, Math.round(r / a));
    sheet.data[i + 1] = Math.min(255, Math.max(0, Math.round((g - spill) / a)));
    sheet.data[i + 2] = Math.min(255, Math.round(b / a));
    sheet.data[i + 3] = Math.round(a * 255);
  }
  assert.ok(transparent > sheet.info.width * sheet.info.height * .4, `${id}: clean chroma background required`);
  const cells = unpackCrewSheet(sheet, { columns: 4, rows: 2, id });
  const order = id === 'designer' ? [0,1,4,2,3,5,6,7] : [0,1,2,3,4,5,6,7];
  const scale = Math.min(284 / Math.max(...cells.map(cell => cell.bodyHeight)),
    220 / Math.max(...cells.map(cell => 2 * Math.max(cell.anchorX, cell.width - cell.anchorX))));
  const frames = [];
  await fs.mkdir(`${source}/frames/${id}`, { recursive: true });
  for (const [index, original] of order.entries()) {
    const cell = cells[original];
    const w = Math.round(cell.width * scale), h = Math.round(cell.height * scale);
    // Foot anchor shared across all poses; presentation arm motion is retained.
    const left = Math.round(width / 2 - cell.anchorX * scale), top = height - 12 - h;
    assert.ok(left >= 0 && left + w <= width && top >= 0, `${id}/${index}: full pose must fit`);
    const cut = await sharp(cell.rgba, { raw: { width: cell.width, height: cell.height, channels: 4 } }).resize(w,h).png().toBuffer();
    const frame = await sharp({ create: { width, height, channels: 4, background: '#00000000' } })
      .composite([{ input: cut, left, top }]).png().toBuffer();
    frames.push(frame);
    await fs.writeFile(`${source}/frames/${id}/${index}.png`, frame);
  }
  await sharp({ create: { width: width * 8, height, channels: 4, background: '#00000000' } })
    .composite(frames.map((input,index) => ({ input, left: width * index, top: 0 })))
    .webp({ quality: 91, alphaQuality: 100, effort: 6 }).toFile(`${output}/${id === 'web' ? 'developer' : id}-motion.webp`);
  const raw = await Promise.all(sequence.map(index => sharp(frames[index]).ensureAlpha().raw().toBuffer()));
  const gif = await sharp(Buffer.concat(raw), { raw: { width, height: height * sequence.length, pageHeight: height, channels: 4 } })
    .gif({ loop: 0, delay: delays, colours: 256, dither: .2, effort: 7 }).toBuffer();
  await fs.writeFile(`design/archive/public/images/people-motion/${id}.gif`, gif);
  const metadata = await sharp(gif, { animated: true }).metadata();
  assert.equal(metadata.pages, sequence.length);
  manifest[id] = { width, height, originalPoseOrder: order, sequence, delays, durationMs: delays.reduce((a,b) => a+b,0), gifBytes: gif.length };
}
await fs.writeFile(`${source}/animation.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log('Two aligned presenter sprites and 15-frame GIFs prepared.');
