'use client';

import { useCallback, useRef, useState } from 'react';
import CardRibbon from './components/card-ribbon';
import Wordmark from './components/wordmark';
import NewsRecruitmentLink from './components/news-recruitment-link';
import SiteControls from './components/site-controls';
import SceneLoader from './components/scene-loader';
import SceneRecoveryNotice from './components/scene-recovery-notice';
import SectionEntry from './components/section-entry';
import WhySection from './components/why-section';
import type { SceneIssue, SceneStatus } from '@/lib/scene-loading';
import type { SceneRecoveryStatus, SceneRuntimeStatus } from '@/lib/scene-recovery';
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
  const pageRef = useRef<HTMLElement>(null);
  const handleSectionProgress = useCallback((progress: number) => {
    pageRef.current?.style.setProperty('--section-progress', String(progress));
  }, []);
  const [paused, setPaused] = useState(false);
  const [heroCovered, setHeroCovered] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'why'>('home');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('loading');
  const [sceneProgress, setSceneProgress] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [sceneIssue, setSceneIssue] = useState<SceneIssue | null>(null);
  const [sceneRuntime, setSceneRuntime] = useState<SceneRuntimeStatus>('ready');
  const [sceneAttempt, setSceneAttempt] = useState(0);
  const handleSceneError = useCallback((issue: SceneIssue) => {
    setSceneIssue(issue);
    setSceneStatus(issue.kind === 'timeout' ? 'timeout' : 'error');
    setSceneRuntime(current => current === 'ready' ? current : 'fallback');
  }, []);
  const handleSceneReady = useCallback(() => {
    setSceneStatus('ready');
    setSceneRuntime('ready');
    setSceneIssue(null);
  }, []);
  const handleRecoveryChange = useCallback((status: SceneRecoveryStatus) => {
    setSceneRuntime(status);
    if (status === 'fallback') setSceneStatus('fallback');
  }, []);
  const continueWithBasic = useCallback(() => {
    setSceneRuntime('fallback');
    setSceneStatus('fallback');
  }, []);
  const retryScene = useCallback(() => {
    setSceneRuntime('retrying');
    setSceneStatus('loading');
    setSceneIssue(null);
    setSceneProgress(0);
    setSceneElapsed(0);
    setSceneAttempt(attempt => attempt + 1);
  }, []);
  const canControlScene = sceneStatus === 'ready' && sceneRuntime === 'ready';
  const directionLabel = direction === 1 ? '왼쪽에서 오른쪽' : '오른쪽에서 왼쪽';
  return (
    <>
    <main className="site-pages" id="home" ref={pageRef}>
    <SectionEntry id="why" onCovered={setHeroCovered} onSectionChange={setCurrentSection} onProgress={handleSectionProgress} front={
    <section className={`hero${paused ? ' is-paused' : ''}`} aria-label="ON&OFF 소개" aria-busy={sceneStatus === 'loading'} inert={heroCovered}>
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
      <div className="hero-copy">
        <p className="hero-caption">당신은 사업만 <span className="hero-caption-emphasis">ON</span><br/>복잡한 마케팅은 <span className="hero-caption-emphasis">OFF</span></p>
      </div>
      <CardRibbon key={sceneAttempt} paused={paused} active={!heroCovered} direction={direction} enabled={sceneStatus !== 'fallback' && sceneRuntime !== 'fallback'} onTogglePause={() => setPaused(value => !value)} onSettled={handleSceneReady} onProgress={setSceneProgress} onElapsed={setSceneElapsed} onError={handleSceneError} onRecoveryChange={handleRecoveryChange}/>
      <footer className="hero-footer">
        <div className="scene-index"><span aria-hidden="true">O—O</span><span>ONE TEAM.<br/>MANY MINDS.</span></div>
        <div className="motion-control">
          <span id="motion-label">MOTION</span>
          <Switch className="motion-switch" checked={!paused} disabled={!canControlScene} onCheckedChange={playing => setPaused(!playing)} aria-labelledby="motion-label"/>
          <span className="motion-state" aria-hidden="true">{paused ? 'OFF' : 'ON'}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="direction-toggle"
            disabled={!canControlScene}
            aria-label="카드 회전 방향 전환"
            aria-pressed={direction === -1}
            title={`회전 방향 전환 · 현재 ${directionLabel}`}
            onClick={() => setDirection(value => value === 1 ? -1 : 1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 8H20M16 4L20 8L16 12M20 16H4M8 12L4 16L8 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <output className="sr-only">현재 회전 방향: {directionLabel}</output>
        </div>
      </footer>
    </section>
    }><WhySection/></SectionEntry>
    <SiteControls currentSection={currentSection}/>
    </main>
    {!heroCovered && <SceneRecoveryNotice status={sceneRuntime} onRetry={retryScene} onContinue={continueWithBasic}/>}
    <SceneLoader status={sceneStatus} progress={sceneProgress} elapsed={sceneElapsed} issue={sceneIssue} onContinue={continueWithBasic}/>
    <noscript><style>{'.scene-loader { display: none !important; }'}</style></noscript>
    </>
  );
}
