import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'design/marketing/v2');
const output = path.join(root, 'app/assets/marketing');
const manifest = [];
for (const [name, filename] of [['instagram','instagram-ongyeol'],['blog','blog-ruum'],['poster','poster-morning-oven']]) {
  const input = await fs.readFile(path.join(source, 'sources', `${name}.png`));
  const image = await sharp(input).resize(720, 900, { fit: 'cover' }).webp({ quality: 88, effort: 6 }).toBuffer();
  const target = path.join(output, `${filename}.webp`);
  const previous = await fs.readFile(target).catch(() => null);
  if (!previous?.equals(image)) await fs.writeFile(target, image);
  manifest.push({ name, filename: `${filename}.webp`, width: 720, height: 900, bytes: image.length, sourceSha256: createHash('sha256').update(input).digest('hex'), sha256: createHash('sha256').update(image).digest('hex') });
}
await fs.writeFile(path.join(source, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
const installedSource = path.join(root, 'design/marketing/v3/sources/poster-installed.png');
const input = await fs.readFile(installedSource);
const installed = await sharp(input).resize(848, 1060, { fit: 'cover' }).webp({ quality: 89, effort: 6 }).toBuffer();
const target = path.join(output, 'poster-installed.webp');
const previous = await fs.readFile(target).catch(() => null);
if (!previous?.equals(installed)) await fs.writeFile(target, installed);
await fs.writeFile(path.join(root, 'design/marketing/v3/assets.json'), JSON.stringify({ filename: 'poster-installed.webp', width: 848, height: 1060, bytes: installed.length, sourceSha256: createHash('sha256').update(input).digest('hex'), sha256: createHash('sha256').update(installed).digest('hex') }, null, 2) + '\n');
console.log(manifest);
