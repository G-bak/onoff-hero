'use client';

import Link from './components/page-link';

import { useCallback, useRef, useState } from 'react';
import CardRibbon from './components/card-ribbon';
import Wordmark from './components/wordmark';
import NewsRecruitmentLink from './components/news-recruitment-link';
import SiteControls from './components/site-controls';
import SceneLoader from './components/scene-loader';
import SceneRecoveryNotice from './components/scene-recovery-notice';
import SectionEntry from './components/section-entry';
import WhySection from './components/why-section';
import CardShowcase from './components/card-showcase';
import DesignEditorial from './components/design-editorial';
import WebSection from './components/web-section';
import ServicesSection from './components/services-section';
import BrandFilm from './components/brand-film';
import { getSiteNavigation, siteSections, type SectionTransition, type SiteSection } from '@/lib/site-sections';
import type { SceneIssue, SceneStatus } from '@/lib/scene-loading';
import { galaxyRevealProgress } from '@/lib/galaxy';
import type { SceneRecoveryStatus, SceneRuntimeStatus } from '@/lib/scene-recovery';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { companyInfo, consultationEmail } from '@/lib/consultation';

const contact = `mailto:${consultationEmail}`;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18L18 6M6 6H18V18' : 'M4 12H20M13 5L20 12L13 19'} stroke="currentColor" strokeWidth="1.5"/></svg>;
}

function CompanyDetails() {
  return (
    <div className="company-details">
      <dl className="company-facts">
        <div><dt>대표이사</dt><dd>{companyInfo.representative}</dd></div>
        <div><dt>사업자번호</dt><dd>{companyInfo.businessNumber}</dd></div>
        <div><dt>회사번호</dt><dd><a href={`tel:${companyInfo.phone.replaceAll('-', '')}`}>{companyInfo.phone}</a></dd></div>
        <div><dt>이메일</dt><dd><a className="header-email" href={contact}>{consultationEmail}</a></dd></div>
        <div className="company-address"><dt>주소</dt><dd>{companyInfo.address}</dd></div>
      </dl>
    </div>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const transitions = useRef<SectionTransition[]>(Array.from({ length: siteSections.length - 1 }, () => ({ progress: 0, backActive: false })));
  const activeSection = useRef<SiteSection>('home');
  const [paused, setPaused] = useState(false);
  const [openingHold, setOpeningHold] = useState(true);
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const handleLoaderDismiss = useCallback(() => setLoaderDismissed(true), []);
  const [heroCovered, setHeroCovered] = useState(false);
  const [whyCovered, setWhyCovered] = useState(false);
  const [designCovered, setDesignCovered] = useState(false);
  const [webCovered, setWebCovered] = useState(false);
  const [cardCovered, setCardCovered] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const servicesVisibleRef = useRef(false);
  const [filmVisible, setFilmVisible] = useState(false);
  const [filmReady, setFilmReady] = useState(false);
  const filmVisibleRef = useRef(false);
  const webVisibleRef = useRef(false);
  const [webVisible, setWebVisible] = useState(false);
  const designVisibleRef = useRef(false);
  const [designVisible, setDesignVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<SiteSection>('home');
  const cardVisibleRef = useRef(false);
  const [cardVisible, setCardVisible] = useState(false);
  const whyVisibleRef = useRef(false);
  const [whyVisible, setWhyVisible] = useState(false);
  const whyRevealedRef = useRef(false);
  const [whyRevealed, setWhyRevealed] = useState(false);
  const updateNavigation = useCallback((index: number, transition: SectionTransition) => {
    transitions.current[index] = transition;
    const navigation = getSiteNavigation(transitions.current);
    pageRef.current?.style.setProperty('--section-progress', String(navigation.progress));
    if (activeSection.current !== navigation.section) {
      activeSection.current = navigation.section;
      setCurrentSection(navigation.section);
    }
  }, []);
  const handleWhyNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(0, transition);
    const visible = transition.progress > 0 || transition.backActive;
    if (whyVisibleRef.current !== visible) { whyVisibleRef.current = visible; setWhyVisible(visible); }
    const revealed = transition.progress >= galaxyRevealProgress;
    if (whyRevealedRef.current !== revealed) { whyRevealedRef.current = revealed; setWhyRevealed(revealed); }
  }, [updateNavigation]);
  const handleDesignNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(1, transition);
    const visible = transition.progress > 0 || transition.backActive;
    if (designVisibleRef.current !== visible) {
      designVisibleRef.current = visible;
      setDesignVisible(visible);
    }
  }, [updateNavigation]);
  const handleWebNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(2, transition);
    const visible = transition.progress > 0 || transition.backActive;
    if (webVisibleRef.current !== visible) {
      webVisibleRef.current = visible;
      setWebVisible(visible);
    }
  }, [updateNavigation]);
  const handleCardNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(3, transition);
    // Start the back scene during the page turn, before its menu becomes active.
    const visible = transition.progress > 0 || transition.backActive;
    if (cardVisibleRef.current !== visible) {
      cardVisibleRef.current = visible;
      setCardVisible(visible);
    }
  }, [updateNavigation]);
  const handleServicesNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(4, transition);
    const visible = transition.progress > 0 || transition.backActive;
    if (servicesVisibleRef.current !== visible) { servicesVisibleRef.current = visible; setServicesVisible(visible); }
  }, [updateNavigation]);
  const handleFilmNavigation = useCallback((transition: SectionTransition) => {
    updateNavigation(5, transition);
    const visible = transition.progress > 0 || transition.backActive;
    if (filmVisibleRef.current !== visible) { filmVisibleRef.current = visible; setFilmVisible(visible); }
  }, [updateNavigation]);
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
    setSceneRuntime('fallback');
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
    <main className="site-pages" id="home" ref={pageRef} tabIndex={-1}>
    <SectionEntry id="why" onCovered={setHeroCovered} onNavigation={handleWhyNavigation} front={
    <section className={`hero${paused ? ' is-paused' : ''}`} aria-label="ON&OFF 소개" aria-busy={sceneStatus === 'loading'} inert={heroCovered}>
      <header className="site-header">
        <Link className="brand" href="/" data-scroll-target="home" aria-label="ON&OFF home" prefetch={false}>
          <img className="brand-logo" src="/images/onoff-logo.png" alt="ON&OFF" width={96} height={48} fetchPriority="high"/>
        </Link>
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
        <p className="hero-caption">고객님은 사업만 <span className="hero-caption-emphasis">ON</span><br/>복잡한 마케팅은 <span className="hero-caption-emphasis">OFF</span></p>
      </div>
      <CardRibbon key={sceneAttempt} paused={paused || openingHold} active={!heroCovered} direction={direction} enabled={sceneStatus !== 'fallback' && sceneRuntime !== 'fallback'} onTogglePause={() => setPaused(value => !value)} onSettled={handleSceneReady} onProgress={setSceneProgress} onElapsed={setSceneElapsed} onError={handleSceneError} onRecoveryChange={handleRecoveryChange}/>
      <footer className="hero-footer">
        <div className="scene-index"><span aria-hidden="true">O—O</span><span>ONE TEAM.<br/>MANY MINDS.</span></div>
        <div className="motion-control">
          <span id="motion-label">MOTION</span>
          <Switch className="motion-switch" checked={!paused} onCheckedChange={playing => setPaused(!playing)} aria-labelledby="motion-label"/>
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
    }>
      <SectionEntry id="design" onCovered={setWhyCovered} onNavigation={handleDesignNavigation} front={<WhySection active={whyVisible} revealed={whyRevealed} paused={paused} covered={whyCovered}/> }>
        <SectionEntry id="web" onCovered={setDesignCovered} onNavigation={handleWebNavigation} front={<DesignEditorial active={designVisible} paused={paused} covered={designCovered}/> }>
          <SectionEntry id="card" scrollRatio={0.8} onCovered={setWebCovered} onNavigation={handleCardNavigation} front={<WebSection active={webVisible} paused={paused} covered={webCovered}/>}>
            <SectionEntry id="services" scrollRatio={0.8} onCovered={setCardCovered} onNavigation={handleServicesNavigation} front={<CardShowcase active={cardVisible} paused={paused} covered={cardCovered}/>}>
              <SectionEntry id="together" legacyId="film" scrollRatio={0.8} onNavigation={handleFilmNavigation} front={<ServicesSection active={servicesVisible} paused={paused}/>}>
                <BrandFilm active={filmVisible} paused={paused} onReadyChange={setFilmReady}/>
              </SectionEntry>
            </SectionEntry>
          </SectionEntry>
        </SectionEntry>
      </SectionEntry>
    </SectionEntry>
    <SiteControls currentSection={currentSection} paused={paused} filmReady={filmReady}/>
    </main>
    {!heroCovered && loaderDismissed && <SceneRecoveryNotice status={sceneRuntime} onRetry={retryScene} onContinue={continueWithBasic}/>}
    <SceneLoader status={sceneStatus} progress={sceneProgress} elapsed={sceneElapsed} issue={sceneIssue} onContinue={continueWithBasic} onOpeningHold={setOpeningHold} onDismiss={handleLoaderDismiss}/>
    <noscript><style>{'.scene-loader { display: none !important; }'}</style></noscript>
    </>
  );
}
