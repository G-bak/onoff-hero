import type { ReactNode } from 'react';
import Link from './page-link';
import { ServiceArrow } from './service-arrow';
import { companyInfo } from '@/lib/consultation';
import { services } from '@/lib/services';
import { inquiryPrivacyNotice, inquiryOverseasNotice } from '@/lib/inquiry-privacy';

export default function ServiceFooter({ currentService, children }: {
  currentService: typeof services[number]['slug'];
  children?: ReactNode;
}) {
  return <footer className="service-footer" aria-label="온앤오프 회사 정보와 이용 안내">
    <div className="service-footer-head">
      <Link className="service-footer-brand" href="/#home" prefetch={false} aria-label="ON&OFF 홈">
        ON&OFF<span>ALL-IN-ONE AGENCY</span>
      </Link>
      <p>기획부터 제작·운영까지,<br/>한 팀에서 이어갑니다.</p>
    </div>

    <div className="service-footer-grid">
      <section className="service-footer-company" aria-labelledby="footer-company-title">
        <h2 className="service-footer-heading" id="footer-company-title">{companyInfo.name}</h2>
        <dl className="service-footer-facts">
          <div><dt>대표이사</dt><dd>{companyInfo.representative}</dd></div>
          <div><dt>사업자번호</dt><dd>{companyInfo.businessNumber}</dd></div>
          <div className="service-footer-address"><dt>주소</dt><dd>{companyInfo.address}</dd></div>
        </dl>
      </section>
      <section className="service-footer-contact" aria-labelledby="footer-contact-title">
        <h2 className="service-footer-heading" id="footer-contact-title">문의</h2>
        <dl>
          <div><dt>회사번호</dt><dd><a className="service-footer-phone" href={`tel:${companyInfo.phone.replaceAll('-', '')}`}>{companyInfo.phone}</a></dd></div>
          <div><dt>이메일</dt><dd><a className="service-footer-email" href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></dd></div>
        </dl>
        <Link className="service-footer-inquiry" href={`/inquiry?service=${currentService}&from=services`} prefetch={false}>프로젝트 문의 <ServiceArrow/></Link>
      </section>
      <nav className="service-footer-services" aria-labelledby="footer-services-title">
        <h2 className="service-footer-heading" id="footer-services-title">서비스</h2>
        <ul>{services.map(service => <li key={service.slug}>
          {service.slug === currentService
            ? <span className="service-footer-current" aria-current="page">{service.name}</span>
            : <Link href={`/services/${service.slug}`} prefetch={false}>{service.name}<ServiceArrow/></Link>}
        </li>)}</ul>
      </nav>
    </div>

    <div className="service-footer-notices">
      <details className="service-footer-disclosure">
        <summary>개인정보 처리 안내 <span aria-hidden="true">+</span></summary>
        <div className="service-footer-privacy">
          <section><h3>프로젝트 문의 개인정보 수집·이용</h3><p>{inquiryPrivacyNotice}</p></section>
          <section><h3>개인정보 국외 처리위탁</h3><p>{inquiryOverseasNotice}</p></section>
        </div>
      </details>
      {children}
    </div>
    <div className="service-footer-bottom">
      <small>© 2026 ON&OFF. All rights reserved.</small>
      <nav aria-label="푸터 바로가기"><Link href="/#services" prefetch={false}>전체 서비스</Link><a href="#service-main">맨 위로 ↑</a></nav>
    </div>
  </footer>;
}
