import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { teamAsset } from './team-asset.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = path.join(root, 'dist/client');
const require = createRequire(import.meta.url);
const fontCss = require.resolve('pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

function codePoints(range) {
  const points = new Set();
  for (const item of range.split(',')) {
    const match = item.trim().match(/^U\+([\da-f?]+)(?:-([\da-f]+))?$/i);
    assert.ok(match, `Invalid Unicode range: ${item}`);
    const first = Number.parseInt(match[1].replaceAll('?', '0'), 16);
    const last = Number.parseInt(match[2] ?? match[1].replaceAll('?', 'f'), 16);
    for (let code = first; code <= last; code++) points.add(code);
  }
  return [...points].sort((a, b) => a - b);
}

function fontFaces(css) {
  return [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].flatMap(([, body]) => {
    const family = body.match(/font-family\s*:\s*([^;]+)/)?.[1].replace(/["']/g, '').trim();
    if (family !== 'Pretendard Variable') return [];
    const range = body.match(/unicode-range\s*:\s*([^;}]+)/i)?.[1];
    const url = body.match(/url\(\s*["']?([^"')]+)["']?\s*\)/)?.[1];
    assert.ok(range && url, 'Pretendard must use local Unicode subsets.');
    assert.match(body, /font-weight\s*:\s*45\s+920/, 'Variable font weights were lost.');
    return [{ points: codePoints(range), url }];
  });
}

function builtFontBytes(url, cssFile) {
  if (url.startsWith('data:')) {
    assert.match(url, /^data:[^,]+;base64,/);
    return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  }
  assert.ok(!/^(?:[a-z]+:)?\/\//i.test(url), `External font URL: ${url}`);
  const decoded = decodeURIComponent(url.split(/[?#]/)[0]);
  const target = decoded.startsWith('/') ? path.join(client, decoded) : path.resolve(path.dirname(cssFile), decoded);
  assert.ok(path.relative(client, target) && !path.relative(client, target).startsWith('..'), 'Font escaped the public build.');
  const bytes = fs.readFileSync(target);
  assert.equal(bytes.subarray(0, 4).toString(), 'wOF2', `Invalid WOFF2: ${target}`);
  return bytes;
}

// Compare every emitted subset with the installed official font, including
// ranges unused by today's copy. New pages must retain the complete repertoire.
const expected = fontFaces(fs.readFileSync(fontCss, 'utf8'));
assert.ok(expected.length > 1, 'Expected the official dynamic subset stylesheet.');
const expectedByRange = new Map(expected.map(face => [face.points.join(','), {
  ...face,
  bytes: fs.readFileSync(path.resolve(path.dirname(fontCss), face.url)),
}]));
const files = filesIn(client);
const seen = new Set();
const covered = new Set();
for (const file of files.filter(file => file.endsWith('.css'))) {
  for (const face of fontFaces(fs.readFileSync(file, 'utf8'))) {
    const key = face.points.join(',');
    const original = expectedByRange.get(key);
    assert.ok(original, 'Production font ranges differ from the official subset.');
    assert.equal(digest(builtFontBytes(face.url, file)), digest(original.bytes), 'Production font bytes changed.');
    seen.add(key);
    face.points.forEach(code => covered.add(code));
  }
}
assert.equal(seen.size, expectedByRange.size, 'A font subset is missing from the build.');
for (let code = 0xac00; code <= 0xd7a3; code++) {
  assert.ok(covered.has(code), `Missing Korean syllable U+${code.toString(16)}.`);
}

// The atlas is imported by both views and must be emitted under a hashed URL.
// Compare bytes with the generated image already checked against the original.
const generated = fs.readFileSync(path.join(root, teamAsset.output));
const atlases = files.filter(file => /^team-atlas[.-][\w-]+\.webp$/.test(path.basename(file)));
assert.equal(atlases.length, 1, 'Expected one shared, hashed team atlas.');
assert.equal(digest(fs.readFileSync(atlases[0])), digest(generated), 'Built atlas differs from the verified image.');

// This is a source-based upper estimate, not a browser/network measurement:
// include Korean strings in app and lib, including unopened dialogs and errors.
const authored = ['app', 'lib'].flatMap(directory => filesIn(path.join(root, directory)))
  .filter(file => /\.tsx?$/.test(file)).map(file => fs.readFileSync(file, 'utf8')).join('\n');
const korean = new Set();
for (const char of authored) {
  const code = char.charCodeAt(0); // Modern Hangul syllables are in the BMP.
  if (code >= 0xac00 && code <= 0xd7a3) korean.add(code);
}
const selected = [...expectedByRange.values()].filter(face => face.points.some(code => korean.has(code)));
const estimate = selected.reduce((sum, face) => sum + face.bytes.length, 0);
console.log(`Production assets passed: ${seen.size} self-hosted font subsets, all 11,172 Korean syllable ranges, one shared hashed atlas (${generated.length} bytes).`);
console.log(`Korean text in current app/lib source maps to ${selected.length} subsets (${estimate} bytes); actual requests depend on visible text and cache.`);
