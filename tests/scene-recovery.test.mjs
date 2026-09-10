import assert from 'node:assert/strict';
import test from 'node:test';
import { createSceneRecovery, observeSceneContext, sceneRecoveryTiming } from '../lib/scene-recovery.ts';
import { createSceneFrameLoop } from '../lib/scene-frame-loop.ts';

function setup(visible = true) {
  let now = 0;
  let nextId = 0;
  let resumes = 0;
  const timers = new Map();
  const changes = [];
  const recovery = createSceneRecovery({
    visible,
    onChange: status => changes.push(status),
    onResume: () => resumes++,
    clock: {
      now: () => now,
      schedule: (callback, delay) => { const id = nextId++; timers.set(id, { callback, at: now + delay }); return id; },
      cancel: id => timers.delete(id),
    },
  });
  return {
    recovery, changes,
    resumes: () => resumes,
    pending: () => timers.size,
    advance(ms) {
      const end = now + ms;
      while (true) {
        const due = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        now = due[1].at;
        timers.delete(due[0]);
        due[1].callback();
      }
      now = end;
    },
  };
}

void test('restoration requests a frame but only a healthy paint completes recovery', () => {
  const h = setup();
  h.recovery.lose('front');
  assert.equal(h.recovery.canRender(), false);
  h.recovery.painted();
  assert.deepEqual(h.changes, ['recovering']);
  h.recovery.restore('front');
  assert.equal(h.recovery.canRender(), true);
  assert.equal(h.resumes(), 1);
  assert.deepEqual(h.changes, ['recovering']);
  h.recovery.painted();
  assert.deepEqual(h.changes, ['recovering', 'ready']);
  assert.equal(h.pending(), 0);
});

void test('both front and rear must restore; duplicate or unrelated events cannot bypass that', () => {
  const h = setup();
  h.recovery.lose('front');
  h.recovery.lose('rear');
  h.recovery.restore('unrelated');
  h.recovery.restore('rear');
  h.recovery.restore('rear');
  h.recovery.painted();
  assert.equal(h.recovery.canRender(), false);
  assert.equal(h.resumes(), 0);
  h.recovery.restore('front');
  assert.equal(h.resumes(), 1);
  h.recovery.painted();
  assert.deepEqual(h.changes, ['recovering', 'ready']);
});

void test('duplicate losses and a second renderer loss cannot keep extending the deadline', () => {
  const h = setup();
  h.recovery.lose('front');
  h.advance(6000);
  h.recovery.lose('front');
  h.recovery.lose('rear');
  h.advance(3999);
  assert.deepEqual(h.changes, ['recovering']);
  h.advance(1);
  assert.deepEqual(h.changes, ['recovering', 'fallback']);
});

void test('a later independent loss receives a fresh recovery budget', () => {
  const h = setup();
  h.recovery.lose('front');
  h.advance(9000);
  h.recovery.restore('front');
  h.recovery.painted();
  h.recovery.lose('rear');
  h.advance(9000);
  assert.deepEqual(h.changes, ['recovering', 'ready', 'recovering']);
  h.advance(1000);
  assert.equal(h.changes.at(-1), 'fallback');
});

void test('time spent in a hidden tab does not consume the remaining visible recovery budget', () => {
  const h = setup();
  h.recovery.lose('front');
  h.advance(4000);
  h.recovery.setVisible(false);
  assert.equal(h.pending(), 0);
  h.advance(600000);
  h.recovery.setVisible(false);
  assert.deepEqual(h.changes, ['recovering']);
  h.recovery.setVisible(true);
  h.advance(5999);
  assert.deepEqual(h.changes, ['recovering']);
  h.advance(1);
  assert.equal(h.changes.at(-1), 'fallback');
});

void test('a context restored while hidden waits for a visible paint', () => {
  const h = setup(false);
  h.recovery.lose('rear');
  h.recovery.restore('rear');
  h.recovery.painted();
  h.advance(600000);
  assert.equal(h.resumes(), 0);
  assert.deepEqual(h.changes, ['recovering']);
  h.recovery.setVisible(true);
  assert.equal(h.resumes(), 1);
  h.recovery.painted();
  assert.deepEqual(h.changes, ['recovering', 'ready']);
  assert.equal(h.pending(), 0);
});

void test('restored contexts without a completed render still time out', () => {
  const h = setup();
  h.recovery.lose('front');
  h.recovery.restore('front');
  h.advance(sceneRecoveryTiming.maximumVisibleMs);
  assert.deepEqual(h.changes, ['recovering', 'fallback']);
  assert.equal(h.recovery.canRender(), false);
});

void test('late callbacks after fallback cannot reactivate disposed graphics', () => {
  const h = setup();
  h.recovery.lose('front');
  h.recovery.fail();
  h.recovery.restore('front');
  h.recovery.painted();
  h.recovery.lose('rear');
  h.recovery.setVisible(false);
  h.recovery.setVisible(true);
  h.recovery.fail();
  h.advance(60000);
  assert.deepEqual(h.changes, ['recovering', 'fallback']);
  assert.equal(h.resumes(), 0);
  assert.equal(h.pending(), 0);
});

void test('cleanup cancels timer ID zero and ignores subsequent lifecycle calls', () => {
  const h = setup();
  h.recovery.lose('front');
  h.recovery.dispose();
  h.recovery.dispose();
  h.recovery.restore('front');
  h.recovery.painted();
  h.recovery.setVisible(false);
  h.recovery.fail();
  h.recovery.lose('rear');
  h.advance(60000);
  assert.deepEqual(h.changes, ['recovering']);
  assert.equal(h.recovery.canRender(), false);
  assert.equal(h.pending(), 0);
});

void test('each canvas listens directly, allows browser restoration and removes both listeners', () => {
  const h = setup();
  const front = new EventTarget();
  const rear = new EventTarget();
  const detachFront = observeSceneContext(front, 'front', h.recovery);
  const detachRear = observeSceneContext(rear, 'rear', h.recovery);
  const loss = new Event('webglcontextlost', { cancelable: true });
  front.dispatchEvent(loss);
  rear.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  assert.equal(loss.defaultPrevented, true);
  detachFront();
  front.dispatchEvent(new Event('webglcontextrestored'));
  rear.dispatchEvent(new Event('webglcontextrestored'));
  assert.equal(h.recovery.canRender(), false, 'detached front restoration must not be observed');
  h.recovery.restore('front');
  h.recovery.painted();
  detachRear();
  const laterLoss = new Event('webglcontextlost', { cancelable: true });
  front.dispatchEvent(laterLoss);
  rear.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  assert.equal(laterLoss.defaultPrevented, false);
  assert.deepEqual(h.changes, ['recovering', 'ready']);
  h.recovery.dispose();
});

void test('a runtime failure can enter fallback directly from ready', () => {
  const h = setup();
  h.recovery.fail();
  h.recovery.fail();
  assert.deepEqual(h.changes, ['fallback']);
  assert.equal(h.recovery.canRender(), false);
});

void test('restoration wakes a MOTION OFF frame loop once, then returns to idle', () => {
  let draws = 0;
  let nextId = 0;
  const frames = new Map();
  const recovery = createSceneRecovery({
    onChange: status => { if (status === 'recovering') loop.suspend(); },
    onResume: () => loop.invalidate(),
    clock: { now: () => 0, schedule: () => 0, cancel: () => {} },
  });
  const loop = createSceneFrameLoop(() => { draws++; recovery.painted(); return false; }, {
    canRun: recovery.canRender,
    clock: {
      now: () => 0,
      request: callback => { const id = nextId++; frames.set(id, callback); return id; },
      cancel: id => frames.delete(id),
    },
  });
  recovery.lose('front');
  loop.invalidate();
  assert.equal(frames.size, 0);
  recovery.restore('front');
  assert.equal(frames.size, 1);
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach(callback => callback(16));
  assert.equal(draws, 1);
  assert.equal(frames.size, 0);
  recovery.dispose();
  loop.dispose();
});
