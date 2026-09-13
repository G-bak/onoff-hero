'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { services } from '@/lib/services';
import Link from './page-link';
import { useSceneActivity } from './use-scene-activity';
import ServiceArtwork from './service-artwork';
import { Button } from '@/components/ui/button';
import { ServiceArrow } from './service-arrow';

export default function ServicesSection({ active = true, paused = false }: { active?: boolean; paused?: boolean }) {
  const host = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [assets, setAssets] = useState<'pending' | 'ready' | 'error'>('pending');
  const [attempt, setAttempt] = useState(0);
  const { visible, reduced, motion } = useSceneActivity(host, { active, paused, covered: false, duringTransition: true });
  useEffect(() => {
    if (!active || !host.current) return;
    let cancelled = false, frame: number | null = null;
    const images = Array.from(host.current.querySelectorAll<HTMLImageElement>('.services-art-slot img'));
    const finish = (state: 'ready' | 'error') => {
      window.clearTimeout(timeout);
      if (cancelled) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = null; if (!cancelled) setAssets(state); });
    };
    const timeout = window.setTimeout(() => finish('error'), 12000);
    // Warm every selectable print on approach; a later hover must never expose
    // an undecoded picture or restart the opening animation.
    images.forEach(image => {
      image.loading = 'eager';
      if (attempt > 0 && image.complete && !image.naturalWidth) {
        const source = image.currentSrc || image.src;
        image.src = source;
      }
    });
    void Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]).then(results => {
      finish(results.some(result => result.status === 'rejected') ? 'error' : 'ready');
    });
    return () => { cancelled = true; window.clearTimeout(timeout); if (frame !== null) cancelAnimationFrame(frame); };
  }, [active, attempt]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    element.dataset.enhanced = 'true';
    if (!active) element.dataset.entered = 'false';
    else if (visible && assets !== 'pending') element.dataset.entered = 'true';
    element.dataset.still = String(reduced || paused);
    element.dataset.motion = String(motion);
  }, [active, visible, reduced, motion, paused, assets]);
  return <section className="services-index" ref={host} aria-labelledby="services-heading" data-selected={selected} data-ready={assets !== 'pending'} data-assets={assets}>
    <output className="services-loading"><span>ON&OFF</span><i aria-hidden="true"/><span>서비스 화면을 준비하고 있어요</span></output>
    <div className="services-edition"><span>ON&OFF / THE SERVICE DESK</span><span>06 / PICK YOUR NEXT</span></div>
    <div className="services-heading-row">
      <h2 id="services-heading"><span aria-hidden="true">{'SERVICES'.split('').map((letter, index) => <span className="services-title-letter" style={{ '--letter': index } as CSSProperties} key={index}>{letter}</span>)}</span><span className="services-heading-accessible">서비스 안내</span><span className="services-heading-star" aria-hidden="true">✳</span></h2>
      <p>한 가지 작업부터 통합 운영까지.<br/><strong>필요한 서비스를 골라보세요.</strong></p>
    </div>
    <div className="services-layout">
      <div className="services-preview">
        <div className="services-preview-top"><span>THE NEXT CHAPTER</span><span>0{selected + 1} / 05</span></div>
        <div className="services-art-stage">{services.map((service, index) => <div className="services-art-slot" data-active={selected === index} key={service.slug}><ServiceArtwork index={index} eager={index === 0}/></div>)}{assets === 'error' && <div className="services-image-error"><p>이미지를 불러오지 못했어요</p><Button variant="ghost" onClick={() => { setAssets('pending'); setAttempt(value => value + 1); }}>다시 불러오기 ↗</Button></div>}</div>
        <div className="services-preview-bottom"><span>CONCEPT VISUAL / ON&OFF</span><span>기획부터 운영까지, 한 팀으로.</span></div>
      </div>
      <ol className="services-list">
        {services.map((service, index) => <li key={service.slug} style={{ '--row': index } as CSSProperties} data-selected={selected === index}>
          <Link className="service-link" href={`/services/${service.slug}`} prefetch={false} onPointerEnter={() => setSelected(index)} onFocus={() => setSelected(index)}>
            <span className="service-number">{service.number}</span>
            <div className="service-link-content"><span className="service-english">{service.english}</span><div className="service-link-description"><h3>{service.name}</h3><span className="service-short">{service.short}</span></div></div>
            <span className="service-link-arrow"><ServiceArrow/></span>
          </Link>
        </li>)}
      </ol>
    </div>
    <div className="services-footer"><span>LET’S MAKE YOUR NEXT.</span><span>소개 · 필요성 · 기대 효과 · 가격 정책</span></div>
    <noscript><style>{'.services-index .services-loading{display:none!important}.services-index[data-ready="false"]>:not(.services-loading){visibility:visible!important}'}</style></noscript>
  </section>;
}
