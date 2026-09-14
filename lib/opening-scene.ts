import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import fontData from '@/app/assets/opening/montserrat-bold.json';
import { getOpeningLetterPose, getOpeningPresentation, getOpeningPixelRatio, openingCurveSegments, openingLetters, openingTiming } from './home-opening';

type Command = { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number };
type Glyph = { bounds: { x1: number; x2: number; y1: number; y2: number }; commands: Command[] };
const em = fontData.unitsPerEm;
const glyphs: Record<string, Glyph> = fontData.glyphs;

export function createOpeningScene(host: HTMLDivElement, wordmark: HTMLElement) {
  const resources: { dispose(): void }[] = [];
  let renderer: THREE.WebGLRenderer | undefined;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 12000);
    camera.position.z = 6000;
    const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
    let environment: THREE.WebGLRenderTarget;
    try { environment = pmrem.fromScene(room, .04); }
    finally { room.dispose(); pmrem.dispose(); }
    resources.push(environment);
    scene.environment = environment.texture;
    scene.environmentIntensity = .65;
    const fill = new THREE.HemisphereLight(0xffffff, 0x7e90b0, 2);
    scene.add(fill);
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.00025; key.shadow.normalBias = .6; key.shadow.radius = 5;
    scene.add(key, key.target);
    resources.push({ dispose: () => key.shadow.dispose() });
    const rim = new THREE.DirectionalLight(0xadb8ff, 1.8);
    scene.add(rim);
    const ink = new THREE.Color('#333333'), blue = new THREE.Color('#343CFF');
    // Keep the brand face colors independent of white light/specular washout.
    // Lit metallic sides and cast shadows still describe the real extrusion.
    const front = new THREE.MeshBasicMaterial({ color: ink, toneMapped: false });
    const ampFront = new THREE.MeshBasicMaterial({ color: blue, toneMapped: false });
    const side = new THREE.MeshStandardMaterial({ color: '#929ca6', metalness: .74, roughness: .23 });
    const ampSide = new THREE.MeshStandardMaterial({ color: '#292b92', metalness: .6, roughness: .2 });
    resources.push(front, ampFront, side, ampSide);
    const geometries = new Map<string, THREE.ExtrudeGeometry>();
    for (const char of new Set(openingLetters)) {
      const glyph = glyphs[char], path = new THREE.ShapePath();
      for (const c of glyph.commands) {
        if (c.type === 'M') path.moveTo(c.x! / em, c.y! / em);
        else if (c.type === 'L') path.lineTo(c.x! / em, c.y! / em);
        else if (c.type === 'Q') path.quadraticCurveTo(c.x1! / em, c.y1! / em, c.x! / em, c.y! / em);
        else if (c.type === 'C') path.bezierCurveTo(c.x1! / em, c.y1! / em, c.x2! / em, c.y2! / em, c.x! / em, c.y! / em);
        else if (c.type === 'Z') path.currentPath?.closePath();
      }
      const { x1, x2, y1, y2 } = glyph.bounds;
      const geometry = new THREE.ExtrudeGeometry(path.toShapes(), { depth: .16, bevelEnabled: false, curveSegments: openingCurveSegments, steps: 1 });
      geometry.translate(-(x1 + x2) / (2 * em), -(y1 + y2) / (2 * em), -.16);
      geometries.set(char, geometry); resources.push(geometry);
    }
    const letters = openingLetters.map(char => {
      const mesh = new THREE.Mesh(geometries.get(char)!, char === '&' ? [ampFront, ampSide] : [front, side]);
      mesh.castShadow = true; scene.add(mesh); return mesh;
    });
    const shadowMaterial = new THREE.ShadowMaterial({ opacity: .15, depthWrite: false });
    const shadowGeometry = new THREE.PlaneGeometry(1, 1);
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.receiveShadow = true; scene.add(shadow); resources.push(shadowMaterial, shadowGeometry);
    let width = 1, height = 1, size = 100, startSize = 100;
    let targets: { x: number; y: number; startX: number; startY: number }[] = [];
    function resize() {
      width = host.clientWidth; height = host.clientHeight;
      if (width <= 0 || height <= 0) throw new Error('Opening viewport has no layout size.');
      renderer!.setPixelRatio(getOpeningPixelRatio(width, height, devicePixelRatio));
      renderer!.setSize(width, height);
      camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      const text = wordmark.querySelector<HTMLElement>('.wordmark-text')!;
      const baseline = wordmark.querySelector<HTMLElement>('[data-wordmark-baseline]')!.getBoundingClientRect().top;
      size = Number.parseFloat(getComputedStyle(text).fontSize);
      startSize = Math.min(width * .174, height * .29, 252);
      const textBounds = text.getBoundingClientRect();
      const startLeft = width / 2 - textBounds.width / size * startSize / 2;
      const startBaseline = height * .49 + startSize * .35;
      targets = [...wordmark.querySelectorAll<HTMLElement>('[data-wordmark-letter]')].map((letter, index) => {
        const range = document.createRange(); range.selectNodeContents(letter);
        const bounds = range.getBoundingClientRect(), glyph = glyphs[openingLetters[index]].bounds;
        const cx = (glyph.x1 + glyph.x2) / (2 * em), cy = (glyph.y1 + glyph.y2) / (2 * em);
        return { x: bounds.left + cx * size - width / 2, y: height / 2 - baseline + cy * size,
          startX: startLeft + ((bounds.left - textBounds.left) / size + cx) * startSize - width / 2,
          startY: height / 2 - startBaseline + cy * startSize };
      });
      if (targets.length !== 6 || !Number.isFinite(size)) throw new Error('Opening wordmark could not be measured.');
      key.position.set(-width * .35, height * .7, 1200); key.target.position.set(0, 0, 0);
      key.shadow.camera.left = -width; key.shadow.camera.right = width;
      key.shadow.camera.top = height; key.shadow.camera.bottom = -height;
      key.shadow.camera.near = .1; key.shadow.camera.far = 6000; key.shadow.camera.updateProjectionMatrix();
      rim.position.set(width * .5, height * .15, 800);
      shadow.scale.set(width * 3, height * 3, 1); shadow.position.z = -startSize * .4;
    }
    resize();
    function draw(time: number) {
      const state = getOpeningPresentation(time), scale = THREE.MathUtils.lerp(startSize, size, state.dock);
      letters.forEach((mesh, index) => {
        mesh.visible = index !== 2 || time >= openingTiming.ampDrop;
        const target = targets[index];
        const bounds = glyphs[openingLetters[index]].bounds;
        const halfWidth = (bounds.x2 - bounds.x1) / (2 * em), halfHeight = (bounds.y2 - bounds.y1) / (2 * em);
        const side = index < 2 ? -1 : 1;
        const edgeDistance = (width / 2 + (halfWidth + .24) * startSize - side * target.startX) / startSize;
        const skyDistance = (height / 2 + (halfHeight + .18) * startSize - target.startY) / startSize;
        const pose = getOpeningLetterPose(time, index, edgeDistance, skyDistance);
        mesh.position.set(THREE.MathUtils.lerp(target.startX, target.x, state.dock) + pose.x * startSize,
          THREE.MathUtils.lerp(target.startY, target.y, state.dock) + pose.y * startSize + halfHeight * scale * (pose.sy - 1), pose.z * startSize);
        mesh.rotation.set(pose.rx, pose.ry, pose.rz);
        mesh.scale.set(scale * pose.sx, scale * pose.sy, scale * Math.max(.001, 1 - state.flatten));
      });
      scene.environmentIntensity = .65 * (1 - state.flatten);
      fill.intensity = 2 * (1 - state.flatten); key.intensity = 2.6 * (1 - state.flatten); rim.intensity = 1.8 * (1 - state.flatten);
      shadowMaterial.opacity = .15 * (1 - state.flatten);
      renderer!.render(scene, camera);
    }
    let disposed = false;
    return { canvas: renderer.domElement, resize, draw, dispose() {
      if (disposed) return;
      disposed = true; resources.forEach(resource => resource.dispose()); renderer!.dispose();
      if (!renderer!.getContext().isContextLost()) renderer!.forceContextLoss();
      renderer!.domElement.remove();
    } };
  } catch (error) {
    resources.forEach(resource => resource.dispose()); renderer?.dispose();
    if (renderer && !renderer.getContext().isContextLost()) renderer.forceContextLoss();
    renderer?.domElement.remove(); throw error;
  }
}
