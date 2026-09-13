import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdownAnchors, markdownLinks, repositoryFiles, resolveLocalLink } from './markdown-links.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const files = repositoryFiles(root);
const docs = files.filter(file => file.endsWith('.md'));
const problems = [];
const headingCache = new Map();
let localLinks = 0;
let headingLinks = 0;
for (const file of docs) {
  for (const { target, line } of markdownLinks(fs.readFileSync(file, 'utf8'))) {
    let resolved;
    try { resolved = resolveLocalLink(root, file, target); }
    catch (error) { problems.push(`${relative(file)}:${line} -> ${target}: ${error.message}`); continue; }
    if (!resolved) continue;
    localLinks++;
    if (!fs.existsSync(resolved.file)) {
      problems.push(`${relative(file)}:${line} -> ${target}: missing file`);
      continue;
    }
    if (resolved.fragment && /\.md$/i.test(resolved.file) && fs.statSync(resolved.file).isFile()) {
      headingLinks++;
      if (!headingCache.has(resolved.file)) headingCache.set(resolved.file, markdownAnchors(fs.readFileSync(resolved.file, 'utf8')));
      if (!headingCache.get(resolved.file).has(resolved.fragment)) problems.push(`${relative(file)}:${line} -> ${target}: missing heading or HTML anchor`);
    }
  }
}
const allowed = JSON.parse(fs.readFileSync(path.join(root, 'scripts/public-assets.config.json'), 'utf8')).sort();
const publicFiles = files.filter(file => relative(file).startsWith('public/')).map(file => relative(file).slice(7)).sort();
assert.deepEqual(publicFiles, allowed, 'public/ differs from the reviewed list. Keep previews/sources in design/; list intentional public additions in scripts/public-assets.config.json.');
assert.equal(problems.length, 0, `Broken documentation links:\n${problems.join('\n')}`);
console.log(`Repository checks passed: ${docs.length} Markdown files, ${localLinks} local links, ${headingLinks} Markdown heading links, ${publicFiles.length} reviewed public files. External HTTP checks are opt-in: npm run check:links.`);
