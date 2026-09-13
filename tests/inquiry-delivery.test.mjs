import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { compileFunction } from 'node:vm';
import { randomUUID } from 'node:crypto';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const modules = new Map();
// The repository's TS files use bundler-style extensionless imports. Compile
// their real source without changing production resolution or mocking enums.
function loadSource(url) {
  const key = url.href;
  if (modules.has(key)) return modules.get(key);
  const exports = {};
  modules.set(key, exports);
  const source = ts.transpileModule(fs.readFileSync(url, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  compileFunction(source, ['require', 'exports'], { filename: url.pathname })(specifier => {
    assert.ok(specifier.startsWith('./'), `Unexpected dependency ${specifier}`);
    return loadSource(new URL(`${specifier}.ts`, url));
  }, exports);
  return exports;
}
const { createInquiryStatus, createInquiryDeliveryGuard, handleInquirySubmission, inquiryBodyLimit } = loadSource(new URL('../lib/inquiry-delivery.ts', import.meta.url));
const webhookUrl = 'https://hooks.slack.com/services/T_TEST/B_TEST/FAKE_SECRET_NEVER_SENT';
const { inquiryPrivacyVersion: privacyVersion, inquiryPrivacyNotice: privacyNotice, inquiryOverseasNotice: overseasNotice } = loadSource(new URL('../lib/inquiry-privacy.ts', import.meta.url));
const draft = () => ({ services: ['web'], description: '신제품 소개 홈페이지 제작을 문의합니다.', budget: '상담 후 결정', budgetBasis: '프로젝트 전체', schedule: '일정 협의', reference: '', company: '가상 검증 브랜드', name: '테스트 담당자', email: 'qa@example.test', phone: '', consent: true, overseasConsent: true, privacyVersion, requestId: randomUUID() });
const request = (payload = draft(), headers = {}, body) => new Request('https://onoff.example/api/inquiry', { method: 'POST', headers: { origin: 'https://onoff.example', 'content-type': 'application/json', ...headers }, body: body ?? JSON.stringify(payload) });
const configured = overrides => ({ webhookUrl, privacyVersion, guard: createInquiryDeliveryGuard(), fetcher: async () => new Response('ok'), ...overrides });
async function result(response) {
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const text = await response.text();
  assert.ok(!text.includes('FAKE_SECRET_NEVER_SENT'));
  return { status: response.status, body: JSON.parse(text) };
}

await test('status exposes only readiness and approved public notice', async () => {
  for (const config of [{}, { webhookUrl }, { privacyVersion }, { webhookUrl, privacyVersion: 'outdated' }, { webhookUrl: 'https://attacker.example/services/a/b/c', privacyVersion }]) {
    assert.deepEqual((await result(createInquiryStatus(config))).body, { enabled: false, privacyVersion: null, privacyNotice: null, overseasNotice: null });
  }
  assert.deepEqual((await result(createInquiryStatus({ webhookUrl, privacyVersion }))).body, { enabled: true, privacyVersion, privacyNotice, overseasNotice });
});

await test('missing configuration and unsafe webhook URLs never call the transport', async () => {
  let calls = 0;
  for (const bad of [undefined, '', 'http://hooks.slack.com/services/a/b/c', 'https://hooks.slack.com.attacker.example/services/a/b/c', 'https://user@hooks.slack.com/services/a/b/c', 'https://hooks.slack.com:8080/services/a/b/c', `${webhookUrl}?token=leak`, `${webhookUrl}#secret`, 'https://hooks.slack.com/services/a/b']) {
    const outcome = await result(await handleInquirySubmission(request(), configured({ webhookUrl: bad, fetcher: async () => { calls++; throw new Error('must not fetch'); } })));
    assert.equal(outcome.status, 503);
    assert.equal(outcome.body.code, 'configuration_required');
  }
  assert.equal(calls, 0);
});

await test('method, Origin, Fetch Metadata and content type are enforced before sending', async () => {
  const fetcher = async () => assert.fail('must not fetch');
  assert.equal((await handleInquirySubmission(new Request('https://onoff.example/api/inquiry'), configured({ fetcher }))).status, 405);
  for (const headers of [{ origin: 'https://attacker.example' }, { origin: '' }, { origin: 'null' }, { 'sec-fetch-site': 'cross-site' }]) assert.equal((await handleInquirySubmission(request(draft(), headers), configured({ fetcher }))).status, 403);
  assert.equal((await handleInquirySubmission(request(draft(), { 'content-type': 'text/plain' }), configured({ fetcher }))).status, 415);
});

await test('server rejects malformed JSON, invalid UTF-8, declared and actual oversized bodies', async () => {
  const fetcher = async () => assert.fail('must not fetch');
  for (const [body, status] of [['{', 400], [new Uint8Array([255, 254]), 400], [' '.repeat(inquiryBodyLimit + 1), 413]]) assert.equal((await handleInquirySubmission(request({}, {}, body), configured({ fetcher }))).status, status);
  assert.equal((await handleInquirySubmission(request(draft(), { 'content-length': String(inquiryBodyLimit + 1) }), configured({ fetcher }))).status, 413);
});

await test('streamed byte limit cannot be bypassed by missing or false Content-Length', async () => {
  let cancelled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(inquiryBodyLimit)); controller.enqueue(new Uint8Array(1)); }, cancel() { cancelled = true; } });
  const streamed = new Request('https://onoff.example/api/inquiry', { method: 'POST', headers: { origin: 'https://onoff.example', 'content-type': 'application/json', 'content-length': '1' }, body: stream, duplex: 'half' });
  assert.equal((await handleInquirySubmission(streamed, configured({ fetcher: async () => assert.fail('must not fetch') }))).status, 413);
  assert.equal(cancelled, true);
});

await test('strict types, enum values, field bounds, consent and request IDs are validated', async () => {
  const changes = [
    { services: [] }, { services: ['unknown'] }, { services: ['web', 'web'] }, { services: ['discuss', 'web'] }, { services: 'web' }, { description: null }, { description: '짧음' }, { description: '가'.repeat(3001) },
    { description: '문의 내용에\u0000제어 문자' }, { company: 'a'.repeat(101) }, { name: '' }, { name: '가\n나' }, { email: 'bad' }, { email: `${'a'.repeat(254)}@b.c` }, { phone: 'not a phone' }, { reference: 'a'.repeat(501) },
    { budget: '확정 무료' }, { budgetBasis: 'unknown' }, { schedule: '내일 보장' }, { consent: false }, { consent: 'true' }, { overseasConsent: false }, { overseasConsent: undefined }, { overseasConsent: 'true' }, { privacyVersion: undefined }, { privacyVersion: 'outdated' }, { requestId: 'not-uuid' }, { channel: 'arbitrary-channel' }, { files: [] },
  ];
  for (const change of changes) assert.equal((await handleInquirySubmission(request({ ...draft(), ...change }), configured({ fetcher: async () => assert.fail('must not fetch') }))).status, 400, JSON.stringify(change));
  for (const invalid of [null, [], 'text', 4]) assert.equal((await handleInquirySubmission(request(invalid), configured({ fetcher: async () => assert.fail('must not fetch') }))).status, 400);
});

await test('valid inquiry uses a fixed notification and plain_text blocks without Slack mention injection', async () => {
  const input = { ...draft(), company: '<!channel> *회사*', name: '<@U123> 담당자', description: `${'가'.repeat(2982)}<!here>🙂`, reference: 'https://example.test/<!channel>' };
  let calls = 0;
  const response = await handleInquirySubmission(request(input), configured({ fetcher: async (url, init) => {
    calls++;
    assert.equal(url, webhookUrl);
    assert.equal(init.method, 'POST');
    assert.equal(init.redirect, 'error');
    assert.equal(init.cache, 'no-store');
    assert.equal(init.headers['Content-Type'], 'application/json');
    assert.ok(init.signal instanceof AbortSignal);
    const payload = JSON.parse(init.body);
    assert.equal(payload.text, 'ON&OFF 새 프로젝트 문의가 도착했습니다.');
    assert.equal(payload.unfurl_links, false);
    assert.equal(payload.unfurl_media, false);
    assert.ok(!('channel' in payload) && !('files' in payload));
    for (const block of payload.blocks) { assert.equal(block.text.type, 'plain_text'); assert.ok(block.text.text.length <= 3000); }
    assert.equal(payload.blocks[5].text.text, input.description);
    assert.ok(payload.blocks.at(-1).text.text.includes(input.requestId));
    assert.ok(payload.blocks.at(-1).text.text.includes(`동의 완료 · 안내 버전 ${privacyVersion}`));
    return new Response('ok', { status: 200 });
  } }));
  assert.deepEqual((await result(response)).body, { ok: true, code: 'delivered', requestId: input.requestId });
  assert.equal(calls, 1);
});

await test('exactly 3000 description characters fit their own Slack block', async () => {
  const response = await handleInquirySubmission(request({ ...draft(), description: '가'.repeat(3000) }), configured({ fetcher: async (_, init) => {
    assert.equal(JSON.parse(init.body).blocks[5].text.text.length, 3000);
    return new Response('ok');
  } }));
  assert.equal(response.status, 200);
});

await test('only HTTP 200 with ok body is success and no upstream error details leak', async () => {
  for (const [status, text] of [[200, 'invalid_payload FAKE_SECRET_NEVER_SENT'], [201, 'ok'], [204, null], [403, 'secret revoked'], [429, 'limited'], [500, 'upstream internals']]) {
    const input = draft(), guard = createInquiryDeliveryGuard();
    const response = await result(await handleInquirySubmission(request(input), configured({ guard, fetcher: async () => new Response(text, { status }) })));
    assert.equal(response.status, 502);
    assert.equal(response.body.code, 'delivery_failed');
    const corrected = await handleInquirySubmission(request(input), configured({ guard }));
    assert.equal(corrected.status, 200, 'Known rejection permits an explicit corrected retry');
  }
});

await test('network failure is uncertain, never leaks secrets, and suppresses repeat delivery', async () => {
  const input = draft(), guard = createInquiryDeliveryGuard();
  let calls = 0;
  const options = configured({ guard, fetcher: async () => { calls++; throw new Error(`FAKE_SECRET_NEVER_SENT ${input.description}`); } });
  for (let i = 0; i < 2; i++) {
    const outcome = await result(await handleInquirySubmission(request(input), options));
    assert.equal(outcome.status, 502);
    assert.equal(outcome.body.code, 'delivery_unknown');
    assert.ok(!JSON.stringify(outcome.body).includes(input.description));
  }
  assert.equal(calls, 1);
});

await test('timeout aborts transport and does not automatically resend', async () => {
  const input = draft(), guard = createInquiryDeliveryGuard();
  let signal, calls = 0;
  const options = configured({ guard, timeoutMs: 10, fetcher: async (_, init) => { calls++; signal = init.signal; return new Promise(() => {}); } });
  assert.equal((await result(await handleInquirySubmission(request(input), options))).body.code, 'delivery_unknown');
  assert.equal(signal.aborted, true);
  assert.equal((await result(await handleInquirySubmission(request(input), options))).body.code, 'delivery_unknown');
  assert.equal(calls, 1);
});

await test('timeout also covers a response body that never completes', async () => {
  const response = await handleInquirySubmission(request(), configured({ timeoutMs: 10, fetcher: async () => new Response(new ReadableStream({ start() {} })) }));
  assert.equal((await result(response)).body.code, 'delivery_unknown');
});

await test('simultaneous duplicate returns pending and a completed duplicate sends only once', async () => {
  const input = draft(), guard = createInquiryDeliveryGuard();
  let complete, entered;
  const started = new Promise(resolve => { entered = resolve; });
  let calls = 0;
  const options = configured({ guard, fetcher: async () => { calls++; entered(); return new Promise(resolve => { complete = resolve; }); } });
  const first = handleInquirySubmission(request(input), options);
  await started;
  const pending = await result(await handleInquirySubmission(request(input), options));
  assert.equal(pending.status, 429);
  assert.equal(pending.body.code, 'duplicate_pending');
  complete(new Response('ok'));
  assert.equal((await first).status, 200);
  assert.equal((await result(await handleInquirySubmission(request(input), options))).body.code, 'delivered');
  assert.equal(calls, 1);
  assert.equal((await handleInquirySubmission(request({ ...input, description: '수정한 문의 내용으로 다시 보냅니다.' }), options)).status, 409);
});

await test('guard is bounded, retains only fingerprints, and expires old receipts', () => {
  let time = 0;
  const guard = createInquiryDeliveryGuard({ now: () => time, ttlMs: 100, maxEntries: 1 });
  assert.equal(guard.reserve('one', 'hash'), 'new');
  guard.finish('one', 'delivered');
  assert.equal(guard.reserve('one', 'hash'), 'delivered');
  assert.equal(guard.reserve('two', 'another'), 'full');
  time = 101;
  assert.equal(guard.reserve('two', 'another'), 'new');
});

await test('Cloudflare metadata enables best-effort 3-per-minute address cooldown', async () => {
  let time = 0;
  const guard = createInquiryDeliveryGuard({ now: () => time });
  let calls = 0;
  const options = configured({ guard, fetcher: async () => { calls++; return new Response('ok'); } });
  const cfRequest = () => {
    const incoming = request(draft(), { 'cf-connecting-ip': '203.0.113.4', 'x-forwarded-for': randomUUID() });
    Object.defineProperty(incoming, 'cf', { value: { colo: 'TEST' } });
    return incoming;
  };
  for (let i = 0; i < 3; i++) assert.equal((await handleInquirySubmission(cfRequest(), options)).status, 200);
  assert.equal((await result(await handleInquirySubmission(cfRequest(), options))).body.code, 'rate_limited');
  assert.equal(calls, 3);
  time = 60001;
  assert.equal((await handleInquirySubmission(cfRequest(), options)).status, 200);
});

await test('Node ignores spoofed Cloudflare and forwarding headers without runtime metadata', async () => {
  const options = configured();
  for (let i = 0; i < 4; i++) assert.equal((await handleInquirySubmission(request(draft(), { 'cf-connecting-ip': '203.0.113.4', 'x-forwarded-for': '203.0.113.4' }), options)).status, 200);
});
