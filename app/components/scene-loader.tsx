'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { getLoadingOrbitPoints, sceneOrbit } from '@/lib/scene-orbit';

export type SceneStatus = 'loading' | 'ready' | 'fallback';

const dotCount = 24;
const orbitLayouts = [
  { name: 'desktop', camera: sceneOrbit.cameraDistance },
  { name: 'mobile', camera: sceneOrbit.mobileCameraDistance },
].map(layout => ({
  name: layout.name,
  points: getLoadingOrbitPoints(dotCount, layout.camera),
}));

export default function SceneLoader({ status, progress }: { status: SceneStatus; progress: number }) {
  const [visible, setVisible] = useState(true);
  const complete = status !== 'loading';
  const value = complete ? 100 : Math.max(0, Math.min(99, progress));
  const filledDots = Math.floor(value / 100 * dotCount);

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
          <p className="scene-loader-label" role="status" aria-live="polite">{complete ? '화면이 준비되었습니다' : '화면을 불러오고 있습니다'}</p>
        </div>
      </div>
    </div>
  );
}
