import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { marketerSequence, marketerDelays, marketerDuration } from '../lib/card-showcase.ts';

// Apply reviewed shoe masks to the existing runtime pixels, preserving every pose.
const source = 'app/assets/marketing/marketer-sprite.webp';
const directory = 'design/marketing/v2/marketer';
const output = 'app/assets/marketing/marketer-no-plinth-v2.webp';
const gifPath = 'design/archive/public/images/marketing/marketer-no-plinth-v2.gif';
await fs.mkdir('design/archive/public/images/marketing', { recursive: true });
const width = 240, height = 320, bandStart = 278;
const original = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(original.info.width, width * 8);
assert.equal(original.info.height, height);
const cleaned = Buffer.from(original.data), frames = [], checks = [];
for (let frame = 0; frame < 8; frame++) {
  const mask = await sharp(`${directory}/removal-masks/${frame}.png`).greyscale().raw().toBuffer();
  assert.equal(mask.length, width * height);
  let changedAlpha = 0;
  const cell = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const p = y * width + x, index = (y * width * 8 + frame * width + x) * 4;
    if (y < bandStart) assert.equal(mask[p], 0, 'No changes above the shoe band');
    cleaned[index + 3] = Math.round(original.data[index + 3] * (255 - mask[p]) / 255);
    if (cleaned[index + 3] !== original.data[index + 3]) changedAlpha++;
    cleaned.copy(cell, p * 4, index, index + 4);
  }
  frames.push(cell);
  checks.push({ frame, changedAlpha });
}
await sharp(cleaned, { raw: { width: width * 8, height, channels: 4 } })
  .webp({ lossless: true, effort: 6 }).toFile(output);
const decoded = await sharp(output).ensureAlpha().raw().toBuffer();
let aboveBandRgbaChanges = 0, visibleRgbChanges = 0;
for (let i = 0; i < decoded.length; i += 4) {
  assert.equal(decoded[i + 3], cleaned[i + 3]);
  if (decoded[i + 3] && !decoded.subarray(i, i + 3).equals(original.data.subarray(i, i + 3))) visibleRgbChanges++;
  if (Math.floor(i / 4 / (width * 8)) < bandStart && original.data[i + 3] && !decoded.subarray(i, i + 4).equals(original.data.subarray(i, i + 4))) aboveBandRgbaChanges++;
}
assert.equal(aboveBandRgbaChanges, 0);
assert.equal(visibleRgbChanges, 0);
await sharp(Buffer.concat(marketerSequence.map(i => frames[i])), {
  raw: { width, height: height * marketerSequence.length, pageHeight: height, channels: 4 },
}).gif({ loop: 0, delay: marketerDelays, colours: 256, dither: 0.2, effort: 7 }).toFile(gifPath);
const metadata = await sharp(gifPath, { animated: true }).metadata();
assert.deepEqual(metadata.delay, marketerDelays);
assert.equal(metadata.pages, marketerSequence.length);
assert.equal(metadata.loop, 0);
const assets = [];
for (const path of [source, output, gifPath]) {
  const buffer = await fs.readFile(path);
  assets.push({ path, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') });
}
await fs.writeFile(`${directory}/runtime-checks.json`, JSON.stringify({ width, height, bandStart, sequence: marketerSequence, delays: marketerDelays, duration: marketerDuration, loop: true, aboveBandRgbaChanges, visibleRgbChanges, checks, assets }, null, 2) + '\n');
console.log(`Marketer: unchanged visible RGB, unchanged upper RGBA, original ${marketerDuration}ms loop; ${assets[1].bytes}B sprite / ${assets[2].bytes}B GIF.`);
