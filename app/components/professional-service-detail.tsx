import Link from '@/app/components/page-link';
import { CircleCheck } from 'lucide-react';
import { ServiceArrow } from '@/app/components/service-arrow';
import ServiceDetailMotion from '@/app/components/service-detail-motion';
import { DetailHeroVisual, ServiceExamples } from '@/app/components/service-detail-visuals';
import ServiceFooter from './service-footer';
import { serviceDetails, type ProfessionalService } from '@/lib/service-details';

export default function ProfessionalServiceDetail({ service }: { service: ProfessionalService }) {
  const detail = serviceDetails[service.slug];
  const whyTitle = 'whyTitle' in detail
    ? detail.whyTitle
    : ['이런 고민이 있다면,', `${service.name}이 필요합니다`];
  const inquiryHref = `/inquiry?service=${service.slug}&from=services`;
  const heroAction = service.slug === 'design'
    ? { href: '#service-scope', label: '디자인 서비스 안내' }
    : { href: '#pricing', label: '작업 유형·비용 보기' };
  return <ServiceDetailMotion key={service.slug} slug={service.slug}>
    <div className="service-guide" data-guide={service.slug}>
      <a className="service-skip" href="#service-main">본문으로 이동</a>
      <header className="service-detail-header"><Link className="service-detail-brand" href="/#home" prefetch={false} aria-label="ON&OFF 홈">ON&OFF<span>ALL-IN-ONE AGENCY</span></Link><Link className="service-back" href="/#services" prefetch={false}>서비스 목록 <ServiceArrow/></Link></header>
      <main id="service-main">
        <section className="guide-hero" aria-labelledby="service-title">
          <div className="guide-hero-meta"><nav className="service-breadcrumb" aria-label="현재 위치"><Link href="/#services" prefetch={false}>SERVICES</Link><span aria-hidden="true">/</span><span aria-current="page">{service.name}</span></nav><span>SERVICE GUIDE / {service.number}</span></div>
          <div className="guide-hero-word" aria-hidden="true">{detail.word}</div>
          <div className="service-hero-layout guide-hero-layout"><div className="guide-hero-copy"><p className="service-detail-kicker">{detail.kicker}</p><h1 id="service-title">{service.headline.map(line => <span className="service-headline-line" key={line}><span>{line}</span></span>)}</h1><p className="service-detail-summary" data-service-reveal>{service.intro}</p><a className="guide-button" href={heroAction.href}>{heroAction.label} <ServiceArrow/></a></div><DetailHeroVisual slug={service.slug}/></div>
          <div className="guide-hero-bottom"><ul>{detail.heroTags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href="#why-service">서비스 자세히 보기 ↓</a></div>
        </section>
        <nav className="service-detail-nav guide-nav" aria-label="상세 안내"><a href="#why-service">필요한 이유</a><a href="#service-scope">작업 범위</a><a href="#service-process">진행 과정</a><a href="#pricing">가격 정책</a><a href="#service-faq">FAQ</a></nav>

        <section className="service-content-section guide-chapter guide-why" id="why-service" aria-labelledby="guide-why-title"><div className="guide-chapter-heading" data-service-reveal><span className="guide-eyebrow">01 / YOUR BUSINESS</span><h2 id="guide-why-title">{whyTitle[0]}<br/>{whyTitle[1]}</h2><p>{service.importance}</p></div><div className="guide-situation-list">{service.situations.map((situation, index) => <article key={situation} data-service-reveal><span>0{index + 1}</span><h3>{situation}</h3></article>)}</div><div className="guide-effects" id="service-effects">{service.effects.map(effect => <article key={effect.title} data-service-reveal><h3>{effect.title}</h3><p>{effect.text}</p></article>)}</div></section>

        <section className="service-content-section guide-chapter guide-scope" id="service-scope" aria-labelledby="guide-scope-title"><div className="guide-chapter-heading" data-service-reveal><span className="guide-eyebrow">02 / WHAT WE DO</span><h2 id="guide-scope-title">{detail.scopeTitle[0]}<br/>{detail.scopeTitle[1]}</h2><p>{detail.scopeIntro}</p></div><ServiceExamples slug={service.slug}/>{detail.deliverables.length > 0 && <><div className="guide-deliverables">{detail.deliverables.map((item, index) => <article key={item.title} data-service-reveal><span className="guide-deliverable-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><ul aria-label={`${item.title} 작업 항목`}>{item.items.map(text => <li key={text}>{text}</li>)}</ul></article>)}</div><p className="guide-note">필요한 작업을 선택해 진행합니다. 안내된 모든 항목이 하나의 기본 상품에 포함되는 것은 아닙니다.</p></>}</section>

        <section className="service-content-section guide-chapter guide-process" id="service-process" aria-labelledby="guide-process-title"><div className="guide-chapter-heading" data-service-reveal><span className="guide-eyebrow">03 / HOW WE WORK</span><h2 id="guide-process-title">진행은 명확하게,<br/>확인은 단계마다</h2><p>처음 정한 범위와 일정을 기준으로 진행하며,<br/>각 단계에서 함께 확인할 내용을 안내합니다.</p></div><ol className="guide-process-list">{detail.process.map((step, index) => <li key={step.title} data-service-reveal><span className="guide-process-number">0{index + 1}</span>{service.slug === 'operations' && index === detail.process.length - 1 && <CircleCheck className="guide-process-complete" aria-hidden="true"/>}<h3>{step.title}</h3><p>{step.text}</p><span className="guide-checkpoint">{step.checkpoint}</span></li>)}</ol></section>

        <section className="service-content-section guide-chapter guide-pricing" id="pricing" aria-labelledby="guide-pricing-title"><div className="guide-chapter-heading" data-service-reveal><span className="guide-eyebrow">04 / SCOPE & PRICING</span><h2 id="guide-pricing-title">필요한 작업부터 정하고,<br/>비용을 안내합니다</h2><p>{service.pricing.summary}<br/>아래 유형을 참고해 필요한 범위를 알려주세요.</p></div><div className="guide-price-grid" data-count={detail.priceOptions.length}>{detail.priceOptions.map((option, index) => <article key={option.name} data-service-reveal><div className="guide-price-meta"><span>{service.english}</span><span>0{index + 1}</span></div><h3>{option.name}</h3><p className="guide-price-purpose">{option.purpose}</p><div className="guide-price-amount"><strong>상담 후 견적</strong><span>작업 범위 확인 후 개별 안내</span></div><ul>{option.items.map(item => <li key={item}>{item}</li>)}</ul><Link href={inquiryHref} prefetch={false} aria-label={`${option.name} 문의하기`}>프로젝트 문의 <ServiceArrow/></Link></article>)}</div><p className="guide-note">유형별 작업 예시입니다. 금액·작업 수량·수정 범위·일정은 상담 후 견적서에서 확정합니다.</p><div className="guide-estimate"><div data-service-reveal><span className="guide-eyebrow">ESTIMATE CHECKLIST</span><h3>견적은 이 기준으로<br/>달라집니다.</h3><ol>{service.pricing.factors.map((factor, index) => <li key={factor}><span>0{index + 1}</span>{factor}</li>)}</ol></div><div className="guide-cost-list" data-service-reveal>{detail.extraCosts.map(cost => <article key={cost.title}><h4>{cost.title}</h4><p>{cost.text}</p></article>)}<article><h4>계약 전에 함께 확인합니다</h4><p>최종 납품물, 수정·추가 작업의 기준, 일정, 부가세 포함 여부와 결제 조건을 견적서에서 확인합니다.</p></article></div></div><p className="guide-price-policy">{service.pricing.note}</p></section>

        <section className="service-content-section guide-chapter guide-faq" id="service-faq" aria-labelledby="guide-faq-title"><div data-service-reveal><span className="guide-eyebrow">05 / FAQ</span><h2 id="guide-faq-title">문의 전에<br/>확인해 보세요</h2></div><div className="guide-faq-list">{detail.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>

        <section className="service-inquiry guide-inquiry" aria-labelledby="guide-inquiry-title"><div data-service-reveal><p>LET’S WORK TOGETHER</p><h2 id="guide-inquiry-title">{detail.inquiry}</h2><span>{detail.preparation}</span></div><Link href={inquiryHref} prefetch={false}>{service.name} 문의 <ServiceArrow/></Link></section>
      </main>
      <ServiceFooter currentService={service.slug}/>
    </div>
  </ServiceDetailMotion>;
}
