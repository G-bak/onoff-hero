import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { galaxyRandom as random, galaxyServices, galaxyFleet, galaxyFleetEntry, galaxyDuration, getGalaxyDistance, getGalaxyFlight, getGalaxyOrbit, getGalaxyPhase, getGalaxyQuality, getCraftEntry, getFlightTrail } from './galaxy';
import { fieldFragment, fieldVertex } from './galaxy-shaders';
import { createGalaxyFleet } from './galaxy-fleet';
import { createGalaxyField } from './galaxy-field';

type Frame = { time: number; pointerX: number; pointerY: number; still: boolean };

export function createGalaxyScene(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000001);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.info.autoReset = false;
  renderer.debug.onShaderError = (gl, program, vertex, fragment) => {
    throw new Error([gl.getProgramInfoLog(program), gl.getShaderInfoLog(vertex), gl.getShaderInfoLog(fragment)].filter(Boolean).join('\n'));
  };
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(40, 1, .1, 1800);
  const system = new THREE.Group(), station = new THREE.Group(), disk = new THREE.Group();
  disk.name = 'galactic-disk'; station.name = 'orbital-station';
  system.rotation.z = -.13;
  scene.add(system);
  system.add(station, disk);
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
  const geometry = <T extends THREE.BufferGeometry>(g: T) => { geometries.add(g); return g; };
  const material = <T extends THREE.Material>(m: T) => { materials.add(m); return m; };
  const merge = (parts: THREE.BufferGeometry[]) => {
    const merged = mergeGeometries(parts, false);
    parts.forEach(p => p.dispose());
    if (!merged) throw new Error('Could not construct spacecraft geometry');
    return geometry(merged);
  };
  const box = (x: number, y: number, z: number, px = 0, py = 0, pz = 0) => new THREE.BoxGeometry(x, y, z).translate(px, py, pz);
  let environment: THREE.WebGLRenderTarget | null = null, composer: EffectComposer | null = null, bloom: UnrealBloomPass | null = null, output: OutputPass | null = null;
  const textures = new Set<THREE.Texture>();
  const texture = <T extends THREE.Texture>(t: T) => { textures.add(t); return t; };
  let width = 1, height = 1, disposed = false;
  let quality = getGalaxyQuality(host.clientWidth, host.clientHeight, devicePixelRatio);
  const projected = new THREE.Vector3(), target = new THREE.Vector3();
  function dispose() {
    if (disposed) return;
    disposed = true;
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    environment?.dispose();
    textures.forEach(t => t.dispose());
    bloom?.dispose(); output?.dispose(); composer?.dispose();
    renderer.dispose(); renderer.domElement.remove();
  }
  try {
    const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
    try { environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .6; }
    finally { pmrem.dispose(); room.dispose(); }
    scene.add(new THREE.HemisphereLight(0xb6ccff, 0x171229, 1.4));
    const key = new THREE.DirectionalLight(0xffead2, 3.1); key.position.set(-4, 7, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5365ff, 3.7); rim.position.set(6, 1, -5); scene.add(rim);
    const ceramic = material(new THREE.MeshPhysicalMaterial({ color: 0xbdc5d2, metalness: .52, roughness: .3, clearcoat: .55 }));
    const titanium = material(new THREE.MeshStandardMaterial({ color: 0x222635, metalness: .86, roughness: .24 }));
    const solar = material(new THREE.MeshStandardMaterial({ color: 0x142455, emissive: 0x142c64, emissiveIntensity: .42, metalness: .74, roughness: .23 }));
    const glass = material(new THREE.MeshPhysicalMaterial({ color: 0x182739, emissive: 0x193252, emissiveIntensity: .5, metalness: .65, roughness: .12, clearcoat: 1 }));
    const signal = material(new THREE.MeshBasicMaterial({ color: new THREE.Color(1.45, 2, .32) }));
    const blueSignal = material(new THREE.MeshBasicMaterial({ color: new THREE.Color(.3, 1.3, 2.2) }));

    const field = createGalaxyField(disk, { geometry, material, texture });
    const farPositions = new Float32Array(1400 * 3), farSizes = new Float32Array(1400), farSeeds = new Float32Array(1400);
    for (let i = 0; i < 1400; i++) {
      const angle = random(i * 4) * Math.PI * 2, z = random(i * 4 + 1) * 2 - 1, radius = 28 + random(i * 4 + 2) * 96;
      farPositions.set([Math.sqrt(1 - z * z) * Math.cos(angle) * radius, z * radius, Math.sqrt(1 - z * z) * Math.sin(angle) * radius], i * 3);
      farSizes[i] = .025 + Math.pow(random(i * 4 + 3), 6) * .2; farSeeds[i] = random(i + 713);
    }
    const farGeometry = geometry(new THREE.BufferGeometry());
    farGeometry.setAttribute('position', new THREE.BufferAttribute(farPositions, 3)); farGeometry.setAttribute('aSize', new THREE.BufferAttribute(farSizes, 1)); farGeometry.setAttribute('aSeed', new THREE.BufferAttribute(farSeeds, 1));
    const farUniforms = { uTime: { value: 0 }, uPixels: { value: 1000 } };
    scene.add(new THREE.Points(farGeometry, material(new THREE.ShaderMaterial({ uniforms: farUniforms, vertexShader: fieldVertex, fragmentShader: fieldFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))));

    // Orbital hub: a double habitat ring, five docking modules, solar arrays,
    // segmented window lights and a glazed central observatory.
    const ringParts: THREE.BufferGeometry[] = [new THREE.TorusGeometry(.89, .115, 12, 96).rotateX(Math.PI / 2), new THREE.TorusGeometry(.68, .065, 8, 80).rotateX(Math.PI / 2).translate(0, .12, 0)];
    for (let i = 0; i < 10; i++) ringParts.push(box(.065, .08, .7, 0, -.025, .55).rotateY(i * Math.PI / 5));
    station.add(new THREE.Mesh(merge(ringParts), ceramic));
    const observatory = new THREE.Mesh(geometry(new THREE.SphereGeometry(.33, 32, 16)), glass); observatory.scale.y = .68; observatory.position.y = .2; station.add(observatory);
    const hub = new THREE.Mesh(geometry(new THREE.CylinderGeometry(.32, .42, .3, 32)), titanium); station.add(hub);
    const lights: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 42; i++) lights.push(box(.055, .035, .045, 0, .045, .993).rotateY(i * Math.PI * 2 / 42));
    station.add(new THREE.Mesh(merge(lights), signal));
    galaxyServices.forEach((service, i) => {
      const group = new THREE.Group(); group.rotation.y = service.angle; station.add(group);
      const shell = merge([new THREE.CylinderGeometry(.13, .13, .6, 12).rotateX(Math.PI / 2).translate(0, 0, 1.12), box(.055, .065, 1.1, 0, -.04, 1.25), box(.94, .025, .045, 0, 0, 1.37)]);
      group.add(new THREE.Mesh(shell, ceramic));
      const panel = merge([box(.34, .02, .66, -.36, .025, 1.4), box(.34, .02, .66, .36, .025, 1.4)]);
      group.add(new THREE.Mesh(panel, solar));
      const lines: THREE.BufferGeometry[] = [];
      for (const side of [-1, 1]) for (let j = 0; j < 7; j++) lines.push(box(.325, .006, .006, side * .36, .039, 1.12 + j * .09));
      group.add(new THREE.Mesh(merge(lines), titanium));
      const light = new THREE.Mesh(geometry(new THREE.SphereGeometry(.045, 8, 6)), i % 2 ? blueSignal : signal); light.position.set(0, .1, 1.46); group.add(light);
    });

    const ships = createGalaxyFleet({ geometry, material, ceramic, titanium, solar, glass, signal, blueSignal });
    ships.forEach(ship => system.add(ship));
    renderer.domElement.dataset.fleet = ['station', ...galaxyFleet.map(f => f.kind)].join(',');
    const wakes = ships.map(() => {
      const g = geometry(new THREE.BufferGeometry());
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(48 * 3), 3).setUsage(THREE.DynamicDrawUsage));
      const colors = new Float32Array(48 * 3);
      for(let i=0;i<48;i++) { const light=(1-i/48)**2; colors.set([light*.35,light*.65,light],i*3); }
      g.setAttribute('color',new THREE.BufferAttribute(colors,3));
      const line = new THREE.Line(g, material(new THREE.LineBasicMaterial({vertexColors:true, transparent:true, opacity:.32, blending:THREE.AdditiveBlending, depthWrite:false})));
      line.name='flight-wake';line.frustumCulled=false;system.add(line);return {line,g};
    });
    const portGeometry = geometry(new THREE.SphereGeometry(.04, 8, 6));
    const ports = galaxyServices.map((service) => {
      const p = getGalaxyOrbit(service.angle, 5.55), marker = new THREE.Mesh(portGeometry, signal);
      marker.position.set(p.x, p.y, p.z); system.add(marker); return marker;
    });
    const projectedPorts = ports.map(() => ({ x: 0, y: 0 }));

    function resize(nextWidth: number, nextHeight: number, pixelRatio: number) {
      width = Math.max(1, nextWidth); height = Math.max(1, nextHeight); quality = getGalaxyQuality(width, height, pixelRatio);
      renderer.setPixelRatio(quality.dpr); renderer.setSize(width, height, false);
      camera.aspect = width / height; camera.updateProjectionMatrix();
      field.resize(quality, height);
      farUniforms.uPixels.value = height * quality.dpr * 1.37;
      if (quality.bloom && !composer) {
        composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4 }));
        composer.addPass(new RenderPass(scene, camera));
        bloom = new UnrealBloomPass(new THREE.Vector2(width, height), .2, .5, 1.4); composer.addPass(bloom);
        output = new OutputPass(); composer.addPass(output);
      }
      composer?.setPixelRatio(quality.dpr); composer?.setSize(width, height);
      materials.forEach(m => {
        if (!(m instanceof THREE.ShaderMaterial)) return;
        const direct = !quality.bloom;
        if (Boolean(m.defines.GALAXY_DIRECT) !== direct) {
          if (direct) m.defines.GALAXY_DIRECT = 1; else delete m.defines.GALAXY_DIRECT;
          m.needsUpdate = true;
        }
      });
    }
    function draw({ time, pointerX, pointerY, still }: Frame) {
      const phase = getGalaxyPhase(time, still), distance = getGalaxyDistance(width, height);
      const approachDistance = distance * (1 + (1 - phase.approach) * 1.3);
      const elevation = .57 + .1 * phase.approach;
      camera.fov = 40;
      camera.position.set(pointerX * .32 * phase.approach, approachDistance * elevation + pointerY * .2, approachDistance * Math.sqrt(1 - elevation * elevation));
      target.set(0, 0, 0); camera.lookAt(target);
      // The camera starts centered in deep space. Editorial copy arrives as the
      // galaxy settles right, while portrait layouts keep a centered full disk.
      camera.setViewOffset(width, height, quality.compact ? 0 : -width * .16 * phase.title, quality.compact ? height * .045 : 0, width, height);
      camera.updateMatrixWorld();
      disk.visible = phase.galaxy > 0;
      renderer.domElement.dataset.diskVisible = String(disk.visible);
      renderer.domElement.dataset.entryTime = time.toFixed(3);
      renderer.domElement.dataset.zoom = (approachDistance / distance).toFixed(3);
      system.rotation.z = -.13 - .17 * (1 - phase.approach);
      field.update(still ? galaxyDuration : time);
      farUniforms.uTime.value = time;
      const stationAngle = -1.15 + time * .065;
      station.position.set(Math.cos(stationAngle) * 2.5, .9, Math.sin(stationAngle) * 2);
      station.scale.setScalar(.43 * (still ? 1 : getCraftEntry(time + galaxyFleetEntry.stationLead, 0).scale));
      station.rotation.set(.08, time * .075, -.05);
      station.visible = phase.station > 0;
      ships.forEach((ship, index) => {
        const p = getGalaxyFlight(time, index, still);
        const entry = getCraftEntry(still ? galaxyDuration : time, index);
        ship.visible = entry.age > 0;
        ship.position.set(p.x, p.y, p.z);
        ship.rotation.set(p.pitch, p.yaw, -.04 * Math.sin(time * .3 + index));
        ship.scale.setScalar(galaxyFleet[index].scale * entry.scale);
        const wake = wakes[index], t = still ? galaxyDuration : time;
        const trail = getFlightTrail(t, index);
        wake.line.visible = trail.count > 1;
        wake.g.setDrawRange(0, trail.count);
        const positions = wake.g.attributes.position as THREE.BufferAttribute;
        for (let j=0;j<trail.count;j++) {
          const q = getGalaxyFlight(t - j / 47 * trail.duration, index);
          positions.setXYZ(j,q.x,q.y,q.z);
        }
        positions.needsUpdate = true;
      });
      ports.forEach((port, i) => port.scale.setScalar(phase.services[i]));
      system.updateMatrixWorld(true);
      ports.forEach((port, i) => {
        port.getWorldPosition(projected); projected.project(camera);
        projectedPorts[i].x = (projected.x * .5 + .5) * 100;
        projectedPorts[i].y = (-projected.y * .5 + .5) * 100;
      });
      renderer.info.reset();
      if (composer && quality.bloom) composer.render(); else renderer.render(scene, camera);
      renderer.domElement.dataset.drawCalls = String(renderer.info.render.calls);
      renderer.domElement.dataset.triangles = String(renderer.info.render.triangles);
      renderer.domElement.dataset.quality = quality.bloom ? 'bloom' : 'compact';
      renderer.domElement.dataset.starInstances = String(quality.stars);
      renderer.domElement.dataset.visibleCraft = String(ships.filter(ship => ship.visible).length);
      return { phase, labels: projectedPorts };
    }
    host.appendChild(renderer.domElement); resize(host.clientWidth, host.clientHeight, devicePixelRatio);
    return { canvas: renderer.domElement, draw, resize, dispose };
  } catch (error) { dispose(); throw error; }
}
