import assert from 'node:assert/strict';
import test from 'node:test';
import { crewPoseCount, crewSequence, crewDelays, crewDuration, getCrewFrame, getCrewFramePosition } from '../lib/galaxy-crew.ts';

await test('the crew leaves its short front pose and displays every forward motion frame', () => {
  let time = 0;
  crewSequence.forEach((frame, index) => {
    assert.equal(getCrewFrame(time), frame);
    assert.equal(getCrewFrame(time + crewDelays[index] - .001), frame);
    time += crewDelays[index];
  });
  assert.ok(crewDelays[0] <= 200);
  assert.equal(new Set(crewSequence).size, crewPoseCount);
  for (let i = 1; i < crewSequence.length; i++) assert.equal(crewSequence[i] - crewSequence[i - 1], 1);
});

await test('a completed gesture holds its back pose indefinitely and a new visit can restart it', () => {
  for (const time of [crewDuration, crewDuration + 1, crewDuration * 5, 60_000, 3_600_000]) {
    assert.equal(getCrewFrame(time), crewPoseCount - 1);
  }
  assert.equal(getCrewFrame(0), 0);
  assert.equal(getCrewFrame(crewDelays[0]), 1);
});

await test('reduced motion shows the final signature pose and invalid indices stay inside the atlas', () => {
  for (const t of [-10, 0, 100, 1400, 2200, 7900, 50000]) {
    assert.equal(getCrewFrame(t, true), crewPoseCount - 1);
  }
  assert.equal(getCrewFrame(Infinity), crewPoseCount - 1);
  assert.equal(getCrewFrame(NaN), 0);
  assert.equal(getCrewFramePosition(0), 0);
  assert.equal(getCrewFramePosition(crewPoseCount - 1), 100);
  assert.equal(getCrewFramePosition(-1), 0);
  assert.equal(getCrewFramePosition(crewPoseCount * 2), 100);
  assert.equal(getCrewFramePosition(NaN), 0);
});
