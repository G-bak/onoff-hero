# SEO 구현과 검증 기록

기준일: **2026-09-15**. 사용자가 공식 SEO 자료 조사·문서 작성·코드 개선·GitHub 반영·운영 배포를 요청했다. 대표 사이트는 **https://on-onf.com/** 이며 기존 `main` → Cloudflare Workers Builds를 사용한다.

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
- 배포 전 전체 검사와 실제 운영 검증 결과는 [배포 기록](../operations/DEPLOYMENT-NOTES.md)의 이번 SEO 항목을 따른다.
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
