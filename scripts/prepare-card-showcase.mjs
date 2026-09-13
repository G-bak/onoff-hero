import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'opentype.js/dist/opentype.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'app/assets/card-showcase');
await fs.mkdir(output, { recursive: true });
async function writeChanged(file, data) {
  const next = Buffer.from(data);
  const previous = await fs.readFile(file).catch(() => null);
  if (!previous?.equals(next)) await fs.writeFile(file, next);
}
const artworks = [
  { source: 'pass-source.png', name: 'pass' },
  { source: 'portfolio-source.png', name: 'portfolio' },
  { source: 'editorial/cover-source.png', name: 'cover-editorial' },
  { source: 'editorial/feature-source.png', name: 'feature-editorial' },
];
for (const { source, name } of artworks) {
  const image = await sharp(path.join(root, 'design/card-showcase', source))
    .resize({ width: 780, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toBuffer();
  await writeChanged(path.join(output, `${name}.webp`), image);
  console.log(`${name}.webp: ${image.length} bytes`);
}

// Own lettering from the project's licensed Montserrat, never reference-site paths.
const bytes = await fs.readFile(path.join(root, 'node_modules/@fontsource/montserrat/files/montserrat-latin-900-normal.woff'));
const font = parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const glyphs = {};
// Extend the stems instead of thickening horizontal strokes with a uniform
// stretch. Each mapping retains the original Montserrat outline and counters.
const verticalMaps = {
  T: [[0,0],[.27,.045],[1,1]],
  H: [[0,0],[.35,.46],[.64,.52],[1,1]],
  E: [[0,0],[.254,.055],[.371,.47],[.614,.525],[.746,.945],[1,1]],
  C: [[0,0],[.261,.055],[.739,.945],[1,1]],
  D: [[0,0],[.263,.055],[.737,.945],[1,1]],
  R: [[0,0],[.26,.055],[.494,.425],[.694,.49],[.749,.55],[1,1]],
  A: [[0,0],[.33,.16],[.583,.49],[.826,.55],[1,1]],
};
function stretchY(char, value) {
  const map = verticalMaps[char];
  for (let i = 1; i < map.length; i++) {
    const [x, y] = map[i], [previousX, previousY] = map[i - 1];
    if (value <= x) return previousY + (value - previousX) / (x - previousX) * (y - previousY);
  }
  return 1;
}
for (const char of new Set('THECARD')) {
  const outline = font.charToGlyph(char).getPath(0, 0, 1000);
  const box = outline.getBoundingBox();
  for (const command of outline.commands) {
    for (const key of ['x', 'x1', 'x2']) if (key in command) command[key] = (command[key] - box.x1) / (box.x2 - box.x1);
    for (const key of ['y', 'y1', 'y2']) if (key in command) command[key] = stretchY(char, (command[key] - box.y1) / (box.y2 - box.y1));
  }
  glyphs[char] = outline.toPathData(6);
}
await writeChanged(path.join(output, 'title.json'), JSON.stringify(glyphs) + '\n');
