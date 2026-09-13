'use client';

import { useEffect, useRef } from 'react';
import { createSceneFrameLoop, settleSceneValue } from '@/lib/scene-frame-loop';
import { getGalaxyPhase, galaxyDuration, advanceGalaxyTime, galaxyRandom } from '@/lib/galaxy';
import { getCrewFrame, getCrewFramePosition, crewDuration } from '@/lib/galaxy-crew';
import type { createGalaxyScene } from '@/lib/galaxy-scene';

function GalaxyFallback() {
  return <svg className="why-galaxy-fallback" viewBox="-8 -5 16 10" aria-hidden="true">
    <defs>
      <radialGradient id="galaxy-core"><stop stopColor="#ffe6c5" stopOpacity=".8"/><stop offset=".22" stopColor="#bca5dc" stopOpacity=".3"/><stop offset="1" stopColor="#5166c8" stopOpacity="0"/></radialGradient>
      <filter id="galaxy-soft"><feGaussianBlur stdDeviation=".12"/></filter>
    </defs>
    <ellipse rx="7.4" ry="3.7" fill="url(#galaxy-core)" transform="rotate(-12)"/>
    <g transform="rotate(-12) scale(1 .55)" fill="none" stroke="#92acff" strokeWidth=".18" opacity=".4" filter="url(#galaxy-soft)">
      {[0, 180].map(angle => <path key={angle} transform={`rotate(${angle})`} d="M0 0C2-1 4 1 3 3S-3 6-6 1"/>)}</g>
    {Array.from({length: 160}, (_, i) => <circle key={i} cx={(galaxyRandom(i * 3) - .5) * 15} cy={(galaxyRandom(i * 3 + 1) - .5) * 9} r={.008 + galaxyRandom(i * 3 + 2) * .021} fill="#fff" opacity={.2 + galaxyRandom(i + 30) * .6}/>)}
    <g transform="translate(1.8 -1.3) rotate(-12) scale(.55)" fill="none"><ellipse rx=".75" ry=".38" stroke="#ced7e3" strokeWidth=".13"/><ellipse rx=".6" ry=".3" stroke="#d8ff3e" strokeWidth=".035"/><path d="M-.35 0H.35M0-.4V.4" stroke="#e0e6ef" strokeWidth=".11"/></g>
    <g fill="#dae2ef" stroke="#8394b4" strokeWidth=".025">
      <path transform="translate(-3 -1.5) rotate(30)" d="M0-.5 .13-.1 .5.3 .1.23 0 .37-.1.23-.5.3-.13-.1Z"/>
      <g transform="translate(3.8 1.1) rotate(35)"><path d="M0-.6Q.22-.35.17.36L.3.5 .08.44H-.08L-.3.5-.17.36Q-.22-.35 0-.6Z"/><path d="M-.12.06H.12V.3H-.12Z" fill="#c98244"/></g>
      <ellipse transform="translate(3 -1.9) rotate(-35)" rx=".21" ry=".55"/>
      <g transform="translate(-1 2.4) rotate(25)"><path d="M-.16-.22H.16V.22H-.16Z" fill="#c5a562"/><path d="M-.7-.2H-.23V.2H-.7ZM.23-.2H.7V.2H.23Z" fill="#334c7b"/></g>
      <path transform="translate(-4 1) rotate(-25)" d="M-.15-.5H.15V-.2H.32V.4H.13V.28H-.13V.4H-.32V-.2H-.15Z"/>
    </g>
  </svg>;
}

export default function WhyGalaxy({
  active,
  revealed,
  paused,
  covered,
}: {
  active: boolean;
  revealed: boolean;
  paused: boolean;
  covered: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null),
    controls = useRef({ active, revealed, paused, covered }),
    refresh = useRef<(() => void) | null>(null);
  useEffect(() => {
    controls.current = { active, revealed, paused, covered };
    refresh.current?.();
  }, [active, revealed, paused, covered]);
  useEffect(() => {
    const host = hostRef.current,
      section = host?.closest<HTMLElement>('.why-section');
    if (!host || !section) return;
    const pages = section.closest<HTMLElement>('.site-pages'),
      reduced = matchMedia('(prefers-reduced-motion: reduce)'),
      fine = matchMedia('(hover: hover) and (pointer: fine)');
    const labels = [...section.querySelectorAll<HTMLElement>('.galaxy-service')];
    const crew = section.querySelector<HTMLElement>('.galaxy-crew-figures');
    let crewStarted = false, crewElapsed = 0, previousCrewFrame = -1, crewInView = false;
    let engine: ReturnType<typeof createGalaxyScene> | null = null;
    let recoveryCanvas: HTMLCanvasElement | null = null;
    let importDeadline: ReturnType<typeof setTimeout> | undefined;
    let disposed = false,
      failed = false,
      loading = false,
      lost = false,
      inView = false,
      needsSize = true,
      previousActive = controls.current.active;
    section.dataset.running = 'false';
    let elapsed = 0,
      pointerX = 0,
      pointerY = 0,
      targetX = 0,
      targetY = 0;
    let previousTitle = -1,
      previousSecondary = -1,
      previousDetail = -1;
    const loop = createSceneFrameLoop(draw, {
      canRun: () =>
        !disposed &&
        !failed &&
        !lost &&
        inView &&
        controls.current.active &&
        !controls.current.covered &&
        !document.hidden &&
        !pages?.inert,
    });
    function showFallback() {
      section!.dataset.galaxy = 'fallback';
      section!.dataset.running = 'false';
      labels.forEach(label => {
        label.style.setProperty('--service-in', '1');
        label.style.removeProperty('left');
        label.style.removeProperty('top');
      });
      for (const property of [
        '--why-title-in',
        '--why-title-secondary',
        '--why-detail-in',
      ])
        section!.style.setProperty(property, '1');
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      loop.suspend();
      showFallback();
      // Release lost handles before the browser restores the context. Deleting
      // them afterwards would target handles from the old WebGL generation.
      recoveryCanvas = engine?.canvas ?? null;
      releaseScene();
      recoveryCanvas?.addEventListener(
        'webglcontextrestored',
        contextRestored,
        { once: true },
      );
    }
    function releaseScene() {
      if (!engine) return;
      engine.canvas.removeEventListener('webglcontextlost', contextLost);
      engine.canvas.removeEventListener(
        'webglcontextrestored',
        contextRestored,
      );
      engine.dispose();
      engine = null;
    }
    function contextRestored() {
      recoveryCanvas = null;
      lost = false;
      previousTitle = -1;
      previousSecondary = -1;
      previousDetail = -1;
      needsSize = true;
      update();
    }
    async function initialize() {
      if (engine || disposed || failed || loading) return;
      loading = true;
      importDeadline = setTimeout(() => {
        if (disposed) return;
        failed = true;
        showFallback();
        loop.suspend();
      }, 12000);
      try {
        section!.dataset.galaxy = 'loading';
        const galaxyModule = await import('@/lib/galaxy-scene');
        if (disposed || failed) return;
        // Visibility can change while downloading. Cache the module but defer
        // GPU allocation until the scene can actually render.
        if (!controls.current.active || controls.current.covered || !inView || document.hidden || pages?.inert) return;
        engine = galaxyModule.createGalaxyScene(host!);
        engine.canvas.addEventListener('webglcontextlost', contextLost);
        engine.canvas.addEventListener('webglcontextrestored', contextRestored);
        needsSize = true;
        loop.invalidate();
      } catch {
        if (disposed) return;
        failed = true;
        showFallback();
        loop.suspend();
      } finally {
        clearTimeout(importDeadline);
        loading = false;
      }
    }
    function draw(delta: number) {
      if (!engine) return false;
      const still = reduced.matches,
        pausedNow = controls.current.paused;
      if (still || pausedNow)
        elapsed = Math.max(elapsed, galaxyDuration);
      const started = elapsed > 0 || controls.current.revealed;
      if (!still && !pausedNow && started) elapsed = advanceGalaxyTime(elapsed, delta);
      const smooth = 1 - Math.exp(-5 * Math.max(delta, 1 / 120));
      if (!still && !pausedNow) {
        pointerX = settleSceneValue(pointerX, targetX, smooth);
        pointerY = settleSceneValue(pointerY, targetY, smooth);
      }
      if (still) {
        pointerX = 0;
        pointerY = 0;
      }
      try {
        if (needsSize) {
          engine.resize(host!.clientWidth, host!.clientHeight, devicePixelRatio);
          needsSize = false;
        }
        const { phase, labels: positions } = engine.draw({
          time: elapsed,
          pointerX,
          pointerY,
          still,
        });
        labels.forEach((label, index) => {
          label.style.left = `${positions[index].x}%`;
          label.style.top = `${positions[index].y}%`;
          label.style.setProperty('--service-in', String(phase.services[index]));
        });
        // Wait for the single atlas to decode and all five people to finish
        // entering. A slow asset must still begin with the front-facing pose.
        if (crewInView && crew?.dataset.ready === 'true' && phase.crew === 1) {
          if (!crewStarted) crewStarted = true;
          else if (!still && !pausedNow) crewElapsed += delta * 1000;
        }
        const crewFrame = getCrewFrame(crewElapsed, still);
        if (crew && crewFrame !== previousCrewFrame) {
          crew.style.setProperty('--crew-pose-x', `${getCrewFramePosition(crewFrame)}%`);
          crew.dataset.frame = String(crewFrame);
          previousCrewFrame = crewFrame;
        }
        const secondary = getGalaxyPhase(elapsed, still).subtitle;
        if (previousTitle !== phase.title || previousSecondary !== secondary) {
          section!.style.setProperty('--why-title-in', String(phase.title));
          section!.style.setProperty(
            '--why-title-secondary',
            String(secondary),
          );
          previousTitle = phase.title;
          previousSecondary = secondary;
        }
        if (previousDetail !== phase.crew) {
          section!.style.setProperty('--why-detail-in', String(phase.crew));
          previousDetail = phase.crew;
        }
        section!.dataset.phase = phase.approach < 1 ? 'approaching' : phase.unfold < 1 ? 'forming' : elapsed < galaxyDuration ? 'assembling' : 'complete';
        section!.dataset.running = String(!still && !pausedNow && started);
        section!.dataset.galaxy = 'ready';
      } catch {
        failed = true;
        showFallback();
        loop.suspend();
        releaseScene();
        return false;
      }
      return !still && !pausedNow && started;
    }
    function update() {
      if (previousActive && !controls.current.active) {
        elapsed = 0;
        pointerX = 0;
        pointerY = 0;
        targetX = 0;
        targetY = 0;
        previousTitle = -1;
        previousSecondary = -1;
        previousDetail = -1;
        crewStarted = false;
        crewElapsed = 0;
        previousCrewFrame = -1;
      }
      previousActive = controls.current.active;
      section!.dataset.running = 'false';
      // The crew belongs to the galaxy's entry. Returning from MARKETING must
      // not replay an isolated gesture while the galaxy remains assembled.
      if (controls.current.covered && elapsed > 0) {
        crewStarted = true;
        crewElapsed = crewDuration;
        previousCrewFrame = -1;
        crew?.style.setProperty('--crew-pose-x', '100%');
        if (crew) crew.dataset.frame = String(getCrewFrame(crewDuration));
      } else if (!controls.current.active) {
        previousCrewFrame = -1;
        crew?.style.setProperty('--crew-pose-x', '0%');
        if (crew) crew.dataset.frame = '0';
      }
      if (
        !controls.current.active ||
        controls.current.covered ||
        lost ||
        !inView ||
        document.hidden ||
        pages?.inert
      ) {
        loop.suspend();
        return;
      }
      if (!engine) void initialize();
      else loop.invalidate();
    }
    function resize() {
      needsSize = true;
      update();
    }
    function move(event: PointerEvent) {
      if (
        !controls.current.active ||
        controls.current.paused ||
        reduced.matches ||
        !fine.matches ||
        event.pointerType === 'touch'
      )
        return;
      targetX = (event.clientX / Math.max(1, innerWidth)) * 2 - 1;
      targetY = 1 - (event.clientY / Math.max(1, innerHeight)) * 2;
    }
    function resetPointer() {
      targetX = 0;
      targetY = 0;
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(host);
    const dimensions = new ResizeObserver(resize);
    dimensions.observe(host);
    // A late decoded atlas must also update a static/reduced-motion scene.
    const crewReady = new MutationObserver(() => loop.invalidate());
    if (crew) crewReady.observe(crew, { attributes: true, attributeFilter: ['data-ready'] });
    // On a tall mobile page the team is below the galaxy. Start when the team
    // can actually be seen. Leaving its viewport pauses rather than resets it.
    const crewVisibility = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < .1) {
        crewInView = false;
      } else if (entry.intersectionRatio >= .55) crewInView = true;
      loop.invalidate();
    }, { threshold: [0, .1, .55] });
    if (crew) crewVisibility.observe(crew);
    const lock = new MutationObserver(update);
    if (pages)
      lock.observe(pages, { attributes: true, attributeFilter: ['inert'] });
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', resetPointer);
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', resize);
    refresh.current = update;
    return () => {
      disposed = true;
      clearTimeout(importDeadline);
      recoveryCanvas?.removeEventListener(
        'webglcontextrestored',
        contextRestored,
      );
      recoveryCanvas = null;
      refresh.current = null;
      loop.dispose();
      observer.disconnect();
      dimensions.disconnect();
      crewReady.disconnect();
      crewVisibility.disconnect();
      lock.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener('change', resize);
      releaseScene();
    };
  }, []);
  return <div className="why-galaxy" ref={hostRef} aria-hidden="true"><GalaxyFallback /></div>;
}
