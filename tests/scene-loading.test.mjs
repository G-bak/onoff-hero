import assert from 'node:assert/strict';
import test from 'node:test';
import { formatSceneWait, getSceneIssue, SceneLoadError, sceneLoadingTiming, startSceneLoadingClock } from '../lib/scene-loading.ts';

function fakeClock(initial = 0) {
  let now = initial;
  let nextId = 0;
  const jobs = new Map();
  const clock = {
    now: () => now,
    schedule(callback, delay) { const id = ++nextId; jobs.set(id, { callback, at: now + delay }); return id; },
    cancel(id) { jobs.delete(id); },
  };
  function runUntil(target, throttled = false) {
    if (throttled) now = target;
    while (true) {
      const next = [...jobs].filter(([, job]) => job.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      jobs.delete(next[0]);
      if (!throttled) now = next[1].at;
      next[1].callback();
    }
    now = target;
  }
  return { clock, advance: ms => runUntil(now + ms), resumeAfter: ms => runUntil(now + ms, true), pending: () => jobs.size };
}

await test('starts the visible timer at ten seconds and expires once at five minutes', () => {
  const time = fakeClock(47000);
  const ticks = [];
  let timeouts = 0;
  startSceneLoadingClock(value => ticks.push(value), () => timeouts++, time.clock);
  time.advance(9999);
  assert.deepEqual(ticks, []);
  time.advance(1);
  assert.deepEqual(ticks, [10]);
  time.advance(289999);
  assert.equal(ticks.at(-1), 299);
  assert.equal(timeouts, 0);
  time.advance(1);
  assert.equal(ticks.at(-1), 300);
  assert.equal(timeouts, 1);
  time.advance(300000);
  assert.equal(timeouts, 1);
  assert.equal(time.pending(), 0);
});

await test('completion, an error, or leaving for the basic view cancels future updates', () => {
  for (const finishAt of [800, 12000, 299999]) {
    const time = fakeClock();
    const ticks = [];
    let timeouts = 0;
    const stop = startSceneLoadingClock(value => ticks.push(value), () => timeouts++, time.clock);
    time.advance(finishAt);
    stop();
    stop();
    const before = ticks.length;
    time.advance(600000);
    assert.equal(ticks.length, before);
    assert.equal(timeouts, 0);
    assert.equal(time.pending(), 0);
  }
});

await test('a suspended tab uses elapsed time instead of counting delayed interval ticks', () => {
  const time = fakeClock();
  const ticks = [];
  let timeouts = 0;
  startSceneLoadingClock(value => ticks.push(value), () => timeouts++, time.clock);
  time.resumeAfter(360000);
  assert.deepEqual(ticks, [300]);
  assert.equal(timeouts, 1);
  assert.equal(time.pending(), 0);
});

await test('network, offline, server, asset, graphics and timeout errors stay distinct', () => {
  assert.equal(getSceneIssue(new Error(), 'assets', true).kind, 'network');
  assert.equal(getSceneIssue(new Error(), 'assets', false).kind, 'offline');
  assert.equal(getSceneIssue(new SceneLoadError('server'), 'assets', true).kind, 'server');
  assert.equal(getSceneIssue(new SceneLoadError('asset'), 'assets', true).kind, 'asset');
  assert.equal(getSceneIssue(new Error(), 'graphics', true).kind, 'graphics');
  assert.equal(getSceneIssue(new SceneLoadError('timeout'), 'assets', false).kind, 'timeout');
});

await test('shows one-second minimum and formats the five-minute waiting limit', () => {
  assert.equal(sceneLoadingTiming.minimumMs, 1000);
  assert.equal(formatSceneWait(10), '00:10');
  assert.equal(formatSceneWait(61), '01:01');
  assert.equal(formatSceneWait(299), '04:59');
  assert.equal(formatSceneWait(301), '05:00');
});
