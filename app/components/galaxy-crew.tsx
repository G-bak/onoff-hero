'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { galaxyServices } from '@/lib/galaxy';
import { crewPoseCount, crewFrameWidth, crewFrameHeight } from '@/lib/galaxy-crew';
import teamAtlasUrl from '@/app/assets/generated/team-atlas.webp?url';

export default function GalaxyCrew({ active, spriteUrl }: { active: boolean; spriteUrl: string }) {
  const [decodedUrl, setDecodedUrl] = useState<string | null>(null);
  const ready = decodedUrl === spriteUrl;
  useEffect(() => {
    if (!active || ready) return;
    let cancelled = false;
    const image = new Image();
    image.src = spriteUrl;
    image.decode().then(() => {
      if (!cancelled) setDecodedUrl(spriteUrl);
    }).catch(() => {
      // Retain the existing front poses if the motion atlas
      // cannot be decoded. Never replace five people with empty rectangles.
    });
    return () => { cancelled = true; };
  }, [active, ready, spriteUrl]);

  return <div className="galaxy-crew-figures" aria-hidden="true" data-ready={ready} style={{
    '--crew-columns': crewPoseCount,
    '--crew-rows': galaxyServices.length,
    '--crew-aspect': `${crewFrameWidth} / ${crewFrameHeight}`,
  } as CSSProperties}>
    {galaxyServices.map((service, index) => <span className="galaxy-crew-person" key={service.id}>
      <span
        className={ready ? 'galaxy-crew-sprite' : 'galaxy-crew-still'}
        style={{
          backgroundImage: `url("${ready ? spriteUrl : teamAtlasUrl}")`,
          backgroundPosition: ready ? undefined : `${service.crew % 3 * 50}% ${Math.floor(service.crew / 3) * 100}%`,
          '--crew-person-y': `${index / (galaxyServices.length - 1) * 100}%`,
        } as CSSProperties}
      />
    </span>)}
    <span className="galaxy-crew-platform"/>
  </div>;
}
