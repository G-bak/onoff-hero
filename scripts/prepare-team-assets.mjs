import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { teamAsset } from './team-asset.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await fs.readFile(path.join(root, teamAsset.source));
const original = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(original.info.width % 3, 0, 'Atlas width must divide into three columns.');
assert.equal(original.info.height % 2, 0, 'Atlas height must divide into two rows.');

const webp = await sharp(source).webp({ lossless: true, effort: 6 }).toBuffer();
const decoded = await sharp(webp).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.equal(decoded.info.width, original.info.width, 'Atlas width changed.');
assert.equal(decoded.info.height, original.info.height, 'Atlas height changed.');
assert.equal(decoded.info.channels, 4);
for (let i = 0; i < original.data.length; i += 4) {
  assert.equal(decoded.data[i + 3], original.data[i + 3], `Alpha changed at pixel ${i / 4}.`);
  // WebP may normalize RGB under fully transparent pixels. Those colors are
  // invisible; every pixel with any opacity must retain its exact RGB values.
  if (original.data[i + 3] !== 0) {
    for (let channel = 0; channel < 3; channel++) {
      assert.equal(decoded.data[i + channel], original.data[i + channel], `Color changed at pixel ${i / 4}.`);
    }
  }
}
const destination = path.join(root, teamAsset.output);
let previous;
try { previous = await fs.readFile(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (!previous?.equals(webp)) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, webp);
}
console.log(`Team atlas: ${source.length} → ${webp.length} bytes; dimensions, visible colors and all alpha values preserved.`);
