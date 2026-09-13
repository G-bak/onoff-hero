// As in the approved marketer: actual generated poses, shared website/GIF
// timing, no synthetic body rotation or optical-flow frame reconstruction.
// Restore the lower arm swing; omit only the final inward tuck (poses 0–1).
export const designerSequence = [2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2];
export const designerDelays = [90, 100, 100, 100, 100, 140, 100, 100, 100, 100, 90];
export const designerDuration = designerDelays.reduce((total, delay) => total + delay, 0);
export const webPersonSequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const webPersonDelays = [160, 180, 220, 200, 180, 220, 180, 220, 300, 300, 380, 220];
export const webPersonDuration = webPersonDelays.reduce((total, delay) => total + delay, 0);

function timedPose(elapsed: number, sequence: readonly number[], delays: readonly number[]) {
  let time = elapsed % delays.reduce((total, delay) => total + delay, 0);
  for (let index = 0; index < sequence.length; index++) {
    if (time < delays[index]) return sequence[index];
    time -= delays[index];
  }
  return sequence[0];
}

export function getPersonFrame(kind: 'dance' | 'writing', elapsed: number, still = false) {
  const time = Math.max(0, Number.isFinite(elapsed) ? elapsed : 0);
  if (kind === 'dance') return still ? designerSequence[0] : timedPose(time, designerSequence, designerDelays);
  // Actual W/E/B strokes, underline, a step back, and wiping are in the poses.
  // Every cycle restarts writing; reduced motion shows the completed word.
  if (still) return 10;
  return timedPose(time, webPersonSequence, webPersonDelays);
}
