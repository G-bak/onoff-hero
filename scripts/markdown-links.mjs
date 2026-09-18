import fs from 'node:fs';
import path from 'node:path';

export const excludedDirectories = new Set(['.git', 'node_modules', 'outputs', 'work', 'daily-work', 'dist', 'out', 'build', '.next', '.vinext', '.wrangler', '.vite', '.cache', '.openai', '.playwright-mcp', 'coverage', 'test-results', 'playwright-report', 'blob-report']);

export function repositoryFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (excludedDirectories.has(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? repositoryFiles(file) : entry.isFile() ? [file] : [];
  });
}

const blank = text => text.replace(/[^\n]/g, ' ');
const unescapeMarkdown = text => text.replace(/\\([!-/:-@[-`{-~])/g, '$1');
const entityNames = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, value) => {
    if (value[0] !== '#') return entityNames[value.toLowerCase()] ?? entity;
    const number = /^#x/i.test(value) ? Number.parseInt(value.slice(2), 16) : Number(value.slice(1));
    return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : '\ufffd';
  });
}

// Deliberately scoped to the repository's Markdown: ATX/setext headings, inline
// and reference links, HTML anchors, comments, fenced/indented code and code spans.
// This is not a complete CommonMark renderer or an external HTML/JS link crawler.
export function withoutCodeBlocks(source) {
  const lines = source.replace(/\r\n?/g, '\n').replace(/<!--[\s\S]*?(?:-->|$)/g, blank)
    .replace(/<(pre|script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, blank).split('\n');
  let fence;
  return lines.map(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined;
      return blank(line);
    }
    if (marker && !(marker[1][0] === '`' && marker[2].includes('`'))) {
      fence = marker[1];
      return blank(line);
    }
    return /^(?: {4}|\t)/.test(line) ? blank(line) : line;
  }).join('\n');
}

function codeSpans(text, replacement) {
  let result = '';
  let index = 0;
  while (index < text.length) {
    if (text[index] !== '`' || (index > 0 && text[index - 1] === '\\')) { result += text[index++]; continue; }
    let length = 1;
    while (text[index + length] === '`') length++;
    let end = index + length;
    while (end < text.length) {
      end = text.indexOf('`'.repeat(length), end);
      if (end < 0) break;
      if (text[end - 1] !== '`' && text[end + length] !== '`') break;
      end += length;
    }
    if (end < 0 || end >= text.length) { result += text.slice(index, index + length); index += length; continue; }
    result += replacement(text.slice(index, end + length), text.slice(index + length, end));
    index = end + length;
  }
  return result;
}

function destinationAt(source, start) {
  let index = start;
  while (/\s/.test(source[index] ?? '') && index < source.length) index++;
  if (source[index] === '<') {
    const end = source.indexOf('>', index + 1);
    if (end < 0 || source.slice(index, end).includes('\n')) return undefined;
    return { target: source.slice(index + 1, end), end: end + 1 };
  }
  const begin = index;
  let depth = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === '\\' && index + 1 < source.length) { index += 2; continue; }
    if (/\s/.test(char) || (char === ')' && depth === 0)) break;
    if (char === '(') depth++;
    if (char === ')') depth--;
    index++;
  }
  return depth === 0 ? { target: source.slice(begin, index), end: index } : undefined;
}

function inlineLinks(source) {
  const links = [];
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== '[' || source[index - 1] === '\\') continue;
    let end = index + 1;
    let depth = 1;
    while (end < source.length && depth) {
      if (source[end] === '\\') { end += 2; continue; }
      if (source[end] === '[') depth++;
      if (source[end] === ']') depth--;
      end++;
    }
    if (depth || source[end] !== '(') continue;
    const destination = destinationAt(source, end + 1);
    if (!destination) continue;
    let close = destination.end;
    while (/\s/.test(source[close] ?? '') && close < source.length) close++;
    if ('"\'('.includes(source[close] ?? '\u0000')) {
      const quote = source[close] === '(' ? ')' : source[close];
      close++;
      while (close < source.length && source[close] !== quote) close += source[close] === '\\' ? 2 : 1;
      close++;
      while (/\s/.test(source[close] ?? '') && close < source.length) close++;
    }
    if (source[close] !== ')') continue;
    links.push({ target: destination.target, index, end: close + 1, label: source.slice(index + 1, end - 1) });
    index = close;
  }
  return links;
}

export function markdownLinks(source) {
  const visible = codeSpans(withoutCodeBlocks(source), whole => blank(whole));
  const links = inlineLinks(visible);
  for (const match of visible.matchAll(/^ {0,3}\[[^\]\n]+\]:[ \t]*/gm)) {
    const destination = destinationAt(visible, match.index + match[0].length);
    if (destination) links.push({ target: destination.target, index: match.index });
  }
  for (const match of visible.matchAll(/<((?:https?:\/\/)[^<>\s]+)>/gi)) links.push({ target: match[1], index: match.index });
  for (const match of visible.matchAll(/<[^>]+\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) links.push({ target: match[1] ?? match[2] ?? match[3], index: match.index });
  return links.sort((a, b) => a.index - b.index).map(({ target, index }) => ({ target: decodeEntities(unescapeMarkdown(target)), line: visible.slice(0, index).split('\n').length }));
}

function headingText(source) {
  const code = [];
  let text = codeSpans(source, (_whole, contents) => {
    code.push(contents.replace(/\s+/g, ' ').trim());
    return `\ue000${code.length - 1}\ue000`;
  });
  for (const link of inlineLinks(text).reverse()) text = text.slice(0, link.index) + link.label + text.slice(link.end);
  text = text.replace(/!?\[([^\]]*)\](?:\[[^\]]*\])/g, '$1').replace(/<[^>]*>/g, '')
    .replace(/(?<!\w)(_+)(?=\S)(.*?\S)\1(?!\w)/g, '$2').replace(/(\*+|~~)(?=\S)(.*?\S)\1/g, '$2');
  text = decodeEntities(unescapeMarkdown(text));
  return text.replace(/\ue000(\d+)\ue000/g, (_match, index) => code[Number(index)]).trim();
}

export function markdownAnchors(source) {
  const visible = withoutCodeBlocks(source);
  const anchors = new Set();
  const generated = new Set();
  const addHeading = text => {
    const base = headingText(text).toLowerCase().replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '').replaceAll(' ', '-');
    let slug = base;
    let suffix = 0;
    while (generated.has(slug)) slug = `${base}-${++suffix}`;
    generated.add(slug);
    anchors.add(slug);
  };
  const lines = visible.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const heading = lines[index].match(/^ {0,3}#{1,6}(?:[ \t]+(.*?)|[ \t]*)$/);
    if (heading) addHeading((heading[1] ?? '').replace(/[ \t]+#+[ \t]*$/, ''));
    else if (index > 0 && /^ {0,3}(?:=+|-+)[ \t]*$/.test(lines[index]) && lines[index - 1].trim() && !/^ {0,3}(?:[-*+]>?|>|#{1,6})(?:\s|$)/.test(lines[index - 1])) addHeading(lines[index - 1]);
  }
  const html = codeSpans(visible, whole => blank(whole));
  for (const tag of html.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)) {
    for (const attribute of tag[2].matchAll(/\b(id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      if (attribute[1].toLowerCase() === 'id' || tag[1].toLowerCase() === 'a') anchors.add(decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4]));
    }
  }
  return anchors;
}

export function resolveLocalLink(root, sourceFile, target) {
  if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(target)) return undefined;
  const separator = target.indexOf('#');
  const pathname = (separator < 0 ? target : target.slice(0, separator)).split('?')[0];
  const fragment = separator < 0 ? undefined : decodeURIComponent(target.slice(separator + 1));
  const decodedPath = decodeURIComponent(pathname);
  const file = !decodedPath ? sourceFile : decodedPath.startsWith('/') ? path.resolve(root, `.${decodedPath}`) : path.resolve(path.dirname(sourceFile), decodedPath);
  const relative = path.relative(root, file);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('link points outside the repository');
  if (relative.split(path.sep).some(part => excludedDirectories.has(part))) throw new Error('link points to excluded/local-only output; describe it as a code path instead');
  return { file, fragment };
}
