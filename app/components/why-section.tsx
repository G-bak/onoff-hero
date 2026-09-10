import teamAtlasUrl from '@/app/assets/generated/team-atlas.webp?url';
import brushUrl from '@/public/images/2페이지 시안/05_Digital/page2-graphic1.png?url';
import brushTextureUrl from '@/public/images/2페이지 시안/05_Digital/page2-graphic2.png?url';

export default function WhySection() {
  return (
    <section className="why-section" aria-labelledby="why-heading">
      <div className="why-frame">
      <div className="why-artboard">
      <p className="why-kicker">WHY ON&OFF / 02</p>
      <svg className="why-outline" viewBox="0 0 3817 2160" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <path d="M148 1997 790 975 3651 226 3010 1250Z" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
      </svg>

      <h2 className="why-heading" id="why-heading">
        <span className="why-heading-intro">문제는 <mark>서비스의 수</mark>가 아니라</span>
        <span className="why-heading-main">
          <span className="why-brush" style={{ backgroundImage: `url("${brushUrl}")` }} aria-hidden="true"/>
          <span className="why-brush-texture" style={{ backgroundImage: `url("${brushTextureUrl}")` }} aria-hidden="true"/>
          <span className="why-heading-text">연결의 방향.</span>
        </span>
      </h2>

      <p className="why-problem" id="why-services">
        <span>기획은 여기, 디자인은 저기,</span>
        <span>영상과 광고 운영은 또 다른 곳에.</span>
        <span>여러 곳에 나뉘면 브랜드의 판단도 함께 흩어집니다.</span>
      </p>
      <p className="why-answer">
        <span>온앤오프는 모든 결과물을</span>
        <span>하나의 메시지, 하나의 운영 체계, 하나의 개선 흐름으로 연결합니다.</span>
      </p>

      <div className="why-wordmark" aria-hidden="true">ONETEAM</div>
      <div className="why-person" style={{ backgroundImage: `url("${teamAtlasUrl}")` }} aria-hidden="true"/>
      </div>
      </div>
    </section>
  );
}
