import Image from 'next/image';
import Link from '@/app/components/page-link';
import { ServiceArrow } from '@/app/components/service-arrow';
import ServiceDetailMotion from '@/app/components/service-detail-motion';
import { services } from '@/lib/services';
import ServiceFooter from './service-footer';
import { webFaqs, webPackages, webProcess, webSources } from '@/lib/web-service';
import devices from '@/app/assets/web-service/website-devices.webp?url';
import planning from '@/app/assets/web-service/website-planning.webp?url';

type WebService = Extract<(typeof services)[number], { slug: 'web' }>;
function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> (새 창)</span></a>;
}

export default function WebServiceDetail({ service }: { service: WebService }) {
  return <ServiceDetailMotion slug="web">
    <div className="web-service">
      <a className="service-skip" href="#service-main">본문으로 이동</a>
      <header className="service-detail-header"><Link className="service-detail-brand" href="/#home" prefetch={false} aria-label="ON&OFF 홈">ON&OFF<span>ALL-IN-ONE AGENCY</span></Link><Link className="service-back" href="/#services" prefetch={false}>서비스 목록 <ServiceArrow/></Link></header>
      <main id="service-main">
        <section className="web-detail-hero" aria-labelledby="service-title">
          <div className="web-hero-meta"><nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/#services" prefetch={false}>SERVICES</Link><span aria-hidden="true">/</span><span aria-current="page">웹사이트 제작</span></nav><span>YOUR BUSINESS, ONLINE.</span></div>
          <div className="web-hero-word" aria-hidden="true">WEB</div>
          <div className="service-hero-layout web-hero-layout">
            <div className="web-hero-copy"><p className="service-detail-kicker">WEBSITE / 기획 · 디자인 · 개발</p><h1 id="service-title">{service.headline.map(line => <span className="service-headline-line" key={line}><span>{line}</span></span>)}</h1><p className="service-detail-summary" data-service-reveal>{service.intro}</p><div className="web-hero-actions"><a className="web-button" href="#pricing">제작 유형·비용 보기 <ServiceArrow/></a><a className="web-text-link" href="#why-service">왜 필요할까요? ↓</a></div></div>
            <figure className="service-hero-art web-device-photo"><div className="web-photo-mat"><Image src={devices} width={1440} height={1152} alt="노트북과 휴대폰에 화면 크기에 맞춰 표시된 웹사이트" unoptimized loading="eager" fetchPriority="high"/><span className="web-photo-label">PC부터 모바일까지</span></div><figcaption>외부 참고 이미지 · Azwedo L.LC / Unsplash</figcaption></figure>
          </div>
          <div className="web-hero-bottom"><span>회사 소개 · 서비스 안내 · 고객 문의</span><a href="#why-service" aria-label="홈페이지가 필요한 이유 읽기">SCROLL TO EXPLORE ↓</a></div>
        </section>

        <nav className="service-detail-nav" aria-label="상세 안내"><a href="#why-service">필요한 이유</a><a href="#service-effects">기대 효과</a><a href="#service-scope">제작 과정</a><a href="#pricing">가격 정책</a><a href="#web-faq">자주 묻는 질문</a></nav>

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
          <div className="web-chapter-heading" data-service-reveal><span className="web-eyebrow">03 / HOW WE MAKE IT</span><h2 id="web-process-title">무엇부터 준비할지,<br/>온앤오프가 함께 정리합니다</h2><p>전문 용어를 몰라도 괜찮습니다. 사업 설명부터 시작해, 단계마다 결과물을 함께 확인합니다.</p></div>
          <div className="web-process-layout"><figure data-service-reveal><Image src={planning} width={1000} height={667} alt="페이지마다 글과 사진의 위치를 그려 놓은 웹사이트 구성 스케치" unoptimized loading="lazy" decoding="async"/><figcaption>화면을 만들기 전, 내용과 순서부터 정리합니다.<br/><span>외부 참고 이미지 · Hal Gatewood / Unsplash</span></figcaption></figure><ol>{webProcess.map((step, index) => <li key={step.title} data-service-reveal><span className="web-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p><span className="web-step-result">{step.result}</span></div></li>)}</ol></div>
        </section>

        <section className="service-content-section web-detail-chapter web-pricing" id="pricing" aria-labelledby="web-pricing-title">
          <div className="web-chapter-heading" data-service-reveal><span className="web-eyebrow">04 / PACKAGES & PRICING</span><h2 id="web-pricing-title">필요한 홈페이지에 맞춰<br/>제작비를 안내합니다</h2><p>한 페이지 소개부터 회사·브랜드 홈페이지까지.<br/>제작 유형을 정하고 페이지 수, 디자인과 추가 작업을 확인해 견적을 드립니다.</p></div>
          <div className="web-package-grid">{webPackages.map((item, index) => <article className="web-package" data-service-reveal key={item.code}><div className="web-package-top"><span>{item.code}</span><span>0{index + 1}</span></div><h3>{item.name}</h3><p className="web-package-purpose">{item.purpose}</p><span className="web-package-scope">{item.scope}</span><div className="web-package-price"><strong>상담 후 견적</strong><span>제작 범위 확인 후 개별 안내</span></div><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul><Link href="/inquiry?service=web&from=services" prefetch={false} aria-label={`${item.name} 제작 문의하기`}>제작 문의하기 <ServiceArrow/></Link></article>)}</div>
          <p className="web-price-clarifier">위 구성은 제작 유형을 고르기 위한 안내입니다. 최종 페이지 수·기능·수정 횟수·제작 일정과 금액은 견적서에서 확정합니다.</p>
          <div className="web-cost-guide" data-service-reveal><div><span className="web-eyebrow">CHECK YOUR ESTIMATE</span><h3>제작비 외에<br/>확인할 비용도 알려드립니다</h3></div><dl><div><dt>추가 제작</dt><dd>추가 페이지, 다국어, 원고 작성, 촬영·영상 등 처음 정한 범위를 넘는 작업은 별도로 견적을 안내합니다.</dd></div><div><dt>주소·서버·보안 연결</dt><dd>도메인과 서버의 이용료, 사이트 공개와 보안 접속(HTTPS) 설정 작업을 구분하고, 제작비에 포함되는 항목을 견적서에 표시합니다.</dd></div><div><dt>데이터 백업·복구</dt><dd>데이터베이스를 사용하는 경우 필요한 백업·복구 작업과 비용을 별도로 협의합니다.</dd></div><div><dt>세금·결제 조건</dt><dd>부가세 포함 여부, 결제 시점, 외부 서비스 이용료와 갱신 비용을 계약 전에 확인합니다.</dd></div></dl></div>
          <div className="web-maintenance" data-service-reveal><div><span className="web-eyebrow">AFTER LAUNCH</span><h3>오픈 후 수정은<br/>필요한 만큼 맡기세요</h3><p>문구·사진·게시물 변경은 담당자에게 요청하는 방식입니다. 제작비와 운영 중 수정 비용을 구분해 안내합니다.</p></div><div className="web-maintenance-options"><article><span>01 / 필요한 때만</span><h4>건별 지원</h4><p>수정할 일이 생겼을 때 작업 내용과 건수를 확인해 견적을 드립니다.</p></article><article><span>02 / 꾸준한 수정이 필요할 때</span><h4>월 관리</h4><p>기본 관리·확장 관리 중 수정량에 맞춰 선택합니다. 월 처리 건수와 금액은 계약 전에 정합니다.</p></article><p>새 페이지 제작이나 큰 구조 변경은 유지보수와 별도로 협의합니다. 납품 범위의 오류 수정과 새 콘텐츠 변경 요청도 구분합니다.</p></div></div>
        </section>

        <section className="service-content-section web-detail-chapter web-faq" id="web-faq" aria-labelledby="web-faq-title"><div data-service-reveal><span className="web-eyebrow">05 / FAQ</span><h2 id="web-faq-title">문의 전에<br/>많이 궁금해하시는 것들</h2></div><div className="web-faq-list">{webFaqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>

        <section className="service-inquiry web-inquiry" aria-labelledby="web-inquiry-title"><div data-service-reveal><p>LET’S BUILD YOUR WEBSITE</p><h2 id="web-inquiry-title">어떤 사업을 하고 계세요?</h2><span>업종과 필요한 홈페이지, 희망 예산·일정을 알려주세요.<br/>소개할 내용과 제작 범위부터 함께 정리하겠습니다.</span></div><Link href="/inquiry?service=web&from=services" prefetch={false}>웹사이트 제작 문의 <ServiceArrow/></Link></section>
      </main>
      <ServiceFooter currentService="web">
        <details className="service-footer-disclosure"><summary>참고 자료·이미지 출처 <span aria-hidden="true">+</span></summary><div><p>안내 자료: <SourceLink href={webSources.naver}>네이버 서치어드바이저</SourceLink> · <SourceLink href={webSources.google}>Google 검색 기본 가이드</SourceLink> · <SourceLink href={webSources.responsive}>Google web.dev 반응형 웹 안내</SourceLink></p><p>사진: <SourceLink href={webSources.devices}>Azwedo L.LC</SourceLink> · <SourceLink href={webSources.planning}>Hal Gatewood</SourceLink> / Unsplash. <SourceLink href={webSources.license}>Unsplash License</SourceLink>에 따라 사용했으며 크기 조정·WebP 변환을 적용했습니다. 사진 속 웹사이트는 외부 참고 사례입니다.</p></div></details>
      </ServiceFooter>
    </div>
  </ServiceDetailMotion>;
}
