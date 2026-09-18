'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from './page-link';
import { ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteSections as sections, type SiteSection } from '@/lib/site-sections';
import { useSceneActivity } from './use-scene-activity';

const promptedDocuments = new WeakSet<Document>();

export default function SiteControls({ currentSection, paused, filmReady }: { currentSection: SiteSection; paused: boolean; filmReady: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const prompted = useRef(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [attention, setAttention] = useState(false);
  const { visible, motion } = useSceneActivity(host, { active: currentSection === 'together', paused, covered: false });
  useEffect(() => {
    if (!visible || !filmReady || dismissed || prompted.current || promptedDocuments.has(document)) return;
    const timer = window.setTimeout(() => {
      prompted.current = true; promptedDocuments.add(document); setPromptVisible(true); setAttention(true);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [visible, filmReady, dismissed]);
  useEffect(() => {
    if (!attention) return;
    const timer = window.setTimeout(() => setAttention(false), motion ? 4400 : 0);
    return () => window.clearTimeout(timer);
  }, [attention, motion]);
  const nudge = currentSection === 'together' && promptVisible && !dismissed;
  return (
    <div className="site-controls" ref={host} data-section={currentSection} data-inquiry-nudge={nudge || undefined} data-attention={nudge && attention || undefined} data-motion={motion}>
      <nav className="section-nav" aria-label="섹션 이동" style={{ '--section-count': sections.length } as CSSProperties}>
        <ol className="section-nav-list">
          {sections.map(section => (
            <li key={section.id}>
              <Link className="section-nav-link" href="/" data-scroll-target={section.id} aria-current={currentSection === section.id ? 'location' : undefined} aria-label={section.description} prefetch={false}>
                <span className="section-nav-number" aria-hidden="true">{section.number}</span>
                <span className="section-nav-label">{section.label}</span>
              </Link>
            </li>
          ))}
        </ol>
        <span className="section-nav-track" aria-hidden="true"/>
        <span className="section-nav-indicator" aria-hidden="true"/>
      </nav>
      <div className="site-chat">
        {nudge && <aside className="inquiry-nudge" aria-label="프로젝트 문의 안내">
          <Button className="inquiry-nudge-close" variant="ghost" size="icon" aria-label="프로젝트 문의 안내 닫기" onClick={event => {
            setDismissed(true);
            event.currentTarget.closest('.site-chat')?.querySelector<HTMLAnchorElement>('.project-inquiry-launcher')?.focus({ preventScroll: true });
          }}><X aria-hidden="true"/></Button>
          <p className="inquiry-nudge-title">사업만 해도 바쁜데,<br/>홍보까지 혼자 하시나요?</p>
          <p className="inquiry-nudge-copy" id="inquiry-nudge-description">홈페이지·디자인·마케팅,<br/>필요한 작업부터 골라보세요.</p>
        </aside>}
        <Link className="chat-launcher project-inquiry-launcher" href={`/inquiry?from=${currentSection}`} prefetch={false} aria-label="프로젝트 문의 페이지로 이동" aria-describedby={nudge ? 'inquiry-nudge-description' : undefined}><span className="chat-launcher-label">프로젝트 문의</span><span className="chat-launcher-icon"><ArrowUpRight aria-hidden="true"/></span></Link>
      </div>
    </div>
  );
}
