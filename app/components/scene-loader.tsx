'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Progress } from '@/components/ui/progress';
import { loadingOrbitPath, sceneOrbit } from '@/lib/scene-orbit';

export type SceneStatus = 'loading' | 'ready' | 'fallback';

const desktopOrbit = loadingOrbitPath();
const mobileOrbit = loadingOrbitPath(sceneOrbit.mobileCameraDistance);
// One dash period is 1/50 of the circumference. Increasing the path angle
// moves the front dots left to right, just like the card ribbon.
const dashPeriodSeconds = (Math.PI * 2 / sceneOrbit.angularSpeed) / 50;

export default function SceneLoader({ status, direction }: { status: SceneStatus; direction: 1 | -1 }) {
  const [visible, setVisible] = useState(true);
  const complete = status !== 'loading';

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
    <div className={`scene-loader${complete ? ' is-complete' : ''}`} style={{ '--orbit-period': `${dashPeriodSeconds}s`, '--orbit-direction': direction === 1 ? 'normal' : 'reverse' } as CSSProperties}>
      <div className="scene-loader-content">
        <div className="scene-loader-orbit">
          <svg className="scene-loader-ring" viewBox="0 0 360 180" fill="none" aria-hidden="true">
            <path className="scene-loader-dots scene-loader-dots-desktop" d={desktopOrbit} pathLength={1000}/>
            <path className="scene-loader-dots scene-loader-dots-mobile" d={mobileOrbit} pathLength={1000}/>
          </svg>
          <img className="scene-loader-logo" src="/images/onoff-logo.png" alt="ON&OFF" width={110} height={55} fetchPriority="high"/>
        </div>
        <div className="scene-loader-progress">
          <div className="scene-loader-meta" aria-hidden="true"><span>ON&OFF</span><span>{complete ? 'READY' : 'LOADING'}</span></div>
          <Progress className="sr-only" value={complete ? 100 : null} aria-label="화면 로딩"/>
          <p className="scene-loader-label" role="status" aria-live="polite">{complete ? '화면이 준비되었습니다' : '화면을 불러오고 있습니다'}</p>
        </div>
      </div>
    </div>
  );
}
