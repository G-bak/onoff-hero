import type { CSSProperties } from 'react';
import ConsultationChat from './consultation-chat';

const sections = [
  { id: 'home', number: '01', label: 'HOME', description: '홈 섹션으로 이동' },
  { id: 'why', number: '02', label: 'WHY', description: '온앤오프의 연결 방식 보기' },
] as const;

export default function SiteControls({ currentSection }: { currentSection: typeof sections[number]['id'] }) {
  return (
    <div className="site-controls" data-section={currentSection}>
      <nav className="section-nav" aria-label="섹션 이동" style={{ '--section-count': sections.length } as CSSProperties}>
        <ol className="section-nav-list">
          {sections.map(section => (
            <li key={section.id}>
              <a className="section-nav-link" href={`#${section.id}`} aria-current={currentSection === section.id ? 'location' : undefined} aria-label={section.description}>
                <span className="section-nav-number" aria-hidden="true">{section.number}</span>
                <span className="section-nav-label">{section.label}</span>
                <span className="section-nav-track" aria-hidden="true"/>
              </a>
            </li>
          ))}
        </ol>
        <span className="section-nav-indicator" aria-hidden="true"/>
      </nav>
      <div className="site-chat"><ConsultationChat/></div>
    </div>
  );
}
