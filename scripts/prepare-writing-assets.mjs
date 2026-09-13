import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { removeChroma } from './person-motion-chroma.mjs';
import { traceWriting } from './writing-strokes.mjs';

await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const source = 'design/people-motion/v3/web';
const temporary = 'outputs/assets/2026-09-12/people-v3/writing';
const ffmpeg = process.argv[2] || './outputs/research/2026-09-09/follow-art/tool/package/ffmpeg.exe';
const width = 256, height = 256, columns = 12, rows = 12, fps = 24, count = 144;
for (const folder of [`${temporary}/input`, `${temporary}/interpolated`, `${source}/keyframes`]) await fs.mkdir(folder, { recursive: true });
const sheet = await removeChroma(`${source}/source.png`);
const poses = [];
for (let index = 0; index < 12; index++) {
  const left = Math.round(index % 4 * sheet.info.width / 4), top = Math.round(Math.floor(index / 4) * sheet.info.height / 3);
  const cellWidth = Math.round((index % 4 + 1) * sheet.info.width / 4) - left;
  const cellHeight = Math.round((Math.floor(index / 4) + 1) * sheet.info.height / 3) - top;
  const raw = await sharp(sheet.data, { raw: { width: sheet.info.width, height: sheet.info.height, channels: 4 } })
    .extract({ left, top, width: cellWidth, height: cellHeight }).raw().toBuffer();
  // Track the fixed pale top rail, not the moving hand, head or changing letters.
  let railTop = cellHeight, railLeft = cellWidth;
  let minX = cellWidth, maxX = 0, minY = cellHeight, maxY = 0;
  for (let y = 0; y < cellHeight; y++) for (let x = 0; x < cellWidth; x++) {
    const i = (y * cellWidth + x) * 4, [r, g, b, a] = raw.subarray(i, i + 4);
    if (a < 12) continue;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    if (x < cellWidth * .61 && y < cellHeight * .35 && r > 145 && r > g * 1.07 && g > b * 1.08) railTop = Math.min(railTop, y);
  }
  for (let y = railTop; y < railTop + 8; y++) for (let x = 0; x < cellWidth * .61; x++) {
    const i = (y * cellWidth + x) * 4, [r, g, b, a] = raw.subarray(i, i + 4);
    if (a > 128 && r > 145 && r > g * 1.07 && g > b * 1.08) railLeft = Math.min(railLeft, x);
  }
  assert.ok(railLeft < cellWidth * .4 && railTop < cellHeight * .25, `Pose ${index}: board rail anchor needs review`);
  assert.ok(minX > 2 && minY > 2 && maxX < cellWidth - 3 && maxY < cellHeight - 3, `Pose ${index}: full scene must fit without touching cell edges`);
  poses.push({ raw, cellWidth, cellHeight, railLeft, railTop, minX, maxX, minY, maxY });
}
// Pose 1 contains an unwanted prepainted rail mark. Pose 5 is the same
// upper-left contact on a genuinely blank board, so reuse those actual pixels.
poses[1] = poses[5];
const bounds = {
  left: Math.min(...poses.map(p => p.minX - p.railLeft)), right: Math.max(...poses.map(p => p.maxX - p.railLeft)),
  top: Math.min(...poses.map(p => p.minY - p.railTop)), bottom: Math.max(...poses.map(p => p.maxY - p.railTop)),
};
const sceneWidth = bounds.right - bounds.left + 1, sceneHeight = bounds.bottom - bounds.top + 1;
const scale = Math.min((width - 20) / sceneWidth, (height - 20) / sceneHeight);
const keyframes = [];
for (const [index, pose] of poses.entries()) {
  const crop = await sharp(pose.raw, { raw: { width: pose.cellWidth, height: pose.cellHeight, channels: 4 } })
    .extract({ left: pose.minX, top: pose.minY, width: pose.maxX - pose.minX + 1, height: pose.maxY - pose.minY + 1 })
    .resize({ width: Math.round((pose.maxX - pose.minX + 1) * scale) }).png().toBuffer();
  const left = Math.round((width - sceneWidth * scale) / 2 + (pose.minX - pose.railLeft - bounds.left) * scale);
  const top = Math.round(height - 10 - sceneHeight * scale + (pose.minY - pose.railTop - bounds.top) * scale);
  const frame = await sharp({ create: { width, height, channels: 4, background: '#00000000' } }).composite([{ input: crop, left, top }]).png().toBuffer();
  keyframes.push(frame); await fs.writeFile(`${source}/keyframes/${index}.png`, frame);
}
// Hold the first and last key poses outside the range used for optical flow.
const sequence = [0, 0, ...Array.from({ length: 12 }, (_, i) => i), 11, 11];
for (const [index, pose] of sequence.entries()) await sharp(keyframes[pose]).flatten({ background: '#00ff00' }).png().toFile(`${temporary}/input/${String(index).padStart(3, '0')}.png`);
execFileSync(path.resolve(ffmpeg), ['-hide_banner', '-loglevel', 'error', '-framerate', '2', '-i', `${temporary}/input/%03d.png`, '-vf', `format=yuv444p,minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:mb_size=8:vsbmc=1:scd=none,trim=start=1:duration=6,setpts=PTS-STARTPTS`, '-frames:v', String(count), '-y', `${temporary}/interpolated/%03d.png`], { stdio: 'pipe' });
const frames = [];
for (let index = 1; index <= count; index++) {
  const frame = await removeChroma(`${temporary}/interpolated/${String(index).padStart(3, '0')}.png`);
  frames.push(await sharp(frame.data, { raw: { width, height, channels: 4 } }).png().toBuffer());
}
await sharp({ create: { width: width * columns, height: height * rows, channels: 4, background: '#00000000' } })
  .composite(frames.map((input, index) => ({ input, left: index % columns * width, top: Math.floor(index / columns) * height })))
  .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile('app/assets/people-motion/web-chalk-v3.webp');
const rawFrames = await Promise.all(frames.map(frame => sharp(frame).ensureAlpha().raw().toBuffer()));
const sourceGuides = JSON.parse(await fs.readFile(`${source}/tip-guides.json`, 'utf8'));
const guides = sourceGuides.map(([x, y], index) => [
  (width - sceneWidth * scale) / 2 + (x - poses[index].railLeft - bounds.left) * scale,
  height - 10 - sceneHeight * scale + (y - poses[index].railTop - bounds.top) * scale,
]);
const drawing = traceWriting(rawFrames, guides, { width, height });
await fs.writeFile('app/assets/people-motion/web-chalk-v3.paths.json', JSON.stringify(drawing) + '\n');
// Chalk belongs to the board surface. The navy sleeve and warm skin occlude
// earlier strokes instead of letting white drawing lines run over the arm.
const visibilityFrames = [];
const boardX = (width - sceneWidth * scale) / 2 - bounds.left * scale;
const boardY = height - 10 - sceneHeight * scale - bounds.top * scale;
for (const frame of rawFrames) {
  const mask = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, [r, g, b, a] = frame.subarray(i, i + 4);
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const inside = x > boardX + 4 * scale && x < boardX + 135 * scale && y > boardY + 5 * scale && y < boardY + 137 * scale;
    const alpha = inside && Math.max(r, g, b) < 125 ? Math.round(a * Math.max(0, Math.min(1, (30 - spread) / 12))) : 0;
    mask[i] = mask[i + 1] = mask[i + 2] = 255; mask[i + 3] = alpha;
  }
  visibilityFrames.push(await sharp(mask, { raw: { width, height, channels: 4 } }).png().toBuffer());
}
await sharp({ create: { width: width * columns, height: height * rows, channels: 4, background: '#00000000' } })
  .composite(visibilityFrames.map((input, index) => ({ input, left: index % columns * width, top: Math.floor(index / columns) * height })))
  .webp({ lossless: true }).toFile('app/assets/people-motion/web-board-visibility-v3.webp');
// The site overlays the functional strokes on the same animated atlas layer.
// The GIF preview includes them too, using exactly the same frame-indexed data.
const gifFrames = [];
for (const [index, frame] of frames.entries()) {
  const paths = drawing.paths.map((p, i) => p.progress[index] > 0 ? `<path d="${p.d}" ${i ? 'clip-path="url(#inside)"' : ''} stroke-dasharray="${p.length}" stroke-dashoffset="${p.length - p.progress[index]}"/>` : '').join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><clipPath id="inside"><path d="${drawing.paths[0].d}Z"/></clipPath></defs><g fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  const strokes = await sharp(Buffer.from(svg)).composite([{ input: visibilityFrames[index], blend: 'dest-in' }]).png().toBuffer();
  gifFrames.push(await sharp(frame).composite([{ input: strokes }]).raw().toBuffer());
}
await sharp(Buffer.concat(gifFrames), { raw: { width, height: height * count, pageHeight: height, channels: 4 } })
  .gif({ loop: 1, delay: Array.from({ length: count }, (_, i) => i === count - 1 ? 3000 : 42), colours: 256, effort: 7, dither: .1 }).toFile('design/archive/public/images/people-motion/web-chalk-v3.gif');
await sharp({ create: { width: width * 4, height: height * 3, channels: 4, background: '#e9edef' } })
  .composite(keyframes.map((input, index) => ({ input, left: index % 4 * width, top: Math.floor(index / 4) * height }))).png().toFile(`${temporary}/keyframe-review.png`);
await fs.writeFile(`${source}/animation.json`, JSON.stringify({ width, height, columns, rows, count, fps, durationMs: 6000, keyPoses: 12, iterations: 1, scale, bounds, boardAnchors: poses.map(p => [p.railLeft, p.railTop]), interpolation: 'FFmpeg motion-compensated interpolation; person, chalk and board share one frame sequence' }, null, 2) + '\n');
console.log('Prepared one writing action: 12 key poses, 144 frames, 6 seconds then hold.');
