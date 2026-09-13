const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// A single elastic entrance: compress, extend, recoil, then hold the finished word.
// The word's advance widths never move, so the readable layout remains stable.
const beats = [
  [0, 0.16],
  [0.12, 0.12],
  [0.39, 1.42],
  [0.62, 0.83],
  [0.81, 1.075],
  [1, 1],
] as const;

export function getMarketingLetterPose(index: number, elapsed: number, still = false) {
  if (still) return { stretch: 1, width: 1, rise: 0 };
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
  const phase = clamp((time - index * 0.065) / 1.15);
  let stretch = 1;
  for (let i = 1; i < beats.length; i++) {
    const [end, to] = beats[i], [start, from] = beats[i - 1];
    if (phase <= end) {
      stretch = from + (to - from) * smooth((phase - start) / (end - start));
      break;
    }
  }
  return {
    stretch,
    width: 1 + (1 - stretch) * 0.075,
    rise: 0.065 * (1 - smooth(phase / 0.45)),
  };
}
