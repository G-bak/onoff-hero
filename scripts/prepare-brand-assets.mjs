import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/images/onoff-logo-new.png');
const metadata = await sharp(source).metadata();
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = -1, bottom = -1;
let visiblePixels = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 20) {
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
      visiblePixels++;
    }
  }
}
if (right < left || bottom < top) throw new Error('The supplied logo is empty.');
console.log(JSON.stringify({ width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha, visiblePixels, bounds: { left, top, right, bottom } }));
await fs.mkdir(path.join(root, 'outputs/assets/brand'), { recursive: true });
await sharp(source).flatten({ background: '#e9edef' }).resize({ width: 768 }).png().toFile(path.join(root, 'outputs/assets/brand/logo-inspection.png'));

// Preserve the supplied design and alpha; only remove transparent padding.
const padding = 8;
const crop = {
  left: Math.max(0, left - padding),
  top: Math.max(0, top - padding),
  width: Math.min(info.width - 1, right + padding) - Math.max(0, left - padding) + 1,
  height: Math.min(info.height - 1, bottom + padding) - Math.max(0, top - padding) + 1,
};
const cropped = await sharp(source).extract(crop).png().toBuffer();
await sharp(cropped).resize({ width: 420 }).png().toFile(path.join(root, 'public/images/onoff-logo.png'));
const faviconFrames = [];
for (const size of [16, 32, 48, 64]) {
  const inset = Math.max(1, Math.round(size / 32));
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  const fitted = await sharp(cropped)
    .resize(size - inset * 2, size - inset * 2, { fit: 'contain', background: transparent })
    .extend({ top: inset, bottom: inset, left: inset, right: inset, background: transparent })
    .png()
    .toBuffer();
  // Flatten after extending so the entire square, including padding, is white.
  const png = await sharp(fitted).flatten({ background: '#ffffff' }).png().toBuffer();
  faviconFrames.push({ size, png });
  if (size === 32 || size === 64) await fs.writeFile(path.join(root, `public/favicon-onoff-${size}.png`), png);
}

// ICO supports PNG frames; keep the conventional /favicon.ico in sync too.
const directory = Buffer.alloc(6 + 16 * faviconFrames.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(faviconFrames.length, 4);
let offset = directory.length;
for (const [index, { size, png }] of faviconFrames.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(24, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
await fs.writeFile(path.join(root, 'public/favicon.ico'), Buffer.concat([directory, ...faviconFrames.map(frame => frame.png)]));
console.log('Prepared header logo, white 32px / 64px PNG favicons, and a white multi-size ICO; original file preserved.');
