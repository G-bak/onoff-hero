import fs from 'node:fs/promises';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { removeChroma } from './person-motion-chroma.mjs';
// Archived v4 outline animation; current WEB uses prepare-web-person-v5.mjs.
const webPersonSequence = [0, 1, 2, 3, 4, 5, 6, 7];
const webPersonDelays = [160, 120, 160, 180, 160, 120, 160, 260];
const webPersonDuration = webPersonDelays.reduce((sum, delay) => sum + delay, 0);

await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const source = 'design/people-motion/v4/web', width = 256, height = 256;
const sheets = await Promise.all(['source.png', 'correction.png'].map(file => removeChroma(`${source}/${file}`)));
const guide = JSON.parse(await fs.readFile(`${source}/tip-guides.json`, 'utf8'));
const cells = [];
for (let index = 0; index < 8; index++) {
  // Preserve the approved first seven poses; only the corrected final cell is used.
  const sheet = sheets[index === 7 ? 1 : 0];
  const cellWidth = sheet.info.width / 4, cellHeight = sheet.info.height / 2;
  const rgba = await sharp(sheet.data, { raw: { width: sheet.info.width, height: sheet.info.height, channels: 4 } })
    .extract({ left: index % 4 * cellWidth, top: Math.floor(index / 4) * cellHeight, width: cellWidth, height: cellHeight }).raw().toBuffer();
  let railTop = cellHeight, railLeft = cellWidth, minX = cellWidth, minY = cellHeight, maxX = 0, maxY = 0;
  for (let y = 0; y < cellHeight; y++) for (let x = 0; x < cellWidth; x++) {
    const i = (y * cellWidth + x) * 4, [r, g, b, a] = rgba.subarray(i, i + 4);
    if (a < 12) continue;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    if (x < cellWidth * .5 && y < cellHeight * .35 && r > 145 && r > g * 1.07 && g > b * 1.08) railTop = Math.min(railTop, y);
  }
  for (let y = railTop; y < railTop + 8; y++) for (let x = 0; x < cellWidth * .5; x++) {
    const [r, g, b, a] = rgba.subarray((y * cellWidth + x) * 4, (y * cellWidth + x) * 4 + 4);
    if (a > 128 && r > 145 && r > g * 1.07 && g > b * 1.08) railLeft = Math.min(railLeft, x);
  }
  assert.ok(railTop < cellHeight * .3 && railLeft < cellWidth * .4, `Pose ${index}: board anchor needs review`);
  assert.ok(minX > 0 && minY > 0 && maxX < cellWidth - 1 && maxY < cellHeight - 1, `Pose ${index}: complete person and board must fit`);
  cells.push({ rgba, cellWidth, cellHeight, railTop, railLeft, minX, minY, maxX, maxY });
}
const bounds = {
  left: Math.min(...cells.map(c => c.minX - c.railLeft)), right: Math.max(...cells.map(c => c.maxX - c.railLeft)),
  top: Math.min(...cells.map(c => c.minY - c.railTop)), bottom: Math.max(...cells.map(c => c.maxY - c.railTop)),
};
const sceneWidth = bounds.right - bounds.left + 1, sceneHeight = bounds.bottom - bounds.top + 1;
const scale = Math.min((width - 20) / sceneWidth, (height - 20) / sceneHeight);
const origin = [(width - sceneWidth * scale) / 2 - bounds.left * scale, height - 10 - sceneHeight * scale - bounds.top * scale];
const frames = [], masks = [], tips = [];
await fs.mkdir(`${source}/frames`, { recursive: true });
for (const [index, cell] of cells.entries()) {
  const crop = await sharp(cell.rgba, { raw: { width: cell.cellWidth, height: cell.cellHeight, channels: 4 } })
    .extract({ left: cell.minX, top: cell.minY, width: cell.maxX - cell.minX + 1, height: cell.maxY - cell.minY + 1 })
    .resize({ width: Math.round((cell.maxX - cell.minX + 1) * scale) }).png().toBuffer();
  const left = Math.round(origin[0] + (cell.minX - cell.railLeft) * scale), top = Math.round(origin[1] + (cell.minY - cell.railTop) * scale);
  const frame = await sharp({ create: { width, height, channels: 4, background: '#00000000' } }).composite([{ input: crop, left, top }]).png().toBuffer();
  frames.push(frame); await fs.writeFile(`${source}/frames/${index}.png`, frame);
  tips.push(guide.tips[index].map((value, axis) => Math.round((origin[axis] + (value - (axis ? cell.railTop : cell.railLeft)) * scale) * 10) / 10));
  const pixels = await sharp(frame).raw().toBuffer(), mask = Buffer.alloc(width * height * 4);
  const [bx, by, bw, bh] = guide.boards[index];
  const rect = [origin[0] + (bx - cell.railLeft) * scale, origin[1] + (by - cell.railTop) * scale, bw * scale, bh * scale];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, [r, g, b, a] = pixels.subarray(i, i + 4);
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const inside = x > rect[0] && x < rect[0] + rect[2] && y > rect[1] && y < rect[1] + rect[3];
    mask[i] = mask[i + 1] = mask[i + 2] = 255;
    mask[i + 3] = inside && Math.max(r, g, b) < 125 ? Math.round(a * Math.max(0, Math.min(1, (30 - spread) / 12))) : 0;
  }
  masks.push(await sharp(mask, { raw: { width, height, channels: 4 } }).png().toBuffer());
}
const lengths = [0];
let curve = `M${tips[0].join(',')}`;
for (let i = 0; i < 8; i++) {
  const previous = tips[(i + 7) % 8], a = tips[i], b = tips[(i + 1) % 8], next = tips[(i + 2) % 8];
  const c = a.map((value, axis) => value + (b[axis] - previous[axis]) * .12);
  const d = b.map((value, axis) => value - (next[axis] - a[axis]) * .12);
  curve += `C${c.join(',')} ${d.join(',')} ${b.join(',')}`;
  let point = a, length = 0;
  for (let step = 1; step <= 24; step++) {
    const t = step / 24, s = 1 - t;
    const position = a.map((value, axis) => s ** 3 * value + 3 * s ** 2 * t * c[axis] + 3 * s * t ** 2 * d[axis] + t ** 3 * b[axis]);
    length += Math.hypot(position[0] - point[0], position[1] - point[1]); point = position;
  }
  lengths.push(lengths.at(-1) + length);
}
const drawing = { width, height, columns: 16, d: curve + 'Z', length: lengths[8], frames: [] };
for (let frame = 0; frame < 16; frame++) {
  const pose = frame % 8, previous = (pose + 7) % 8;
  drawing.frames.push({ drawn: frame < 8 ? lengths[pose] : lengths[8], trailStart: lengths[previous], trailLength: lengths[previous + 1] - lengths[previous], complete: frame >= 8 });
}
for (const { filename, images, lossless } of [
  { filename: 'web-writer-v4.webp', images: frames, lossless: false },
  { filename: 'web-board-visibility-v4.webp', images: masks, lossless: true },
]) {
  await sharp({ create: { width: width * 16, height, channels: 4, background: '#00000000' } })
    .composite(Array.from({ length: 16 }, (_, index) => ({ input: images[index % 8], left: index * width, top: 0 })))
    .webp({ quality: 90, alphaQuality: 100, lossless, effort: 6 }).toFile(`app/assets/people-motion/${filename}`);
}
await fs.writeFile('app/assets/people-motion/web-writer-v4.paths.json', JSON.stringify(drawing) + '\n');
// GIF previews the continuing cycle; the website also draws the first outline.
const gifFrames = [];
for (const pose of webPersonSequence) {
  const item = drawing.frames[8 + pose];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><g fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path opacity=".6" d="${drawing.d}"/><path d="${drawing.d}" stroke-dasharray="${item.trailLength} ${drawing.length}" stroke-dashoffset="${-item.trailStart}"/></g></svg>`;
  const strokes = await sharp(Buffer.from(svg)).composite([{ input: masks[pose], blend: 'dest-in' }]).png().toBuffer();
  gifFrames.push(await sharp(frames[pose]).composite([{ input: strokes }]).raw().toBuffer());
}
await sharp(Buffer.concat(gifFrames), { raw: { width, height: height * 8, pageHeight: height, channels: 4 } })
  .gif({ loop: 0, delay: webPersonDelays, colours: 256, dither: .2, effort: 7 }).toFile('design/archive/public/images/people-motion/web-writer-v4.gif');
await fs.writeFile(`${source}/animation.json`, JSON.stringify({ width, height, columns: 16, rows: 1, uniquePoses: 8, sequence: webPersonSequence, delays: webPersonDelays, duration: webPersonDuration, loop: true, interpolation: false, scale, bounds, tips, boardAnchors: cells.map(c => [c.railLeft, c.railTop]) }, null, 2) + '\n');
await fs.mkdir('outputs/assets/2026-09-12/people-v4', { recursive: true });
await sharp({ create: { width: width * 4, height: height * 2, channels: 4, background: '#e9edef' } })
  .composite(frames.map((input, index) => ({ input, left: index % 4 * width, top: Math.floor(index / 4) * height }))).png().toFile('outputs/assets/2026-09-12/people-v4/web-poses.png');
console.log(`WEB: 8 real poses, ${webPersonDuration}ms continuing loop, no plinth, no interpolation.`);
