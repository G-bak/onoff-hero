'use client';

import { useEffect, useState, type RefObject } from 'react';

// DOM visibility and inert are independent of a chapter's navigation state.
// In particular, the initial loader and a turning foreground sheet can cover it.
export function useSceneActivity(host: RefObject<HTMLElement | null>, {
  active, paused, covered, duringTransition = false,
}: { active: boolean; paused: boolean; covered: boolean; duringTransition?: boolean }) {
  const [environment, setEnvironment] = useState({ visible: false, reduced: true });
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let intersects = false;
    const update = () => {
      const lock = element.closest<HTMLElement>('[inert]');
      // Opt-in decorative media may move while the preceding sheet turns away.
      // The page's input stays inert, and the global loading lock still wins.
      const transitionLock = duringTransition && !!lock?.classList.contains('section-surface') && !element.closest<HTMLElement>('main')?.inert;
      const visible = intersects && !document.hidden && (!lock || transitionLock);
      setEnvironment(previous => previous.visible === visible && previous.reduced === reduced.matches
        ? previous : { visible, reduced: reduced.matches });
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting && entry.intersectionRatio > 0;
      update();
    }, { threshold: [0, .05] });
    observer.observe(element);
    const inertObserver = new MutationObserver(update);
    const main = element.closest('main');
    if (main) inertObserver.observe(main, { subtree: true, attributes: true, attributeFilter: ['inert'] });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect();
      inertObserver.disconnect();
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener('change', update);
    };
  }, [host, duringTransition]);
  const visible = active && !covered && environment.visible;
  return { visible, reduced: environment.reduced, motion: visible && !paused && !environment.reduced };
}
