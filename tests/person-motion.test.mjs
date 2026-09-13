import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPersonFrame, designerDuration, webPersonDuration } from '../lib/person-motion.ts';

await test('DESIGN retains the lower swing but excludes the inward tuck across loop boundaries', () => {
  assert.equal(getPersonFrame('dance', 0), 2);
  assert.equal(getPersonFrame('dance', designerDuration - 1), 2);
  assert.equal(getPersonFrame('dance', designerDuration), 2);
  assert.equal(getPersonFrame('dance', 600), getPersonFrame('dance', designerDuration * 7 + 600));
  let previous = 2;
  for (let time = 0; time < designerDuration * 3; time += 10) {
    const frame = getPersonFrame('dance', time);
    assert.ok(frame >= 2 && frame <= 7, 'Inward arm poses must not return');
    assert.ok(Math.abs(frame - previous) <= 1, 'Adjacent poses must meet smoothly');
    previous = frame;
  }
});

await test('WEB repeats the complete writing and wiping cycle without holding the last pose', () => {
  assert.equal(getPersonFrame('writing', 0), 0);
  assert.equal(getPersonFrame('writing', webPersonDuration - 1), 11);
  assert.equal(getPersonFrame('writing', webPersonDuration), 0);
  assert.equal(getPersonFrame('writing', webPersonDuration * 8), 0);
  assert.equal(getPersonFrame('writing', webPersonDuration + 400), getPersonFrame('writing', webPersonDuration * 100 + 400));
});

await test('invalid time and reduced motion select complete in-range poses', () => {
  for (const time of [-1, NaN, Infinity]) {
    assert.equal(getPersonFrame('dance', time), 2);
    assert.equal(getPersonFrame('writing', time), 0);
  }
  assert.equal(getPersonFrame('dance', 900, true), 2);
  assert.equal(getPersonFrame('writing', 0, true), 10);
});
