import assert from 'node:assert/strict';
import test from 'node:test';
import { loadCardFonts } from '../lib/scene-fonts.ts';

const members = [
  { displayName: '똠얌 Jane', role: '기존 직무', category: 'NEW TEAM', line: '새로운 설명입니다.' },
  { displayName: null, role: '확장된 직무', category: 'FUTURE ROLE', line: '다른 소개입니다.' },
];

await test('loads future display names and role fallbacks before drawing canvas text', async () => {
  const requests = [];
  await loadCardFonts({
    load(font, text) { requests.push({ font, text }); return Promise.resolve([]); },
    ready: Promise.resolve(),
  }, members);
  for (const family of ['"Pretendard Variable"', 'Inter']) {
    const title = requests.find(request => request.font === `500 58px ${family}`);
    assert.ok(title.text.includes(members[0].displayName));
    assert.ok(title.text.includes(members[1].role));
    assert.ok(!title.text.includes(members[0].role), 'The replaced role should not stand in for the actual name.');
  }
  const koreanBody = requests.find(request => request.font === '400 19px "Pretendard Variable"');
  const latinBody = requests.find(request => request.font === '400 22px Inter');
  for (const member of members) {
    assert.ok(koreanBody.text.includes(member.line));
    assert.ok(latinBody.text.includes(member.category));
    assert.ok(latinBody.text.includes(member.line));
  }
});

await test('waits for every requested subset and the visible page fonts', async () => {
  for (const delayed of ['subset', 'page']) {
    const pending = [];
    const requests = { load: () => new Promise(resolve => pending.push(resolve)), ready: Promise.resolve() };
    let ready;
    requests.ready = new Promise(resolve => { ready = resolve; });
    let finished = false;
    const loading = loadCardFonts(requests, members).then(() => { finished = true; });
    const last = pending.pop();
    pending.forEach(resolve => resolve([]));
    if (delayed === 'subset') ready();
    else last([]);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(finished, false, `Still waiting for ${delayed} fonts.`);
    last([]);
    ready();
    await loading;
    assert.equal(finished, true);
  }
});

await test('propagates a missing font to the existing scene error flow', async () => {
  const missingFont = new Error('Missing font subset');
  await assert.rejects(loadCardFonts({
    load: () => Promise.reject(missingFont),
    ready: Promise.resolve(),
  }, members), error => error === missingFont);
});
