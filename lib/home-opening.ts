export const openingLetters = ['O', 'N', '&', 'O', 'F', 'F'] as const;
export const openingCurveSegments = 36;
export function getOpeningPixelRatio(width: number, height: number, pixelRatio: number) {
  const compact = width <= 700;
  // Preserve sharp glyph edges on 1x desktops and native 3x phone displays.
  return Math.min(Math.max(compact ? 1 : 2, pixelRatio), 3,
    Math.sqrt((compact ? 4_500_000 : 8_294_400) / Math.max(1, width * height)));
}
// Keep the authored choreography in scene seconds; the shared clock now runs it in 6.8 seconds.
export const openingPlaybackRate = 8.7 / 6.8;
export const openingTiming = { ampDrop: 3.6, impact: 4.32, align: 5.34, dockStart: 5.66, dockEnd: 7.16, canvasEnd: 7.28, cards: 6.42, cardsEnd: 8.4, unlock: 8.42, duration: 8.7 };
// The innermost letters lead each side so the following letters do not overtake.
export const openingLetterStarts = [.44, 0, openingTiming.ampDrop, .16, .72, 1.28];
export const openingHops = [
  { start: 0, duration: .78, from: 0, to: .52, height: .6, squash: .16 },
  { start: .86, duration: .6, from: .52, to: .84, height: .34, squash: .11 },
  { start: 1.53, duration: .46, from: .84, to: .97, height: .15, squash: .07 },
  { start: 2.05, duration: .3, from: .97, to: 1, height: .05, squash: .035 },
];
export const clampOpening = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
export const openingProgress = (time: number, start: number, end: number) => clampOpening((time - start) / (end - start));
export const smoothOpening = (value: number) => { const t = clampOpening(value); return t * t * t * (t * (t * 6 - 15) + 10); };
function bezierOpening(value: number, x1: number, y1: number, x2: number, y2: number) {
  const p = clampOpening(value);
  if (p === 0 || p === 1) return p;
  const sample = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
  let low = 0, high = 1;
  for (let i = 0; i < 20; i++) {
    const t = (low + high) / 2;
    if (sample(t, x1, x2) < p) low = t; else high = t;
  }
  return sample((low + high) / 2, y1, y2);
}
// A steep departure and long soft arrival, equivalent to CSS cubic-bezier.
export const easeOutOpening = (value: number) => bezierOpening(value, .16, 1, .3, 1);

function liftOpening(progress: number, apex: number) {
  const p = clampOpening(progress);
  // Rounded shoulders and summit: vertical speed is zero at lift-off and landing.
  return p < apex ? (1 - Math.cos(Math.PI * p / apex)) / 2
    : (1 + Math.cos(Math.PI * (p - apex) / (1 - apex))) / 2;
}

function openingHopMotion(progress: number, index: number) {
  const p = clampOpening(progress), anticipation = [.10, .075, .035, 0][index];
  const preload = index < 2 ? .018 : 0;
  const q = openingProgress(p, anticipation, 1);
  const overshoot = index < 2 ? .008 : 0;
  const settleAt = overshoot > 0 ? .9 : 1;
  const travel = p < anticipation ? -preload * smoothOpening(p / anticipation)
    : q < settleAt ? -preload + (1 + overshoot + preload) * bezierOpening(q / settleAt, .36, 0, .64, 1)
    : 1 + overshoot * (1 - smoothOpening(openingProgress(q, settleAt, 1)));
  return {
    travel,
    lift: liftOpening(q, [.48, .5, .5, .5][index]),
    // Rotation follows the launch instead of sharing the height's apex.
    lean: liftOpening(openingProgress(q, .10, 1), .5),
    preload: anticipation > 0 ? pulse(p, anticipation * .6, anticipation * .6) * .7 : 0,
  };
}

export function shouldPlayHomeOpening({ claimed, initialPath, navigationType, hash, scrollY, reduced }: {
  claimed: boolean; initialPath: string; navigationType: string; hash: string; scrollY: number; reduced: boolean;
}) {
  return !claimed && initialPath === '/' && navigationType !== 'back_forward' && (!hash || hash === '#home') && scrollY < 2 && !reduced;
}

function hop(time: number, start: number, duration: number, height: number) {
  const p = (time - start) / duration;
  return p > 0 && p < 1 ? liftOpening(p, .5) * height : 0;
}
function pulse(time: number, center: number, radius: number) {
  return 1 - smoothOpening(Math.abs(time - center) / radius);
}

// Each landing holds its horizontal position while the letter compresses.
// Successive hops cover less ground; depth and rotation stay close to the floor.
export function getOpeningLetterPose(time: number, index: number, offscreenX: number, offscreenY: number) {
  const t = Math.max(0, Number.isFinite(time) ? time : 0);
  const align = easeOutOpening(openingProgress(t, openingTiming.impact + .46, openingTiming.align));
  const side = index < 2 ? -1 : 1;
  if (index === 2) {
    const drop = openingProgress(t, openingTiming.ampDrop, openingTiming.impact);
    const bounce = hop(t, openingTiming.impact + .1, .5, .38) + hop(t, openingTiming.impact + .68, .25, .09);
    const impact = pulse(t, openingTiming.impact + .035, .105);
    const recovery = pulse(t, openingTiming.impact + .6, .075) * .09;
    return {
      x: 0, y: (1 - drop ** 3) * offscreenY + bounce,
      z: (1 - align) * .05,
      rx: (1 - easeOutOpening(drop)) * .12, ry: (1 - align) * -.06, rz: (1 - easeOutOpening(drop)) * -.18,
      sx: 1 + impact * .18 + recovery * .7, sy: 1 - impact * .26 - recovery,
    };
  }
  const local = t - (openingLetterStarts[index] ?? 0);
  let arrival = 0, bounce = 0, compression = 0, airborne = 0, lift = 0;
  for (const [index, step] of openingHops.entries()) {
    if (local >= step.start) {
      const p = openingProgress(local, step.start, step.start + step.duration);
      const movement = openingHopMotion(p, index);
      arrival = step.from + (step.to - step.from) * movement.travel;
      if (p < 1) {
        lift = movement.lift; bounce = lift * step.height; airborne = movement.lean;
        compression += movement.preload * step.squash;
      }
    }
    compression += pulse(local, step.start + step.duration + .022, .08) * step.squash;
  }
  const shock = hop(t, openingTiming.impact + Math.abs(index - 2) * .03, .38, .13);
  const closeGap = .16 * arrival * (1 - easeOutOpening(openingProgress(t, openingTiming.impact, openingTiming.align)));
  const restingRoll = [-.035, .03, 0, -.025, .03, -.02][index] ?? 0;
  const waiting = smoothOpening(openingProgress(local, 2.4, 2.7)) * (1 - align);
  const stretch = lift * .085;
  return {
    x: side * (offscreenX * (1 - arrival) - closeGap + shock * .8),
    y: bounce + shock,
    z: lift * .06,
    rx: airborne * -.045,
    ry: airborne * side * .12,
    rz: airborne * side * .10 + restingRoll * waiting,
    sx: 1 + compression * .7 - stretch * .4, sy: 1 - compression + stretch,
  };
}

// A clear Ease Out: most of the travel happens early, with a long soft arrival.
export function getOpeningCardTravel(time: number) {
  return easeOutOpening(openingProgress(time, openingTiming.cards, openingTiming.cardsEnd));
}

export function getOpeningPresentation(time: number) {
  return {
    dock: easeOutOpening(openingProgress(time, openingTiming.dockStart, openingTiming.dockEnd)),
    flatten: smoothOpening(openingProgress(time, 6.48, 7.1)),
    backdrop: 1 - smoothOpening(openingProgress(time, 5.96, openingTiming.canvasEnd)),
    canvas: 1 - smoothOpening(openingProgress(time, 7.14, openingTiming.canvasEnd)),
    wordmark: smoothOpening(openingProgress(time, 7.12, 7.26)),
    cards: smoothOpening(openingProgress(time, openingTiming.cards, 6.9)),
    cardTravel: getOpeningCardTravel(time),
    header: easeOutOpening(openingProgress(time, 7.18, 8.22)),
    copy: easeOutOpening(openingProgress(time, 7.32, 8.44)),
    controls: easeOutOpening(openingProgress(time, 7.5, openingTiming.duration)),
  };
}
