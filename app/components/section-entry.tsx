'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { getSectionEntry, getSectionScrollLength } from '@/lib/section-entry';
import type { SectionTransition } from '@/lib/site-sections';

export default function SectionEntry({ id, legacyId, front, children, onCovered, onNavigation, scrollRatio = 1 }: {
  id: string;
  legacyId?: string;
  front: ReactNode;
  children: ReactNode;
  onCovered?: (covered: boolean) => void;
  onNavigation: (transition: SectionTransition) => void;
  scrollRatio?: number;
}) {
  const turnRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Establish the real section anchors during commit, before the router reads
  // a destination hash or restores history scroll in its queued microtask.
  useLayoutEffect(() => {
    const turn = turnRef.current;
    const sheet = sheetRef.current;
    const back = backRef.current;
    const anchor = anchorRef.current;
    if (!turn || !sheet || !back) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let disposed = false;
    let covered: boolean | undefined;
    let currentSection: 'home' | 'why' | undefined;
    let progress: number | undefined;

    function update() {
      frame = null;
      if (!turn || !sheet || !back) return;
      turn.classList.toggle('is-enhanced', !reduced.matches);
      const width = sheet.offsetWidth;
      const height = sheet.offsetHeight;
      turn.style.setProperty('--page-front-height', `${height}px`);
      // Use the CSS sticky inset so mobile browser chrome cannot change the
      // turn endpoint relative to the stable #why anchor (100svh).
      const stickyTop = sheet.parentElement ? Number.parseFloat(getComputedStyle(sheet.parentElement).top) || 0 : 0;
      const viewportHeight = reduced.matches ? window.innerHeight : height + Math.min(0, stickyTop);
      const state = getSectionEntry(-turn.getBoundingClientRect().top, viewportHeight, height, width, reduced.matches, scrollRatio);
      turn.style.setProperty('--page-scroll-height', `${state.scrollLength}px`);
      // A nested back is sticky before its turn. Keep its anchor at the final
      // document position instead of allowing the sticky offset to move it.
      if (anchor && !reduced.matches) {
        let root = turn;
        let offset = state.scrollLength;
        let parent = root.parentElement?.closest<HTMLDivElement>('.page-turn');
        while (parent) {
          const parentSheet = parent.querySelector<HTMLElement>(':scope > .page-turn-front-track > .page-turn-front > .page-turn-sheet');
          const parentHeight = parentSheet?.offsetHeight ?? 0;
          const parentInset = parentSheet?.parentElement ? Number.parseFloat(getComputedStyle(parentSheet.parentElement).top) || 0 : 0;
          offset += getSectionScrollLength(parentHeight + Math.min(0, parentInset), parentHeight, Number(parent.dataset.scrollRatio) || 1);
          root = parent;
          parent = root.parentElement?.closest<HTMLDivElement>('.page-turn');
        }
        anchor.style.top = `${offset + root.getBoundingClientRect().top - turn.getBoundingClientRect().top}px`;
      } else anchor?.style.removeProperty('top');
      turn.classList.toggle('is-turning', state.turning);
      turn.classList.toggle('is-turned', state.covered);
      sheet.style.transform = !reduced.matches && state.progress > 0
        ? `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)` : '';
      back.inert = !reduced.matches && !state.covered;
      sheet.inert = state.covered;
      if (progress !== state.progress || currentSection !== state.currentSection) {
        progress = state.progress;
        currentSection = state.currentSection;
        onNavigation({ progress, backActive: currentSection === 'why' });
      }
      if (covered !== state.covered) {
        covered = state.covered;
        onCovered?.(covered);
      }
    }

    function schedule() {
      if (document.hidden || frame !== null) return;
      frame = requestAnimationFrame(update);
    }

    function visibilityChanged() {
      if (document.hidden) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
      } else schedule();
    }

    function revealFocusedControl(event: FocusEvent) {
      if (!turn || !sheet || !turn.classList.contains('is-turning') || !(event.target instanceof HTMLElement)) return;
      const target = event.target;
      const bounds = target.getBoundingClientRect();
      const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      if (hit && target.contains(hit)) return;
      // Keyboard navigation must not leave focus outside the departing page.
      // Keep a tall page's footer in view when restoring its initial position.
      window.scrollTo({top: window.scrollY + turn.getBoundingClientRect().top + Math.max(0, sheet.offsetHeight - window.innerHeight), behavior: 'instant'});
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(sheet);
    observer.observe(back);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', visibilityChanged);
    sheet.addEventListener('focusin', revealFocusedControl);
    update();
    // Child effects run before parent effects. Re-measure once all ancestors
    // have acquired their sticky layout, still before the router's scroll job.
    queueMicrotask(() => { if (!disposed) update(); });

    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      document.removeEventListener('visibilitychange', visibilityChanged);
      sheet.removeEventListener('focusin', revealFocusedControl);
      turn.classList.remove('is-enhanced', 'is-turning', 'is-turned');
      sheet.style.transform = '';
      sheet.inert = false;
      back.inert = false;
      turn.style.removeProperty('--page-front-height');
      turn.style.removeProperty('--page-scroll-height');
      anchor?.style.removeProperty('top');
    };
  }, [onCovered, onNavigation, scrollRatio]);

  useLayoutEffect(() => {
    if (!legacyId) return;
    function normalizeHash() {
      if (window.location.hash !== `#${legacyId}`) return;
      // Keep the router's history state and saved scroll; the colocated alias
      // handles native fragment scrolling, including without JavaScript.
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${id}`);
    }
    normalizeHash();
    window.addEventListener('hashchange', normalizeHash);
    return () => window.removeEventListener('hashchange', normalizeHash);
  }, [id, legacyId]);

  return <div className="page-turn" data-next-section={id} data-scroll-ratio={scrollRatio} ref={turnRef}>
    <div className="page-turn-front-track">
      <div className="page-turn-front">
        <div className="page-turn-sheet" ref={sheetRef}>{front}</div>
      </div>
    </div>
    <div className="section-entry" id={id} ref={anchorRef} tabIndex={-1}>
      {legacyId && <span id={legacyId} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>}
    </div>
    <div className="page-turn-back-track">
      <div className="section-surface" ref={backRef}>{children}</div>
      <div className="page-turn-runway" aria-hidden="true"/>
    </div>
  </div>;
}
