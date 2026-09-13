import test from 'node:test';
import assert from 'node:assert/strict';
import { Object3D, PerspectiveCamera, Vector3, PlaneGeometry } from 'three';
import { getMarketingSurfacePoint, createMarketingSurface } from '../lib/marketing-surface.ts';
import { getMarketingLetterPose } from '../lib/marketing-title.ts';
import {
  getShowcasePose,
  getPanelPose,
  getShowcaseCameraDistance,
  showcasePanels,
  getMarketerFrame,
  marketerSequence,
  marketerDelays,
  marketerDuration,
} from '../lib/card-showcase.ts';

await test('kinetic title stays continuous and readable, travels across letters, and has a stable still pose', () => {
  for (let index = 0; index < 9; index++) {
    let previous = getMarketingLetterPose(index, 0);
    for (let time = 0; time <= 12; time += 1 / 240) {
      const pose = getMarketingLetterPose(index, time);
      assert.ok(Object.values(pose).every(Number.isFinite));
      assert.ok(pose.stretch >= 0.1 && pose.stretch < 1.55, 'Never flip, collapse or overshoot the composition');
      assert.ok(Math.abs(pose.stretch - previous.stretch) < 0.035, 'No discontinuous frame at an entry/pulse boundary');
      if (time >= 1.67) assert.deepEqual(pose, { stretch: 1, width: 1, rise: 0 }, 'The approved entrance must finish and stay completely still');
      previous = pose;
    }
    for (const time of [0, 0.4, 2, 100]) assert.deepEqual(getMarketingLetterPose(index, time, true), { stretch: 1, width: 1, rise: 0 });
    for (const time of [-1, NaN, Infinity]) assert.deepEqual(getMarketingLetterPose(index, time), getMarketingLetterPose(index, 0));
  }
  assert.ok(getMarketingLetterPose(0, 0.45).stretch > 1.3);
  assert.ok(getMarketingLetterPose(8, 0.45).stretch < 0.2);
  assert.deepEqual(getMarketingLetterPose(1, 5), getMarketingLetterPose(7, 100));
});

await test('campaign panels unfold in platform order from separate depth without invalid transforms', () => {
  assert.equal(showcasePanels.length, 3);
  for (const compact of [false, true])
    for (let spread = 0; spread <= 1; spread += 0.025)
      for (let i = 0; i < 3; i++) {
        const pose = getPanelPose(i, spread, 0, 1, compact);
        assert.ok(Object.values(pose).every(Number.isFinite));
        assert.ok(Math.abs(pose.ry) < 0.8, 'The face should remain visible throughout the opening');
        assert.ok(Math.abs(pose.rz) < 0.2);
        assert.ok(pose.scale > 0 && pose.scale <= 1);
      }
  const visible = showcasePanels.map((_, i) => getPanelPose(i, 1, 0, 0, false));
  assert.deepEqual(showcasePanels.map(panel => panel.id), ['instagram','blog','poster']);
  assert.ok(visible[0].x < visible[1].x && visible[1].x < visible[2].x);
  assert.ok(visible.every(pose => pose.z === 0));
  assert.equal(new Set(showcasePanels.map((_, i) => getPanelPose(i, 0, 0, 0, false).z)).size, 3);
  assert.ok(showcasePanels[1].height > showcasePanels[0].height && showcasePanels[0].height > showcasePanels[2].height, 'A long blog article, Instagram post, and installed poster retain different proportions');
  const trajectory = Array.from({ length: 101 }, (_, i) => getPanelPose(2, i / 100, 0, 0, false).x);
  assert.ok(Math.max(...trajectory) > trajectory.at(-1) * 1.05, 'Opening has a measurable overshoot and recoil');
  assert.ok(trajectory[3] - trajectory[0] < trajectory[23] - trajectory[20], 'Cards accelerate from rest instead of moving linearly');
  assert.ok(trajectory[100] < Math.max(...trajectory));
});

await test('a continuous bowed surface keeps thickness and UVs, then resets without cumulative deformation', () => {
  const w = 2.2, h = 5.26;
  for (const bend of [-.84, -.4, 0, .15, .4]) for (const twist of [-.08, 0, .08]) for (const axis of [-.24, 0, .24]) {
    for (let x = -w / 2; x <= w / 2; x += .1) for (const y of [-h / 2, 0, h / 2]) {
      const front = getMarketingSurfacePoint(x, y, .0325, w, h, bend, twist, axis);
      const back = getMarketingSurfacePoint(x, y, -.0325, w, h, bend, twist, axis);
      assert.ok(Math.abs(Math.hypot(front.x - back.x, front.y - back.y, front.z - back.z) - .065) < 1e-12);
      assert.ok(Object.values(front).every(Number.isFinite));
      if (axis === 0) assert.equal(front.y, y);
    }
  }
  const geometry = new PlaneGeometry(w, h, 18, 24), surface = createMarketingSurface(geometry, w, h);
  const original = Float32Array.from(geometry.getAttribute('position').array), uv = Float32Array.from(geometry.getAttribute('uv').array);
  for (let i = 0; i < 3; i++) {
    surface.update(.4, .06, .24);
    assert.ok(Math.min(...Array.from(geometry.getAttribute('position').array).filter((_, n) => n % 3 === 2)) < -.15);
    surface.update(0, 0);
    assert.deepEqual(geometry.getAttribute('position').array, original);
    assert.deepEqual(geometry.getAttribute('uv').array, uv);
    assert.ok(Array.from(geometry.getAttribute('normal').array).every(Number.isFinite));
  }
  for (const compact of [false, true]) for (let i = 0; i < 3; i++) {
    const settled = getPanelPose(i, 1, 0, 0, compact);
    assert.ok(Math.abs(settled.bend) > .15 && Math.abs(settled.bend) < .9, 'The finished face must retain a readable bow');
    if (i !== 1) {
      assert.ok(getPanelPose(i, .2, 0, 0, compact).bend > 0 && settled.bend < 0, 'The outer sheets must counter-bend as they open');
      assert.ok(Math.abs(settled.bendAxis) > .1, 'Outer sheets bend sideways along a tilted axis');
    }
    for (const time of [2, 12, 100]) assert.equal(getPanelPose(i, 1, 1, time, compact).bend, settled.bend, 'The finished curve must not flatten or keep flexing');
  }
  geometry.dispose();
});

await test('fully spread campaign edges stay separated in the actual perspective projection', () => {
  for (const compact of [false,true]) for(const aspect of [.5,.85,1.8,3.5]) for(const pointer of [-1,0,1]) {
    const camera = new PerspectiveCamera(32,aspect,.1,60);
    camera.position.set(pointer*.22,pointer*.14,getShowcaseCameraDistance(aspect,compact));
    camera.lookAt(0,0,0);camera.updateMatrixWorld();
    for(const drift of [0,.5,1]) for(const time of [0,1,4,12,25]) {
      const projected = showcasePanels.map((panel,index) => {
        const pose = getPanelPose(index,1,drift,time,compact), object = new Object3D();
        object.position.set(pose.x,pose.y,pose.z);object.rotation.set(pose.rx,pose.ry,pose.rz);object.scale.setScalar(pose.scale);object.updateMatrixWorld();
        const corners = [];
        for(const u of [-1,-.75,-.5,-.25,0,.25,.5,.75,1]) for(const v of [-1,0,1]) for(const z of [-.0325,.045]) {
          const p = getMarketingSurfacePoint(u*(panel.width+.045)/2,v*(panel.height+.045)/2,z,panel.width,panel.height,pose.bend,pose.twist,pose.bendAxis);
          corners.push(new Vector3(p.x,p.y,p.z).applyMatrix4(object.matrixWorld).project(camera));
        }
        return {left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),bottom:Math.min(...corners.map(p=>p.y)),top:Math.max(...corners.map(p=>p.y))};
      });
      assert.ok(projected[0].right < projected[1].left, 'Instagram and Blog must not overlap');
      assert.ok(projected[1].right < projected[2].left, 'Blog and Poster must not overlap');
      for(const box of projected) assert.ok(box.left>=-1&&box.right<=1&&box.bottom>=-1&&box.top<=1,'Complete card must remain inside the canvas');
    }
  }
});
await test('camera accommodates every bowed card throughout the depth opening', () => {
  for (const compact of [false, true]) for (const aspect of [.5, 1.8, 3.5]) for (const pointer of [-1, 1]) {
    const camera = new PerspectiveCamera(32, aspect, .1, 60);
    for (let opening = 0; opening <= 1; opening += .025) {
      camera.position.set(pointer * .22, pointer * .14, getShowcaseCameraDistance(aspect, compact, opening));
      camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
      showcasePanels.forEach((panel, index) => {
        const pose = getPanelPose(index, opening, 0, 0, compact), object = new Object3D();
        object.position.set(pose.x, pose.y, pose.z); object.rotation.set(pose.rx, pose.ry, pose.rz); object.scale.setScalar(pose.scale); object.updateMatrixWorld();
        for (const u of [-1, -.5, 0, .5, 1]) for (const v of [-1, 0, 1]) {
          const p = getMarketingSurfacePoint(u * panel.width / 2, v * panel.height / 2, .045, panel.width, panel.height, pose.bend, pose.twist,pose.bendAxis);
          const screen = new Vector3(p.x, p.y, p.z).applyMatrix4(object.matrixWorld).project(camera);
          assert.ok(Math.abs(screen.x) <= 1 && Math.abs(screen.y) <= 1, `Card ${index} clipped during opening ${opening}`);
        }
      });
    }
  }
});
await test('arrival stays continuous and reversing scroll restores the same campaign spread', () => {
  for (const { width, height, mobile } of [
    { width: 1440, height: 900, mobile: false },
    { width: 390, height: 844, mobile: true },
    { width: 844, height: 390, mobile: false },
  ]) {
    const entry = getShowcasePose(0, height, width, mobile);
    assert.equal(entry.spread, 1);
    let previous = -Infinity;
    for (let top = height; top >= -height * 2; top -= 5) {
      const pose = getShowcasePose(top, height, width, mobile);
      assert.ok(pose.progress >= previous);
      previous = pose.progress;
      assert.ok(pose.spread >= 0 && pose.spread <= 1);
      assert.ok(pose.drift >= 0 && pose.drift <= 1);
    }
    assert.ok(
      Math.abs(
        getShowcasePose(0.001, height, width, mobile).spread - entry.spread,
      ) < 0.0001,
    );
    getShowcasePose(-height, height, width, mobile);
    assert.deepEqual(getShowcasePose(0, height, width, mobile), entry);
  }
  for (const top of [-1e6, 0, 1e6])
    assert.ok(
      Object.values(getShowcasePose(top, 0, 0, false)).every(Number.isFinite),
    );
});
await test('marketer uses every generated gesture frame, loops consistently and can hold still', () => {
  let elapsed = 0;
  marketerSequence.forEach((frame, i) => {
    assert.equal(getMarketerFrame(elapsed), frame);
    assert.equal(getMarketerFrame(elapsed + marketerDelays[i] - 0.01), frame);
    elapsed += marketerDelays[i];
  });
  assert.equal(getMarketerFrame(marketerDuration), 0);
  assert.equal(getMarketerFrame(700 + marketerDuration), getMarketerFrame(700));
  for (const time of [0, 500, 10000])
    assert.equal(getMarketerFrame(time, true), 7);
});
