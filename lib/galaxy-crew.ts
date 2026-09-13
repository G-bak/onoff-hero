// The website sprite and exported GIF use this one timetable. All five people
// share one frame index; no per-person animation delay or independent clocks.
export const crewPoseCount = 16;
export const crewFrameWidth = 240;
export const crewFrameHeight = 320;
export const crewSequence = Array.from({ length: crewPoseCount }, (_, index) => index);
// Give foot lift, weight transfer and landing different beats; the short front
// hold and the existing wrist lift remain part of one synchronized gesture.
const turnDelays = [180, 90, 100, 70, 110, 100, 80, 70] as const;
export const crewDelays = crewSequence.map((_, index) =>
  turnDelays[index] ?? (index === crewPoseCount - 1 ? 2000 : index <= 10 ? 70 : 90),
);
export const crewDuration = crewDelays.slice(0, -1).reduce((sum, delay) => sum + delay, 0);

export function getCrewFrame(elapsedMs: number, reducedMotion = false) {
  if (reducedMotion || elapsedMs >= crewDuration) return crewPoseCount - 1;
  if (elapsedMs <= 0 || !Number.isFinite(elapsedMs)) return 0;
  let remaining = elapsedMs;
  for (let i = 0; i < crewSequence.length; i++) {
    if (remaining < crewDelays[i]) return crewSequence[i];
    remaining -= crewDelays[i];
  }
  return crewPoseCount - 1;
}

export function getCrewFramePosition(frame: number) {
  if (!Number.isFinite(frame)) return 0;
  return Math.max(0, Math.min(crewPoseCount - 1, Math.floor(frame))) / (crewPoseCount - 1) * 100;
}
