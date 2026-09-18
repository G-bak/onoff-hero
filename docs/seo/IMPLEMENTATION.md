# SEO 구현과 검증 기록

기준일: **2026-09-15**. 사용자가 공식 SEO 자료 조사·문서 작성·코드 개선·GitHub 반영·운영 배포를 요청했다. 대표 사이트는 **https://on-onf.com/** 이며 기존 `main` → Cloudflare Workers Builds를 사용한다.

## 2026-09-18 OG 이미지 로컬 적용

10:00 KST 사용자 제공v2 이미지 운영 배포를 완료했다. 소스 커밋 `011c38b32918cda8bc856ae7f9e11deb983f1653`의 자동 빌드 성공과 실제 Worker100% 배포를 확인했으며 공개7페이지 OG/X 연결·원본 이미지 일치·기존 SEO/네이버 인증·robots/sitemap 보존 검사를 통과했다. 아래 로컬 적용과 배포 진행 문장은 해당 시점의 이력이다. 이 완료 기록은 로컬에만 남긴다.

후속 사용자 요청으로 현재 변경 전체의 GitHub 반영·운영 배포를 진행한다. 아래 로컬 전용 상태는 검토 당시 이력이며 실제 운영 완료 여부는 [배포 기록](../operations/DEPLOYMENT-NOTES.md)을 따른다.

최신 선택: 사용자가 직접 첨부한 [OG 이미지 v2](../../design/og/v2/README.md)로 `public/og.png`를 교체했다. PNG1200×630 원본을 수정 없이 사용하며 `lib/seo.ts`의 이미지 너비·높이·대체 텍스트를 맞췄다. 공개7페이지의 공통 OG/X 연결과 기존 제목·설명·canonical·인증·robots/sitemap·UI는 유지한다. 로컬 반영 상태이며 운영 배포하지 않았다. 아래 생성 이미지 내용은 최초 적용 이력이다.

사용자가 선택한 [OG 이미지 시안](../../design/og/v1/README.md)을 `public/og.png`로 복사했다. 생성 원본1730×909 PNG를 변경 없이 사용한다. `lib/seo.ts`의 공통 메타데이터에서 공개7페이지에 `og:image`·너비·높이·형식·대체 텍스트와 `twitter:image`·`summary_large_image`를 설정한다. 이미지 URL은 대표 주소 기반 `https://on-onf.com/og.png`다. 각 페이지의 제목·설명·canonical, 네이버 인증값, robots/sitemap 및 기존 UI는 유지한다. 로컬 적용 상태이며 운영 배포는 하지 않았다.

로컬 `npm run ci:build`와 SEO HTTP 검사를 통과했다. 공개7페이지의 OG/X 이미지 태그·크기·형식·대체 텍스트, 이미지200 응답과 생성 원본/빌드 파일 바이트 일치를 확인했다. 변경 전 응답과 비교해 본문 main·CSS 참조·기존 제목/설명·canonical·인증 태그 상태 및 robots/sitemap이 동일하다. 실제 메신저 공유 미리보기와 운영 배포는 검증 범위에 포함하지 않는다. 상세 결과는 Git 제외 `outputs/qa/2026-09-18/og-image/verification.json`에 보관한다.

## 2026-09-18 지역 검색 메타데이터

사용자 제공 title/description을 HOME·마케팅·웹·디자인에 그대로 반영한다. title은 아래와 같으며 description의 단일 원본은 `lib/seo.ts`다.

| 페이지 | title |
| --- | --- |
| `/` | ON&OFF \| 광고·웹디자인·브랜딩 에이전시 |
| `/services/marketing` | 평택 광고대행사 \| SNS·콘텐츠·광고 운영 - ON&OFF |
| `/services/web` | 평택 웹디자인·홈페이지 제작 \| ON&OFF |
| `/services/design` | 평택 로고디자인·브랜딩 디자인 \| ON&OFF |

기획·운영·문의의 고유 title/description은 유지한다. 공통 `pageMetadata`를 통해 Open Graph·Twitter 제목/설명이 페이지 메타데이터와 일치하며 WebPage 구조화 데이터도 같은 원본을 따른다. canonical은 각 실제 URL을 사용한다. 기존 네이버 인증값은 운영 runtime secret에 유지하며 robots/sitemap 설정과 공개 경로7개는 변경하지 않는다.

디자인·애니메이션·UI 코드와 화면의 메인 카피·제목은 유지한다. 사용자 선택 요청에 따라 마케팅/디자인 작업 안내에 **평택 광고대행사 / 평택 로고디자인**, 웹의 자료 준비 FAQ 답변에 **평택 홈페이지 제작**을 각각 본문1회만 넣는다. 기존 설명의 의미와 안내 조건을 보존하고 별도 keywords 태그는 추가하지 않는다. 기존 SEO 회귀 검사의 브랜드 표기를 ON&OFF에 맞추며 HTTP 검사에 실제 `og:title`·`og:description` 일치 검증을 포함한다. 실제 배포 결과는 [배포 기록](../operations/DEPLOYMENT-NOTES.md)을 따른다.

로컬 검증: `npm run ci:build`의162개 검사·린트·타입·프로덕션 빌드·CSS/자산 검사를 통과했다.7개 페이지 HTTP/SSR 검사에서 사용자 지정 문구·고유 제목/설명·Open Graph/Twitter 일치·canonical을 확인했다. 변경 전 HTML과 비교해 본문은 지정한 설명3곳만 바뀌고 모든 제목·나머지 main 마크업, robots/sitemap 응답은 그대로임을 확인했다. 실제 브라우저 시각 검수는 수행하지 않았다. 근거는 Git 제외 `outputs/deploy/2026-09-18/local-seo/local-verification.json`, `outputs/logs/local-seo-ci-20260918.log`·`local-seo-http-20260918.log`에 있다.

운영 검증: 2026-09-18 09:12 KST 소스 `d241d16`의 자동 배포가 성공했다. 기본 DNS의7개 공개 페이지에서 요청 메타데이터·고유 제목/설명·Open Graph/Twitter·canonical·네이버 인증 태그 보존을 확인했다. 변경 전 운영 HTML과 비교해 본문은 승인된 설명3곳만 바뀌고 나머지 main 마크업·모든 제목·CSS 참조, robots/sitemap 원문은 동일하다. 운영 SEO·www308·404·Googlebot/Yeti 응답과 문의 GET 활성 검사도 통과했다. `production-verification.json`·`seo-production.log`·`cloudflare-verification.json`·`deployment.json`을 위 Git 제외 폴더에 보관하며 검색엔진의 실제 재수집·색인 완료로 설명하지 않는다. 이 완료 기록은 로컬만 유지한다.

## 발견한 문제와 변경

| 우선순위 | 변경 전 확인 | 적용 내용 |
| --- | --- | --- |
| 필수 | 루트의 `noindex,nofollow`를 모든 공개 페이지가 상속 | 공개 페이지 `index,follow`; 오류 페이지의404·noindex 유지 |
| 필수 | canonical 없음, www에서도 같은 문서200 | 페이지별 HTTPS 대표 URL; HTTPS www→대표 호스트308 |
| 필수 | `/sitemap.xml`404 | 루트 XML 사이트맵으로 공개7개 URL 제공 |
| 필수 | robots에는 Cloudflare 관리 설명만 존재 | 공개 페이지·렌더링 자산 수집 허용과 사이트맵 안내 |
| 중요 | 서비스 제목이 서비스명·브랜드 정도로만 구성 | 실제 서비스 주제를 포함한 고유 한국어 제목·설명 |
| 중요 | 구조화된 회사·사이트·서비스 정보 없음 | HOME Organization·WebSite·WebPage, 상세 Service·WebPage·BreadcrumbList |
| 중요 | 메타데이터를 스트리밍할 때 head 뒤에 출력 | 모든 요청에서 head를 완성한 뒤 출력하도록 설정 |
| 중요 | 검색 도구 소유 확인 설정 경로 없음 | 계정별 Google·네이버 HTML 인증값 선택 지원과 등록 안내 |
| 유지 | 본문 SSR, 서비스 링크, 이미지 alt·파비콘 존재 | 기존 내용을 보존하고 HTTP 검사에 포함 |

기존 HOME 클라이언트 코드는 내용 변경 없이 `app/home-content.tsx`로 옮겼다. `app/page.tsx`는 서버에서 HOME 메타데이터·JSON-LD를 내리고 기존 화면을 부르는 작은 진입점이다. 이에 맞춰 기존 컴포넌트 테스트와 로고의 린트 예외 경로를 갱신했다. 서비스 상단의 현재 위치 안내는 같은 디자인의 의미 있는 `nav`와 `aria-current`로 표현한다.

## 코드의 공통 원본

| 파일 | 역할 |
| --- | --- |
| [lib/seo.ts](../../lib/seo.ts) | 대표 도메인,7개 제목·설명·canonical, robots·sitemap, 구조화 데이터, 안전한 직렬화, 인증 태그 값 |
| [app/layout.tsx](../../app/layout.tsx) | 공통 언어·색인 허용·파비콘·요청 시 인증값 읽기 |
| [app/page.tsx](../../app/page.tsx) | HOME 서버 메타데이터와 회사·사이트 JSON-LD |
| [app/services/[slug]/page.tsx](../../app/services/%5Bslug%5D/page.tsx) | 서비스별 메타데이터·JSON-LD, 없는 서비스404 |
| [app/inquiry/page.tsx](../../app/inquiry/page.tsx) | 문의 페이지 제목·설명·쿼리 없는 canonical |
| [app/robots.ts](../../app/robots.ts), [app/sitemap.ts](../../app/sitemap.ts) | 프레임워크의 텍스트·XML 메타데이터 경로 |
| [next.config.ts](../../next.config.ts) | 메타데이터 스트리밍 해제, API X-Robots-Tag |
| [middleware.ts](../../middleware.ts) | 요청의 경로·쿼리를 그대로 보존하는 www 영구 이동 |
| [lib/consultation.ts](../../lib/consultation.ts) | 화면과 JSON-LD가 공유하는 확정 회사 정보 |

추가 서비스 페이지를 만들면 서비스 콘텐츠와 함께 `seoPages`도 갱신한다. 제목·설명은 본문과 같아야 한다. canonical의 경로, 서비스 구조화 데이터, 사이트맵 URL을 따로 복제 관리하지 않는다. 존재하지 않는 페이지에 HOME canonical을 기본 상속하지 않는다.

공유용 제목·설명은 Open Graph·Twitter 텍스트 메타데이터로도 제공한다. 새 공유 이미지를 생성하거나 추가하지 않았다. 페이지별 실제 수정일을 관리하지 않는 상태에서 배포 시각을 `lastmod`로 쓰지 않는다.

## 선택형 소유 확인값

2026-09-17 사용자 제공 네이버 인증값을 운영 `NAVER_SITE_VERIFICATION`에 추가하고 배포했다. 기본 DNS로 공개7페이지의 head에 정확한 태그1개와 Yeti 헤더의 홈페이지 응답을 확인했다. 기존 출력 기능을 사용해 앱 소스·자동 배포 설정은 변경하지 않았다. 네이버 계정에서 소유 확인을 누르는 단계와 실제 색인은 별개다. [배포 기록](../operations/DEPLOYMENT-NOTES.md)을 따른다.

| 실행 환경 이름 | 출력되는 태그 |
| --- | --- |
| `GOOGLE_SITE_VERIFICATION` | `google-site-verification` |
| `NAVER_SITE_VERIFICATION` | `naver-site-verification` |

입력은 발급된 meta 태그의 **content 값만** 사용한다. 값이 없으면 태그를 생성하지 않는다. 비밀번호·웹훅·API 키를 HTML에 출력하는 기능이 아니다. Google 도메인 속성의 DNS 인증을 선택하면 Google HTML 변수는 불필요하다. 실행 환경에 값을 추가하는 절차는 [Google 안내](GOOGLE-SEARCH-CONSOLE.md)와 [네이버 안내](NAVER-SEARCH-ADVISOR.md)에 있다.

## 자동 검사

```powershell
npm.cmd run ci:build
npm.cmd run check:seo -- http://localhost:5187
npm.cmd run check:seo -- https://on-onf.com
```

`ci:build`에 SEO 회귀8개를 포함한다. 전체 기존 테스트·문서 링크·린트·타입 검사와 프로덕션 빌드·CSS/자산 검사를 함께 실행한다. `check:seo`는 실행 중인 사이트에 GET만 보내는 별도 HTTP/SSR 검사다. 로컬 미리보기는 `npm.cmd run preview:node`로 실행한다.

### 회귀 검사 범위

- 7개 URL·제목·설명의 고유성과 canonical·사이트맵 일치
- 없는 경로·API·해시·쿼리가 SEO 문서 정의에 섞이지 않는지
- 공개 수집 규칙과 사이트맵 위치
- 확정 회사 연락처와 JSON-LD 일치, 서비스·회사·경로 연결
- JSON-LD의 `</script>` 삽입 방지와 원문 보존
- 계정값 없이 인증 태그가 생성되지 않는지
- 실제 middleware 응답으로 www만 영구 이동하고 경로·문의 선택·인코딩·반복 쿼리와 다른 호스트를 유지하는지

### HTTP/SSR 검사 범위

- 홈·상세5개·문의 모두200, 고유 제목·설명, head 안 canonical·Open Graph·색인 허용
- 언어 `ko`, 모바일 viewport, 각 페이지 h1 한 개
- 서버 HTML의 회사·서비스 JSON-LD 파싱과 서비스 이동 링크, 이미지 alt
- HTML이 참조하는 CSS·JavaScript 자산의200 응답
- robots 텍스트와 사이트맵 XML의 상태 코드·MIME·정확한7개 URL
- 없는 일반 경로와 서비스 경로의 실제404, noindex, 잘못된 canonical 미상속
- 문의 선택·광고 쿼리 접근 시 정식 `/inquiry` canonical
- 문의 API GET200, `no-store`, `X-Robots-Tag:noindex,nofollow`
- Googlebot·Yeti User-Agent의 대표 HTML·robots·sitemap 응답
- 운영에서는 HTTPS www의 홈·상세·robots·sitemap308 및 상세 쿼리 보존

실제 통과 여부는 아래 기록과 배포 로그를 기준으로 한다. User-Agent를 바꾼 요청은 네이버·Google 서버의 실제 크롤링이나 색인 완료를 증명하지 않는다. 로컬 Vite는 외부 Host 요청을 차단하므로 www HTTP 이동은 운영에서 확인하고 로컬에서는 middleware 응답 회귀 검사를 사용한다.

## 현재 검증 기록

- 2026-09-15 로컬 `npm run ci:build`의 전체161개 검사(SEO 회귀8개 포함), 문서 링크·린트·TypeScript·프로덕션 빌드·CSS/자산 검사에 통과했다. HTTP/SSR 검사도 통과했다.
- SEO 문서 외부 링크35개를 검사해34개 정상 응답·깨진 링크0개를 확인했다. Cloudflare 로그인 대시보드1개는403으로 자동 HTTP 확인 불가이며 인증 후 접근하는 관리 화면이다.
- 루트·서비스 메타데이터가 본문 뒤로 내려오던 스트리밍 상태를 재현하고, 설정 반영 후 head 안 출력까지 확인했다.
- 첫 운영 검증에서 설정형 www redirect가 쿼리를 누락하는 문제를 발견했다. URL의 호스트·프로토콜만 바꾸는 middleware로 수정하고 문의 선택값·광고 추적값·인코딩·반복 쿼리의 보존을 검사에 포함했다.
- 2026-09-15 15:19 KST의 최종 소스 배포 후 `check:seo` 운영 검사를 통과했다. HTTPS www의5개 경로308·쿼리 보존,7개 공개 페이지·robots·sitemap·404·API·검색로봇 User-Agent 검사가 포함된다. 추가로 직접 참조 자산19개200, 문의 활성 상태, HTTP→HTTPS301과 임시 주소404를 확인했다. 정확한 소스·버전·검증 범위는 [배포 기록](../operations/DEPLOYMENT-NOTES.md)을 따른다.
- 비교 HTML·로컬 HTTP 결과·PageSpeed 응답은 Git 제외 `outputs/qa/2026-09-15/seo/`에 보관한다. 원격 배포·운영 HTTP 결과는 Git 제외 `outputs/deploy/2026-09-15/seo/`에 남긴다.

## 측정하지 않은 항목

- Google·네이버의 실제 계정 소유 확인, 사이트맵 제출, 검색 색인·노출·순위
- 실제 Google Rich Results Test·네이버 진단 화면 결과; JSON-LD는 로컬 구조·실제 응답 파싱 검증
- 실제 브라우저의 모바일·데스크톱 클릭·시각 검수와 이번 변경 후 Core Web Vitals
- 실제 문의 전송·Slack 메시지 수신; 기존 API 상태 조회만 수행

2026-09-15 Google PageSpeed Insights 모바일 API 요청은 **HTTP429, 일일 쿼리 한도 초과**로 실패했다. Lighthouse 점수·LCP·INP·CLS 결과를 얻었다고 보고하지 않는다. [PageSpeed Insights](https://pagespeed.web.dev/)에서 이후 모바일·데스크톱 각각 측정하고, Search Console에 실사용 데이터가 쌓이면 함께 확인한다. 목표는 LCP2.5초 이하·INP200ms 이하·CLS0.1 이하이나 이번 작업의 통과 수치가 아니다. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).

## 운영자가 이어서 할 일

1. [Google 등록](GOOGLE-SEARCH-CONSOLE.md)과 [네이버 등록](NAVER-SEARCH-ADVISOR.md)의 실제 계정 소유 확인을 완료한다.
2. 양쪽에 `https://on-onf.com/sitemap.xml`을 제출하고 처리 결과를 확인한다.
3. 대표 페이지를 검사·수집 요청하고 수집 시각과 색인 상태를 기록한다.
4. 첫 달 주1회, 이후 월1회와 주요 배포 후 상태·검색 유입·성능을 확인한다.
5. 실측 데이터와 실제 제작 사례를 근거로 제목·설명·콘텐츠와 성능을 개선한다.

| 운영 기록 항목 | 의미 |
| --- | --- |
| 사이트맵 처리 상태·최근 읽은 날짜 | 검색엔진이 변경 목록을 가져갔는지 |
| 정식 페이지의 색인 상태·제외 이유 | 실제 노출 후보인지, 중복·오류가 있는지 |
| 검색어·페이지별 노출·클릭·CTR | 어떤 문의 의도로 방문하는지 |
| 모바일·PC 실사용 성능 | 화면이 뜨고 반응하는 경험이 충분한지 |
| 회사 정보·서비스 내용 수정 이력 | 사용자에게 보이는 내용과 SEO 정보가 계속 일치하는지 |

robots 수집 허용, 사이트맵 성공, SEO 코드 검사는 서로 다른 확인 단계다. 어느 하나만으로 검색 상위 노출이나 영구적인 ‘완벽한 SEO’를 보장하지 않는다. 적용 근거는 [공식 자료 조사](RESEARCH.md)를 따른다.
