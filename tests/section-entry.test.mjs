import assert from 'node:assert/strict';
import test from 'node:test';
import { getSectionEntry } from '../lib/section-entry.ts';

await test('front poster starts flat and leaves fully at the unchanged WHY anchor', () => {
  const initial = getSectionEntry(0, 900, 900, 1440);
  assert.equal(initial.progress, 0);
  assert.deepEqual([initial.x, initial.y, initial.angle], [0, 0, 0]);
  assert.equal(initial.covered, false);
  const end = getSectionEntry(900, 900, 900, 1440);
  assert.equal(end.progress, 1);
  assert.equal(end.y, -900);
  assert.ok(end.y + 900 * Math.cos(end.angle * Math.PI / 180) <= 0);
  assert.equal(end.turning, false);
  assert.equal(end.covered, true);
  assert.deepEqual(getSectionEntry(-100, 900, 900, 1440), initial);
  assert.deepEqual(getSectionEntry(1800, 900, 900, 1440), end);
});

await test('a tall page shows its footer before the exit and ends at its anchor', () => {
  assert.equal(getSectionEntry(409, 390, 800, 390).progress, 0);
  assert.equal(getSectionEntry(410, 390, 800, 390).y, 0);
  assert.equal(getSectionEntry(605, 390, 800, 390).progress, .5);
  assert.equal(getSectionEntry(800, 390, 800, 390).progress, 1);
  assert.equal(getSectionEntry(800, 390, 800, 390).covered, true);
  assert.equal(getSectionEntry(800, 850, 800, 390).progress, 1);
});

await test('all poster corners move upward with finite, bounded rotation across sizes', () => {
  for (const [width, viewport, height] of [[320, 740, 800], [390, 844, 844], [844, 390, 700], [1440, 900, 900], [3840, 1080, 1080]]) {
    let previousBottom = height;
    for (let step = 0; step <= 100; step++) {
      const state = getSectionEntry(height * step / 100, viewport, height, width);
      const radians = state.angle * Math.PI / 180;
      const bottomLeft = state.y + height * Math.cos(radians);
      const bottomRight = bottomLeft + width * Math.sin(radians);
      assert.ok(bottomLeft <= previousBottom + .001);
      assert.ok(bottomRight <= bottomLeft);
      assert.ok(state.angle <= 0 && state.angle >= -12);
      for (const value of [state.x, state.y, state.angle, bottomLeft, bottomRight]) assert.ok(Number.isFinite(value));
      previousBottom = bottomLeft;
    }
  }
});

await test('reverse scrolling restores the same planar transform and foreground state', () => {
  const forward = getSectionEntry(450, 900, 900, 1440);
  assert.equal(forward.turning, true);
  assert.equal(forward.covered, false);
  getSectionEntry(900, 900, 900, 1440);
  assert.deepEqual(getSectionEntry(450, 900, 900, 1440), forward);
  assert.equal(getSectionEntry(0, 900, 900, 1440).currentSection, 'home');
  assert.equal(getSectionEntry(225, 900, 900, 1440).currentSection, 'home');
  assert.equal(getSectionEntry(750, 900, 900, 1440).currentSection, 'why');
  assert.equal(getSectionEntry(750, 900, 900, 1440).covered, false);
});

await test('reduced motion has no transform and uses the normal section boundary', () => {
  const state = getSectionEntry(750, 900, 900, 1440, true);
  assert.equal(state.turning, false);
  assert.deepEqual([state.x, state.y, state.angle], [0, 0, 0]);
  assert.equal(state.currentSection, 'home');
  assert.equal(getSectionEntry(900, 900, 900, 1440, true).currentSection, 'why');
});

await test('zero dimensions never create invalid transforms or an unfinished exit', () => {
  const state = getSectionEntry(0, 0, 0, 0);
  assert.equal(state.progress, 1);
  assert.equal(state.covered, true);
  assert.equal(state.turning, false);
  for (const value of [state.x, state.y, state.angle]) assert.ok(Number.isFinite(value));
});
