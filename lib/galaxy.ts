// One clock drives the camera, fleet, typography and crew. No scroll hijacking.
export const galaxyDuration = 6.42;
// Faster camera approach, star formation and orbital motion.
// The character gesture retains its own real-time frame durations.
export const galaxyPlaybackRate = 1.4;
export const galaxyEntryPlaybackRate = 1.75;
export const galaxyRevealProgress = .48;

// Only the initial approach/assembly is faster. Blend back into the approved
// cruising speed, and leave the crew's real-time gesture clock untouched.
export function advanceGalaxyTime(time: number, delta: number) {
  const settle = easeGalaxy((time - (galaxyDuration - .7)) / .7);
  return time + Math.max(0, delta) * (galaxyEntryPlaybackRate + (galaxyPlaybackRate - galaxyEntryPlaybackRate) * settle);
}
// The fleet joins while the outer arms are still settling, with no empty beat
// after galaxy formation. Pop, flight and trail share the same launch times.
export const galaxyFleetEntry = { start: 3.05, stagger: .16, duration: .42, stationLead: .2 } as const;

export function easeGalaxy(value: number) {
  if (value >= 1 - 1e-12) return 1;
  if (value <= 0) return 0;
  const t = Math.max(0, Math.min(1, value));
  return Math.max(0, Math.min(1, t * t * t * (t * (t * 6 - 15) + 10)));
}

export const galaxyServices = [
  { id: 'strategy', ko: '기획', keyword: '브랜드 전략', tags: '시장 분석 · 캠페인 기획', angle: -2.3, crew: 0 },
  { id: 'design', ko: '디자인', keyword: '브랜드·광고 디자인', tags: '로고 · 이미지 · 영상', angle: -.85, crew: 2 },
  { id: 'website', ko: '웹사이트', keyword: '홈페이지·랜딩 제작', tags: '반응형 웹 · 사용자 경험', angle: .35, crew: 4 },
  { id: 'marketing', ko: '마케팅', keyword: 'SNS·광고 집행', tags: '콘텐츠 · 퍼포먼스', angle: 1.65, crew: 5 },
  { id: 'operation', ko: '운영', keyword: '운영·성과 개선', tags: '모니터링 · 분석 · 보고', angle: 2.7, crew: 1 },
] as const;

export function getGalaxyPhase(time: number, still = false) {
  const t = still ? galaxyDuration : Math.max(0, time);
  return {
    approach: easeGalaxy(t / 2.9),
    galaxy: easeGalaxy((t - .6) / .4),
    unfold: easeGalaxy((t - .6) / 3.6),
    station: easeGalaxy((t - (galaxyFleetEntry.start - galaxyFleetEntry.stationLead)) / .55),
    title: easeGalaxy((t - 3.8) / 1.2),
    subtitle: easeGalaxy((t - 4.05) / 1.15),
    // Follow the readable title immediately, overlapping its final reveal.
    crew: easeGalaxy((t - 4.7) / .55),
    services: galaxyServices.map((_, i) => easeGalaxy((t - 4.4 - i * .28) / .9)),
  };
}

export function galaxyRandom(index: number) {
  // Integer hashing is identical in Node and browsers, unlike Math.sin's
  // platform-dependent last digits (also used by the server-rendered SVG).
  let value = (index + 731) | 0;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export function getGalaxyOrbit(angle: number, radius = 5.1) {
  return { x: Math.cos(angle) * radius, y: .38, z: Math.sin(angle) * radius * .9 };
}

export const galaxyFleet = [
  { kind: 'shuttle', radius: 4.9, speed: .16, tilt: .14, altitude: .4, scale: .64 },
  { kind: 'airship', radius: 4.25, speed: -.12, tilt: -.18, altitude: .9, scale: .58 },
  { kind: 'rocket', radius: 5.5, speed: .21, tilt: .25, altitude: .3, scale: .63 },
  { kind: 'explorer', radius: 3.8, speed: .13, tilt: -.23, altitude: .7, scale: .58 },
  { kind: 'cargo', radius: 5.15, speed: -.15, tilt: .1, altitude: .45, scale: .64 },
] as const;

export function getFleetOrbit(angle: number, index: number) {
  const flight = galaxyFleet[index];
  const radius = flight.radius + .22 * Math.sin(angle * 2 + index);
  const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius * .87;
  return { x, y: flight.altitude + z * Math.sin(flight.tilt), z: z * Math.cos(flight.tilt) };
}

export function getCraftEntry(time: number, index: number) {
  const age = time - (galaxyFleetEntry.start + index * galaxyFleetEntry.stagger);
  const progress = Math.max(0, Math.min(1, age / galaxyFleetEntry.duration));
  // Short in-place pop: no translational drop, with a restrained 5% overshoot.
  const x = progress - 1;
  return { age, scale: age <= 0 ? 0 : 1 + 2.1 * x * x * x + 1.1 * x * x };
}

export function getGalaxyFlight(time: number, index: number, still = false) {
  const t = still ? galaxyDuration : Math.max(0, time);
  const age = getCraftEntry(t, index).age;
  const arrival = easeGalaxy(age / galaxyFleetEntry.duration);
  const orbitAge = Math.max(0, age);
  const orbitTime = orbitAge - (1 - Math.exp(-orbitAge));
  const angle = galaxyServices[index].angle + orbitTime * galaxyFleet[index].speed;
  const p = getFleetOrbit(angle, index);
  const tangent = getFleetOrbit(angle + Math.sign(galaxyFleet[index].speed) * .001, index);
  return {
    x: p.x,
    y: p.y,
    z: p.z,
    yaw: Math.atan2(tangent.x - p.x, tangent.z - p.z),
    pitch: -Math.atan2(tangent.y - p.y, Math.hypot(tangent.x - p.x, tangent.z - p.z)),
    arrival,
  };
}

export function getGalaxyQuality(width: number, height: number, pixelRatio: number) {
  const compact = width <= 1100;
  // Quality-first: a 1080p desktop renders at 4K, while portrait phones can
  // use their native 3x density. Keep a finite budget for MSAA/bloom buffers.
  const desiredDpr = Math.max(compact ? 1 : 2, pixelRatio);
  return {
    compact,
    dpr: Math.min(desiredDpr, 3, Math.sqrt((compact ? 4_500_000 : 8_294_400) / Math.max(1, width * height))),
    stars: compact ? 14_000 : 32_000,
    clouds: compact ? 1800 : 3600,
    dust: compact ? 600 : 1200,
    bloom: !compact,
  };
}

// Independent trajectories for the GPU star instances; this CPU equivalent is
// also useful for validating depth, continuity and the final stellar disk.
export function getGalaxyStarPose(time: number, target: { x: number; y: number; z: number }, seed: readonly number[]) {
  const radius = Math.hypot(target.x, target.z), angle = Math.atan2(target.z, target.x);
  const delay = .6 + radius * .11 + seed[0] * .45;
  const age = time - delay, progress = easeGalaxy(age / (1.45 + seed[1] * .9));
  const rotation = angle + (1 - progress) * (.55 + seed[2] * 1.8) - Math.max(0, time - 4.2) * .008;
  const startRadius = .6 + radius * .25 + seed[0] * 1.6;
  const r = startRadius * (1 - progress) + radius * progress + Math.sin(Math.PI * progress) * (seed[3] - .5) * .7;
  return { x: Math.cos(rotation) * r, y: (seed[2] - .5) * 4.8 * (1 - progress) + target.y * progress + Math.sin(Math.PI * progress) * Math.sin(seed[3] * Math.PI * 2) * .8, z: Math.sin(rotation) * r, visible: age > 0, progress };
}

export function getFlightTrail(time: number, index: number) {
  const age = Math.max(0, getCraftEntry(time, index).age);
  const duration = .85 / (galaxyFleet[index].radius * Math.abs(galaxyFleet[index].speed));
  return { duration, count: age <= 0 ? 0 : Math.min(48, Math.floor(age / duration * 47) + 1) };
}

export function getGalaxyDistance(width: number, height: number) {
  const aspect = Math.max(1, width) / Math.max(1, height);
  return width <= 1100 ? Math.max(21, 14.8 / (2 * Math.tan(Math.PI / 9) * aspect)) : Math.max(19.5, 12.5 / (2 * Math.tan(Math.PI / 9) * aspect));
}
