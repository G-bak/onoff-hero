import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const legacy = process.argv.includes('--legacy');
const source = path.join(root, 'design/design-showcase', legacy ? '' : 'v2');
const destination = path.join(root, 'app/assets/design-showcase');
await fs.mkdir(destination, { recursive: true });
const manifest = [];
for (const name of legacy ? ['identity', 'package', 'editorial'] : ['bakery', 'beauty', 'living']) {
  const input = path.join(source, 'sources', `${name}.png`);
  const output = path.join(destination, `design-${name}.webp`);
  const info = await sharp(input).resize(720, 900, { fit: 'cover' }).webp({ quality: 86, effort: 6 }).toFile(output);
  const bytes = await fs.readFile(output);
  manifest.push({ name, width: info.width, height: info.height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), sourceSha256: createHash('sha256').update(await fs.readFile(input)).digest('hex') });
}
await fs.writeFile(path.join(source, 'assets.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
