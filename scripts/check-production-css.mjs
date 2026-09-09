import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { twMerge } from 'tailwind-merge';

function jsxClasses(file, tag) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let result;
  function visit(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === tag) {
      const attribute = node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(source) === 'className');
      const value = attribute?.initializer;
      if (value && ts.isStringLiteral(value)) result = value.text;
      if (value && ts.isJsxExpression(value) && value.expression && ts.isCallExpression(value.expression)) {
        const first = value.expression.arguments[0];
        if (first && ts.isStringLiteral(first)) result = first.text;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(result, `Could not read ${tag} classes in ${file}`);
  return result;
}

// Exercise the actual shared component and call-site classes through the same
// merge used by cn(), so a default centering class cannot silently return.
const classes = new Set(twMerge(
  jsxClasses('components/ui/dialog.tsx', 'DialogPrimitive.Popup'),
  jsxClasses('app/components/consultation-chat.tsx', 'DialogContent'),
).split(/\s+/));
for (const name of ['top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2']) {
  assert.ok(!classes.has(name), `Consultation popup still inherits ${name}`);
}
for (const name of ['top-auto', 'left-auto', 'translate-x-0', 'translate-y-0']) {
  assert.ok(classes.has(name), `Consultation popup is missing ${name}`);
}

const directory = 'dist/client/_next/static/css';
const css = fs.readdirSync(directory).filter(name => name.endsWith('.css')).map(name => fs.readFileSync(`${directory}/${name}`, 'utf8')).join('\n');
function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\{([^}]+)\\}`));
  assert.ok(match, `Missing production CSS rule: ${selector}`);
  return match[1];
}
function property(body, name) {
  return body.split(';').find(item => item.startsWith(`${name}:`))?.slice(name.length + 1);
}
const popup = rule('.consultation-dialog');
assert.equal(property(popup, 'position'), 'fixed');
assert.equal(property(popup, 'inset'), 'auto var(--chat-edge-x) var(--chat-edge-bottom) auto');
assert.ok(property(popup, 'width')?.includes('var(--chat-edge-x)'));
assert.ok(property(popup, 'height')?.includes('100dvh'));
assert.equal(property(popup, 'translate'), undefined);
assert.equal(property(popup, 'transform'), undefined);
for (const axis of ['x', 'y']) {
  const zero = property(rule(`.translate-${axis}-0`), `--tw-translate-${axis}`)?.replace(/\s+/g, '');
  assert.ok(zero === '0' || zero === '0px' || zero === 'calc(var(--spacing)*0)', `Unexpected ${axis} offset: ${zero}`);
}
const thumb = rule('.motion-control .motion-switch [data-slot=switch-thumb]');
assert.ok(property(thumb, 'translate')?.startsWith('var(--motion-thumb-x)'));
assert.equal(property(thumb, 'transform'), undefined);
const authoredCss = fs.readFileSync('app/globals.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
for (const match of authoredCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  assert.ok(!(/(?:^|;)\s*translate\s*:\s*none\s*[;}]/.test(`${match[2]};`) && /(?:^|;)\s*transform\s*:/.test(match[2])), `Unsafe mixed transform reset in ${match[1].trim()}`);
}

// Check the dimensions used by the compiled breakpoint rules, including
// narrow phones, short landscape windows, and display cutout insets.
const compactCss = css.replace(/\s+/g, '');
assert.ok(compactCss.includes('--chat-edge-x:max(16px,env(safe-area-inset-left),env(safe-area-inset-right))'));
assert.ok(compactCss.includes('--chat-edge-bottom:max(12px,env(safe-area-inset-bottom))'));
const widthLimit = Number.parseFloat(property(popup, '--chat-width'));
const heightLimit = Number.parseFloat(property(popup, '--chat-height'));
const cases = [
  [1920, 1080], [1366, 768], [1024, 600], [768, 1024],
  [320, 568], [375, 667], [390, 844, 0, 47, 34], [844, 390, 47, 0, 21], [600, 320],
];
for (const [width, height, safeX = 0, safeTop = 0, safeBottom = 0] of cases) {
  const mobile = width <= 700;
  const short = height <= 520;
  const edgeX = Math.max(mobile ? 16 : Math.max(24, Math.min(68, width * .035)), safeX);
  const bottom = short ? Math.max(12, safeBottom) : mobile ? Math.max(16, safeBottom) : 104;
  const top = short ? Math.max(12, safeTop) : mobile ? Math.max(16, safeTop) : 16;
  const popupWidth = mobile ? width - 2 * edgeX : Math.min(widthLimit, width - 2 * edgeX);
  const popupHeight = Math.min(mobile ? 700 : heightLimit, height - bottom - top);
  const left = width - edgeX - popupWidth;
  const upper = height - bottom - popupHeight;
  assert.ok(left >= safeX && upper >= safeTop && popupWidth > 0 && popupHeight > 0, `Popup exceeds viewport at ${width}x${height}`);
}
console.log(`Production CSS checks passed: popup class merging, zero offsets, switch travel, ${cases.length} viewport bounds.`);
