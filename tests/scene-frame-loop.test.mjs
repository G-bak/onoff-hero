import assert from 'node:assert/strict';
import test from 'node:test';
import { createSceneFrameLoop, settleSceneValue } from '../lib/scene-frame-loop.ts';

function fakeFrames() {
  let now = 0;
  let nextId = 0;
  const callbacks = new Map();
  return {
    clock: {
      now: () => now,
      request(callback) { const id = nextId++; callbacks.set(id, callback); return id; },
      cancel(id) { callbacks.delete(id); },
    },
    step(ms = 16) {
      now += ms;
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach(callback => callback(now));
    },
    pending: () => callbacks.size,
    settle() {
      for (let i = 0; callbacks.size && i < 1000; i++) this.step();
      assert.equal(callbacks.size, 0, 'A stationary scene must stop requesting frames');
    },
  };
}

void test('automatic playback keeps drawing, OFF idles, and ON resumes', () => {
  const frames = fakeFrames();
  let playing = true;
  let draws = 0;
  const loop = createSceneFrameLoop(() => { draws++; return playing; }, { clock: frames.clock });
  loop.invalidate();
  frames.step(); frames.step(); frames.step();
  assert.equal(draws, 3);
  assert.equal(frames.pending(), 1);
  playing = false;
  loop.invalidate();
  frames.step();
  assert.equal(draws, 4);
  assert.equal(frames.pending(), 0);
  frames.step(60000);
  assert.equal(draws, 4);
  playing = true;
  loop.invalidate();
  frames.step();
  assert.equal(draws, 5);
  assert.equal(frames.pending(), 1);
  loop.dispose();
});

void test('manual rotation and hover can wake an idle scene and finish easing', () => {
  const frames = fakeFrames();
  let angle = 0;
  let targetAngle = 0;
  let tilt = 0;
  let targetTilt = 0;
  const loop = createSceneFrameLoop(dt => {
    angle = settleSceneValue(angle, targetAngle, 1 - Math.exp(-dt * 9));
    tilt = settleSceneValue(tilt, targetTilt, .035);
    return angle !== targetAngle || tilt !== targetTilt;
  }, { clock: frames.clock });
  loop.invalidate();
  frames.settle();

  // A drag changes the target while automatic rotation remains disabled.
  targetAngle = .8;
  loop.invalidate();
  frames.step();
  assert.ok(angle > 0 && angle < targetAngle);
  frames.settle();
  assert.equal(angle, .8);

  // Keyboard rotation and pointer tilt also wake the same stopped loop.
  targetAngle -= .38;
  targetTilt = .04;
  loop.invalidate();
  frames.settle();
  assert.equal(angle, targetAngle);
  assert.equal(tilt, targetTilt);

  targetTilt = 0;
  loop.invalidate();
  frames.settle();
  assert.equal(tilt, 0);
  loop.dispose();
});

void test('a burst of input or resize events schedules only one redraw', () => {
  const frames = fakeFrames();
  let draws = 0;
  const loop = createSceneFrameLoop(() => { draws++; return false; }, { clock: frames.clock });
  for (let i = 0; i < 100; i++) loop.invalidate();
  assert.equal(frames.pending(), 1);
  frames.step();
  assert.equal(draws, 1);
  assert.equal(frames.pending(), 0);
});

void test('hiding the page cancels rendering and resuming does not jump in time', () => {
  const frames = fakeFrames();
  let visible = true;
  const deltas = [];
  const loop = createSceneFrameLoop(dt => { deltas.push(dt); return true; }, {
    clock: frames.clock,
    canRun: () => visible,
  });
  loop.invalidate();
  frames.step();
  visible = false;
  loop.suspend();
  loop.invalidate();
  frames.step(600000);
  assert.equal(deltas.length, 1);
  assert.equal(frames.pending(), 0);
  visible = true;
  loop.invalidate();
  frames.step();
  assert.deepEqual(deltas, [.016, .016]);
  frames.step(1000);
  assert.equal(deltas.at(-1), .05);
  loop.dispose();
});

void test('visibility is checked again before a pending frame draws', () => {
  const frames = fakeFrames();
  let visible = true;
  let draws = 0;
  const loop = createSceneFrameLoop(() => { draws++; return true; }, {
    clock: frames.clock,
    canRun: () => visible,
  });
  loop.invalidate();
  visible = false;
  frames.step();
  assert.equal(draws, 0);
  assert.equal(frames.pending(), 0);
  loop.dispose();
});

void test('invalidation from inside a draw is preserved', () => {
  const frames = fakeFrames();
  let draws = 0;
  const loop = createSceneFrameLoop(() => {
    if (++draws === 1) loop.invalidate();
    return false;
  }, { clock: frames.clock });
  loop.invalidate();
  frames.step();
  assert.equal(frames.pending(), 1);
  frames.step();
  assert.equal(draws, 2);
  assert.equal(frames.pending(), 0);
});

void test('cleanup cancels even frame ID zero and prevents late restarts', () => {
  const frames = fakeFrames();
  let draws = 0;
  const loop = createSceneFrameLoop(() => { draws++; return true; }, { clock: frames.clock });
  loop.invalidate();
  loop.dispose();
  loop.dispose();
  loop.invalidate();
  frames.step();
  assert.equal(draws, 0);
  assert.equal(frames.pending(), 0);
});
