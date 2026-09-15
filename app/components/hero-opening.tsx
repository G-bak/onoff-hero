'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSceneFrameLoop } from '@/lib/scene-frame-loop';
import { getOpeningPresentation, openingTiming, openingPlaybackRate } from '@/lib/home-opening';
import { sectionNavigationEvent } from '@/lib/scroll-navigation';
import type { createOpeningScene } from '@/lib/opening-scene';

export type OpeningResult = 'complete' | 'skipped' | 'unavailable';
const properties = ['wordmark', 'cards', 'header', 'copy', 'controls', 'card-y'];
export default function HeroOpening({ ready, onStart, onReveal, onComplete }: {
  ready: boolean; onStart: () => void; onReveal: () => void; onComplete: (result: OpeningResult) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null), readyRef = useRef(ready);
  const resumeRef = useRef(() => {}), skipRef = useRef(() => {});
  useEffect(() => { readyRef.current = ready; resumeRef.current(); }, [ready]);
  useEffect(() => {
    const host = hostRef.current, layer = host?.parentElement;
    const page = document.getElementById('home'), wordmark = page?.querySelector<HTMLElement>('.hero-wordmark');
    if (!host || !page || !wordmark || !layer) { onComplete('unavailable'); return; }
    let disposed = false, ended = false, started = false, revealed = false, elapsed = 0, needsSize = true;
    let engine: ReturnType<typeof createOpeningScene> | undefined;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const loop = createSceneFrameLoop(draw, { canRun: () => !disposed && !ended && started && !document.hidden });
    page.dataset.opening = 'preparing';
    function clearPresentation() {
      delete page!.dataset.opening;
      properties.forEach(name => page!.style.removeProperty(`--opening-${name}`));
    }
    function releaseEngine() {
      engine?.canvas.removeEventListener('webglcontextlost', contextLost);
      engine?.dispose(); engine = undefined;
    }
    function finish(result: OpeningResult) {
      if (disposed || ended) return;
      ended = true; loop.dispose(); releaseEngine(); clearPresentation(); onComplete(result);
    }
    function contextLost(event: Event) { event.preventDefault(); finish('unavailable'); }
    function draw(delta: number) {
      try {
        elapsed = Math.min(openingTiming.duration, elapsed + delta * openingPlaybackRate);
        if (needsSize) { engine?.resize(); needsSize = false; }
        const state = getOpeningPresentation(elapsed);
        if (state.canvas > 0) engine?.draw(elapsed); else releaseEngine();
        layer!.style.setProperty('--opening-backdrop', String(state.backdrop));
        layer!.style.setProperty('--opening-canvas', String(state.canvas));
        layer!.dataset.docked = String(state.canvas === 0);
        for (const name of ['wordmark', 'cards', 'header', 'copy', 'controls'] as const) page!.style.setProperty(`--opening-${name}`, String(state[name]));
        page!.style.setProperty('--opening-card-y', `${-112 * (1 - state.cardTravel)}svh`);
        layer!.dataset.time = elapsed.toFixed(3);
        if (elapsed >= openingTiming.unlock && !revealed) { revealed = true; onReveal(); }
        if (elapsed >= openingTiming.duration) { finish('complete'); return false; }
        return true;
      } catch { finish('unavailable'); return false; }
    }
    function resume() {
      if (!engine || !readyRef.current || disposed || ended) return;
      if (!started) { started = true; page!.dataset.opening = 'playing'; onStart(); }
      if (!document.hidden) loop.invalidate();
    }
    function visibility() { if (document.hidden) loop.suspend(); else if (started) loop.invalidate(); else resume(); }
    function resize() { needsSize = true; if (started) loop.invalidate(); }
    function reduce() { if (reduced.matches) finish('skipped'); }
    function hashChange() { if (location.hash && location.hash !== '#home') finish('skipped'); }
    function sectionChange(event: Event) { if ((event as CustomEvent<string>).detail !== 'home') finish('skipped'); }
    function keyboard(event: KeyboardEvent) { if (started && event.key === 'Escape') { event.preventDefault(); finish('skipped'); } }
    const dimensions = new ResizeObserver(resize);
    dimensions.observe(host); dimensions.observe(wordmark);
    document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', reduce);
    window.addEventListener('hashchange', hashChange); window.addEventListener('keydown', keyboard);
    window.addEventListener(sectionNavigationEvent, sectionChange);
    resumeRef.current = resume; skipRef.current = () => finish('skipped');
    const timeout = window.setTimeout(() => { if (!engine && !started) finish('unavailable'); }, 8000);
    void Promise.all([document.fonts.load('700 100px Montserrat', 'ON&OFF'), import('@/lib/opening-scene')]).then(([fonts, module]) => {
      if (disposed || ended) return;
      if (!fonts.length || reduced.matches) { finish('unavailable'); return; }
      engine = module.createOpeningScene(host, wordmark);
      engine.canvas.addEventListener('webglcontextlost', contextLost); engine.draw(0);
      clearTimeout(timeout); resume();
    }).catch(() => finish('unavailable'));
    return () => {
      disposed = true; clearTimeout(timeout); loop.dispose(); releaseEngine(); clearPresentation(); dimensions.disconnect();
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', reduce);
      window.removeEventListener('hashchange', hashChange); window.removeEventListener('keydown', keyboard);
      window.removeEventListener(sectionNavigationEvent, sectionChange);
      resumeRef.current = () => {}; skipRef.current = () => {};
    };
  }, [onStart, onReveal, onComplete]);
  return <div className="hero-opening">
    <div className="opening-backdrop" aria-hidden="true"/>
    <div className="opening-canvas" ref={hostRef} aria-hidden="true"/>
    <p className="opening-colophon" aria-hidden="true">ONE TEAM. MANY MINDS.</p>
    <Button className="opening-skip" variant="ghost" onClick={() => skipRef.current()} aria-label="오프닝 건너뛰고 홈페이지 보기">건너뛰기 <ArrowUpRight aria-hidden="true"/></Button>
    <output className="sr-only">온앤오프 오프닝. 건너뛰기 버튼이나 Escape 키로 홈페이지를 볼 수 있습니다.</output>
  </div>;
}
