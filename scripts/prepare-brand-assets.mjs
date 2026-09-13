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
for (const size of [32, 64]) {
  const inset = size === 32 ? 1 : 2;
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  await sharp(cropped)
    .resize(size - inset * 2, size - inset * 2, { fit: 'contain', background: transparent })
    .extend({ top: inset, bottom: inset, left: inset, right: inset, background: transparent })
    .png()
    .toFile(path.join(root, `public/favicon-onoff-${size}.png`));
}
console.log('Prepared header logo and transparent 32px / 64px favicons; original file preserved.');
