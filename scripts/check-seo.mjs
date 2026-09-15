// HTTP/SSR checks; this does not simulate rendering or prove search-engine indexing.
import assert from 'node:assert/strict';
import { seoPages, siteOrigin } from '../lib/seo.ts';

const base = new URL(process.argv[2] || 'http://localhost:5187');
const remote = base.origin === siteOrigin;
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)])));
const meta = (html, name) => tags(html, 'meta').filter(tag => tag.name?.toLowerCase() === name || tag.property === name).map(tag => tag.content);
const canonical = html => tags(html, 'link').filter(tag => tag.rel === 'canonical').map(tag => new URL(tag.href).href);
const report = { base: base.origin, checkedAt: new Date().toISOString(), pages: [], redirects: [], resources: [] };

async function get(path, options = {}) {
  const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30000), ...options });
  return { response, body: await response.text() };
}

for (const page of seoPages) {
  const { response, body } = await get(page.path);
  assert.equal(response.status, 200, page.path);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const head = body.split('</head>')[0];
  const titles = [...head.matchAll(/<title>(.*?)<\/title>/gs)].map(match => decode(match[1]));
  assert.deepEqual(titles, [page.title], `${page.path}: title`);
  assert.deepEqual(meta(head, 'description'), [page.description]);
  assert.deepEqual(canonical(head), [siteOrigin + page.path]);
  assert.deepEqual(meta(head, 'og:url').map(url => new URL(url).href), [siteOrigin + page.path]);
  assert.ok(meta(head, 'robots').some(value => /\bindex\b/.test(value)));
  assert.equal(meta(body, 'robots').some(value => /noindex|none/.test(value)), false);
  assert.equal(/noindex|none/.test(response.headers.get('x-robots-tag') || ''), false);
  assert.match(body, /<html[^>]+lang="ko"/);
  assert.equal([...body.matchAll(/<h1[\s>]/g)].length, 1, `${page.path}: h1`);
  assert.deepEqual(meta(head, 'viewport'), ['width=device-width, initial-scale=1']);
  const graphs = [...body.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  if (page.path !== '/inquiry') {
    assert.equal(graphs.length, 1, `${page.path}: JSON-LD`);
    assert.ok(graphs[0]['@graph'].some(item => item['@type'] === 'WebPage'));
    assert.ok(graphs[0]['@graph'].some(item => item['@type'] === (page.path === '/' ? 'Organization' : 'Service')));
  }
  for (const img of tags(body, 'img')) assert.ok(Object.hasOwn(img, 'alt'), `${page.path}: missing image alternative`);
  if (page.path === '/') {
    for (const service of seoPages.filter(item => item.path.startsWith('/services/'))) {
      assert.ok(tags(body, 'a').some(tag => tag.href === service.path), `SSR link missing: ${service.path}`);
    }
    const assets = [...new Set([...tags(head, 'link').filter(tag => tag.rel === 'stylesheet').map(tag => tag.href), ...tags(body, 'script').map(tag => tag.src).filter(Boolean)])];
    for (const path of assets) {
      const asset = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
      assert.equal(asset.status, 200, `asset: ${path}`);
      assert.equal(/noindex/.test(asset.headers.get('x-robots-tag') || ''), false);
      await asset.arrayBuffer();
      report.resources.push(path);
    }
  }
  report.pages.push({ path: page.path, status: response.status, title: page.title, canonical: canonical(head)[0], graphs: graphs.length });
}

const robots = await get('/robots.txt');
assert.equal(robots.response.status, 200);
assert.match(robots.response.headers.get('content-type'), /text\/plain/);
assert.match(robots.body, /^User-agent: \*\s*$/mi);
assert.match(robots.body, /^Allow: \/\s*$/mi);
assert.doesNotMatch(robots.body, /^Disallow: \/\s*$/mi);
assert.match(robots.body, /^Sitemap: https:\/\/on-onf\.com\/sitemap\.xml\s*$/mi);
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200);
assert.match(sitemap.response.headers.get('content-type'), /(?:application|text)\/xml/);
const locations = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
assert.deepEqual(locations.toSorted((a, b) => a.localeCompare(b)), seoPages.map(page => siteOrigin + page.path).toSorted((a, b) => a.localeCompare(b)));
assert.doesNotMatch(sitemap.body, /<lastmod>|<priority>|<changefreq>/);

for (const path of ['/seo-audit-missing-page', '/services/seo-audit-missing-service']) {
  const missing = await get(path);
  assert.equal(missing.response.status, 404, path);
  assert.ok(meta(missing.body, 'robots').some(value => /noindex/.test(value)), path);
  assert.deepEqual(canonical(missing.body), [], `${path}: no inherited homepage canonical`);
}

const inquiry = await get('/inquiry?service=web&from=web&utm_source=seo-audit');
assert.equal(inquiry.response.status, 200);
assert.deepEqual(canonical(inquiry.body.split('</head>')[0]), [siteOrigin + '/inquiry']);
const api = await get('/api/inquiry');
assert.equal(api.response.status, 200);
assert.match(api.response.headers.get('x-robots-tag') || '', /noindex/);
assert.match(api.response.headers.get('cache-control') || '', /no-store/);

for (const agent of ['Googlebot', 'Yeti']) {
  for (const path of ['/', '/services/web', '/robots.txt', '/sitemap.xml']) {
    const fetched = await get(path, { headers: { 'User-Agent': agent } });
    assert.equal(fetched.response.status, 200, `${agent}: ${path}`);
    if (path === '/' || path.startsWith('/services/')) {
      assert.deepEqual(canonical(fetched.body.split('</head>')[0]), [siteOrigin + path]);
      assert.equal(meta(fetched.body, 'robots').some(value => /noindex/.test(value)), false);
    }
  }
}

// Vite rejects foreign Host headers. Check the actual public host after deployment;
// tests/seo.test.mjs also exercises the authored middleware locally.
for (const path of remote ? ['/', '/services/web?utm_source=seo-audit', '/inquiry?service=web&from=web', '/robots.txt', '/sitemap.xml'] : []) {
  const target = new URL(path, 'https://www.on-onf.com');
  const response = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 308, `www: ${path}`);
  assert.equal(new URL(response.headers.get('location')).href, new URL(path, siteOrigin).href);
  report.redirects.push({ from: target.href, status: response.status, to: response.headers.get('location') });
  await response.arrayBuffer();
}

report.robots = { status: robots.response.status, body: robots.body };
report.sitemap = { status: sitemap.response.status, urls: locations };
report.api = { status: api.response.status, robots: api.response.headers.get('x-robots-tag') };
report.botHeaders = 'Googlebot and Yeti user-agent HTTP checks passed; actual indexing is not measured.';
console.log(JSON.stringify(report, null, 2));
