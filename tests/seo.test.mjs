import assert from 'node:assert/strict';
import test from 'node:test';
import { middleware } from '../middleware.ts';
import { companyInfo } from '../lib/consultation.ts';
import { homeStructuredData, pageMetadata, robotsRules, seoPages, serializeStructuredData, serviceStructuredData, sitemapEntries, siteOrigin, verificationMetadata } from '../lib/seo.ts';

await test('every advertised page has one distinct title and description and a canonical matching its sitemap URL', () => {
  const entries = sitemapEntries();
  assert.equal(new Set(entries.map(entry => entry.url)).size, 7);
  assert.equal(new Set(seoPages.map(page => page.title)).size, 7);
  assert.equal(new Set(seoPages.map(page => page.description)).size, 7);
  for (const [index, page] of seoPages.entries()) {
    const metadata = pageMetadata(page.path);
    const url = new URL(entries[index].url);
    assert.equal(url.origin, siteOrigin);
    assert.equal(url.pathname, page.path);
    assert.equal(url.search + url.hash, '');
    assert.equal(metadata.alternates.canonical, url.href);
    assert.equal(metadata.openGraph.url, url.href);
    assert.match(metadata.title, /온앤오프/);
    assert.equal(entries[index].lastModified, undefined);
  }
});

await test('unknown paths, fragments and campaign parameters cannot become indexed page definitions', () => {
  for (const path of ['/api/inquiry', '/missing', '/#home', '/inquiry?from=web', '//evil.example']) {
    assert.throws(() => pageMetadata(path), /No SEO page/);
  }
  assert.throws(() => serviceStructuredData({ slug: 'missing', name: 'missing', intro: '' }), /No public service/);
});

await test('robots permits the public site and rendering resources and announces the production sitemap', () => {
  const robots = robotsRules();
  assert.equal(robots.rules.userAgent, '*');
  assert.equal(robots.rules.allow, '/');
  assert.equal(robots.rules.disallow, '/api/');
  assert.equal(robots.sitemap, siteOrigin + '/sitemap.xml');
});

await test('company graph uses the same confirmed contact information as the visible site', () => {
  const graph = homeStructuredData(companyInfo)['@graph'];
  const organization = graph.find(item => item['@type'] === 'Organization');
  const website = graph.find(item => item['@type'] === 'WebSite');
  assert.equal(organization.legalName, companyInfo.name);
  assert.equal(organization.email, companyInfo.email);
  assert.equal(organization.identifier.value, companyInfo.businessNumber);
  assert.equal(organization.address.streetAddress, companyInfo.address);
  assert.equal(organization.telephone, '+82-31-647-6396');
  assert.equal(website.publisher['@id'], organization['@id']);
  assert.equal(organization.aggregateRating, undefined);
  assert.equal(organization.openingHours, undefined);
});

await test('each service graph connects its page, provider and ordered canonical breadcrumbs without invented commercial data', () => {
  for (const slug of ['planning', 'design', 'web', 'marketing', 'operations']) {
    const graph = serviceStructuredData({ slug, name: '서비스', intro: '실제 서비스 설명' })['@graph'];
    const [page, service, breadcrumb] = graph;
    assert.equal(page.mainEntity['@id'], service['@id']);
    assert.equal(page.breadcrumb['@id'], breadcrumb['@id']);
    assert.equal(service.provider['@id'], siteOrigin + '/#organization');
    assert.equal(service.offers, undefined);
    assert.equal(service.aggregateRating, undefined);
    assert.deepEqual(breadcrumb.itemListElement.map(item => item.position), [1, 2]);
    assert.equal(breadcrumb.itemListElement[1].item, page.url);
  }
});

await test('JSON-LD serialization cannot terminate its HTML script element and preserves the source value', () => {
  const malicious = { name: '</script><script>alert("x")</script>&\u2028\u2029', nested: ['<img src=x onerror=alert(1)>'] };
  const serialized = serializeStructuredData(malicious);
  assert.equal(serialized.includes('<'), false);
  assert.equal(serialized.includes('\u2028'), false);
  assert.equal(serialized.includes('\u2029'), false);
  assert.deepEqual(JSON.parse(serialized), malicious);
});

await test('ownership tags are absent without supplied account values and independent when only one exists', () => {
  assert.equal(verificationMetadata({}), undefined);
  assert.equal(verificationMetadata({ google: ' ', naver: '\n' }), undefined);
  assert.deepEqual(verificationMetadata({ google: ' google-test-token ' }), { google: 'google-test-token' });
  assert.deepEqual(verificationMetadata({ naver: ' naver-test-token ' }), { other: { 'naver-site-verification': 'naver-test-token' } });
  assert.deepEqual(verificationMetadata({ google: 'google-test-token', naver: 'naver-test-token' }), { google: 'google-test-token', other: { 'naver-site-verification': 'naver-test-token' } });
});

await test('the redirect preserves path, encoded and repeated query values, method semantics and the exact canonical host', () => {
  for (const path of ['/', '/services/web?utm_source=seo-audit', '/inquiry?service=web&from=web', '/inquiry?ref=a%2Fb&tag=one&tag=two', '/robots.txt', '/sitemap.xml']) {
    const request = new Request('https://www.on-onf.com' + path);
    const response = middleware(request);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), siteOrigin + path);
  }
  const post = middleware(new Request('https://www.on-onf.com/api/inquiry', { method: 'POST', body: 'test-only' }));
  assert.equal(post.status, 308); // The HTTP redirect status preserves the method.
  assert.equal(post.headers.get('location'), siteOrigin + '/api/inquiry');
  for (const host of ['on-onf.com', 'localhost:5187', 'wwwXon-onfXcom', 'www.on-onf.com.evil.example']) {
    const request = new Request('https://' + host + '/services/web');
    assert.equal(middleware(request), undefined);
  }
});
