import fs from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { unpackCrewSheet } from './crew-sheet.mjs';
import { removeChroma } from './person-motion-chroma.mjs';
import { designerSequence, designerDelays, designerDuration } from '../lib/person-motion.ts';

const source = 'design/people-motion/v4/designer';
await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const width = 240, height = 320;
const sheet = await removeChroma(`${source}/source.png`);
const cells = unpackCrewSheet(sheet, { columns: 4, rows: 2, id: 'designer-original-v4' });
// A shared scale preserves the original proportions and the small knee bounce.
const scale = Math.min(244 / cells[0].bodyHeight, (height - 20) / Math.max(...cells.map(cell => cell.height)));
const frames = [];
await fs.mkdir(`${source}/frames`, { recursive: true });
for (const [index, cell] of cells.entries()) {
  const w = Math.round(cell.width * scale), h = Math.round(cell.height * scale);
  const left = Math.round(width / 2 - cell.anchorX * scale), top = height - 10 - h;
  assert.ok(left >= 0 && top >= 0 && left + w <= width, `Designer pose ${index} must fit with hands and shoes intact`);
  const cut = await sharp(cell.rgba, { raw: { width: cell.width, height: cell.height, channels: 4 } }).resize(w, h).png().toBuffer();
  const frame = await sharp({ create: { width, height, channels: 4, background: '#00000000' } }).composite([{ input: cut, left, top }]).png().toBuffer();
  frames.push(frame); await fs.writeFile(`${source}/frames/${index}.png`, frame);
}
await sharp({ create: { width: width * 8, height, channels: 4, background: '#00000000' } })
  .composite(frames.map((input, index) => ({ input, left: index * width, top: 0 })))
  .webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile('app/assets/people-motion/designer-rhythm-v4.webp');
const raw = await Promise.all(designerSequence.map(index => sharp(frames[index]).raw().toBuffer()));
await sharp(Buffer.concat(raw), { raw: { width, height: height * designerSequence.length, pageHeight: height, channels: 4 } })
  .gif({ loop: 0, delay: designerDelays, colours: 256, dither: .2, effort: 7 }).toFile('design/archive/public/images/people-motion/designer-rhythm-v4.gif');
await fs.writeFile(`${source}/animation.json`, JSON.stringify({ width, height, columns: 8, rows: 1, sequence: designerSequence, delays: designerDelays, duration: designerDuration, scale, loop: true, interpolation: false }, null, 2) + '\n');
await fs.mkdir('outputs/assets/2026-09-12/people-v4', { recursive: true });
await sharp({ create: { width: width * 4, height: height * 2, channels: 4, background: '#f0f0e9' } })
  .composite(frames.map((input, index) => ({ input, left: index % 4 * width, top: Math.floor(index / 4) * height })))
  .png().toFile('outputs/assets/2026-09-12/people-v4/designer-poses.png');
console.log(`Designer: ${frames.length} original poses, ${designerDuration}ms forward/back loop, no plinth, no interpolation.`);
