import type { Metadata, MetadataRoute } from 'next';

export const siteOrigin = 'https://on-onf.com';
export const siteName = '온앤오프';
export const socialPreviewImage = {
  url: `${siteOrigin}/og.png`, width: 1200, height: 630, type: 'image/png',
  alt: '온앤오프 ON&OFF | 당신은 사업만 ON, 복잡한 마케팅은 OFF',
};

// Canonical URLs describe public pages, never navigation or campaign parameters.
export const seoPages = [
  { path: '/', title: 'ON&OFF | 광고·웹디자인·브랜딩 에이전시', description: 'ON&OFF는 광고·마케팅, 웹사이트 제작, 브랜딩·디자인, 콘텐츠 제작을 한 팀에서 진행하는 크리에이티브 에이전시입니다.' },
  { path: '/services/planning', title: '브랜드 기획·마케팅 전략 | 온앤오프 ON&OFF', description: '브랜드 현황과 고객을 분석하고 핵심 메시지, 홍보 채널, 제작 우선순위를 정리합니다. 온앤오프의 기획·전략 서비스 범위와 진행 과정, 견적 기준을 확인하세요.' },
  { path: '/services/design', title: '평택 로고디자인·브랜딩 디자인 | ON&OFF', description: '평택 로고디자인 ON&OFF는 로고 제작부터 브랜드 아이덴티티, 그래픽 디자인까지 브랜드에 필요한 디자인을 기획·제작합니다.' },
  { path: '/services/web', title: '평택 웹디자인·홈페이지 제작 | ON&OFF', description: '평택 웹디자인 ON&OFF는 기업 홈페이지, 브랜드 사이트, 반응형 웹사이트의 기획·디자인·개발을 제공합니다. 목적에 맞는 홈페이지 제작을 진행합니다.' },
  { path: '/services/marketing', title: '평택 광고대행사 | SNS·콘텐츠·광고 운영 - ON&OFF', description: '평택 광고대행사 ON&OFF는 SNS·블로그 콘텐츠 제작, 광고 소재 제작 및 광고 운영을 제공합니다. 콘텐츠 기획부터 채널 운영, 광고까지 브랜드에 맞춰 진행합니다.' },
  { path: '/services/operations', title: '홈페이지 운영·유지보수 | 온앤오프 ON&OFF', description: '홈페이지의 문구·사진 수정과 화면·링크 점검, 새 페이지·기능 제작이 필요한 경우를 나눠 안내합니다. 온앤오프의 운영·유지관리 범위와 요청 방법, 비용 기준을 확인하세요.' },
  { path: '/inquiry', title: '프로젝트 상담·제작 문의 | 온앤오프 ON&OFF', description: '온앤오프에 브랜드 기획, 디자인, 홈페이지 제작, 콘텐츠·마케팅, 운영·유지관리를 문의하세요. 필요한 서비스와 프로젝트 내용을 정리해 상담을 요청할 수 있습니다.' },
] as const;

export function pageMetadata(path: string): Metadata {
  const page = seoPages.find(page => page.path === path);
  if (!page) throw new Error(`No SEO page configured for ${path}`);
  const url = siteOrigin + page.path;
  return {
    title: page.title, description: page.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'ko_KR', siteName, url, title: page.title, description: page.description, images: [socialPreviewImage] },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [{ url: socialPreviewImage.url, alt: socialPreviewImage.alt }] },
  };
}

export function sitemapEntries(): MetadataRoute.Sitemap {
  // Do not manufacture a fresh lastmod on every build or request.
  return seoPages.map(page => ({ url: siteOrigin + page.path }));
}

export function robotsRules(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${siteOrigin}/sitemap.xml` };
}

export function verificationMetadata(values: { google?: string; naver?: string }): Metadata['verification'] {
  const google = values.google?.trim();
  const naver = values.naver?.trim();
  if (!google && !naver) return undefined;
  return { ...(google ? { google } : {}), ...(naver ? { other: { 'naver-site-verification': naver } } : {}) };
}

type Company = { name: string; businessNumber: string; address: string; phone: string; email: string };
type Service = { slug: string; name: string; intro: string };

export function homeStructuredData(company: Company) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': `${siteOrigin}/#organization`,
        name: siteName, alternateName: 'ON&OFF', legalName: company.name, url: `${siteOrigin}/`,
        logo: { '@type': 'ImageObject', url: `${siteOrigin}/images/onoff-logo.png`, width: 420, height: 211 },
        description: seoPages[0].description,
        email: company.email, telephone: company.phone.replace(/^0/, '+82-'),
        identifier: { '@type': 'PropertyValue', name: '사업자등록번호', value: company.businessNumber },
        address: { '@type': 'PostalAddress', streetAddress: company.address, addressCountry: 'KR' },
      },
      {
        '@type': 'WebSite', '@id': `${siteOrigin}/#website`, url: `${siteOrigin}/`,
        name: siteName, alternateName: ['ON&OFF', '온앤오프 ON&OFF'], inLanguage: 'ko-KR',
        publisher: { '@id': `${siteOrigin}/#organization` },
      },
      { '@type': 'WebPage', '@id': `${siteOrigin}/#webpage`, url: `${siteOrigin}/`, name: seoPages[0].title, description: seoPages[0].description, inLanguage: 'ko-KR', isPartOf: { '@id': `${siteOrigin}/#website` }, about: { '@id': `${siteOrigin}/#organization` } },
    ],
  };
}

export function serviceStructuredData(service: Service) {
  const page = seoPages.find(page => page.path === `/services/${service.slug}`);
  if (!page) throw new Error(`No public service page for ${service.slug}`);
  const url = siteOrigin + page.path;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: 'ko-KR', isPartOf: { '@id': `${siteOrigin}/#website` }, mainEntity: { '@id': `${url}#service` }, breadcrumb: { '@id': `${url}#breadcrumb` } },
      { '@type': 'Service', '@id': `${url}#service`, url, name: service.name, serviceType: service.name, description: service.intro, provider: { '@id': `${siteOrigin}/#organization` } },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SERVICES', item: `${siteOrigin}/` },
        { '@type': 'ListItem', position: 2, name: service.slug === 'web' ? '웹사이트 제작' : service.name, item: url },
      ] },
    ],
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
