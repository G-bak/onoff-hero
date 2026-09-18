'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getLoadingOrbitPoints, sceneOrbit } from '@/lib/scene-orbit';
import { formatSceneWait, getInitialSceneTiming, sceneLoadingTiming, type SceneIssue, type SceneStatus } from '@/lib/scene-loading';
import { resolveSiteSection } from '@/lib/site-sections';
import { shouldPlayHomeOpening } from '@/lib/home-opening';
import { getNavigationHash } from '@/lib/scroll-navigation';
import HeroOpening, { type OpeningResult } from './hero-opening';

// A new document gets an opening. Router returns within that document do not.
const visitedDocuments = new WeakSet<Document>();
type EntryMode = 'checking' | 'opening' | 'standard' | 'resume';

const dotCount = 24;
const orbitLayouts = [
  { name: 'desktop', camera: sceneOrbit.cameraDistance },
  { name: 'mobile', camera: sceneOrbit.mobileCameraDistance },
].map(layout => ({
  name: layout.name,
  // Trigonometric rounding can differ between server and browser engines.
  points: getLoadingOrbitPoints(dotCount, layout.camera).map(point => ({
    x: Number(point.x.toFixed(3)),
    y: Number(point.y.toFixed(3)),
  })),
}));

export default function SceneLoader({ status, progress, elapsed, issue, onContinue, onOpeningHold, onDismiss }: {
  status: SceneStatus;
  progress: number;
  elapsed: number;
  issue: SceneIssue | null;
  onContinue: () => void;
  onOpeningHold: (hold: boolean) => void;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [timing, setTiming] = useState(() => getInitialSceneTiming(''));
  const [online, setOnline] = useState(true);
  const [mode, setMode] = useState<EntryMode>('checking');
  const [openingStarted, setOpeningStarted] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);
  const [scrollReleased, setScrollReleased] = useState(false);
  const entry = useRef<{ mode: EntryMode; hash: string; reduced: boolean } | null>(null);
  const focusAfterSkip = useRef(false);
  const sceneReady = status === 'ready' || status === 'fallback';
  const complete = sceneReady && mode !== 'checking' && (mode === 'opening' ? openingDone || status === 'fallback' : minimumElapsed);
  const openingActive = openingStarted && !openingDone && status === 'ready';
  const startOpening = useCallback(() => setOpeningStarted(true), []);
  const revealOpening = useCallback(() => { setScrollReleased(true); onOpeningHold(false); }, [onOpeningHold]);
  const finishOpening = useCallback((result: OpeningResult) => {
    focusAfterSkip.current = result === 'skipped';
    setOpeningDone(true); onOpeningHold(false);
  }, [onOpeningHold]);
  const value = sceneReady ? 100 : Math.max(0, Math.min(99, progress));
  const filledDots = Math.floor(value / 100 * dotCount);
  const delayed = elapsed >= sceneLoadingTiming.delayMs / 1000;
  const notice = sceneReady ? '' : issue?.message || (!online
    ? '인터넷 연결이 끊겼습니다. 연결 상태를 확인해 주세요.'
    : delayed ? '3D 콘텐츠 로딩이 지연되고 있습니다. 네트워크 상태를 확인해 주세요.' : '');
  const retry = () => window.location.reload();

  useEffect(() => {
    if (!entry.current) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const initialPath = new URL(navigation?.name || window.location.href).pathname;
      const claimed = visitedDocuments.has(document);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hash = getNavigationHash(window);
      const options = { claimed, initialPath, navigationType: navigation?.type || 'navigate', hash, scrollY: window.scrollY, reduced };
      const nextMode = shouldPlayHomeOpening(options) ? 'opening' : claimed || initialPath !== '/' || navigation?.type === 'back_forward' ? 'resume' : 'standard';
      entry.current = { mode: nextMode, hash, reduced };
      visitedDocuments.add(document);
    }
    const decision = entry.current;
    setMode(decision.mode);
    onOpeningHold(decision.mode === 'opening');
    if (decision.mode === 'resume') { setVisible(false); return; }
    const initial = decision.reduced ? { minimumMs: 0, fadeMs: 0 } : getInitialSceneTiming(decision.hash);
    const timer = window.setTimeout(() => {
      setTiming(initial);
      setMinimumElapsed(true);
    }, initial.minimumMs);
    return () => window.clearTimeout(timer);
  }, [onOpeningHold]);

  useEffect(() => {
    if (status === 'error' || status === 'timeout' || status === 'fallback') {
      const timer = window.setTimeout(() => { setOpeningDone(true); onOpeningHold(false); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status, onOpeningHold]);

  useEffect(() => {
    if (!visible) onDismiss();
  }, [visible, onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || complete || scrollReleased || entry.current?.mode === 'resume') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Restore the scrollbar when the reveal starts, before the page is visible.
    return () => { document.body.style.overflow = previousOverflow; };
  }, [visible, complete, scrollReleased]);

  useEffect(() => {
    if (!visible || entry.current?.mode === 'resume') return;
    const page = document.getElementById('home');
    const previousInert = page?.inert ?? false;
    if (page) page.inert = true;
    return () => {
      if (page) page.inert = previousInert;
      // Initial fragment navigation may run before the loader releases the
      // scroll lock. Use the untransformed section anchor once it is released.
      const hash = getNavigationHash(window);
      const section = resolveSiteSection(hash.slice(1));
      if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (focusAfterSkip.current && (!hash || hash === '#home')) page?.focus({ preventScroll: true });
    };
  }, [visible]);

  useEffect(() => {
    if (!complete) return;
    const delay = mode === 'opening' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : timing.fadeMs;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [complete, mode, timing.fadeMs]);

  if (!visible) return null;

  return (
    <>
    <div className={`scene-loader${complete ? ' is-complete' : ''}`} data-opening-active={openingActive || undefined} style={{ transitionDuration: `${mode === 'opening' ? 0 : timing.fadeMs}ms` }}>
      {mode === 'opening' && !openingDone && (status === 'loading' || status === 'ready') && <HeroOpening ready={status === 'ready'} onStart={startOpening} onReveal={revealOpening} onComplete={finishOpening}/>}
      <div className="scene-loader-content">
        <img className="scene-loader-logo" src="/images/onoff-logo.png" alt="ON&OFF" width={110} height={55} fetchPriority="high"/>
        <div className="scene-loader-progress">
          <div className="scene-loader-orbit">
            <svg className="scene-loader-ring" viewBox="0 0 360 180" aria-hidden="true">
              {orbitLayouts.map(layout => (
                <g key={layout.name} className={`scene-loader-points-${layout.name}`}>
                  {layout.points.map((point, index) => <circle key={index} className={`scene-loader-dot${index < filledDots ? ' is-filled' : ''}`} cx={point.x} cy={point.y} r={3.6}/>)}
                </g>
              ))}
            </svg>
          </div>
          <Progress className="sr-only" value={value} aria-label="화면 준비 진행률"/>
          {notice ? <p className="scene-loader-error" role="alert"><CircleAlert aria-hidden="true"/><span>{notice}</span></p> : <output className="scene-loader-label" aria-live="polite">{sceneReady ? (status === 'ready' ? '3D 공간이 준비되었습니다' : '화면이 준비되었습니다') : '3D 공간을 구성하는 중입니다'}</output>}
          {delayed && !sceneReady && <p className="scene-loader-timer">대기 시간 <span role="timer" aria-live="off">{formatSceneWait(elapsed)}</span><span className="scene-loader-limit">/ 최대 05:00</span></p>}
          {notice && status !== 'timeout' && <div className="scene-loader-actions">
            <Button className="scene-loader-retry" onClick={retry}>다시 시도</Button>
            <Button className="scene-loader-continue" variant="ghost" onClick={onContinue}>기본 화면 보기</Button>
          </div>}
        </div>
      </div>
    </div>
    <AlertDialog open={status === 'timeout'} onOpenChange={open => { if (!open) onContinue(); }}>
      <AlertDialogContent className="scene-load-dialog">
        <span className="scene-load-dialog-icon"><CircleAlert aria-hidden="true" strokeWidth={1.6}/></span>
        <AlertDialogTitle className="scene-load-dialog-title">3D 화면을 불러오지 못했습니다</AlertDialogTitle>
        <AlertDialogDescription className="scene-load-dialog-description">5분 동안 기다렸지만 3D 콘텐츠를 불러오지 못했습니다.<br/><br/>인터넷 연결 상태를 확인한 뒤 다시 시도해 주세요. 기본 화면으로도 사이트를 이용하실 수 있습니다.</AlertDialogDescription>
        <div className="scene-load-dialog-actions">
          <AlertDialogCancel className="scene-loader-continue">기본 화면 보기</AlertDialogCancel>
          <AlertDialogAction className="scene-loader-retry" onClick={retry}>다시 시도</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
