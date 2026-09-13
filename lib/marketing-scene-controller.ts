import * as THREE from 'three';
import { createSceneFrameLoop, settleSceneValue } from '@/lib/scene-frame-loop';
import { getMarketingLetterPose } from '@/lib/marketing-title';
import { createMarketingSurface } from '@/lib/marketing-surface';
import { drawCampaignCanvas } from '@/lib/marketing-textures';
import { marketingCanvasText } from '@/lib/marketing-content';
import {
  getShowcasePose,
  getShowcaseCameraDistance,
  getPanelPose,
  getMarketerFrame,
  showcasePanels,
} from '@/lib/card-showcase';
import instagramUrl from '@/app/assets/marketing/instagram-ongyeol.webp?url';
import blogUrl from '@/app/assets/marketing/blog-ruum.webp?url';
import posterUrl from '@/app/assets/marketing/poster-installed.webp?url';
import marketerUrl from '@/app/assets/marketing/marketer-no-plinth-v2.webp?url';

const artwork = [instagramUrl, blogUrl, posterUrl];

type SceneControls = { active: boolean; paused: boolean; covered: boolean };
export function mountMarketingScene({
  section, host, title, formats, marketer, controls, refresh,
}: {
  section: HTMLElement; host: HTMLDivElement; title: HTMLHeadingElement | null;
  formats: HTMLDivElement | null; marketer: HTMLSpanElement | null;
  controls: { current: SceneControls }; refresh: { current: (() => void) | null };
}) {
  const letters = title?.querySelectorAll<HTMLElement>('.marketing-title-letter');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'),
    small = matchMedia('(max-width: 700px)'),
    fine = matchMedia('(hover: hover) and (pointer: fine)');
  const pages = section.closest<HTMLElement>('.site-pages');
  let renderer: THREE.WebGLRenderer | null = null,
    scene: THREE.Scene | null = null,
    camera: THREE.PerspectiveCamera | null = null;
  let panels: THREE.Group[] = [];
  const textures = new Set<THREE.Texture>();
  let initializationDeadline: number | undefined;
  let surfaces: ReturnType<typeof createMarketingSurface>[][] = [];
  let disposed = false,
    loading = false,
    failed = false,
    lost = false,
    inView = false,
    needsSize = true,
    generation = 0,
    recoveryCanvas: HTMLCanvasElement | null = null;
  let time = 0,
    entryTime = 0,
    spread = 0,
    drift = 0,
    px = 0,
    py = 0,
    tx = 0,
    ty = 0,
    previousActive = controls.current.active,
    previousFrame = -1,
    titleEntered = false,
    titleTime = 0;
  const projected = new THREE.Vector3();
  section.dataset.enhanced = 'true';
  const allowed = () =>
    !disposed &&
    inView &&
    controls.current.active &&
    !controls.current.covered &&
    !document.hidden &&
    !pages?.inert;
  const loop = createSceneFrameLoop(draw, {
    canRun: () => allowed() && !lost,
  });
  function release() {
    generation++;
    window.clearTimeout(initializationDeadline);
    panels.forEach((group) =>
      group.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
          materials.forEach((material) => material.dispose());
        }
      }),
    );
    panels = [];
    surfaces = [];
    textures.forEach((texture) => texture.dispose());
    textures.clear();
    if (renderer) {
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        contextLost,
      );
      renderer.dispose();
      renderer.domElement.remove();
    }
    renderer = null;
    scene = null;
    camera = null;
    loading = false;
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    loop.suspend();
    section!.dataset.renderer = 'fallback';
    recoveryCanvas = renderer?.domElement ?? null;
    release();
    recoveryCanvas?.addEventListener(
      'webglcontextrestored',
      contextRestored,
      { once: true },
    );
  }
  function contextRestored() {
    recoveryCanvas = null;
    lost = false;
    failed = false;
    needsSize = true;
    update();
  }
  function fallback() {
    failed = true;
    section!.dataset.renderer = 'fallback';
    release();
    update();
  }
  async function initialize() {
    if (renderer || loading || failed || disposed || lost) return;
    loading = true;
    const token = ++generation;
    section!.dataset.renderer = 'loading';
    initializationDeadline = window.setTimeout(() => {
      if (!disposed && token === generation) fallback();
    }, 12000);
    try {
      const next = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer = next;
      next.setClearColor(0, 0);
      next.outputColorSpace = THREE.SRGBColorSpace;
      next.domElement.setAttribute('aria-hidden', 'true');
      next.domElement.addEventListener('webglcontextlost', contextLost);
      host!.appendChild(next.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
      scene.add(new THREE.AmbientLight('#ffffff', 1.9));
      const light = new THREE.DirectionalLight('#ffffff', 1.5);
      light.position.set(-3, 4, 6);
      scene.add(light);
      const person = new window.Image();
      person.src = marketerUrl;
      const [loaded, fonts, portrait] = await Promise.all([
        Promise.allSettled(artwork.map(async url => {
          const texture = await new THREE.TextureLoader().loadAsync(url);
          // Own each completed asset immediately, even if another image or
          // font never resolves. Late arrivals after release dispose themselves.
          if (disposed || token !== generation) { texture.dispose(); return null; }
          textures.add(texture);
          return texture;
        })),
        Promise.allSettled([
          document.fonts.load('700 24px "Pretendard Variable"', marketingCanvasText),
          document.fonts.load('700 48px Montserrat', 'MARKETING'),
        ]),
        person.decode().then(() => true, () => false),
      ]);
      if (disposed || token !== generation) {
        return;
      }
      if (loaded.some((r) => r.status === 'rejected') || fonts.some((r) => r.status === 'rejected') || !portrait) {
        fallback();
        return;
      }
      loaded.forEach((result, index) => {
        if (result.status !== 'fulfilled' || !result.value) return;
        let texture: THREE.Texture = result.value;
        texture.colorSpace = THREE.SRGBColorSpace;
        if (index < 2) {
          const canvas = drawCampaignCanvas(index, result.value.image);
          // Keep the same pixels available as a 2D fallback after context loss.
          const card = section!.querySelectorAll<HTMLElement>('.marketing-fallback-card')[index];
          card?.querySelector('canvas')?.remove();
          card?.appendChild(canvas);
          if (card) card.dataset.textureReady = 'true';
          texture.dispose();
          textures.delete(texture);
          texture = new THREE.CanvasTexture(canvas);
          textures.add(texture);
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        texture.anisotropy = Math.min(
          8,
          next.capabilities.getMaxAnisotropy(),
        );
        const panel = showcasePanels[index],
          group = new THREE.Group();
        panels.push(group);
        scene!.add(group);
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(
            panel.width + 0.045,
            panel.height + 0.045,
            0.065,
            18, 24, 1,
          ),
          new THREE.MeshStandardMaterial({
            color: index === 2 ? '#090a0f' : '#ffffff',
            roughness: 0.42,
            metalness: 0.22,
          }),
        );
        group.add(body);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: .62,
          metalness: .02,
          emissive: '#ffffff',
          emissiveMap: texture,
          emissiveIntensity: .08,
          toneMapped: false,
        });
        const face = new THREE.Mesh(
          new THREE.PlaneGeometry(panel.width, panel.height, 18, 24).translate(0, 0, .045),
          material,
        );
        group.add(face);
        surfaces.push([body, face].map(mesh => createMarketingSurface(mesh.geometry, panel.width, panel.height)));
      });
      needsSize = true;
      loading = false;
      update();
    } catch {
      if (!disposed && token === generation) fallback();
    } finally {
      // An older context generation must not cancel the restored scene's timer.
      if (token === generation) {
        window.clearTimeout(initializationDeadline);
        loading = false;
      }
    }
  }
  function draw(delta: number) {
    if (loading || (!failed && panels.length !== 3)) return false;
    const still = reduced.matches || controls.current.paused;
    if (!still && titleEntered) {
      time += delta;
      entryTime += delta;
      titleTime = Math.min(1.67, titleTime + delta);
    }
    // Stop writing the finished title on every card/person frame.
    if (title?.dataset.motionTime !== titleTime.toFixed(3) || still) letters?.forEach((letter, index) => {
      const pose = getMarketingLetterPose(index, titleTime, still);
      letter.style.transform = `translate3d(0,${pose.rise.toFixed(4)}em,0) scale(${pose.width.toFixed(4)},${pose.stretch.toFixed(4)})`;
    });
    title?.setAttribute('data-motion-time', titleTime.toFixed(3));
    const top =
      document.getElementById('card')?.getBoundingClientRect().top ?? 0;
    const target = getShowcasePose(
        top,
        innerHeight,
        section!.clientWidth,
        small.matches,
        section!.offsetHeight - (section!.firstElementChild as HTMLElement).offsetHeight,
      ),
      factor = 1 - Math.exp(-12 * Math.max(delta, 1 / 120));
    if (reduced.matches) {
      spread = 1;
      drift = 0;
      px = 0;
      py = 0;
    } else if (!still) {
      spread = settleSceneValue(
        spread,
        target.spread,
        factor,
      );
      drift = settleSceneValue(drift, target.drift, factor);
      px = settleSceneValue(px, tx, factor);
      py = settleSceneValue(py, ty, factor);
    } else if (entryTime === 0) {
      spread = 1;
      drift = 0;
    }
    const frame = getMarketerFrame(time * 1000, still);
    if (marketer && frame !== previousFrame) {
      marketer.style.backgroundPositionX = `${(frame / 7) * 100}%`;
      marketer.dataset.frame = String(frame);
      previousFrame = frame;
    }
    if (renderer && scene && camera && panels.length === 3) {
      try {
      if (needsSize) {
        const w = host!.clientWidth,
          h = host!.clientHeight;
        renderer.setPixelRatio(
          Math.min(
            devicePixelRatio,
            1.5,
            Math.sqrt(1400000 / Math.max(1, w * h)),
          ),
        );
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.updateProjectionMatrix();
        needsSize = false;
      }
      const opening = still ? spread : Math.min(spread, Math.max(0, (entryTime - 0.08) / 1.28));
      const distance = getShowcaseCameraDistance(camera.aspect, small.matches, opening);
      camera.position.set(px * 0.22, py * 0.14, distance);
      camera.lookAt(0, 0, 0);
      panels.forEach((panel, index) => {
        const pose = getPanelPose(
          index,
          opening,
          drift,
          still ? 0 : time,
          small.matches,
        );
        panel.position.set(pose.x, pose.y, pose.z);
        panel.rotation.set(pose.rx, pose.ry, pose.rz);
        panel.scale.setScalar(pose.scale);
        surfaces[index].forEach(surface => surface.update(pose.bend, pose.twist, pose.bendAxis));
      });
      formats?.style.setProperty('--formats-in', String(still ? 1 : Math.max(0, Math.min(1, (opening - .74) / .26))));
        renderer.render(scene, camera);
        panels.forEach((panel, index) => {
          projected.copy(panel.position).project(camera!);
          formats?.style.setProperty(`--campaign-${index}-x`, `${(projected.x + 1) * 50}%`);
          projected.set(0, -showcasePanels[index].height / 2, .035).applyMatrix4(panel.matrixWorld).project(camera!);
          formats?.style.setProperty(`--campaign-${index}-y`, `${(1 - projected.y) * .5 * host!.clientHeight + 12}px`);
        });
        const firstFrame = section!.dataset.renderer !== 'ready';
        section!.dataset.renderer = 'ready';
        if (firstFrame) update();
        renderer.domElement.dataset.spread = (still ? spread : Math.min(spread, Math.max(0, (entryTime - 0.08) / 1.28))).toFixed(3);
        renderer.domElement.dataset.panels = String(panels.length);
        renderer.domElement.dataset.surface = 'curved-lit';
      } catch {
        fallback();
      }
    }
    section!.dataset.running = String(!still);
    return !still;
  }
  function update() {
    if (previousActive && !controls.current.active) {
      entryTime = 0;
      spread = 0;
      drift = 0;
      time = 0;
      previousFrame = -1;
      titleEntered = false;
      titleTime = 0;
    }
    previousActive = controls.current.active;
    const run =
      allowed() && !controls.current.paused && !reduced.matches && !lost;
    const front = section!.closest('.page-turn-back-track')?.parentElement?.querySelector<HTMLElement>(':scope > .page-turn-front-track > .page-turn-front > .page-turn-sheet');
    if ((section!.dataset.renderer === 'ready' || failed) && allowed() && title && (!front || front.getBoundingClientRect().bottom < title.getBoundingClientRect().bottom - 24)) titleEntered = true;
    section!.dataset.titleEntered = String(titleEntered);
    section!.dataset.still = String(reduced.matches || controls.current.paused);
    section!.dataset.running = String(run);
    if (!allowed() || lost) {
      loop.suspend();
      return;
    }
    if (!renderer && !failed) void initialize();
    else loop.invalidate();
  }
  function resize() {
    needsSize = true;
    update();
  }
  function move(e: PointerEvent) {
    if (
      !fine.matches ||
      e.pointerType === 'touch' ||
      controls.current.paused ||
      reduced.matches
    )
      return;
    tx = (e.clientX / Math.max(1, innerWidth)) * 2 - 1;
    ty = 1 - (e.clientY / Math.max(1, innerHeight)) * 2;
  }
  function leave() {
    tx = 0;
    ty = 0;
  }
  const observer = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    update();
  });
  observer.observe(host);
  const sizes = new ResizeObserver(resize);
  sizes.observe(host);
  const lock = new MutationObserver(update);
  if (pages)
    lock.observe(pages, { attributes: true, attributeFilter: ['inert'] });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', resize);
  small.addEventListener('change', resize);
  refresh.current = update;
  return () => {
    disposed = true;
    refresh.current = null;
    loop.dispose();
    observer.disconnect();
    sizes.disconnect();
    lock.disconnect();
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', leave);
    document.removeEventListener('visibilitychange', update);
    reduced.removeEventListener('change', resize);
    small.removeEventListener('change', resize);
    recoveryCanvas?.removeEventListener(
      'webglcontextrestored',
      contextRestored,
    );
    delete section.dataset.enhanced;
    release();
  };
}
