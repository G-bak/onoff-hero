import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'opentype.js/dist/opentype.mjs';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bytes = await fs.readFile(path.join(root, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'));
const font = parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const glyphs = {};
const number = n => Math.round(n * 1000) / 1000;
for (const char of new Set('ON&F')) {
  const glyph = font.charToGlyph(char);
  const outline = [];
  let contourStart;
  for (const command of glyph.path.commands) {
    if (command.type === 'M') {
      contourStart = [command.x, command.y];
      outline.push('m', number(command.x), number(command.y));
    } else if (command.type === 'L') {
      outline.push('l', number(command.x), number(command.y));
    } else if (command.type === 'Q') {
      outline.push('q', number(command.x), number(command.y), number(command.x1), number(command.y1));
    } else if (command.type === 'C') {
      outline.push('b', number(command.x), number(command.y), number(command.x1), number(command.y1), number(command.x2), number(command.y2));
    } else if (command.type === 'Z' && contourStart) {
      outline.push('l', ...contourStart.map(number));
    }
  }
  const box = glyph.getBoundingBox();
  glyphs[char] = { ha: glyph.advanceWidth, x_min: box.x1, x_max: box.x2, o: outline.join(' ') };
}
const data = {
  glyphs,
  familyName: 'ONOFF Display Geometry',
  resolution: font.unitsPerEm,
  boundingBox: { yMin: font.descender, yMax: font.ascender },
  underlineThickness: 50,
  originalFontInformation: 'Inter Bold, SIL Open Font License 1.1; subset for ON&OFF wordmark geometry.',
};
const parsed = new FontLoader().parse(data);
for (const char of Object.keys(glyphs)) {
  const shapes = parsed.generateShapes(char, 1);
  if (shapes.length !== 1) throw new Error(`Invalid contour count for ${char}: ${shapes.length}`);
  if (char === 'O' && shapes[0].holes.length !== 1) throw new Error('O must retain its counter.');
  console.log(`${char}: ${shapes.length} shape, ${shapes[0].holes.length} counters`);
}
await fs.mkdir(path.join(root, 'public/fonts'), { recursive: true });
await fs.mkdir(path.join(root, 'design/archive/public/fonts'), { recursive: true });
await fs.writeFile(path.join(root, 'design/archive/public/fonts/onoff-display.json'), JSON.stringify(data));
await fs.copyFile(path.join(root, 'node_modules/@fontsource/inter/LICENSE'), path.join(root, 'public/fonts/INTER-LICENSE.txt'));
console.log('Created design/archive/public/fonts/onoff-display.json');
