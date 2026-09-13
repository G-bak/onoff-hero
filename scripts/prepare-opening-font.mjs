import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'opentype.js/dist/opentype.mjs';
import { ShapePath, ExtrudeGeometry } from 'three';

const source = 'node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff';
const bytes = await fs.readFile(source);
const font = parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const glyphs = {};
for (const character of new Set('ON&OFF')) {
  const glyph = font.charToGlyph(character);
  const commands = glyph.path.commands;
  const path = new ShapePath();
  for (const c of commands) {
    if (c.type === 'M') path.moveTo(c.x, c.y);
    else if (c.type === 'L') path.lineTo(c.x, c.y);
    else if (c.type === 'Q') path.quadraticCurveTo(c.x1, c.y1, c.x, c.y);
    else if (c.type === 'C') path.bezierCurveTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y);
    else if (c.type === 'Z') path.currentPath.closePath();
  }
  const shapes = path.toShapes();
  assert.equal(shapes.length, 1);
  assert.equal(shapes[0].holes.length, character === 'O' ? 1 : character === '&' ? 2 : 0);
  const geometry = new ExtrudeGeometry(shapes, { depth: 140, bevelEnabled: false, curveSegments: 16 });
  geometry.computeBoundingBox();
  const bounds = glyph.getBoundingBox();
  assert.ok(Math.abs(geometry.boundingBox.min.x - bounds.x1) < .1);
  assert.ok(Math.abs(geometry.boundingBox.max.x - bounds.x2) < .1);
  assert.ok(Math.abs(geometry.boundingBox.min.y - bounds.y1) < .1);
  assert.ok(Math.abs(geometry.boundingBox.max.y - bounds.y2) < .1);
  geometry.dispose();
  glyphs[character] = { advance: glyph.advanceWidth, bounds, commands };
}
const data = { family: 'Montserrat', weight: 700, unitsPerEm: font.unitsPerEm, sourceSha256: createHash('sha256').update(bytes).digest('hex'), glyphs };
await fs.mkdir('app/assets/opening', { recursive: true });
await fs.writeFile('app/assets/opening/montserrat-bold.json', JSON.stringify(data) + '\n');
console.log('Opening geometry: Montserrat Bold 700, four original outlines; O and & counters verified.');
