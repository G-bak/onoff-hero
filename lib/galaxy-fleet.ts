import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { galaxyFleet } from './galaxy';

type Resources = {
  geometry: <T extends THREE.BufferGeometry>(g: T) => T;
  material: <T extends THREE.Material>(m: T) => T;
  ceramic: THREE.Material; titanium: THREE.Material; solar: THREE.Material;
  glass: THREE.Material; signal: THREE.Material; blueSignal: THREE.Material;
};

// Model silhouettes are deliberately different: delta-wing orbiter, ribbed
// dirigible, staged rocket, solar-array probe and modular freight carrier.
export function createGalaxyFleet(r: Resources) {
  const orange = r.material(new THREE.MeshStandardMaterial({ color: 0xc98244, metalness: .57, roughness: .35 }));
  const gold = r.material(new THREE.MeshStandardMaterial({ color: 0xc5a562, metalness: .76, roughness: .32 }));
  const flame = r.material(new THREE.MeshBasicMaterial({ color: 0x9bdfff, transparent: true, opacity: .37, depthWrite: false, blending: THREE.AdditiveBlending }));
  const box = (x: number, y: number, z: number, px = 0, py = 0, pz = 0) => new THREE.BoxGeometry(x, y, z).translate(px, py, pz);
  const cylinder = (radius: number, length: number, x = 0, y = 0, z = 0) => new THREE.CylinderGeometry(radius, radius, length, 16).rotateX(Math.PI / 2).translate(x, y, z);
  const capsule = (radius: number, length: number, x = 0, y = 0, z = 0) => new THREE.CapsuleGeometry(radius, length, 5, 16).rotateX(Math.PI / 2).translate(x, y, z);
  function wing(points: number[][], thickness = .035) {
    const shape = new THREE.Shape();
    points.forEach(([x, z], i) => { if (i) shape.lineTo(x, -z); else shape.moveTo(x, -z); });
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .008, bevelThickness: .008 }).rotateX(-Math.PI / 2).translate(0, -thickness / 2, 0);
  }
  function mesh(group: THREE.Group, parts: THREE.BufferGeometry[], material: THREE.Material) {
    // Normalize indices because extruded wings and primitive bodies differ.
    const normalized = parts.map(g => g.index ? g.toNonIndexed() : g);
    const joined = mergeGeometries(normalized);
    new Set([...parts, ...normalized]).forEach(g => g.dispose());
    if (!joined) throw new Error('Spacecraft geometry could not be merged');
    group.add(new THREE.Mesh(r.geometry(joined), material));
  }
  function exhaust(group: THREE.Group, jets: number[][], length = .5) {
    length *= .45;
    mesh(group, jets.map(([x, y, z]) => cylinder(.05, .055, x, y, z)), r.blueSignal);
    mesh(group, jets.map(([x, y, z]) => new THREE.ConeGeometry(.045, length, 10).rotateX(-Math.PI / 2).translate(x, y, z - length / 2)), flame);
  }
  return galaxyFleet.map(({ kind }) => {
    const group = new THREE.Group(); group.name = `fleet-${kind}`;
    if (kind === 'shuttle') {
      mesh(group, [capsule(.145, .72), wing([[-.1,.22],[-.67,-.47],[-.2,-.45],[0,-.2],[.2,-.45],[.67,-.47],[.1,.22]]), wing([[0,-.2],[.29,-.55],[0,-.53]]).rotateZ(Math.PI / 2).translate(0,.12,0)], r.ceramic);
      mesh(group, [capsule(.138, .66, 0, -.053, -.02), box(.3,.035,.15,0,-.04,-.39)], r.titanium);
      mesh(group, [new THREE.SphereGeometry(.115,16,12).scale(1,.4,1.3).translate(0,.137,.24)], r.glass);
      mesh(group, [box(.22,.01,.035,-.32,.025,-.28),box(.22,.01,.035,.32,.025,-.28)], r.signal);
      exhaust(group, [[-.085,0,-.51],[.085,0,-.51]], .48);
    } else if (kind === 'airship') {
      mesh(group, [new THREE.SphereGeometry(.29,32,20).scale(1,.82,2.85), box(.22,.14,.48,0,-.28,-.03)], r.ceramic);
      const ribs = [-.52,-.3,0,.3,.52].map(z => new THREE.TorusGeometry(.293 * Math.sqrt(1 - z*z/.69),.012,5,32).scale(1,.82,1).translate(0,0,z));
      mesh(group, ribs, r.titanium);
      mesh(group, [box(.228,.065,.32,0,-.26,.01)], r.glass);
      mesh(group, [wing([[0,-.42],[-.43,-.83],[0,-.7]]),wing([[0,-.42],[.43,-.83],[0,-.7]]),wing([[0,-.35],[.33,-.82],[0,-.7]]).rotateZ(Math.PI/2)], r.solar);
      exhaust(group, [[-.23,-.12,-.57],[.23,-.12,-.57]], .32);
    } else if (kind === 'rocket') {
      mesh(group, [cylinder(.15,1.03),new THREE.ConeGeometry(.15,.36,20).rotateX(Math.PI/2).translate(0,0,.69),capsule(.065,.52,-.23,0,-.19),capsule(.065,.52,.23,0,-.19)], r.ceramic);
      mesh(group, [cylinder(.152,.52,0,0,.07)], orange);
      mesh(group, [new THREE.TorusGeometry(.153,.027,6,24).translate(0,0,-.38),new THREE.TorusGeometry(.153,.019,6,24).translate(0,0,.37),cylinder(.115,.15,0,0,-.56)], r.titanium);
      mesh(group, Array.from({length:4},(_,i)=>wing([[.13,-.25],[.34,-.61],[.13,-.54]]).rotateZ(i*Math.PI/2)), r.ceramic);
      exhaust(group, [[0,0,-.66],[-.23,0,-.52],[.23,0,-.52]], .85);
    } else if (kind === 'explorer') {
      mesh(group, [box(.3,.28,.36),cylinder(.018,1.6).rotateY(Math.PI/2)], gold);
      mesh(group, [box(.55,.018,.57,-.57,0,0),box(.55,.018,.57,.57,0,0)], r.solar);
      const grid: THREE.BufferGeometry[] = [];
      for (const side of [-1,1]) {
        for (let i=0;i<7;i++) grid.push(box(.53,.008,.006,side*.57,.013,-.25+i*.083));
        for (let i=0;i<5;i++) grid.push(box(.006,.008,.55,side*.57-.25+i*.125,.013,0));
      }
      mesh(group, grid, r.titanium);
      mesh(group, [new THREE.SphereGeometry(.22,20,12,0,Math.PI*2,0,Math.PI/2).scale(1,.4,1).translate(0,.24,.04),box(.025,.16,.025,0,.19,0)], r.ceramic);
      mesh(group, [new THREE.SphereGeometry(.025,8,6).translate(0,.36,0)], r.signal);
      exhaust(group, [[0,-.05,-.2]], .3);
    } else {
      mesh(group, [box(.27,.19,.9),capsule(.105,.62,-.3,0,-.13),capsule(.105,.62,.3,0,-.13),wing([[-.14,.55],[-.32,.1],[.32,.1],[.14,.55]])], r.titanium);
      mesh(group, [box(.25,.18,.2,-.3,.15,-.2),box(.25,.18,.2,-.3,.15,.04),box(.25,.18,.2,.3,.15,-.2),box(.25,.18,.2,.3,.15,.04),box(.27,.13,.3,0,.17,-.28)], r.ceramic);
      mesh(group, [box(.258,.04,.21,-.3,.19,-.2),box(.258,.04,.21,.3,.19,.04),box(.16,.03,.23,0,.18,.26)], r.solar);
      mesh(group, [box(.23,.08,.025,0,.09,.55)], r.glass);
      mesh(group, [box(.018,.19,.15,-.433,.15,-.2),box(.018,.19,.15,.433,.15,.04)], r.signal);
      exhaust(group, [[-.3,0,-.57],[.3,0,-.57],[0,0,-.47]], .52);
    }
    return group;
  });
}
