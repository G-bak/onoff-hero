import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'opentype.js/dist/opentype.mjs';
import { ShapePath, ExtrudeGeometry } from 'three';
import { openingLetters, openingTiming, openingHops, openingLetterStarts, openingCurveSegments, getOpeningPixelRatio, shouldPlayHomeOpening, getOpeningLetterPose, getOpeningPresentation, getOpeningCardTravel } from '../lib/home-opening.ts';

const fresh = { claimed: false, initialPath: '/', navigationType: 'navigate', hash: '', scrollY: 0, reduced: false };
await test('opening renders a sharp 4K desktop and native-density phone within finite pixel budgets', () => {
  for (const [width, height, density] of [[320,568,3],[390,844,3],[700,1000,3],[701,1000,2],[1440,900,1],[1920,1080,1],[3840,2160,2],[7680,4320,3]]) {
    const ratio = getOpeningPixelRatio(width, height, density);
    assert.ok(Number.isFinite(ratio) && ratio > 0 && ratio <= 3);
    assert.ok(width * height * ratio ** 2 <= (width <= 700 ? 4500000 : 8294400) + 1);
  }
  assert.equal(getOpeningPixelRatio(1920, 1080, 1), 2);
  assert.equal(getOpeningPixelRatio(390, 844, 3), 3);
  assert.equal(getOpeningPixelRatio(3840, 2160, 2), 1);
});
await test('opening plays on fresh HOME and reload, while restored/navigation destinations remain accessible', () => {
  assert.equal(shouldPlayHomeOpening(fresh), true);
  assert.equal(shouldPlayHomeOpening({ ...fresh, navigationType: 'reload', hash: '#home' }), true);
  for (const override of [{ claimed: true }, { navigationType: 'back_forward' }, { initialPath: '/inquiry' }, { hash: '#why' }, { hash: '#services' }, { hash: '#unknown' }, { scrollY: 800 }, { reduced: true }]) {
    assert.equal(shouldPlayHomeOpening({ ...fresh, ...override }), false, JSON.stringify(override));
  }
});
await test('letters begin beyond the viewport, land individually, and ampersand drops with a recovery bounce', () => {
  for (const i of [0, 1, 3, 4, 5]) assert.ok(Math.abs(getOpeningLetterPose(0, i, 10, 8).x) >= 10);
  assert.ok(getOpeningLetterPose(0, 2, 10, 8).y >= 8);
  assert.ok(getOpeningLetterPose(.7, 1, 10, 8).x > getOpeningLetterPose(.7, 0, 10, 8).x);
  assert.equal(getOpeningLetterPose(openingTiming.impact, 2, 10, 8).y, 0);
  assert.ok(getOpeningLetterPose(openingTiming.impact + .25, 2, 10, 8).y > 0);
  assert.ok(getOpeningLetterPose(openingTiming.impact + .035, 2, 10, 8).sy < .8);
  assert.ok(getOpeningLetterPose(openingTiming.impact - .1, 1, 10, 8).x > .1, 'Space opens in response to the impact');
});
await test('four decreasing hops land before the ampersand and hold their horizontal position during compression', () => {
  const start = openingLetterStarts[1], span = openingHops[0].duration;
  const pose = p => getOpeningLetterPose(start + span * p, 1, 2, 4);
  assert.equal(pose(.06).y, 0, 'Anticipation stays grounded');
  assert.ok(pose(.06).sy < 1 && pose(.06).x < pose(0).x, 'Crouch and pull back before launching');
  assert.ok(pose(.4).y > pose(.8).y, 'The rounded arc settles back toward the floor');
  assert.ok(Math.abs(pose(.6).rx) > Math.abs(pose(.4).rx), 'Rotation follows the height peak');
  assert.ok(pose(.95).x > pose(1).x, 'The large hop eases back from a small late overshoot');
  for (const i of [0, 1, 3, 4, 5]) {
    let height = Infinity;
    for (let j = 0; j < openingHops.length; j++) {
      const step = openingHops[j], start = openingLetterStarts[i] + step.start;
      const apex = getOpeningLetterPose(start + step.duration / 2, i, 2, 4);
      assert.ok(apex.y > 0 && apex.y < height); height = apex.y;
      const land = getOpeningLetterPose(start + step.duration, i, 2, 4);
      const beforeLand = getOpeningLetterPose(start + step.duration - 1e-4, i, 2, 4);
      assert.ok(Math.abs((land.y - beforeLand.y) / 1e-4) < .01, 'The rounded landing has no sudden vertical stop');
      assert.ok(Math.abs((land.rx - beforeLand.rx) / 1e-4) < .01, 'Rotation also eases to rest');
      const compress = getOpeningLetterPose(start + step.duration + .022, i, 2, 4);
      assert.ok(Math.abs(land.y) < 1e-12 && Math.abs(compress.y) < 1e-12);
      assert.ok(compress.sy < 1 && compress.sx > 1);
      assert.ok(Math.abs(land.x - compress.x) < 1e-12);
      assert.ok(Math.abs(land.z) < 1e-12 && Math.abs(land.rx) < 1e-12);
    }
  }
});
await test('all six real glyphs reach their exact neutral poses before docking, without residual transforms', () => {
  assert.ok(openingTiming.dockStart - openingTiming.align >= .3);
  assert.equal(getOpeningPresentation(openingTiming.dockStart).dock, 0);
  for (let i = 0; i < openingLetters.length; i++) for (const t of [openingTiming.align, openingTiming.dockStart, openingTiming.dockEnd, openingTiming.duration]) {
    const pose = getOpeningLetterPose(t, i, 10, 8);
    for (const key of ['x', 'y', 'z', 'rx', 'ry', 'rz']) assert.ok(Math.abs(pose[key]) < 1e-12, `${i}/${t}/${key}`);
    assert.equal(pose.sx, 1); assert.equal(pose.sy, 1);
  }
});
await test('logo and card Ease Out travel decelerates throughout and reaches a stopped endpoint', () => {
  const start = openingTiming.cards, span = openingTiming.cardsEnd - start;
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const next = getOpeningCardTravel(start + span * i / 1000);
    assert.ok(next >= previous - 1e-12 && next >= 0 && next <= 1 + 1e-12); previous = next;
  }
  const speed = p => (getOpeningCardTravel(start + span * (p + 1e-6)) - getOpeningCardTravel(start + span * (p - 1e-6))) / 2e-6;
  assert.ok(speed(.1) > speed(.35) && speed(.35) > speed(.65) && speed(.65) > speed(.9));
  assert.ok(getOpeningCardTravel(start + span / 2) > .9);
  assert.ok(speed(1) < .001);
  assert.equal(getOpeningCardTravel(0), 0); assert.equal(getOpeningCardTravel(openingTiming.duration), 1);
  const dock = p => getOpeningPresentation(openingTiming.dockStart + p * (openingTiming.dockEnd - openingTiming.dockStart)).dock;
  assert.ok(dock(.5) > .9 && dock(.25) - dock(0) > dock(.5) - dock(.25));
});
await test('the final handoff exposes every part, removes the overlay, and unlocks only after docking', () => {
  const final = getOpeningPresentation(openingTiming.duration);
  for (const key of ['dock', 'flatten', 'wordmark', 'cards', 'cardTravel', 'header', 'copy', 'controls']) assert.equal(final[key], 1, key);
  assert.equal(final.canvas, 0); assert.equal(final.backdrop, 0);
  assert.ok(openingTiming.unlock > openingTiming.dockEnd);
  for (let t = 0; t <= openingTiming.duration + .1; t += 1 / 60) for (const value of Object.values(getOpeningPresentation(t))) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1 + 1e-12);
});
await test('runtime Montserrat outlines match the licensed source, preserve holes, and extrude behind the docking plane', () => {
  const data = JSON.parse(fs.readFileSync(new URL('../app/assets/opening/montserrat-bold.json', import.meta.url), 'utf8'));
  const bytes = fs.readFileSync(new URL('../node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff', import.meta.url));
  assert.equal(data.sourceSha256, createHash('sha256').update(bytes).digest('hex'));
  const font = parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  for (const char of new Set(openingLetters)) {
    const glyph = data.glyphs[char], path = new ShapePath(), em = data.unitsPerEm;
    assert.deepEqual(glyph.commands, font.charToGlyph(char).path.commands);
    for (const c of glyph.commands) {
      if (c.type === 'M') path.moveTo(c.x / em, c.y / em);
      else if (c.type === 'L') path.lineTo(c.x / em, c.y / em);
      else if (c.type === 'Q') path.quadraticCurveTo(c.x1 / em, c.y1 / em, c.x / em, c.y / em);
      else if (c.type === 'C') path.bezierCurveTo(c.x1 / em, c.y1 / em, c.x2 / em, c.y2 / em, c.x / em, c.y / em);
      else if (c.type === 'Z') path.currentPath.closePath();
    }
    const shapes = path.toShapes();
    assert.equal(shapes.length, 1); assert.equal(shapes[0].holes.length, char === 'O' ? 1 : char === '&' ? 2 : 0);
    const geometry = new ExtrudeGeometry(shapes, { depth: .16, bevelEnabled: false, curveSegments: openingCurveSegments });
    geometry.translate(0, 0, -.16); geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    for (const axis of ['x', 'y']) {
      assert.ok(Math.abs(bounds.min[axis] - glyph.bounds[axis + '1'] / em) < 1e-6);
      assert.ok(Math.abs(bounds.max[axis] - glyph.bounds[axis + '2'] / em) < 1e-6);
    }
    assert.ok(Math.abs(bounds.max.z) < 1e-6 && Math.abs(bounds.min.z + .16) < 1e-6);
    for (const name of ['position', 'normal']) assert.ok([...geometry.getAttribute(name).array].every(Number.isFinite));
    geometry.dispose();
  }
});
