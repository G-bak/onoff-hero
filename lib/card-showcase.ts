const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export const showcasePanels = [
  {
    id: 'instagram',
    width: 2.25,
    height: 2.25 * 1420 / 720,
    x: -2.7,
    y: 0,
    z: 0,
    yaw: 0.26,
    pitch: -0.11,
    roll: -0.09,
    bend: -0.78,
    bendAxis: 0.24,
  },
  {
    id: 'blog',
    width: 2.2,
    height: 2.2 * 1720 / 720,
    x: 0,
    y: 0,
    z: 0,
    yaw: -0.06,
    pitch: 0.02,
    roll: 0.01,
    bend: 0.24,
    bendAxis: 0,
  },
  {
    id: 'poster',
    width: 2.65,
    height: 3.3125,
    x: 2.7,
    y: 0,
    z: 0,
    yaw: -0.3,
    pitch: -0.12,
    roll: 0.08,
    bend: -0.84,
    bendAxis: -0.24,
  },
] as const;

export function getShowcaseCameraDistance(aspect: number, compact: boolean, opening = 1) {
  const halfFov = Math.tan(Math.PI * 32 / 360);
  const dolly = opening <= 0 || opening >= 1 ? 0 : 1.4 * Math.sin(Math.PI * opening);
  return Math.max((compact ? 5.05 : 5.85) / (2 * halfFov), (compact ? 7.7 : 8.95) / (2 * halfFov * Math.max(0.01, aspect))) + dolly;
}

// Panels travel out of a depth stack and retain distinct, readable curved faces.
export function getShowcasePose(
  entryTop: number,
  viewportHeight: number,
  width: number,
  mobile: boolean,
  scrollTravel = mobile ? viewportHeight * 0.5 : width * 0.3,
) {
  const arrival = 0.68,
    travel = Math.max(1, scrollTravel);
  const progress =
    entryTop >= 0
      ? arrival * clamp(1 - entryTop / Math.max(1, viewportHeight))
      : arrival + (1 - arrival) * clamp(-entryTop / travel);
  return {
    progress,
    spread: smooth(progress / 0.6),
    drift: smooth((progress - 0.68) / 0.32),
  };
}

export function getPanelPose(
  index: number,
  spread: number,
  drift: number,
  time: number,
  compact: boolean,
) {
  const panel = showcasePanels[index],
    delay = [0.055, 0.11, 0][index],
    phase = clamp((spread - delay) / (1 - delay)),
    // Damped spring response: accelerate out of the stack, overshoot, then settle.
    // Normalize the endpoint so reverse scrolling also reaches the exact rest pose.
    spring = (t: number) => 1 - Math.exp(-7 * t) * (Math.cos(9 * t) + 7 / 9 * Math.sin(9 * t)),
    s = phase === 1 ? 1 : spring(phase) / spring(1),
    lift = Math.sin(Math.PI * phase) * (1 - phase),
    side = index - 1,
    // The sheet first flexes out of the stack, then counter-bends sideways.
    counterBend = smooth((phase - .26) / .74);
  const bob = Math.sin(time * 0.6 + index * 1.7) * 0.035 * s;
  return {
    x: (panel.x * s + side * (1 - s) * 0.24 + side * drift * 0.1) * (compact ? 0.86 : 1),
    y: lift * (index === 1 ? 0.9 : index === 0 ? -0.42 : 0.56) + bob,
    z: -(2 - index) * 0.55 * (1 - s) + lift * (index === 1 ? 1.15 : 1.65),
    rx: (1 - s) * -0.26 + lift * (index === 1 ? -.46 : .16) + panel.pitch * smooth(phase),
    ry: (1 - s) * side * 0.72 + lift * (side * .5 - (index === 1 ? .32 : 0)) + panel.yaw * s + Math.sin(time * 0.35 + index) * 0.012 * s,
    rz: panel.roll * s + side * (1 - s) * 0.16 - side * lift * 0.24,
    scale: (compact ? 0.86 : 1) * (0.92 + 0.08 * Math.min(1, s)),
    bend: (compact ? .78 : 1) * (.16 * (1 - counterBend) + .4 * lift * (1 - counterBend) + panel.bend * counterBend),
    bendAxis: panel.bendAxis * counterBend,
    twist: side * .16 * lift,
  };
}

export const marketerSequence = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0];
export const marketerDelays = [
  400, 100, 110, 120, 180, 110, 130, 2200, 140, 120, 150, 120, 110, 100, 800,
];
export const marketerDuration = marketerDelays.reduce((a, b) => a + b, 0);
export function getMarketerFrame(elapsed: number, still = false) {
  if (still) return 7;
  let time =
    Math.max(0, Number.isFinite(elapsed) ? elapsed : 0) % marketerDuration;
  for (let i = 0; i < marketerSequence.length; i++) {
    if (time < marketerDelays[i]) return marketerSequence[i];
    time -= marketerDelays[i];
  }
  return 0;
}
