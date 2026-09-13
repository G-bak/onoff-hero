import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { markdownAnchors, markdownLinks, resolveLocalLink } from '../scripts/markdown-links.mjs';
import { checkExternalLinks } from '../scripts/check-external-links.mjs';

await test('Korean, punctuation, inline markup and code headings keep readable text', () => {
  assert.deepEqual([...markdownAnchors('# ON&OFF\n## **한국어** `alpha_beta` <span>안내</span>\n## [참고](https://example.com) &amp; 이야기')], ['onoff', '한국어-alpha_beta-안내', '참고--이야기']);
});

await test('duplicate heading slugs reserve earlier numbered headings', () => {
  assert.deepEqual([...markdownAnchors('# A\n# A\n# A-1\n# A\n# A-1')], ['a', 'a-1', 'a-1-1', 'a-2', 'a-1-2']);
});

await test('HTML anchors do not change automatic duplicate heading numbering', () => {
  const anchors = markdownAnchors('<a name="same"></a>\n# Same\n# Same\n<div id="한글&amp;id"></div>\n<a name=legacy></a>');
  assert.deepEqual([...anchors], ['same', 'same-1', '한글&id', 'legacy']);
});

await test('HTML-looking code and comments do not create anchors or links', () => {
  const text = '`<a id="fake" href="bad.md">`\n<!-- <a id="hidden" href="missing.md"> -->\n<a id="visible" href="ok.md">';
  assert.deepEqual([...markdownAnchors(text)], ['visible']);
  assert.deepEqual(markdownLinks(text).map(link => link.target), ['ok.md']);
});

await test('setext headings, closing hashes and space rules match document conventions', () => {
  assert.deepEqual([...markdownAnchors('Title\n=====\n\n한글 제목\n---\n\n### End ###\n### C#\n## A  B')], ['title', '한글-제목', 'end', 'c', 'a--b']);
});

await test('fences accept longer closing markers and ignore fenced headings and links', () => {
  const text = '```md\n# hidden\n[bad](missing.md)\n````\n# Visible\n[good](ok.md)\n~~~\n# hidden2\n~~~~';
  assert.deepEqual([...markdownAnchors(text)], ['visible']);
  assert.deepEqual(markdownLinks(text), [{ target: 'ok.md', line: 6 }]);
});

await test('unclosed fences and indented code are not documentation links', () => {
  assert.deepEqual(markdownLinks('    [bad](missing.md)\n\t[bad](missing2.md)\n```md\n[bad](missing3.md)'), []);
});

await test('inline code spans keep Markdown examples out of the link scan', () => {
  assert.deepEqual(markdownLinks('`[one](bad.md)` ``[two](bad2.md) `x` `` [three](good.md)').map(link => link.target), ['good.md']);
});

await test('nested parentheses, escaped parentheses, titles and angle destinations', () => {
  const text = '[a](docs/one(two).md#part "a title") [b](docs/one\\(two\\).md) [c](<docs/한국어 안내.md#첫-장>) ![img](image.png)';
  assert.deepEqual(markdownLinks(text).map(link => link.target), ['docs/one(two).md#part', 'docs/one(two).md', 'docs/한국어 안내.md#첫-장', 'image.png']);
});

await test('reference definitions, nested labels, HTTP autolinks and HTML hrefs', () => {
  const text = '[ref]: <docs/a b.md#first> "title"\n[**nested [label]**](ok.md)\n<https://example.com/a(b)>\n<a href="guide.md#go">go</a>';
  assert.deepEqual(markdownLinks(text).map(link => link.target), ['docs/a b.md#first', 'ok.md', 'https://example.com/a(b)', 'guide.md#go']);
});

await test('percent encoding and root-relative paths resolve within the repository', () => {
  const root = path.resolve('fixture-root');
  const source = path.join(root, 'docs', 'source.md');
  assert.deepEqual(resolveLocalLink(root, source, '../%ED%95%9C%EA%B8%80.md#%EC%B2%AB-%EC%9E%A5'), { file: path.join(root, '한글.md'), fragment: '첫-장' });
  assert.deepEqual(resolveLocalLink(root, source, '/README.md#start'), { file: path.join(root, 'README.md'), fragment: 'start' });
  assert.deepEqual(resolveLocalLink(root, source, '#same'), { file: source, fragment: 'same' });
  assert.deepEqual(resolveLocalLink(root, source, 'target.md?view=1#part'), { file: path.join(root, 'docs', 'target.md'), fragment: 'part' });
});

await test('external URLs skip local lookup; malformed fragments and local-only paths fail', () => {
  const root = path.resolve('fixture-root');
  const source = path.join(root, 'README.md');
  assert.equal(resolveLocalLink(root, source, 'https://example.com/guide#part'), undefined);
  assert.equal(resolveLocalLink(root, source, '//example.com/guide'), undefined);
  assert.throws(() => resolveLocalLink(root, source, '#%ZZ'), URIError);
  assert.throws(() => resolveLocalLink(root, source, 'outputs/evidence.png'), /local-only/);
  assert.throws(() => resolveLocalLink(root, source, '../outside.md'), /outside/);
});

await test('missing heading fragments are distinguishable from existing targets', () => {
  const anchors = markdownAnchors('# 실제 제목\n# 실제 제목');
  assert.ok(anchors.has('실제-제목'));
  assert.ok(anchors.has('실제-제목-1'));
  assert.equal(anchors.has('잘못된-제목'), false);
});

await test('HTTP checker retries misleading HEAD responses and distinguishes access restrictions', async () => {
  const methods = [];
  const statuses = { good: [200], headOnly: [405, 200], gone: [404, 404], removed: [410, 410], restricted: [403], limited: [429], login: [401], server: [503] };
  const fetchImpl = async (url, options) => {
    const name = new URL(url).pathname.slice(1);
    methods.push(`${name}:${options.method}`);
    return new Response(null, { status: statuses[name].shift() });
  };
  const results = await checkExternalLinks(Object.keys(statuses).map(name => ({ url: `https://example.com/${name}`, sources: ['fixture.md:1'] })), { fetchImpl });
  assert.deepEqual(results.map(result => result.classification), ['reachable', 'reachable', 'broken', 'broken', 'unverified', 'unverified', 'unverified', 'unverified']);
  assert.ok(methods.includes('headOnly:GET'));
  assert.ok(methods.includes('gone:GET'));
});

await test('HTTP concurrency is capped at four and network errors stay unverified', async () => {
  let active = 0;
  let maximum = 0;
  const fetchImpl = async () => {
    maximum = Math.max(maximum, ++active);
    await new Promise(resolve => setTimeout(resolve, 5));
    active--;
    throw new TypeError('network error');
  };
  const results = await checkExternalLinks(Array.from({ length: 12 }, () => ({ url: 'https://example.com/' })), { concurrency: 100, fetchImpl });
  assert.equal(maximum, 4);
  assert.ok(results.every(result => result.classification === 'unverified'));
});
