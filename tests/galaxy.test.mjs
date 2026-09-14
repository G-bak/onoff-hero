import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceGalaxyTime, galaxyEntryPlaybackRate, galaxyPlaybackRate, galaxyRevealProgress } from '../lib/galaxy.ts';
import { galaxyDuration, galaxyRandom, galaxyServices, galaxyFleet, galaxyFleetEntry, getGalaxyDistance, getGalaxyFlight, getGalaxyOrbit, getGalaxyPhase, getGalaxyQuality, getFleetOrbit, getCraftEntry, getFlightTrail, getGalaxyStarPose } from '../lib/galaxy.ts';

const values = phase => [...Object.values(phase).filter(v => typeof v === 'number'), ...phase.services];
await test('initial galaxy assembly is faster but completed orbital speed stays unchanged', () => {
  assert.ok(galaxyRevealProgress > .4 && galaxyRevealProgress < .58, 'Start during the reveal, not behind an almost closed sheet');
  assert.ok(galaxyEntryPlaybackRate > galaxyPlaybackRate);
  let time = 0, wall = 0, titleAt = 0;
  while (time < galaxyDuration) {
    const next = advanceGalaxyTime(time, 1 / 120);
    assert.ok(next >= time && next - time <= galaxyEntryPlaybackRate / 120 + 1e-12);
    time = next; wall += 1 / 120;
    if (!titleAt && getGalaxyPhase(time).title > .05) titleAt = wall;
  }
  assert.ok(titleAt < 2.4, 'Readable type starts within 2.4 seconds of scene entry');
  assert.ok(wall < 3.85, 'Assembly completes sooner without cutting off any stage');
  assert.ok(Math.abs(advanceGalaxyTime(20, .5) - 20 - galaxyPlaybackRate * .5) < 1e-12);
  assert.equal(advanceGalaxyTime(2, 0), 2);
});
await test('entry stages never reverse, reveal five services in order and finish legibly', () => {
  let previous = values(getGalaxyPhase(-2));
  assert.ok(previous.every(v => v === 0));
  for (let t = 0; t < 12; t += .025) {
    const phase = getGalaxyPhase(t), current = values(phase);
    current.forEach((v, i) => assert.ok(v >= previous[i] && v <= 1));
    phase.services.forEach((v, i) => { if (i) assert.ok(v <= phase.services[i - 1]); });
    previous = current;
  }
  assert.ok(values(getGalaxyPhase(galaxyDuration)).every(v => v === 1));
  const titleReady = getGalaxyPhase(5.2);
  assert.equal(titleReady.subtitle, 1);
  assert.ok(titleReady.crew > .9, 'Crew must follow the title without waiting for the service sequence');
  assert.ok(titleReady.services.at(-1) < 1);
  assert.equal(galaxyServices.length, 5);
});
await test('reduced motion gives a complete scene with fixed ship positions at any time', () => {
  for (const t of [0, 1, 5, 20, 500]) {
    assert.deepEqual(getGalaxyPhase(t, true), getGalaxyPhase(galaxyDuration));
    galaxyServices.forEach((_, i) => assert.deepEqual(getGalaxyFlight(t, i, true), getGalaxyFlight(galaxyDuration, i)));
  }
});
await test('flights start on their orbit and accelerate continuously without a vertical drop', () => {
  galaxyServices.forEach((_, i) => {
    let previous = getGalaxyFlight(0, i);
    for (let t = .01; t <= 30; t += .01) {
      const p = getGalaxyFlight(t, i);
      assert.ok(Math.hypot(p.x - previous.x, p.y - previous.y, p.z - previous.z) < .2);
      assert.ok(p.arrival >= previous.arrival);
      if (t >= 6) { assert.equal(p.arrival, 1); assert.ok(Math.hypot(p.x, p.z) <= galaxyFleet[i].radius + .22 + 1e-10); }
      previous = p;
    }
    const birth = galaxyFleetEntry.start + i * galaxyFleetEntry.stagger;
    for (const t of [birth, birth + galaxyFleetEntry.duration]) {
      const h = 1e-4, a = getGalaxyFlight(t - h, i), b = getGalaxyFlight(t, i), c = getGalaxyFlight(t + h, i);
      for (const axis of ['x', 'y', 'z']) assert.ok(Math.abs((c[axis] - b[axis]) / h - (b[axis] - a[axis]) / h) < .01);
    }
    const start=getGalaxyFlight(birth,i),orbit=getFleetOrbit(galaxyServices[i].angle,i);
    for(const axis of ['x','y','z']) assert.equal(start[axis],orbit[axis]);
  });
  for (let a = -10; a < 10; a += .1) {
    const p = getGalaxyOrbit(a), q = getGalaxyOrbit(a + Math.PI * 2);
    assert.ok(Math.hypot(p.x - q.x, p.z - q.z) < 1e-12);
    galaxyFleet.forEach((_, i) => {
      const a1 = getFleetOrbit(a, i), a2 = getFleetOrbit(a + Math.PI * 2, i);
      assert.ok(Math.hypot(a1.x-a2.x, a1.y-a2.y, a1.z-a2.z) < 1e-12);
    });
  }
});

await test('deep space stays empty initially, then individual stars form before copy and crew settle', () => {
  for (let t=0;t<=.6;t+=.01) {
    const p=getGalaxyPhase(t); assert.equal(p.galaxy,0); assert.equal(p.station,0);
    assert.equal(p.title,0); assert.ok(p.services.every(v=>v===0));
  }
  assert.equal(getGalaxyPhase(2.9).approach,1);
  assert.equal(getGalaxyPhase(4.2).unfold,1);
  assert.equal(getGalaxyPhase(1).galaxy,1);
  assert.ok(getGalaxyPhase(1.2).galaxy > 0);
  const fleetJoining = 3.5;
  assert.ok(getGalaxyPhase(fleetJoining).unfold < 1, 'Outer stars are still settling');
  assert.ok(getCraftEntry(fleetJoining, 0).age > 0, 'Fleet joins before galaxy formation ends');
  assert.ok(getGalaxyPhase(fleetJoining).station > 0);
  const destinations=[{x:1,y:.2,z:2},{x:-4,y:-.1,z:3},{x:6.8,y:0,z:0}];
  for(const target of destinations) for(let i=0;i<20;i++) {
    const seed=Array.from({length:4},(_,j)=>galaxyRandom(i*4+j));
    assert.equal(getGalaxyStarPose(.6,target,seed).visible,false);
    let previous=getGalaxyStarPose(0,target,seed);
    for(let t=.01;t<=4.2;t+=.01) {
      const pose=getGalaxyStarPose(t,target,seed);
      assert.ok(pose.progress>=previous.progress);
      assert.ok(Math.hypot(pose.x-previous.x,pose.y-previous.y,pose.z-previous.z)<.2);
      previous=pose;
    }
    const final=getGalaxyStarPose(4.2,target,seed);
    assert.equal(final.progress,1);
    for(const axis of ['x','y','z']) assert.ok(Math.abs(final[axis]-target[axis])<1e-12);
  }
  const target={x:3,y:0,z:2},a=getGalaxyStarPose(1.5,target,[.1,.3,.1,.7]),b=getGalaxyStarPose(1.5,target,[.9,.8,.9,.2]);
  assert.ok(Math.abs(a.y-b.y)>2,'separate depth paths, not one flat disk');
  assert.notEqual(a.progress,b.progress,'separate birth and settling times');
});

await test('craft pop in place with a small overshoot and only leave a finite travelled wake',()=>{
  galaxyFleet.forEach((fleet,i)=>{
    const birth=galaxyFleetEntry.start+i*galaxyFleetEntry.stagger;
    assert.equal(getCraftEntry(birth,i).scale,0);
    assert.equal(getFlightTrail(birth,i).count,0);
    let max=0,previousCount=0;
    for(let t=birth;t<birth+3;t+=.01) {
      const scale=getCraftEntry(t,i).scale,trail=getFlightTrail(t,i);
      assert.ok(scale>=0&&scale<=1.06);
      assert.ok(trail.count>=previousCount&&trail.count<=48);
      assert.ok(t-(trail.count-1)/47*trail.duration>=birth-1e-10,'no pre-existing line before launch');
      assert.ok(Math.abs(trail.duration*fleet.radius*Math.abs(fleet.speed)-.85)<1e-10);
      max=Math.max(max,scale);previousCount=trail.count;
    }
    assert.ok(max>1);
    assert.equal(getCraftEntry(birth+1,i).scale,1);
    assert.equal(getFlightTrail(birth+3,i).count,48);
  });
});

await test('the fleet has five distinct silhouettes and different orbit planes and directions', () => {
  assert.equal(new Set(galaxyFleet.map(f=>f.kind)).size,5);
  assert.equal(new Set(galaxyFleet.map(f=>f.radius)).size,5);
  assert.equal(new Set(galaxyFleet.map(f=>f.tilt)).size,5);
  assert.ok(galaxyFleet.some(f=>f.speed<0)&&galaxyFleet.some(f=>f.speed>0));
});
await test('portrait camera fits the disk and sharper rendering stays within bounded buffers', () => {
  for (const [w, h, dpr] of [[320,1280,3],[390,1280,3],[768,1240,1],[768,1240,2],[1100,1240,2],[1101,900,2],[1440,900,1],[1440,900,2],[1920,1080,1],[2048,1020,2],[3840,2160,3]]) {
    const q = getGalaxyQuality(w, h, dpr);
    assert.ok(w * h * q.dpr ** 2 <= (q.compact ? 4500000 : 8294400) + 1);
    assert.ok(q.dpr > 0 && q.dpr <= Math.min(3, Math.max(q.compact ? 1 : 2, dpr)));
    assert.equal(q.bloom, !q.compact);
    assert.deepEqual([q.stars, q.clouds, q.dust], q.compact ? [14000,1800,600] : [32000,3600,1200], 'Density and composition remain unchanged');
    if (q.compact) assert.ok(2 * Math.tan(Math.PI / 9) * getGalaxyDistance(w, h) * w / h >= 14.8 - 1e-10);
  }
  assert.equal(getGalaxyQuality(1920, 1080, 1).dpr, 2, 'A 1080p desktop renders a complete 3840×2160 frame');
  assert.equal(getGalaxyQuality(3840, 2160, 2).dpr, 1, 'A 4K display retains native detail without an unbounded 8K buffer');
  assert.equal(getGalaxyQuality(390, 1280, 3).dpr, 3, 'Portrait phones retain their native three render pixels per CSS pixel');
});
await test('star seed values are reproducible unsigned fractions', () => {
  const samples = Array.from({length: 1000}, (_, i) => galaxyRandom(i));
  assert.ok(samples.every(v => v >= 0 && v < 1));
  assert.equal(new Set(samples).size, 1000);
  assert.ok(Math.abs(samples.reduce((a, b) => a + b) / samples.length - .5) < .03);
});
