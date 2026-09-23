import Image from 'next/image';
import Link from '@/app/components/page-link';
import { ServiceArrow } from '@/app/components/service-arrow';
import ServiceDetailMotion from '@/app/components/service-detail-motion';
import { services } from '@/lib/services';
import ServiceFooter from './service-footer';
import { webBusinessTypes, webCostItems, webFaqs, webPackages, webProcess, webSources } from '@/lib/web-service';
import devices from '@/app/assets/web-service/website-devices.webp?url';
import planning from '@/app/assets/web-service/website-planning.webp?url';

type WebService = Extract<(typeof services)[number], { slug: 'web' }>;
function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> (새 창)</span></a>;
}

export default function WebServiceDetail({ service }: { service: WebService }) {
  return <ServiceDetailMotion slug="web">
    <div className="web-service">
      <Link className="service-skip" href="/services/web" data-scroll-target="service-main" prefetch={false}>본문으로 이동</Link>
      <header className="service-detail-header"><Link className="service-detail-brand" href="/" data-scroll-target="home" prefetch={false} aria-label="ON&OFF 홈">ON&OFF<span>ALL-IN-ONE AGENCY</span></Link><Link className="service-back" href="/" data-scroll-target="services" prefetch={false}>서비스 목록 <ServiceArrow/></Link></header>
      <main id="service-main">
        <section className="web-detail-hero" aria-labelledby="service-title">
          <div className="web-hero-meta"><nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/" data-scroll-target="services" prefetch={false}>SERVICES</Link><span aria-hidden="true">/</span><span aria-current="page">웹사이트 제작</span></nav><span>YOUR BUSINESS, ONLINE.</span></div>
          <div className="web-hero-word" aria-hidden="true">WEB</div>
          <div className="service-hero-layout web-hero-layout">
            <div className="web-hero-copy"><p className="service-detail-kicker">WEBSITE / 기획 · 디자인 · 개발</p><h1 id="service-title">{service.headline.map(line => <span className="service-headline-line" key={line}><span>{line}</span></span>)}</h1><p className="service-detail-summary" data-service-reveal>{service.intro}</p><div className="web-hero-actions"><Link className="web-button" href="/services/web" data-scroll-target="pricing" prefetch={false}>제작 유형·비용 보기 <ServiceArrow/></Link><Link className="web-text-link" href="/services/web" data-scroll-target="why-service" prefetch={false}>왜 필요할까요? ↓</Link></div></div>
            <figure className="service-hero-art web-device-photo"><div className="web-photo-mat"><Image src={devices} width={1440} height={1152} alt="노트북과 휴대폰에 화면 크기에 맞춰 표시된 웹사이트" unoptimized loading="eager" fetchPriority="high"/><span className="web-photo-label">PC부터 모바일까지</span></div><figcaption>외부 참고 이미지 · Azwedo L.LC / Unsplash</figcaption></figure>
          </div>
          <div className="web-hero-bottom"><span>회사 소개 · 서비스 안내 · 고객 문의</span><Link href="/services/web" data-scroll-target="why-service" aria-label="홈페이지가 필요한 이유 읽기" prefetch={false}>SCROLL TO EXPLORE ↓</Link></div>
        </section>

        <nav className="service-detail-nav" aria-label="상세 안내"><Link href="/services/web" data-scroll-target="why-service" prefetch={false}>웹사이트가 필요한 순간</Link><Link href="/services/web" data-scroll-target="service-effects" prefetch={false}>우리가 만드는 웹사이트</Link><Link href="/services/web" data-scroll-target="service-scope" prefetch={false}>진행 과정</Link><Link href="/services/web" data-scroll-target="pricing" prefetch={false}>서비스 안내</Link><Link href="/services/web" data-scroll-target="web-faq" prefetch={false}>FAQ</Link></nav>

        <section className="service-content-section web-detail-chapter web-why" id="why-service" aria-labelledby="web-why-title">
          <div className="web-chapter-heading" data-service-reveal><span className="web-eyebrow">01 / WHY A WEBSITE</span><h2 id="web-why-title">검색한 고객이<br/>우리 회사를 알 수 있도록</h2><p>홈페이지는 회사 소개, 서비스, 실적과 연락처를 한 주소에 모은 온라인 안내 공간입니다. 고객이 궁금한 내용을 확인하고 문의할 수 있게 만듭니다.</p></div>
          <div className="web-reasons">
            <article data-service-reveal><span className="web-index">01</span><p className="web-customer-question">“어떤 일을 하는 회사인가요?”</p><h3>설명은 한곳에</h3><p>서비스와 강점, 작업 사례를 메뉴별로 정리합니다. 고객에게 매번 따로 보내던 소개 자료를 홈페이지 주소 하나로 안내할 수 있습니다.</p></article>
            <article data-service-reveal><span className="web-index">02</span><p className="web-customer-question">“믿고 맡길 수 있을까요?”</p><h3>판단할 정보는 충분히</h3><p>실제 사례와 회사 정보, 진행 방식까지 보여줍니다. 고객이 문의하기 전에 필요한 내용을 직접 확인할 수 있습니다.</p></article>
            <article data-service-reveal><span className="web-index">03</span><p className="web-customer-question">“어디로 문의하면 되나요?”</p><h3>문의 방법은 간단하게</h3><p>관심 있는 서비스 옆에 문의 버튼을 배치합니다. 전화, 이메일, 문의폼 등 사업에 맞는 연락 방법으로 연결합니다.</p></article>
          </div>
        </section>

        <section className="service-content-section web-detail-chapter web-value" id="service-effects" aria-labelledby="web-value-title">
          <div className="web-value-heading" data-service-reveal><span className="web-eyebrow">02 / BUILT FOR YOUR CUSTOMERS</span><h2 id="web-value-title">찾기 쉽고,<br/>읽기 편하고,<br/><span>문의하기 가깝게</span></h2><div className="web-contact-route" aria-label="검색과 SNS에서 홈페이지 안내를 확인한 후 고객 문의로 이동"><span>검색 · SNS · 광고</span><i aria-hidden="true">↓</i><strong>우리 회사 홈페이지</strong><i aria-hidden="true">↓</i><span>서비스 확인 → 고객 문의</span></div></div>
          <div className="web-value-list">
            <article data-service-reveal><span>SEARCH</span><h3>검색으로 찾아올 수 있게 준비합니다</h3><p>페이지 제목과 설명, 메뉴 구조를 정리하고 검색엔진이 내용을 확인할 수 있도록 기초 설정을 합니다.</p><SourceLink href={webSources.naver}>네이버의 검색 최적화 안내 ↗</SourceLink></article>
            <article data-service-reveal><span>RESPONSIVE</span><h3>휴대폰에서도 읽고 누르기 편하게 만듭니다</h3><p>화면 크기에 맞춰 글과 사진, 메뉴의 배치를 조정합니다. 작은 글씨를 확대하거나 화면을 옆으로 밀어야 하는 불편을 줄입니다.</p><SourceLink href={webSources.responsive}>Google web.dev 반응형 안내 ↗</SourceLink></article>
            <article data-service-reveal><span>INQUIRY</span><h3>광고 다음에 보여줄 안내 페이지가 생깁니다</h3><p>SNS나 광고에서 관심을 가진 고객에게 서비스 내용과 사례를 이어서 보여줍니다. 문의할 때 필요한 정보도 함께 받을 수 있습니다.</p></article>
            <p className="web-value-note" data-service-reveal>검색 설정만으로 상위 노출이나 문의·매출 증가가 보장되지는 않습니다. 공개 후 콘텐츠와 유입 경로도 함께 관리해야 합니다.</p>
          </div>
        </section>

        <section className="service-content-section web-detail-chapter web-process" id="service-scope" aria-labelledby="web-process-title">
          <div className="web-chapter-heading" data-service-reveal><span className="web-eyebrow">03 / HOW WE MAKE IT</span><h2 id="web-process-title">준비된 기획은 구체적으로,<br/>필요한 기획은 함께.</h2><p>자료 준비와 기획 범위를 먼저 확인합니다.<br/>구성·디자인·개발·공개까지 단계별 결과물을 확인하며 진행합니다.</p></div>
          <div className="web-process-layout"><figure data-service-reveal><Image src={planning} width={1000} height={667} alt="페이지마다 글과 사진의 위치를 그려 놓은 웹사이트 구성 스케치" unoptimized loading="lazy" decoding="async"/><figcaption>화면을 만들기 전, 내용과 순서부터 정리합니다.<br/><span>외부 참고 이미지 · Hal Gatewood / Unsplash</span></figcaption></figure><ol>{webProcess.map((step, index) => <li key={step.title} data-service-reveal><span className="web-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p><span className="web-step-result">{step.result}</span></div></li>)}</ol></div>
        </section>

        <section className="service-content-section web-detail-chapter web-pricing" id="pricing" aria-labelledby="web-pricing-title">
          <div className="web-chapter-heading" data-service-reveal><span className="web-eyebrow">04 / PACKAGES & PRICING</span><h2 id="web-pricing-title">목적과 준비 상태에 맞는<br/>제작 방식을 선택하세요.</h2><p>집중도 높은 한 페이지부터 회사 소개 홈페이지까지.<br/>랜딩·스타터·기업 중 필요한 구성을 선택하고, 기능이 중심인 서비스는 별도 개발로 상담합니다.</p></div>
          <div className="web-package-grid">{webPackages.map((item, index) => <article className="web-package" data-service-reveal key={item.code}><div className="web-package-top"><span>{item.code}</span><span>0{index + 1}</span></div><h3>{item.name}</h3><p className="web-package-purpose">{item.purpose}</p><span className="web-package-scope">{item.scope}</span><p className="web-package-planning">{item.planning}</p><div className="web-package-price"><strong>상담 후 견적</strong><span>제작 범위 확인 후 개별 안내</span></div><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Link href="/inquiry?service=web&from=services" prefetch={false} aria-label={`${item.name} 제작 문의하기`}>제작 문의하기 <ServiceArrow/></Link></article>)}</div>
          <div className="web-package-guide" data-service-reveal><p><strong>스타터와 기업의 차이는 기획 담당입니다.</strong> 기획 외 기본 제작 범위는 동일하며, 기업은 메뉴 구조와 페이지 구성안 작성부터 함께 진행합니다.</p><p>세 패키지는 자체 개발하는 소개형 홈페이지입니다. 고객용 편집 관리자 화면은 제공하지 않으며, 게시판 화면과 초기 게시물 등록은 모두 추가 옵션입니다.</p></div>
          <p className="web-price-clarifier">최종 페이지·섹션 수, 시안과 기능, 수정 횟수·제작 일정·금액은 자료와 요청 범위를 확인한 뒤 견적서에서 확정합니다.</p>
          <section className="web-business" aria-labelledby="web-business-title" data-service-reveal>
            <div><span className="web-eyebrow">BUSINESS / CUSTOM DEVELOPMENT</span><h3 id="web-business-title">소개를 넘어,<br/>서비스가 작동해야 한다면.</h3><p>회원·거래·예약·업무 기능이 필요한 웹 서비스는 비즈니스 개별 개발로 검토합니다. 소개형 패키지와 별도의 범위·일정·견적을 제안합니다.</p><Link className="web-button" href="/inquiry?service=web&from=services" prefetch={false}>비즈니스 개발 상담 <ServiceArrow/></Link></div>
            <div><ul className="web-business-types">{webBusinessTypes.map(item => <li key={item.title}><h4>{item.title}</h4><p>{item.text}</p></li>)}</ul><p className="web-business-note">위 항목은 상담 가능한 기능의 예시입니다. 사용자 역할, 처리 규칙, 외부 연결과 운영 규모를 확인하고 수행 가능한 범위를 정합니다. 개발비와 공개 후 운영비·지원 조건은 개별 계약에서 확정합니다.</p></div>
          </section>
          <div className="web-cost-guide" data-service-reveal><div><span className="web-eyebrow">CHECK YOUR ESTIMATE</span><h3>제작 범위부터 운영비까지,<br/>견적에서 명확하게.</h3></div><dl>{webCostItems.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl></div>
          <div className="web-maintenance" data-service-reveal><div><span className="web-eyebrow">AFTER LAUNCH</span><h3>오픈 후 변경도<br/>담당자에게 간편하게.</h3><p>변경할 페이지 주소와 위치, 최종 문구·이미지를 보내주세요. 작업 범위·건수·비용·일정을 확인한 뒤 반영하고 결과를 안내합니다.</p></div><div className="web-maintenance-options"><article><span>01 / 필요한 때만</span><h4>건별 지원</h4><p>월 계약 없이 필요한 작업만 요청할 수 있습니다. 변경 대상과 수량에 따라 견적과 일정을 안내합니다.</p></article><article><span>02 / 정기적인 변경과 점검</span><h4>월 관리</h4><p>기본 관리와 확장 관리는 월 처리 건수로 구분합니다. 제공 업무와 점검·보고 기준은 같으며, 최종 건수와 금액은 계약에서 정합니다.</p></article><p>연락 횟수가 아닌 실제 작업 단위로 건수를 산정합니다. 제작 오류의 정정과 새로운 콘텐츠 요청을 구분하며, 새 페이지·구조 변경·데이터 백업·복구는 별도로 협의합니다.</p></div></div>
        </section>

        <section className="service-content-section web-detail-chapter web-faq" id="web-faq" aria-labelledby="web-faq-title"><div data-service-reveal><span className="web-eyebrow">05 / FAQ</span><h2 id="web-faq-title">문의 전에<br/>많이 궁금해하시는 것들</h2></div><div className="web-faq-list">{webFaqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>

        <section className="service-inquiry web-inquiry" aria-labelledby="web-inquiry-title"><div data-service-reveal><p>LET’S BUILD YOUR WEBSITE</p><h2 id="web-inquiry-title">지금, 어떤 웹사이트가 필요한가요?</h2><span>사업과 필요한 화면·기능, 준비된 자료와 희망 일정을 알려주세요.<br/>소개형 홈페이지부터 비즈니스 개발까지, 적합한 범위를 함께 정리하겠습니다.</span></div><Link href="/inquiry?service=web&from=services" prefetch={false}>웹사이트 제작 문의 <ServiceArrow/></Link></section>
      </main>
      <ServiceFooter currentService="web">
        <details className="service-footer-disclosure"><summary>참고 자료·이미지 출처 <span aria-hidden="true">+</span></summary><div><p>안내 자료: <SourceLink href={webSources.naver}>네이버 서치어드바이저</SourceLink> · <SourceLink href={webSources.google}>Google 검색 기본 가이드</SourceLink> · <SourceLink href={webSources.responsive}>Google web.dev 반응형 웹 안내</SourceLink></p><p>사진: <SourceLink href={webSources.devices}>Azwedo L.LC</SourceLink> · <SourceLink href={webSources.planning}>Hal Gatewood</SourceLink> / Unsplash. <SourceLink href={webSources.license}>Unsplash License</SourceLink>에 따라 사용했으며 크기 조정·WebP 변환을 적용했습니다. 사진 속 웹사이트는 외부 참고 사례입니다.</p></div></details>
      </ServiceFooter>
    </div>
  </ServiceDetailMotion>;
}
