import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { webPersonSequence, webPersonDelays, webPersonDuration } from '../lib/person-motion.ts';
import { removeChroma } from './person-motion-chroma.mjs';

// Package actual generated writing poses, including their chalk lettering.
// Do not reconstruct the arm or substitute a separately animated chalk path.
const directory = 'design/people-motion/v5/web';
const config = JSON.parse(await fs.readFile(`${directory}/sheet.json`, 'utf8'));
const source = config.background === 'chroma-green'
  ? await removeChroma(`${directory}/source.png`)
  : await sharp(`${directory}/source.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const width = 288, height = 288;
const cells = [];
for (let index = 0; index < config.columns * config.rows; index++) {
  const [regionLeft, regionTop, cellWidth, cellHeight] = config.regions[index];
  const pixels = await sharp(source.data, { raw: source.info })
    .extract({ left: regionLeft, top: regionTop, width: cellWidth, height: cellHeight })
    .raw().toBuffer();
  let left = cellWidth, top = cellHeight, right = -1, bottom = -1;
  for (let y = 0; y < cellHeight; y++) for (let x = 0; x < cellWidth; x++) {
    if (pixels[(y * cellWidth + x) * 4 + 3] < 16) continue;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  assert.ok(left > 0 && top > 0 && right < cellWidth - 1 && bottom < cellHeight - 1, `Pose ${index}: complete cutout must fit with transparent margins`);
  cells.push({ pixels, cellWidth, cellHeight, bounds: { left, top, right, bottom }, anchor: config.anchors[index] });
}
const bounds = {
  left: Math.min(...cells.map(c => c.bounds.left - c.anchor[0])),
  right: Math.max(...cells.map(c => c.bounds.right - c.anchor[0])),
  top: Math.min(...cells.map(c => c.bounds.top - c.anchor[1])),
  bottom: Math.max(...cells.map(c => c.bounds.bottom - c.anchor[1])),
};
const scale = Math.min((width - 12) / (bounds.right - bounds.left + 1), (height - 12) / (bounds.bottom - bounds.top + 1));
const origin = [(width - (bounds.right - bounds.left + 1) * scale) / 2 - bounds.left * scale, height - 6 - (bounds.bottom + 1) * scale];
const frames = [];
await fs.mkdir(`${directory}/frames`, { recursive: true });
for (const [index, cell] of cells.entries()) {
  const b = cell.bounds;
  const cut = await sharp(cell.pixels, { raw: { width: cell.cellWidth, height: cell.cellHeight, channels: 4 } })
    .extract({ left: b.left, top: b.top, width: b.right - b.left + 1, height: b.bottom - b.top + 1 })
    .resize({ width: Math.round((b.right - b.left + 1) * scale) }).png().toBuffer();
  const left = Math.round(origin[0] + (b.left - cell.anchor[0]) * scale);
  const top = Math.round(origin[1] + (b.top - cell.anchor[1]) * scale);
  const frame = await sharp({ create: { width, height, channels: 4, background: '#00000000' } })
    .composite([{ input: cut, left, top }]).png().toBuffer();
  frames.push(frame);
  await fs.writeFile(`${directory}/frames/${index}.png`, frame);
}
await sharp({ create: { width: width * frames.length, height, channels: 4, background: '#00000000' } })
  .composite(frames.map((input, index) => ({ input, left: index * width, top: 0 })))
  .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile('app/assets/people-motion/web-writer-v5.webp');
const gif = await Promise.all(webPersonSequence.map(index => sharp(frames[index]).raw().toBuffer()));
await sharp(Buffer.concat(gif), { raw: { width, height: height * gif.length, pageHeight: height, channels: 4 } })
  .gif({ loop: 0, delay: webPersonDelays, colours: 256, dither: .2, effort: 7 }).toFile('design/archive/public/images/people-motion/web-writer-v5.gif');
await fs.writeFile(`${directory}/animation.json`, JSON.stringify({ width, height, columns: frames.length, rows: 1, sequence: webPersonSequence, delays: webPersonDelays, duration: webPersonDuration, loop: true, interpolation: false, scale, bounds }, null, 2) + '\n');
await fs.mkdir('outputs/assets/2026-09-12/people-v5', { recursive: true });
await sharp({ create: { width: width * config.columns, height: height * config.rows, channels: 4, background: '#e9edef' } })
  .composite(frames.map((input, index) => ({ input, left: index % config.columns * width, top: Math.floor(index / config.columns) * height })))
  .png().toFile('outputs/assets/2026-09-12/people-v5/web-poses.png');
console.log(`WEB: ${frames.length} actual writing poses, ${webPersonDuration}ms loop, lettering baked into each pose.`);
