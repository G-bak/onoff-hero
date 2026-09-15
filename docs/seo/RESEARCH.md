# Google·네이버 SEO 공식 자료 조사

확인일: **2026-09-15**. 공식 문서를 직접 열람한 뒤 온앤오프의 회사·서비스 소개 사이트에 해당하는 내용을 정리했다. 아래 ‘적용’은 해당 자료를 이 프로젝트에 맞춰 판단한 결과다. 쇼핑몰 상품 피드·뉴스·다국어·채용처럼 제공하지 않는 기능의 정책은 적용 대상으로 삼지 않았다.

## 1. 검색 발견과 색인

| 공식 자료 | 확인한 기준 | 온앤오프 적용 |
| --- | --- | --- |
| [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko) | 이용자에게 유용한 콘텐츠, 이해할 수 있는 구성과 링크를 제공한다. 기술 준수만으로 순위가 보장되지는 않는다. | 기존 서비스 범위·과정·견적 기준·FAQ를 유지하고 페이지별 검색 주제를 구분 |
| [네이버 검색엔진 최적화의 목적](https://searchadvisor.naver.com/guide/seo-basic-intro) | 사이트 등록·소유 확인, 검색로봇 접근, 콘텐츠 해석이 기본이다. | 공개 페이지의 색인 차단 해제와 별도 소유 확인 안내 |
| [Google robots 메타와 X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) | `noindex`는 색인을 막으며 HTTP 헤더로도 전달할 수 있다. 로봇이 접근해야 규칙을 읽을 수 있다. | 전체 레이아웃의 `noindex,nofollow` 제거, API 응답은 `noindex,nofollow` |
| [네이버 robots.txt](https://searchadvisor.naver.com/guide/seo-basic-robots) | 루트 경로에서 텍스트 규칙을 제공하고 수집할 페이지와 자료의 접근을 허용한다. | `/robots.txt`, 공개 문서·CSS·JS·이미지 허용, 사이트맵 위치 제공 |
| [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | 크롤링·렌더링·색인은 별도 과정이다. 링크, 올바른 상태 코드와 렌더링 자료 접근을 확인해야 한다. | 처음 받는 HTML에 본문·링크·메타데이터·JSON-LD 제공, 잘못된 주소는 실제404 |
| [네이버 JavaScript SEO](https://searchadvisor.naver.com/guide/seo-advanced-javascript) | 주요 HTML의 서버 렌더링을 권장하며 JS·CSS 수집을 허용해야 한다. fragment는 별도 문서 주소로 보지 않는다. | 홈 안의7개 화면은 하나의 문서, 서비스 상세5개는 고유 경로로 제공 |

`robots.txt`는 접근 권한이나 개인정보 보호 기능이 아니다. `/api/` 수집 제한과 API의 `X-Robots-Tag`를 함께 두었지만, 수집이 막히면 헤더도 읽을 수 없으므로 이미 색인된 주소의 삭제 보장으로 해석하지 않는다. API는 사이트맵·탐색 링크에서 제외하고 기존 서버 입력 검증·개인정보 정책을 유지한다.

## 2. 대표 주소와 사이트맵

| 공식 자료 | 확인한 기준 | 온앤오프 적용 |
| --- | --- | --- |
| [Google 중복 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | 영구 이동, canonical, 사이트맵이 같은 대표 URL을 가리키도록 한다. | `https://on-onf.com` 기준, www→대표 호스트308, 쿼리 없는 페이지 canonical |
| [네이버 사이트 구조](https://searchadvisor.naver.com/guide/markup-structure) | 중복 문서는 절대 주소 canonical로 대표 URL을 알리고, 대표 홈페이지 이동에는 HTTP redirect를 사용한다. | JavaScript 이동 없이 서버의 영구 이동과 HTML canonical 제공 |
| [네이버 리다이렉션](https://searchadvisor.naver.com/guide/seo-basic-redirect) | 주소가 바뀔 때 검색로봇이 해석할 수 있는 HTTP 응답으로 이동한다. | HTTPS www의 경로·쿼리를 보존해 정식 호스트로 이동 |
| [Google 사이트맵 작성](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | 색인할 절대 대표 URL을 담는다. `priority`·`changefreq`는 사용하지 않으며 `lastmod`는 중요한 실제 수정 시점이어야 한다. | 공개7개 경로만 XML에 포함; 근거 없는 수정 날짜·우선순위 생략 |
| [네이버 RSS·사이트맵 제출](https://searchadvisor.naver.com/guide/request-feed) | 사이트맵은 소유 확인한 사이트와 같은 도메인의 URL이어야 한다. 네이버 안내의 크기 제한은10MB다. | 동일 도메인 사이트맵1개; 실제 소식 피드가 없는 사이트에 가짜 RSS 생성 안 함 |

문의 선택값 `?service=web&from=web`이나 광고 추적값은 사용 기능에 필요할 수 있으므로 요청에서 보존한다. 검색에 알리는 canonical은 `/inquiry` 한 주소다. 홈의 섹션 ID와 JSON-LD의 `#organization` 같은 엔터티 식별자는 별도 검색 페이지가 아니며 사이트맵에 넣지 않는다.

HTTP→HTTPS는 기존 Cloudflare301 규칙이다. `http://www.on-onf.com`은 HTTPS www를 거쳐 대표 HTTPS로 이동할 수 있다. 정식 내부 링크와 제출 주소는 처음부터 HTTPS 대표 주소를 사용한다. 기존 workers.dev 주소는 사용자의 이전 요청대로 비활성 상태를 유지한다.

## 3. 제목·설명·콘텐츠

| 공식 자료 | 확인한 기준 | 온앤오프 적용 |
| --- | --- | --- |
| [네이버 콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content) | 페이지마다 고유하고 명확한 제목·설명을 작성한다. 같은 키워드의 반복이나 기계적 나열을 피한다. | 실제 제공하는 서비스명+온앤오프 브랜드명, 내용에 맞춘 설명 |
| [네이버 URL 안내](https://searchadvisor.naver.com/guide/seo-advanced-url) | 콘텐츠마다 접근 가능한 명확한 URL을 사용한다. | `/services/planning` 등 기존 상세 경로와 SSR 링크 유지 |
| [네이버 파비콘](https://searchadvisor.naver.com/guide/markup-favicon) | 검색로봇이 가져올 수 있는 사이트 아이콘을 제공한다. | 기존 투명32·64px PNG와 파비콘 경로 유지 |

공유용 제목·설명·대표 URL은 Open Graph에도 일치시킨다. 새 소셜 미리보기 이미지는 제작하지 않았다. 이미지 대체 텍스트는 사진의 실제 의미를 설명하고, 장식 이미지는 빈 alt를 유지한다. 키워드를 추가하려고 가상 사례를 실제 고객 실적으로 바꾸지 않는다.

### 페이지별 검색 의도

아래는 제공 중인 서비스와 본문에 근거한 편집 기준이다. 검색량·난도·경쟁 순위를 측정한 키워드 조사 결과는 아니다.

| 경로 | 이용자가 찾는 내용 | 제목의 주요 표현 |
| --- | --- | --- |
| `/` | 온앤오프 회사와 서비스 전체 | 온앤오프 ON&OFF, 브랜드 디자인·홈페이지 제작·마케팅 |
| `/services/planning` | 브랜드 메시지·홍보 방향을 먼저 정리 | 브랜드 기획·마케팅 전략 |
| `/services/design` | 로고·브랜드·상품 설명 화면 제작 | 로고·브랜드·상세페이지 디자인 |
| `/services/web` | 회사·브랜드 홈페이지 제작과 비용 기준 | 반응형 홈페이지·웹사이트 제작 |
| `/services/marketing` | 채널에 맞는 콘텐츠와 광고 운영 | SNS·블로그 콘텐츠 제작·광고 운영 |
| `/services/operations` | 기존 홈페이지 수정·점검과 추가 제작 | 홈페이지 운영·유지보수 |
| `/inquiry` | 상담·제작 문의를 실제로 남기기 | 프로젝트 상담·제작 문의 |

후속 콘텐츠는 승인된 실제 사례를 ‘고객의 문제 → 작업 범위 → 결과 → 측정 근거’ 순서로 추가한다. 가격·제작 기간·성과 수치는 확인된 값만 쓴다. 지역 키워드를 위해 실제 제공 범위가 확인되지 않은 지역별 복제 페이지를 만들지 않는다.

## 4. 구조화된 데이터

| 공식 자료 | 확인한 기준 | 온앤오프 적용 |
| --- | --- | --- |
| [Google Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) | 홈페이지에 실제 회사 정보를 표현해 조직을 구별할 수 있도록 한다. | 회사명·법인명·공개 연락처·주소·사업자번호·기존 로고 |
| [Google 사이트 이름](https://developers.google.com/search/docs/appearance/site-names) | 루트 홈페이지의 WebSite 정보와 사이트의 일관된 명칭이 기준이다. | 이름 ‘온앤오프’, 대체 이름 ‘ON&OFF’와 ‘온앤오프 ON&OFF’ |
| [Google Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) | 사용자에게 의미 있는 페이지 계층을 순서와 이름·URL로 전달한다. | 실제 상세 상단의 SERVICES→해당 서비스 경로와 일치 |
| [Google 구조화 데이터 일반 정책](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | 사용자에게 보이는 내용과 일치해야 하며 정확한 마크업만으로 리치 결과 노출이 보장되지 않는다. | 허구 리뷰·평점·가격·예약·검색 기능을 넣지 않음 |
| [네이버 구조화 데이터 소개](https://searchadvisor.naver.com/guide/structured-data-intro) | 문서의 의미를 검색로봇이 이해할 수 있도록 표준 구조를 사용한다. | 서버 HTML에 JSON-LD 제공; 일반 Service 의미 정보와 노출 보장은 구분 |
| [Google 2026년 문서 변경 이력](https://developers.google.com/search/updates) | FAQ 리치 결과는2026-05-07부터 중단됐고 관련 문서는6월에 정리됐다. `llms.txt`가 Google 검색 노출·순위에 필요하다는 주장은 공식 기준과 다르다. | 기존 FAQ 본문은 고객 안내로 유지; FAQ 리치 결과를 약속하거나 불필요한 파일을 추가하지 않음 |

Organization의 회사 값은 화면과 같은 `lib/consultation.ts`를 사용한다. Service는 상세 설명을 재사용한다. JSON-LD 문자열은 `<` 등을 이스케이프하여 입력이 script 태그를 끝내지 못하게 한다. 전용 검색창이 없는 사이트에 SearchAction을 넣지 않는다.

## 5. 성능·등록·지속 점검

| 공식 자료 | 확인한 기준 | 실행 기준 |
| --- | --- | --- |
| [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) | 주요 지표는 LCP·INP·CLS이며 실제 방문 경험을 확인해야 한다. | 모바일·PC를 나눠 LCP2.5초 이하, INP200ms 이하, CLS0.1 이하를 목표로 추적 |
| [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) | URL의 실험실 성능과 이용 가능한 실사용 데이터를 조회하는 도구다. | 이번 API는429로 측정 실패; 점수·통과 여부를 만들어내지 않음 |
| [Google 속성 추가](https://support.google.com/webmasters/answer/34592?hl=ko), [소유 확인](https://support.google.com/webmasters/answer/9008080?hl=ko) | 도메인 속성은 DNS로 인증한다. URL 접두어 속성은 다른 인증 수단도 있다. | `on-onf.com` 도메인 속성과 Cloudflare TXT 권장 |
| [Google 사이트맵 보고서](https://support.google.com/webmasters/answer/7451001?hl=ko), [URL 검사](https://support.google.com/webmasters/answer/9012289?hl=ko) | 사이트맵 처리 상태와 개별 URL의 수집·색인 상태를 구분한다. | 등록 후 사이트맵 성공 확인, 대표 페이지 URL 검사 |
| [네이버 수집 요청](https://searchadvisor.naver.com/guide/request-crawl), [SEO 보고서](https://searchadvisor.naver.com/guide/report-seo) | 수집 요청과 검색 노출은 별개이며 보고서에서 문제를 확인해야 한다. | 홈페이지·핵심 상세 수집 요청 후 수집·색인·진단 결과 확인 |

기존 자체 호스팅 글꼴·반응형 이미지·장면별 지연 로딩과 화면 밖 GPU 정리를 유지한다. 6.8초 오프닝과 고해상도3D의 실제 모바일 비용은 추후 실사용·성능 측정 대상이다. 점수 없이 품질이나 브랜드 연출을 임의로 낮추지 않는다.

메타데이터가 본문 뒤로 스트리밍되는 현상을 HTTP로 확인하여 `htmlLimitedBots: /.*/`로 모든 요청의 `<head>`를 먼저 완성한다. 이 사이트의 메타데이터는 외부 API를 기다리지 않는다. [Next.js 설정 공식 설명](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots)을 참고하고, 설치된 Vinext의 실제 지원 코드와 응답도 확인했다.

실제 등록 방법은 [Google 안내](GOOGLE-SEARCH-CONSOLE.md)와 [네이버 안내](NAVER-SEARCH-ADVISOR.md), 검증 결과와 미측정 항목은 [구현 기록](IMPLEMENTATION.md)을 따른다.
