'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSceneActivity } from './use-scene-activity';
import { createSceneFrameLoop } from '@/lib/scene-frame-loop';
import { getPersonFrame } from '@/lib/person-motion';

export default function PersonMotion({ src, kind, className, active, paused, covered }: {
  src: string; kind: 'dance' | 'writing'; className: string; active: boolean; paused: boolean; covered: boolean;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const { motion, reduced } = useSceneActivity(host, { active, paused, covered, duringTransition: kind === 'dance' });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const loaded = ready;

  useEffect(() => { elapsed.current = 0; }, [kind, src]);

  useEffect(() => {
    const sheet = sheetRef.current, element = host.current;
    if (!sheet || !element) return;
    const columns = kind === 'dance' ? 8 : 12;
    const still = reduced && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousFrame = -1;
    const paint = () => {
      const frame = getPersonFrame(kind, elapsed.current, still);
      if (frame === previousFrame) return;
      sheet.style.transform = `translateX(${-frame * 100 / columns}%)`;
      element.dataset.frame = String(frame);
      element.dataset.motionTime = String(Math.round(elapsed.current));
      previousFrame = frame;
    };
    paint();
    if (!motion || !loaded || reduced) return;
    // Same clock and real-pose selection method as the approved marketer.
    // Pausing disposes the scheduler without resetting the gesture's time.
    const loop = createSceneFrameLoop(delta => {
      elapsed.current += delta * 1000;
      paint();
      return true;
    });
    loop.invalidate();
    return () => loop.dispose();
  }, [kind, src, motion, reduced, loaded]);

  return (
    <span className={`person-motion ${className}`} ref={host} aria-hidden="true"
      data-kind={kind} data-ready={loaded} data-playing={motion && loaded} data-still={reduced} data-failed={failed}>
      <span className="person-motion-clip">
        <span className="person-motion-sheet" ref={sheetRef}>
          <Image src={src} width={kind === 'dance' ? 1920 : 3456} height={kind === 'dance' ? 320 : 288}
            alt="" loading="lazy" unoptimized onLoad={() => setReady(true)} onError={() => setFailed(true)} />
        </span>
      </span>
    </span>
  );
}
