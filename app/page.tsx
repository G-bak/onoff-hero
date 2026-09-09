'use client';

import { useState } from 'react';
import CardRibbon from './components/card-ribbon';
import Wordmark from './components/wordmark';
import NewsRecruitmentLink from './components/news-recruitment-link';
import ConsultationChat from './components/consultation-chat';
import SceneLoader, { type SceneStatus } from './components/scene-loader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const contact = 'mailto:onoff3739@naver.com';
const temporaryCompany = {
  representative: '홍길동',
  address: '서울특별시 ○○구 ○○로 123, 3층',
  phone: '02-0000-0000',
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18L18 6M6 6H18V18' : 'M4 12H20M13 5L20 12L13 19'} stroke="currentColor" strokeWidth="1.5"/></svg>;
}

function CompanyDetails() {
  return (
    <div className="company-details">
      <dl className="company-facts">
        <div><dt>대표자</dt><dd>{temporaryCompany.representative}</dd></div>
        <div><dt>전화</dt><dd>{temporaryCompany.phone}</dd></div>
        <div className="company-address"><dt>주소</dt><dd>{temporaryCompany.address}</dd></div>
        <div><dt>이메일</dt><dd><a className="header-email" href={contact}>onoff3739@naver.com</a></dd></div>
      </dl>
    </div>
  );
}

export default function Home() {
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('loading');
  const directionLabel = direction === 1 ? '왼쪽에서 오른쪽' : '오른쪽에서 왼쪽';
  return (
    <>
    <main className={`hero${paused ? ' is-paused' : ''}`} id="home" aria-busy={sceneStatus === 'loading'}>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="ON&OFF home">
          <img className="brand-logo" src="/images/onoff-logo.png" alt="ON&OFF" width={96} height={48} fetchPriority="high"/>
        </a>
        <div className="header-colophon" aria-label="회사 정보">
          <div className="colophon-meta">
            <p className="header-copyright">
              <span className="copyright-title"><span>© 2026</span><span>ON&OFF</span></span>
              <span className="copyright-rights">ALL RIGHTS RESERVED.</span>
            </p>
          </div>
          <CompanyDetails/>
        </div>
        <NewsRecruitmentLink>News & Recruitment <Arrow diagonal/></NewsRecruitmentLink>
      </header>

      <div className="hero-kicker"><span className="status-dot"/> ALL-IN-ONE CREATIVE AGENCY</div>

      <Wordmark />

      <div className="scene-track" aria-hidden="true"/>
      <div className="scene-index" aria-hidden="true"><span>O—O</span><span>ONE TEAM.<br/>MANY MINDS.</span></div>
      <CardRibbon paused={paused} direction={direction} onTogglePause={() => setPaused(value => !value)} onSettled={setSceneStatus}/>
      <nav className="section-nav" aria-label="섹션 이동">
        <ol className="section-nav-list">
          <li>
            <a className="section-nav-link" href="#home" aria-current="location" aria-label="홈 섹션으로 이동">
              <span className="section-nav-number" aria-hidden="true">01</span>
              <span className="section-nav-label">HOME</span>
              <span className="section-nav-track" aria-hidden="true"/>
            </a>
          </li>
        </ol>
      </nav>

      <footer className="hero-footer">
        <div className="hero-copy">
          <p className="hero-caption">당신은 사업만 <span className="hero-caption-emphasis">ON</span>.<br/>복잡한 마케팅은 <span className="hero-caption-emphasis">OFF</span>.</p>
        </div>
        <div className="motion-control">
          <span id="motion-label">MOTION</span>
          <Switch className="motion-switch" checked={!paused} onCheckedChange={playing => setPaused(!playing)} aria-labelledby="motion-label"/>
          <span className="motion-state" aria-hidden="true">{paused ? 'OFF' : 'ON'}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="direction-toggle"
            aria-label="카드 회전 방향 전환"
            aria-pressed={direction === -1}
            title={`회전 방향 전환 · 현재 ${directionLabel}`}
            onClick={() => setDirection(value => value === 1 ? -1 : 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8H20M16 4L20 8L16 12M20 16H4M8 12L4 16L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <span className="sr-only" role="status">현재 회전 방향: {directionLabel}</span>
        </div>
        <ConsultationChat/>
      </footer>
    </main>
    <SceneLoader status={sceneStatus} direction={direction}/>
    <noscript><style>{'.scene-loader { display: none !important; }'}</style></noscript>
    </>
  );
}
