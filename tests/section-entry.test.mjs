import assert from 'node:assert/strict';
import test from 'node:test';
import { getSectionEntry, getSectionScrollLength } from '../lib/section-entry.ts';
import { getSiteNavigation } from '../lib/site-sections.ts';

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

await test('DESIGN unlocks WEB when its rotated sheet leaves view, before the nominal anchor', () => {
  // Real 1440×900 wheel reproduction: DESIGN starts at 1800, WEB anchor 4050.
  // At document scroll 3480 the entire DESIGN sheet is already above the view.
  const exposed = getSectionEntry(1680, 900, 2250, 1425);
  assert.ok(exposed.progress < 1);
  assert.equal(exposed.covered, true);
  assert.equal(exposed.turning, false);
  assert.equal(exposed.currentSection, 'why');
  // A little earlier, its last 47px are still visible. Reverse scrolling must
  // restore that sheet and its input state without changing the page anchor.
  const partial = getSectionEntry(1620, 900, 2250, 1425);
  assert.equal(partial.covered, false);
  assert.equal(partial.turning, true);
  assert.equal(getSectionEntry(1680, 900, 2250, 1425, true).covered, false);
  assert.equal(getSectionEntry(2250, 900, 2250, 1425).progress, 1);
});

await test('interaction follows the actual last corner across tall, short and landscape pages', () => {
  for (const [width, viewport, height] of [[1425,900,2250],[1265,720,1860],[375,844,2110],[652,375,1302.5],[1425,900,900]]) {
    for (let scroll=0;scroll<=height;scroll+=13) {
      const state=getSectionEntry(scroll,viewport,height,width);
      const angle=state.angle*Math.PI/180,top=-Math.min(scroll,Math.max(0,height-viewport));
      const corners=[top+state.y,top+state.y+width*Math.sin(angle),top+state.y+height*Math.cos(angle),top+state.y+width*Math.sin(angle)+height*Math.cos(angle)];
      assert.equal(state.covered,Math.max(...corners)<=0,`${width}×${viewport} at ${scroll}`);
    }
  }
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

await test('a shorter WEB turn keeps the same poster trajectory and unlocks at its new anchor', () => {
  for (const [width, height] of [[1440,900],[1280,720],[390,844],[667,375]]) {
    const distance = getSectionScrollLength(height, height, .8);
    assert.equal(distance, height * .8);
    for (const fraction of [0, .2, .5, .9, 1]) {
      const original = getSectionEntry(height * fraction, height, height, width);
      const shorter = getSectionEntry(distance * fraction, height, height, width, false, .8);
      for (const key of ['x','y','angle','progress']) assert.ok(Math.abs(shorter[key] - original[key]) < 1e-8);
      assert.equal(shorter.covered, original.covered);
      assert.equal(shorter.currentSection, original.currentSection);
    }
    assert.equal(getSectionEntry(distance, height, height, width, false, .8).covered, true);
    assert.equal(getSectionEntry(distance * .5, height, height, width, false, .8).covered, false);
  }
});

await test('shortening a turn preserves tall-page reading and the reduced-motion document boundary', () => {
  const height = 800, viewport = 390, reading = height - viewport;
  const distance = getSectionScrollLength(viewport, height, .8);
  assert.equal(distance, reading + viewport * .8);
  assert.equal(getSectionEntry(reading, viewport, height, 390, false, .8).progress, 0);
  assert.equal(getSectionEntry(distance, viewport, height, 390, false, .8).progress, 1);
  const reduced = getSectionEntry(distance, viewport, height, 390, true, .8);
  assert.equal(reduced.scrollLength, height);
  assert.equal(reduced.covered, false);
  assert.deepEqual([reduced.x,reduced.y,reduced.angle], [0,0,0]);
  assert.equal(getSectionEntry(height, viewport, height, 390, true, .8).covered, true);
});

await test('seven-page navigation follows every continuous turn and restores on reverse scroll', () => {
  const front = { progress: 0, backActive: false };
  const back = { progress: 1, backActive: true };
  const ids = ['home', 'why', 'design', 'web', 'card', 'services', 'film'];
  for (const index of [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]) {
    const transitions = Array.from({ length: 6 }, (_, i) => i < index ? back : front);
    assert.deepEqual(getSiteNavigation(transitions), { section: ids[index], progress: index / 6 });
    if (index < 6) {
      transitions[index] = { progress: .5, backActive: true };
      assert.deepEqual(getSiteNavigation(transitions), { section: ids[index + 1], progress: (index + .5) / 6 });
    }
  }
  assert.deepEqual(getSiteNavigation([front, back, back, back, back, back]), { section: 'home', progress: 0 });
});
