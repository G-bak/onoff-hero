'use client';

import { useEffect, useRef } from 'react';
import MarketingFallback from './marketing-fallback';
import instagramUrl from '@/app/assets/marketing/instagram-ongyeol.webp?url';
import blogUrl from '@/app/assets/marketing/blog-ruum.webp?url';
import posterUrl from '@/app/assets/marketing/poster-installed.webp?url';
import marketerUrl from '@/app/assets/marketing/marketer-no-plinth-v2.webp?url';


export default function CardShowcase({
  active,
  paused,
  covered = false,
}: {
  active: boolean;
  paused: boolean;
  covered?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null),
    hostRef = useRef<HTMLDivElement>(null),
    titleRef = useRef<HTMLHeadingElement>(null),
    formatsRef = useRef<HTMLDivElement>(null),
    marketerRef = useRef<HTMLSpanElement>(null);
  const controls = useRef({ active, paused, covered }),
    refresh = useRef<(() => void) | null>(null);
  useEffect(() => {
    controls.current = { active, paused, covered };
    refresh.current?.();
  }, [active, paused, covered]);
  useEffect(() => {
    const section = sectionRef.current,
      host = hostRef.current,
      title = titleRef.current,
      formats = formatsRef.current,
      marketer = marketerRef.current;
    if (!section || !host) return;
    let disposed = false, started = false, failed = false;
    let cleanup: (() => void) | undefined;
    let deadline: number | undefined;
    function fallback() {
      failed = true;
      section!.dataset.renderer = 'fallback';
      delete section!.dataset.enhanced;
    }
    async function prepare() {
      if (started || disposed || !controls.current.active) return;
      started = true;
      section!.dataset.enhanced = 'true';
      deadline = window.setTimeout(() => {
        if (!disposed && !cleanup) fallback();
      }, 12000);
      try {
        const { mountMarketingScene } = await import('@/lib/marketing-scene-controller');
        if (disposed || failed) return;
        cleanup = mountMarketingScene({ section: section!, host: host!, title, formats, marketer, controls, refresh });
      } catch {
        if (!disposed) fallback();
      } finally { window.clearTimeout(deadline); }
    }
    refresh.current = prepare;
    void prepare();
    return () => {
      disposed = true;
      window.clearTimeout(deadline);
      refresh.current = null;
      cleanup?.();
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      className="card-showcase"
      data-category="marketing"
      data-renderer="pending"
      aria-labelledby="marketing-showcase-heading"
    >
      <div className="card-showcase-stage">
        <div className="marketing-loading" aria-live="polite" aria-atomic="true">
          <span className="marketing-loading-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>캠페인을 펼치는 중</span><small>ON&amp;OFF / MARKETING</small>
        </div>
        <p className="card-showcase-edition">
          <span>ON&amp;OFF / SELECTED CAMPAIGNS</span>
          <span>05 / MARKETING</span>
        </p>
        <h2 className="card-showcase-title" id="marketing-showcase-heading" ref={titleRef} aria-label="MARKETING">
          <span aria-hidden="true">{'MARKETING'.split('').map((letter, index) => <span className="marketing-title-letter" key={index}>{letter}</span>)}</span>
        </h2>
        <MarketingFallback instagramUrl={instagramUrl} blogUrl={blogUrl} posterUrl={posterUrl} />
        <div className="card-showcase-canvas" ref={hostRef} />
        <div className="marketing-formats" ref={formatsRef}>
          <span>INSTAGRAM<br />인스타그램</span>
          <span>BLOG<br />블로그</span>
          <span>AD POSTER<br />광고 포스터</span>
        </div>
        <div className="marketing-director">
          <span
            className="marketing-marketer"
            ref={marketerRef}
            aria-hidden="true"
            style={{ backgroundImage: 'url("' + marketerUrl + '")' }}
          />
          <p>
            <span>CONTENT · CAMPAIGN · MANAGEMENT</span>
            <strong>
              홍보할 시간 없다면
              <br />
              온앤오프에 맡기세요
            </strong>
          </p>
        </div>
        <p className="marketing-folio">가상 브랜드 캠페인 시안</p>
        <p className="sr-only">
          왼쪽부터 온결 보습크림 인스타그램 광고, 루움의 소재·계절·세탁 방법을 다룬 이불 선택 블로그 콘텐츠,
          모닝오븐 매장 입구 입간판에 설치된 샌드위치와 아메리카노 점심 세트 광고 포스터. 세 화면이 모였다가 가로로 펼쳐집니다.
          마케터가 광고를 소개하는 제스처를 취합니다. 모두 온앤오프에서 만든
          가상 브랜드 콘셉트이며, 좋아요 수와 댓글은 시안용 예시입니다.
        </p>
      </div>
      <noscript><style>{`.card-showcase[data-renderer='pending'] .card-showcase-stage > :not(.marketing-loading) { visibility: visible; } .marketing-loading { display: none !important; } @media (max-width:700px) { body:has(#card:target) .chat-launcher-label { display:none; } body:has(#card:target) .chat-launcher { padding:4px; gap:0; } }`}</style></noscript>
    </section>
  );
}
