import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'design/marketing/detail-cards-v1');
const output = path.join(root, 'app/assets/marketing');
const manifest = [];
for (const [name, filename] of [
  ['blog-ruum', 'detail-blog-ruum-v1.webp'],
  ['poster-morning-oven', 'detail-campaign-morning-oven-v1.webp'],
]) {
  const input = await fs.readFile(path.join(source, 'sources', `${name}.png`));
  const original = await sharp(input).metadata();
  assert.ok(original.width && original.height, `Invalid source dimensions: ${name}`);
  assert.ok(Math.abs(original.height / original.width - 2) < .08, `Expected a portrait card near 1:2: ${name}`);
  // Keep the generated composition intact; this step only downsamples and
  // encodes it for the site. Original full-resolution sources stay in design/.
  const image = await sharp(input).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 92, effort: 6 }).toBuffer();
  const metadata = await sharp(image).metadata();
  const target = path.join(output, filename);
  const previous = await fs.readFile(target).catch(() => null);
  if (!previous?.equals(image)) await fs.writeFile(target, image);
  manifest.push({
    name, filename, width: metadata.width, height: metadata.height,
    bytes: image.length, sourceWidth: original.width, sourceHeight: original.height,
    sourceSha256: createHash('sha256').update(input).digest('hex'),
    sha256: createHash('sha256').update(image).digest('hex'),
  });
}
await fs.writeFile(path.join(source, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
