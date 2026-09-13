'use client';
import { useEffect, useRef, type ReactNode } from 'react';

export default function ServiceDetailMotion({ slug, children }: { slug: string; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let cancelled = false, frame: number | null = null;
    const entries = root.querySelectorAll<HTMLElement>('[data-service-reveal]');
    const navLinks = root.querySelectorAll<HTMLAnchorElement>('.service-detail-nav a');
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.service-content-section'));
    // Observe the untransformed chapter, not its clipped children: an entirely
    // clipped element has no intersection and can otherwise never reveal itself.
    const reveal = new IntersectionObserver(items => {
      for (const item of items) if (item.isIntersecting) {
        item.target.querySelectorAll<HTMLElement>('[data-service-reveal]').forEach((entry, index) => {
          entry.style.transitionDelay = `${Math.min(index, 3) * 70}ms`;
          entry.dataset.revealed = 'true';
        });
        reveal.unobserve(item.target);
      }
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    root.querySelectorAll('.service-hero-layout, .service-content-section, .service-inquiry').forEach(section => reveal.observe(section));
    function paint() {
      frame = null;
      if (!root || cancelled) return;
      root.style.setProperty('--reading-progress', String(Math.max(0, Math.min(1, scrollY / Math.max(1, root.scrollHeight - innerHeight)))));
      root.style.setProperty('--hero-drift', `${Math.min(65, scrollY * .12)}px`);
      let current = sections[0]?.id;
      for (const section of sections) if (section.getBoundingClientRect().top <= 180) current = section.id;
      navLinks.forEach(link => {
        if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function schedule() { if (!document.hidden && frame === null) frame = requestAnimationFrame(paint); }
    const environment = () => {
      root.dataset.still = String(reduced.matches);
      root.dataset.paused = String(document.hidden);
      if (reduced.matches) entries.forEach(entry => { entry.dataset.revealed = 'true'; });
      if (!document.hidden) schedule();
      else if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
    };
    const ready = () => { if (!cancelled) { root.dataset.ready = 'true'; environment(); } };
    const deadline = window.setTimeout(ready, 2400);
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('.service-hero-art img'));
    void Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]).then(ready);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', environment);
    reduced.addEventListener('change', environment);
    environment();
    return () => {
      cancelled = true; window.clearTimeout(deadline); if (frame !== null) cancelAnimationFrame(frame);
      reveal.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', environment); reduced.removeEventListener('change', environment);
    };
  }, [slug]);
  return <div className="service-detail" data-service={slug} data-ready="false" ref={host}>
    <output className="service-opening"><span>ON&OFF</span><i/><span>화면을 준비하고 있어요</span></output>
    {children}
    <noscript><style>{'.service-detail[data-ready="false"] .service-opening{display:none}.service-detail[data-ready="false"] main{visibility:visible}.service-detail [data-service-reveal]{clip-path:none!important;transform:none!important;opacity:1!important}.service-detail .service-headline-line>span{transform:none!important}.service-detail .service-hero-art{transform:none!important;opacity:1!important}'}</style></noscript>
  </div>;
}
