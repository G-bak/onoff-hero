'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getSectionEntry } from '@/lib/section-entry';

export default function SectionEntry({ id, front, children, onCovered, onSectionChange, onProgress }: {
  id: string;
  front: ReactNode;
  children: ReactNode;
  onCovered: (covered: boolean) => void;
  onSectionChange: (section: 'home' | 'why') => void;
  onProgress: (progress: number) => void;
}) {
  const turnRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const turn = turnRef.current;
    const sheet = sheetRef.current;
    const back = backRef.current;
    if (!turn || !sheet || !back) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let covered: boolean | undefined;
    let currentSection: 'home' | 'why' | undefined;
    let progress: number | undefined;

    function update() {
      frame = null;
      if (!turn || !sheet || !back) return;
      turn.classList.toggle('is-enhanced', !reduced.matches);
      const width = sheet.offsetWidth;
      const height = sheet.offsetHeight;
      // Use the CSS sticky inset so mobile browser chrome cannot change the
      // turn endpoint relative to the stable #why anchor (100svh).
      const stickyTop = sheet.parentElement ? Number.parseFloat(getComputedStyle(sheet.parentElement).top) || 0 : 0;
      const viewportHeight = reduced.matches ? window.innerHeight : height + Math.min(0, stickyTop);
      const state = getSectionEntry(-turn.getBoundingClientRect().top, viewportHeight, height, width, reduced.matches);
      turn.classList.toggle('is-turning', state.turning);
      turn.classList.toggle('is-turned', state.covered);
      // Replay the heading accents only after a complete return to HOME.
      // Small reverse scrolls near the turn endpoint must not erase them.
      if (state.covered) turn.classList.add('is-why-revealed');
      else if (state.progress === 0) turn.classList.remove('is-why-revealed');
      sheet.style.transform = !reduced.matches && state.progress > 0
        ? `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)` : '';
      back.inert = !reduced.matches && !state.covered;
      if (progress !== state.progress) {
        progress = state.progress;
        onProgress(progress);
      }
      if (covered !== state.covered) {
        covered = state.covered;
        onCovered(covered);
      }
      if (currentSection !== state.currentSection) {
        currentSection = state.currentSection;
        onSectionChange(currentSection);
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

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      document.removeEventListener('visibilitychange', visibilityChanged);
      sheet.removeEventListener('focusin', revealFocusedControl);
      turn.classList.remove('is-enhanced', 'is-turning', 'is-turned', 'is-why-revealed');
      sheet.style.transform = '';
      back.inert = false;
    };
  }, [onCovered, onSectionChange, onProgress]);

  return <div className="page-turn" ref={turnRef}>
    <div className="page-turn-front-track">
      <div className="page-turn-front">
        <div className="page-turn-sheet" ref={sheetRef}>{front}</div>
      </div>
    </div>
    <div className="section-entry" id={id} tabIndex={-1}/>
    <div className="page-turn-back-track">
      <div className="section-surface" ref={backRef}>{children}</div>
      <div className="page-turn-runway" aria-hidden="true"/>
    </div>
  </div>;
}
