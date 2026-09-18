import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'design/marketing/detail-cards-v2');
const output = path.join(root, 'app/assets/marketing');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = [];
for (const [name, filename] of [
  ['sns-lumet', 'detail-sns-lumet-v2.webp'],
  ['blog-nourve', 'detail-blog-nourve-v2.webp'],
  ['campaign-ploop', 'detail-campaign-ploop-v2.webp'],
]) {
  const input = await fs.readFile(path.join(source, 'sources', `${name}.png`));
  const original = await sharp(input).metadata();
  assert.equal(original.width, 720, `${name}: original width`);
  assert.equal(original.height, 1460, `${name}: original height`);
  // Preserve the supplied artwork exactly; only its delivery format changes.
  const image = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
  const metadata = await sharp(image).metadata();
  const [before, after] = await Promise.all([
    sharp(input).ensureAlpha().raw().toBuffer(),
    sharp(image).ensureAlpha().raw().toBuffer(),
  ]);
  assert.ok(before.equals(after), `${name}: lossless pixels`);
  const target = path.join(output, filename);
  const previous = await fs.readFile(target).catch(() => null);
  if (!previous?.equals(image)) await fs.writeFile(target, image);
  manifest.push({ name, filename, width: metadata.width, height: metadata.height, bytes: image.length,
    sourceBytes: input.length, sourceSha256: digest(input), sha256: digest(image), lossless: true });
}
await fs.writeFile(path.join(source, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
