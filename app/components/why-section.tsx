import WhyGalaxy from './why-galaxy';
import GalaxyCrew from './galaxy-crew';
import { galaxyServices } from '@/lib/galaxy';
import crewSpriteUrl from '@/app/assets/galaxy-crew/crew-sprite.webp?url';

export default function WhySection({ active = false, revealed = false, paused = false, covered = false }: { active?: boolean; revealed?: boolean; paused?: boolean; covered?: boolean }) {
  return <section className="why-section" aria-labelledby="why-heading" data-visible={active} data-galaxy="pending">
    <div className="why-frame">
      <output className="why-loading"><span className="why-loading-ring" aria-hidden="true"/><span>하나로 연결하는 중</span><small>ON&amp;OFF / SYSTEM</small></output>
      <WhyGalaxy active={active} revealed={revealed} paused={paused} covered={covered}/>
      <p className="why-kicker"><span className="galaxy-status" aria-hidden="true"/> THE CONNECTED UNIVERSE <span>/ 02</span></p>
      <div className="galaxy-editorial">
        <p className="galaxy-eyebrow">기획부터 제작·운영까지</p>
        <h2 className="why-heading" id="why-heading"><span>마케팅 전부,</span><span>온앤오프 하나로</span></h2>
        <p className="galaxy-integration"><span>ALL-IN-ONE AGENCY</span><strong>다섯 분야를 한 번에</strong></p>
      </div>
      <ol className="galaxy-services" id="why-services" aria-label="통합 서비스">
        {galaxyServices.map((service, index) => <li className={`galaxy-service galaxy-service-${index}`} key={service.id}>
          <span className="galaxy-service-number" aria-hidden="true">0{index + 1}</span>
          <div><h3>{service.ko}</h3><p>{service.keyword}</p><span className="galaxy-service-tags">{service.tags}</span></div>
        </li>)}
      </ol>
      <div className="galaxy-crew">
        <GalaxyCrew active={active} spriteUrl={crewSpriteUrl}/>
        <p><span>분야별 전문가</span><strong>한 팀에서 끝까지</strong></p>
      </div>
      <div className="galaxy-folio"><span>ON&amp;OFF / ONE TEAM</span><span className="galaxy-folio-line" aria-hidden="true"/><span>TOGETHER, IN ORBIT</span></div>
    </div>
    <noscript><style>{`.why-section[data-galaxy='pending'] .why-frame > :not(.why-loading) { visibility: visible; } .why-loading { display: none !important; }`}</style></noscript>
  </section>;
}
