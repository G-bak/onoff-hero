'use client';

import { useEffect, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getLoadingOrbitPoints, sceneOrbit } from '@/lib/scene-orbit';
import { formatSceneWait, sceneLoadingTiming, type SceneIssue, type SceneStatus } from '@/lib/scene-loading';

const dotCount = 24;
const orbitLayouts = [
  { name: 'desktop', camera: sceneOrbit.cameraDistance },
  { name: 'mobile', camera: sceneOrbit.mobileCameraDistance },
].map(layout => ({
  name: layout.name,
  points: getLoadingOrbitPoints(dotCount, layout.camera),
}));

export default function SceneLoader({ status, progress, elapsed, issue, onContinue }: {
  status: SceneStatus;
  progress: number;
  elapsed: number;
  issue: SceneIssue | null;
  onContinue: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [online, setOnline] = useState(true);
  const sceneReady = status === 'ready' || status === 'fallback';
  const complete = sceneReady && minimumElapsed;
  const value = sceneReady ? 100 : Math.max(0, Math.min(99, progress));
  const filledDots = Math.floor(value / 100 * dotCount);
  const delayed = elapsed >= sceneLoadingTiming.delayMs / 1000;
  const notice = sceneReady ? '' : issue?.message || (!online
    ? '인터넷 연결이 끊겼습니다. 연결 상태를 확인해 주세요.'
    : delayed ? '3D 콘텐츠 로딩이 지연되고 있습니다. 네트워크 상태를 확인해 주세요.' : '');
  const retry = () => window.location.reload();

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumElapsed(true), sceneLoadingTiming.minimumMs);
    return () => window.clearTimeout(timer);
  }, []);

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
    if (!visible) return;
    const hero = document.getElementById('home');
    const previousOverflow = document.body.style.overflow;
    const previousInert = hero?.inert ?? false;
    document.body.style.overflow = 'hidden';
    if (hero) hero.inert = true;
    return () => {
      document.body.style.overflow = previousOverflow;
      if (hero) hero.inert = previousInert;
    };
  }, [visible]);

  useEffect(() => {
    if (!complete) return;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [complete]);

  if (!visible) return null;

  return (
    <>
    <div className={`scene-loader${complete ? ' is-complete' : ''}`}>
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
          {notice ? <p className="scene-loader-error" role="alert"><CircleAlert aria-hidden="true"/><span>{notice}</span></p> : <p className="scene-loader-label" role="status" aria-live="polite">{sceneReady ? (status === 'ready' ? '3D 공간이 준비되었습니다' : '화면이 준비되었습니다') : '3D 공간을 구성하는 중입니다'}</p>}
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
