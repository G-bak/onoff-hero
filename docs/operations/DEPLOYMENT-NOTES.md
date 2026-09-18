# 배포 기록

## 2026-09-18 — 내부 링크 해시 제거·고객님 호칭

- 사용자가 상세 로고의 `/#home` 재발을 지적하고 전체 내부 이동 해시 제거·재배포를 요청했다. 모든 내부 섹션 링크를 실제 페이지 URL과 별도 목적지 속성으로 분리했다. 공통 제어기가 경로 전환·지연된 본문·HOME 로더 후 이동을 처리하며 기존 해시 주소의 query/router state와 뒤로가기 복원을 보존한다. 상세 목차 활성 표시도 새 속성을 따른다.
- 앞선 로컬 메인/OG/X 호칭과 OG v3, 날짜별 작업 일지 및 완료 기록을 함께 반영한다. 아래 항목의 과거 로컬 전용 표기는 이번 배포 승인 전 이력이다. 기존 GitHub main → 회사 계정 Cloudflare 자동 배포를 사용한다.
- 최종 `npm run ci:build`를 통과했다. 이동 회귀 검사12개와 로컬7페이지의 내부 링크157개·섹션 링크87개를 확인했다. 모든 내부 href에 해시가 없고 대상 ID가 존재한다. 변경 전과 비교해 링크 속성·승인된 고객님 호칭 외 본문, 제목/설명·canonical·robots/sitemap, 카드3개가 유지된다. 새 OG 파일200/바이트 일치·문의 GET 활성·문의 query 복귀를 확인했다. 실제 브라우저 클릭/화면 검수와 문의 전송은 수행하지 않았다.
- 배포 전 회사 계정·main 전용 빌드 명령/트리거·임시 URL 비활성을 재확인했다. 검증 근거는 Git 제외 `outputs/qa/2026-09-18/clean-navigation/` 및 `outputs/deploy/2026-09-18/clean-navigation/`에 보관한다. 실제 배포 완료는 후속 기록한다. 로컬 서버·DNS·PC 설정은 유지한다.

> 날짜별 배포 이력이다. 현재 운영 버전은 실제 Worker 배포와 GitHub 커밋을 함께 확인한다. 2026-09-13 초기 점검은 로컬이었으며, 최신 사용자가 실제 Slack 테스트 후 전체 GitHub 반영·배포를 승인했다.

## 2026-09-18 — 마케팅 사용자 제공 카드3개

- **12:56 KST 운영 배포 완료:** 소스 커밋 `d722d2c923b5da3b5797cf910d7093f67f50c51d`을 GitHub main에 반영했다. 해당 SHA의 Workers Builds 체크는 completed/success, Build `a867ee3e-e8b3-4368-b368-5e5eb246af11`은 stopped/success다. 체크가 보고한 버전 `c771f259-68fb-49c3-b674-1c7e576ee6df`와12:56:32 KST 배포 `125545bd-ef37-4e32-87a8-cc7b1b14413d`의100% 버전이 일치한다.
- 12:57 KST 기본 DNS에서 공개7페이지200과 새 카드3개의 실제720×1460 크기·무손실 실행 파일 SHA-256·빌드 CSS 일치를 확인했다. 배포 전 main 비교에서 카드 이미지 영역3곳·블로그 분류만 변경됐으며 HOME/HERO와 다른 페이지는 동일하다.7페이지 OG/SEO/네이버 인증, robots/sitemap·OG 원본 보존, 문의 GET enabled=true·로컬 서버200, www308과404 noindex 검사를 통과했다. workers.dev/Preview 비활성도 유지한다.
- 실제 브라우저 시각 검수와 문의 전송은 수행하지 않았다. 원본 결과는 `cloudflare-deployment.json`, `deployment.json`, `production-verification.json`, `production-seo.log`에 보관한다. 완료 기록은 로컬에만 남기며 문서 기록만을 위한 추가 배포는 하지 않는다.

- 사용자가 마케팅 상세02의 SNS·블로그·캠페인 교체본 배포를 요청했다. 사용자 제공720×1460 PNG3개와 픽셀을 보존한 무손실 WebP3개·재현 스크립트·기록을 GitHub main에 반영한다. 상세02에서만 새 이미지를 사용하고 SNS의 기존 HTML 게시물 틀 중복을 제거한다. 블로그 분류는 `HEALTH / BLOG`, 기본 프레임 비율은720/1460이다.
- 최종 앱 소스의 `npm run ci:build`를 통과했고 로컬7페이지 HTTP200·변경 범위 제한·메타데이터 보존·실제 이미지3개 크기/해시와 원본 픽셀 일치를 확인했다. 이후 앱 변경은 없어 통과한 빌드를 재사용한다. HOME·HERO·다른 서비스·본문 문구·가상 시안 고지·OG/SEO는 유지한다.
- 회사 계정·main 전용 GitHub 자동 배포·secret3개·workers.dev/Preview 비활성을 읽기 확인했다. 기존 자동 배포의 성공과 실제 운영 페이지·이미지를 확인한 뒤 완료를 기록한다. DNS·PC 설정과 기존 로컬 서버는 유지한다. 검증 원본은 Git 제외 `outputs/deploy/2026-09-18/marketing-cards-v2/`에 보관한다.

## 2026-09-18 — 사용자 제공 공통 OG 이미지

- **10:00 KST 배포 완료:** 소스 커밋 `011c38b32918cda8bc856ae7f9e11deb983f1653`을 GitHub main에 반영했다. 해당 SHA의 Workers Builds 체크는 completed/success, Build `ab8a46dd-ebf1-4039-9a00-8c32415ab826`은 stopped/success다. 체크가 보고한 Worker 버전 `fe3d32ad-0885-491a-ae2f-eef9933bf1c6`과10:00:52 KST 배포 `79fa9209-b05d-4a62-bab3-798fe189002e`의100% 버전이 일치한다.
- 10:01 KST 기본 DNS의 공개7페이지에서 새 OG/X 이미지·1200×630 크기·형식·대체 텍스트·큰 이미지 카드, 각 페이지 title/description·canonical·네이버 인증1개를 확인했다. `/og.png`는200이며53,241바이트와 사용자 원본 SHA-256이 정확히 일치한다. 배포 전 운영 응답과 main 마크업·CSS 참조·robots/sitemap이 동일하다. 운영 SEO 검사·www308·404 noindex·문의 GET enabled=true·로컬 서버200을 확인했다.
- Facebook/X/카카오 스크랩 User-Agent를 지정한 홈페이지·이미지 HTTP 요청도200이다. 실제 메신저 수집·캐시 갱신이나 브라우저 시각 검수, 실제 문의 전송은 수행하지 않았다. 원본 결과는 `cloudflare-deployment.json`, `deployment.json`, `production-verification.json`, `production-seo.log`에 보관한다. 완료 기록은 로컬에만 남기며 기록만을 위한 추가 배포는 하지 않는다.

- 사용자가 현재 변경 전체의 GitHub 반영과 운영 배포를 요청했다. 사용자 제공1200×630 PNG를 `public/og.png`로 사용하고 공개7페이지에 공통 Open Graph/X 이미지를 연결한다. 이미지 크기·형식·대체 텍스트와 X 큰 이미지 카드를 설정하며 제목·설명·canonical·네이버 인증·robots/sitemap·기존 UI는 유지한다.
- 최종 사용자 이미지의 SHA-256은 `75e068fd34c2144b5cb5ad16814f1cc2bdc54a03e0e3b33c4eb45e3228fa51cc`이며53,241바이트다. 생성 시안v1과 사용자 제공v2의 원본·제작 기록, 앞선 SEO 배포 완료 기록을 함께 반영한다. 취소된 디자이너 가이드 요청의 파일 변경은 없다.
- 사용자 이미지 적용 후 로컬 `npm run ci:build`와7페이지 OG/X 메타데이터·1200×630 크기·원본/빌드 파일 일치 검사를 통과했다. 이전 main/CSS·제목/설명·canonical·인증 태그 상태와 robots/sitemap 응답이 동일함을 확인했다. 이후 앱 소스 변경은 없어 해당 빌드 결과를 재사용한다.
- 회사 MCP의 실제 계정·main 전용 자동 배포·문의 및 네이버 secret3개·workers.dev/Preview 비활성을 재확인했다. 기존 GitHub main → 회사 계정 Cloudflare Workers Builds 자동 배포를 사용한다. 검증 근거는 Git 제외 `outputs/deploy/2026-09-18/og-image/`에 보관하며 실제 완료는 배포 결과 확인 후 기록한다. DNS·PC 설정·로컬 서버는 유지한다.

## 2026-09-18 — 평택 검색 메타데이터

- **09:12 KST 배포 완료:** 소스 커밋 `d241d16fd55538152dc66cb9600f59990f5ee0c0`을 GitHub main에 반영했다. 해당 SHA의 `Workers Builds: onoff-hero-preview` 체크가 completed/success이며 Cloudflare Build `d7845cc8-798c-4c53-b3cf-b6ac6e21fb4e`도 stopped/success다. 체크의 Worker 버전 `8a5c9c33-e3c1-4aab-986a-49e82bdf02ca`와 실제09:12:01 KST 배포 `08ec1c5b-129f-4168-ab77-837a5717162a`의100% 버전이 일치한다. 네이버 인증을 포함한 secret3개와 workers.dev·Preview 비활성을 유지한다.
- 09:12 KST 기본 DNS의 공개7개 페이지가200이며, 요청한4개 title/description 정확 일치·기존3개 메타데이터 보존·7개 제목/설명 고유성·Open Graph/Twitter 일치·canonical·각 head의 네이버 인증 태그1개를 검증했다. 변경 전 운영 HTML과 비교해 승인된 설명3곳만 변경됐고 모든 제목·나머지 main 마크업·스타일시트 URL, robots/sitemap 응답은 동일하다. 실제 운영 HTTP SEO 검사(robots/sitemap·404·www308·Googlebot/Yeti 응답)와 문의 GET200/enabled=true도 통과했다. 브라우저 시각 검수·실제 문의 전송·검색엔진 재수집/색인은 이번 검증 범위가 아니다.
- 사용자 요청으로 HOME·마케팅·웹·디자인의 title/description을 지정 문구로 바꾸며 Open Graph·Twitter·WebPage 구조화 데이터도 같은 원본으로 맞춘다. 기획·운영·문의는 기존 고유 메타데이터를 유지한다. canonical·네이버 인증 태그·robots/sitemap·디자인·애니메이션·메인 카피는 보존한다.
- 마케팅/디자인 작업 안내와 웹의 자료 준비 FAQ 설명에 각 페이지 지역 키워드를1회씩만 넣는다. 변경은 데이터3개와 기존 검증 도구에 한정하며 UI 컴포넌트·CSS·모션·자산은 수정하지 않는다.
- 로컬 `npm run ci:build`의162개 검사·린트·타입·빌드·CSS/자산 검사를 통과했다.7개 페이지의 실제 title/description·Open Graph/Twitter·canonical·제목 고유성과 기존3페이지 메타데이터를 확인했다. 변경 전 HTML 대비 승인된 설명3곳 외 본문 마크업·모든 제목·robots/sitemap 응답 보존도 확인했다. 기존 회사 계정과 네이버 인증 secret을 포함한 기존3개 secret·main 배포 트리거를 읽기 조회했다.
- 기존 GitHub main → 회사 계정 Cloudflare Workers Builds 자동 배포를 사용했다. 검증 원본은 Git 제외 `outputs/deploy/2026-09-18/local-seo/`에 보관한다. DNS·PC 설정·로컬 서버를 유지하고 실제 문의 전송은 하지 않았다. 완료 기록은 로컬에 남기며 기록만을 위한 추가 push·배포는 하지 않는다.

## 2026-09-17 — 네이버 소유 확인 태그

- **17:17 KST 운영 적용 완료:** 사용자 제공 HTML 인증 태그의 content 값을 기존 회사 Worker `onoff-hero-preview`의 `NAVER_SITE_VERIFICATION` 실행 환경 secret으로 추가했다. 기존 메타데이터 출력 기능을 사용하며 앱 소스 커밋 `95db768c47e55efa47d30293ee90aa793ba76c69`는 변경하지 않았다. 회사 MCP `/user`·`/accounts`로 계정 확인 후 secret API201·success=true를 확인했다.
- secret 변경에 따른17:17:28 KST 배포 `0dd3a4e6-5a91-46ad-af40-6159cff91a8e`가 Worker 버전 `714e1e5d-eef5-4225-89ec-23e6db3c644a`를100% 반영했다. 기존 `INQUIRY_PRIVACY_VERSION`·`SLACK_INQUIRY_WEBHOOK_URL`과 새 인증값까지 secret3개가 있으며 workers.dev·Preview 비활성, 기존 main 자동 배포를 유지한다. Git push·앱 재빌드·인증값의 코드 하드코딩은 필요하지 않았다.
- 17:18:44 KST 기본 DNS에서 공개7개 경로 HTTP200, 각 페이지 head에 사용자 제공 값과 정확히 일치하는 `naver-site-verification` 태그1개를 확인했다. canonical·기존 Google Ads 태그·마케팅 새 이미지 참조를 보존한다. Yeti 헤더의 홈페이지200·태그, 문의 GET200/enabled=true, 로컬 서버200도 확인했다. 실제 네이버 서버의 소유 확인·사이트맵 제출·색인 완료는 미확인이며 실제 문의 전송은 하지 않았다.
- 검증 근거는 Git 제외 `outputs/deploy/2026-09-17/naver-verification/deployment.json`·`production-verification.json`에 보관한다. DNS·PC 설정·로컬 서버·앱 소스는 변경하지 않았으며 완료 기록만을 위한 commit·push·재배포는 하지 않는다.

## 2026-09-17 — 마케팅 상세 개선·새 채널 이미지

- **10:06 KST 배포 완료:** 소스 커밋 `95db768c47e55efa47d30293ee90aa793ba76c69`을 GitHub main에 반영했다. 해당 SHA의 `Workers Builds: onoff-hero-preview` 체크가 completed/success이며 Cloudflare Build `43c9e75b-7149-4de0-82fc-de94198e4fda`도 stopped/success다. 체크의 Worker 버전 `9333083e-8720-4308-8910-3e05cfdcb0e9`와 실제10:06:22 KST 배포 `9185dbf3-bec1-4047-99cc-10e41e7c386f`의100% 버전이 일치한다. workers.dev·Preview 비활성을 유지한다.
- 10:07 KST 공개 DNS1.1.1.1을 검증 프로세스에만 지정한 HTTPS 요청에서 공개7개 경로200·상세5개 목차·마케팅5개 본문 섹션의 로컬 문구 일치·참조 자산41개200·새 이미지2개와 빌드 CSS의 로컬 SHA-256 일치·문의 GET200/enabled=true를 확인했다. SEO·robots·sitemap·404·www308 검사도 통과했다. 실제 브라우저 시각 검수와 문의 전송은 수행하지 않았다.
- 기본 DNS는10:04:43 루트 EAI_AGAIN·www308이었고 마지막10:07:40 마케팅 상세200·www 상세308이었다. 이번 기본 접속 성공을 전체 회선·상위 DNS의 안정화 완료로 단정하지 않는다. DNS·PC 설정은 변경하지 않았고 기존 로컬 마케팅 상세도200이다. 완료 기록은 로컬에만 보관하고 문서만을 위한 추가 push·배포는 하지 않는다. 근거는 Git 제외 `outputs/deploy/2026-09-17/marketing-details/`에 있다. 이전 Wrangler OAuth를 사용한 읽기 검증은401이어서 추가 로그인 없이 회사 MCP로 실제 배포·설정을 확인했다.
- 사용자가 현재 마케팅 수정 전체의 GitHub 반영·운영 배포를 요청했다. 첫 본문·고민과 효과, 작업 범위 소개·채널 카드 문구·동일 크기 프레임, 새 블로그/광고 이미지2개, 보고·작업 범위·진행 과정 전체를 포함한다. 디자인·다른 서비스와 HOME·HERO 미디어는 보존한다.
- 최종 앱 소스는 `npm run ci:build`의162개 검사·린트·타입·빌드·CSS/자산 검사를 통과했다. 이미지2개의 생성 원본·정확한 프롬프트·실행 WebP와 변환 스크립트, 크기 맞춤 동작의 회귀 검사를 함께 반영한다. 마지막 로컬 HTTP/SSR·반응형 CSS 검사와 빌드 로그는 Git 제외 `outputs/qa/2026-09-17/marketing-process/`·`outputs/logs/marketing-process-ci-20260917.log`에 있다.
- 실제 MCP `/user`·`/accounts`에서 회사 계정 `onoff3738@naver.com` / `f446e31d575c7e7135b7486ada7c35c4`를 확인했다. 기존 `G-bak/onoff-hero` main 전용 트리거·검사/배포 명령, workers.dev·Preview 비활성을 재확인했고 설정은 변경하지 않는다. 이번 승인으로 아래 각 변경의 로컬 전용 제한을 해제하며 기존 자동 배포를 사용한다.
- 실제 배포 결과와 공개 HTTP/문구/자산 검증은 위 완료 기록을 따른다. 로컬 서버·DNS·PC 설정은 유지하며 실제 문의 전송은 수행하지 않는다. 원본 로그·검증 스크립트·환경변수는 Git에서 제외하고 완료 기록만을 위한 재배포는 하지 않는다.

## 2026-09-16 — 디자인 상세 개선·공통 목차

- **13:41 KST 배포 완료:** 소스 커밋 `f96bf1ed79fcb0a416a3d043d8b5ea8b038f7c4b`을 GitHub main에 반영했다. 해당 SHA의 GitHub `Workers Builds: onoff-hero-preview` 체크가 completed/success이며 Cloudflare Build는 `927a8e61-0859-41e2-801d-e097d2c743e8`이다. 체크에 기록된 Worker 버전 `c66db1e9-b491-49ee-aaa8-a150aaaabf36`과 실제13:41:55 KST 배포 `6a167ac8-74e9-47ca-8635-5c057faf96e4`의100% 버전이 일치한다. workers.dev·Preview 비활성도 확인했다.
- 13:42 KST 공개 DNS1.1.1.1을 검증 프로세스에만 지정한 HTTPS 요청에서 공개7개 경로200·상세5개 새 목차·디자인5개 본문 섹션의 로컬 문구 일치·참조 자산39개200·배포 CSS와 로컬 빌드 SHA-256 일치·문의 GET200/enabled=true를 확인했다. SEO·robots·sitemap·404·www308 검사도 통과했다. 실제 브라우저 시각 검수와 문의 전송은 수행하지 않았다.
- 13:42:01 KST 기본 DNS에서 루트는 ENOTFOUND, www는308이었다. 공개 DNS 검증 통과를 전체 방문자의 접속 복구 완료로 설명하지 않는다. DNS·PC 설정은 변경하지 않았으며 요청된 로컬 서버는 `http://localhost:5187`에서200으로 유지된다. 이 완료 기록은 로컬에 저장하며 추가 문서 배포는 하지 않는다.
- 사용자가 현재 디자인 수정본의 GitHub 반영과 운영 배포를 요청했다. 상세5개의 목차 문구와 모바일 가로 스크롤, 디자인 상세의 첫 소개·고민/효과3열·작업 범위와 포트폴리오 설명 배치·진행 과정·서비스 안내/견적 기준 및 반응형 글자 크기를 반영한다. 기존 이미지는 유지하며 교체 예정 이미지와 추후 확정할 작업 항목은 이번 변경에 추가하지 않는다.
- 최종 앱 소스의 `npm run ci:build`는161개 검사·린트·타입·프로덕션 빌드·CSS/자산 검사를 통과했다. 각 변경의 로컬 HTTP/SSR·문구·실제 제공 CSS를 확인했다. 브라우저 시각 검수와 실제 문의 전송은 수행하지 않았다. 검증 로그는 Git 제외 `outputs/qa/2026-09-16/`에 보관한다.
- 기존 `G-bak/onoff-hero`의 main → 회사 계정 `f446e31d575c7e7135b7486ada7c35c4`의 `onoff-hero-preview` 자동 배포를 사용한다. 이번 세션의 Cloudflare MCP는 OAuth 인증 오류로 조회하지 못했으며, Wrangler의 실제 로그인 계정과 기존 Worker 배포를 확인했다. DNS·PC·배포 설정은 유지하고 기존 로컬 서버도 유지한다.
- 운영 검증 결과는 Git 제외 `outputs/deploy/2026-09-16/design-details/`에 보관한다. 배포 성공 후 결과 기록은 로컬에 남기고 문서 기록만을 위한 추가 배포는 하지 않는다.

## 2026-09-16 — 마케팅 상세 HERO·고민·장점 문구

- **09:22 KST 배포 완료:** 소스 커밋 `c1b642a2b2b5f666d27986861666130e962575c7`을 GitHub main에 반영했고 Build `1659a29c-3687-4ba2-92d8-51c290a01478`가 stopped/success로 종료됐다. 09:22:42 KST에 Worker 버전 `d9d76712-fd33-499e-9222-c03a7ce9af40`가100% 배포됐다. workers.dev·Preview 비활성도 재확인했다.
- 09:24 KST에 공개 DNS1.1.1.1을 이 검증 프로세스에만 지정하고 원래 호스트·TLS 검증을 유지한 요청에서 공개7개 페이지·SEO/robots/sitemap/404/리다이렉트 검사, 마케팅 새 문구25개·지정 줄바꿈 CSS·직접 참조 자산19개 HTTP200·문의 GET200/enabled=true를 확인했다. 브라우저 시각 검수와 실제 문의 전송은 하지 않았다.
- 기본 DNS 접속은 09:09 KST 루트200/www308이었으나 09:23 KST 배포 후 검사에서는 ENOTFOUND가 발생했고, 09:24:54 KST 재조회에서는 다시 루트200/www308이었다. 간헐 실패를 관측했으므로 전체 방문자 DNS 복구 완료로 설명하지 않는다. PC DNS는192.168.0.1 그대로이며 DNS·PC 설정은 변경하지 않았다. 09:24 KST 사용자 요청 로컬 서버도200으로 유지된다.
- 사용자가 로컬에서 반영한 마케팅 상세 문구의 운영 배포를 요청했다. 상단 분류·HERO 제목과 소개·하단 키워드, 첫 본문 제목과 설명·고민3개·장점3개 및 지정 줄바꿈을 반영한다. 상세는 [서비스 문구 기록](../pages/SERVICE-DETAILS-NOTES.md)을 따른다.
- 최종 앱 소스의 `npm run ci:build`가 테스트161개·린트·타입·빌드·배포 CSS/자산 검사를 통과했다. 로컬 마케팅 상세 HTTP200·요청 문구25개와 다른 공통 상세3개의 기존 제목 유지를 확인했다.
- 기존 GitHub `G-bak/onoff-hero`의 `main` → 회사 계정 `f446e31d575c7e7135b7486ada7c35c4`의 `onoff-hero-preview` 자동 배포를 사용한다. 도메인·문의 설정·자동 배포 구성은 유지하며 DNS·PC 설정을 변경하지 않는다. 사용자 요청으로 켠 로컬 서버도 유지한다.
- 원본 결과는 Git 제외 `outputs/deploy/2026-09-16/marketing-copy/`의 `deployment.json`·`production-verification.json`·`seo-public-dns.log`·`system-dns-verification.json`에 보관한다. 성공 후 추가한 완료 기록은 로컬에 저장하며, 기록만을 위해 같은 앱을 재배포하지 않는다.

## 2026-09-15 — DNS 진단 문서 GitHub 반영

- 사용자가 현재 기록의 GitHub 반영을 승인했다. AGENTS와 운영 문서5개를 반영하며 앱 소스·DNS·Worker 배포 설정은 변경하지 않는다. 기존 main 자동 배포 설정을 유지한다.
- [현재 복구 기록](DNS-RECOVERY-2026-09-15.md), [초기 진단](DNS-RECURRENCE-2026-09-15.md), [인수인계](HANDOFF-2026-09-15-MCP-RECONNECT.md), [미전송 Cloudflare 요청문](CLOUDFLARE-DNS-INCIDENT-2026-09-15.md)을 보관한다. 본문의 로컬 전용 표기는 이번 승인 전 작성 이력이다.
- 일반 DNS 경로의 접속 복구는 미확인이며, 문서 반영이나 같은 앱 소스의 자동 배포와 구분한다. 원본 outputs·DNS 설정 백업·복구 스크립트·환경변수는 Git에 포함하지 않는다.

## 2026-09-15 — 흰 배경 파비콘·운영 전체 점검

- **16:46~16:49 KST 배포 완료:** 소스9e853bbebfb9c52101c2e0dbf3df3794a9c65bc0의 새 계정 Build7683bebb-c4ca-49f1-91a0-9e2287a5ccd1가 success로 종료됐다.16:46:14 KST Worker 버전5e815bce-2ffe-4456-b60f-c91752d9e678이100% 배포됐다. 이후 운영7개 페이지에 새 아이콘 링크4개·Google 태그1회씩 확인했고 PNG2개·ICO의 기본/버전 주소6개 모두200·로컬 파일과 바이트 일치다. 결과 기록은 로컬 문서에 보관하고 추가 문서 배포는 하지 않는다.
- 사용자가 사이트 접속과 광고 테스트 성공을 확인했고 전체 운영 점검 및 다크모드 파비콘 개선을 요청했다. 기존 로고 픽셀을 유지하면서 정사각형 전체가 흰색인32·64px PNG와16·32·48·64px ICO를 생성했다. 공통 아이콘 주소는 `v=white-20260915`다. 원본·홈페이지 헤더 로고는 유지한다.
- 기존161개 검사·린트·타입·최종 빌드·CSS·자산·문서 검사를 통과했다. PNG의 배경 외 픽셀 일치와 ICO4개 프레임의 흰색·불투명을 확인했다. 운영7개 경로·SEO·robots·sitemap·404·리다이렉트, 내부 직접 참조 자원16개·외부 참고 링크6개의200을 확인했다. npm audit 전체 및 운영 의존성 취약점은0건이다.
- 실제 Chromium PC·모바일14개 경로 조건과 운영 탭·문의 선택/입력 검증/미리보기·두 동의 전 전송 잠금·해시 없는 이동을 검증했다. 브라우저 실행 오류·내부 HTTP 오류0건, 실제 문의 POST·Slack 메시지0건이다. 검수용 화면에 로컬 파비콘을 밝고 어두운 배경으로 표시해 가독성을 확인했다.
- 새 계정의 zone·인증서3개·문의 secret2개·main 전용 자동 배포·임시 URL 비활성을 확인했다. 검색 도구 계정의 처리 성공, 네이버 인증, Google Ads 문의 완료 전환 라벨은 [운영 검토](../reviews/PRODUCTION-REVIEW-2026-09-15.md)의 남은 확인 항목이다. 이번 점검·수정과 기존 진단 문서를 함께 main 자동 배포로 반영한다.
- 검증 출력은 Git 제외 `outputs/qa/2026-09-15/production-review/`에 보관한다. 실제 배포 후 아이콘 응답·메타데이터·해시와 배포 버전을 후속 기록한다.

## 2026-09-15 — 접속 재발·초기 계정 재조회 진행

- **16:54~16:57 KST 재조회 완료:** 실제 MCP는 초기 계정 `ajdhfbx1836203@naver.com` / `4c692f878ebb293ad79ef0d8c9c7cfcc`다. 초기 zone·정식 Custom Domain0개, hero Worker 부재 및16:48:23 삭제 감사 기록, 기존 tag의 Builds 설정 없음·트리거0개를 확인했다. 남은 임시 Worker는 정식 도메인/route 연결이 없다. 기본 DNS192.168.0.1은 주소 없음/이전 SOA 및 새·이전 응답 혼재로 접속 실패가 재현되고, 새 권한 NS·공개 DNS3곳·com parent·RDAP는 정상이다. 상세·복구 범위는 [진단 보고서](DNS-RECURRENCE-2026-09-15.md). 전체 복구 완료가 아니며 이번에는 삭제·네트워크 설정·소스 변경·push·배포 없이 읽기 조회와 로컬 기록만 수행했다.
- **16:50 KST 재시작 메모:** 사용자와 CLI가 초기 계정 재로그인·인증 성공을 확인했다. 현재 열린 MCP `/user`·`/accounts`는 여전히 새 계정 onoff3738@naver.com / f446e31d575c7e7135b7486ada7c35c4를 반환하므로, 재시작 후 초기 계정 ID를 먼저 확인한다. 다음 작업은 [인수인계](HANDOFF-2026-09-15-MCP-RECONNECT.md)를 따른다. 이번 후속 문서는 로컬만 저장한다.
- 16:47 KST registry RDAP의 네임서버는 AIDA.NS.CLOUDFLARE.COM·KEANU.NS.CLOUDFLARE.COM이며 마지막 변경은15:55:14 KST다. 새 네임서버2개 직접 조회와8.8.8.8·1.1.1.1·9.9.9.9는 새 NS/SOA와 A/AAAA를 반환했다. 이전 ashley·trevor 직접 조회 및 공유기192.168.0.1은 옛 NS/SOA와 A/AAAA 없음으로 응답했다. 일부 PC 캐시에는 정상 A가 들어 있어 그 시점 HTTP200과 상위 DNS 실패가 공존했다.
- 사용자가 초기 계정의 잔존 자원 조회를 위해 MCP 전환을 요청했다. cloudflare_api OAuth 로그아웃 후 초기 이메일 ajdhfbx1836203@naver.com의 재인증을 시작했다. 사용자 인증과 실제 MCP의 계정4c692f878ebb293ad79ef0d8c9c7cfcc 확인이 필요하다. 새 운영 배포·Wrangler 인증·네임서버는 변경하지 않는다. 기존 계정에 자원이 남아 있다는 가설을 조회 전 확정하지 않으며 이번 단계에서 삭제하지 않는다.
- 근거는 Git 제외 outputs/qa/2026-09-15/sitemap-fetch/dns-recurrence.json이며 이번 후속 기록은 로컬에만 보관한다.

## 2026-09-15 — 사이트 접속·사이트맵 가져오기 실패 조사

- 사용자가 Search Console의 `가져올 수 없음`과 사이트 접속 장애를 알렸다. 16:28 KST 이 PC의 기본 DNS(공유기 192.168.0.1)로 HOME·sitemap.xml 요청이 ENOTFOUND로 실패하는 것을 재현했다. NS 조회는 이전 ashley·trevor를 반환했고 A/AAAA는 주소 없이 이전 zone의 SOA를 반환했다. Windows DNS 캐시를 초기화해도 실패가 남았으며 상위 DNS 응답의 이전 SOA·실패 캐시 TTL 갱신도 관찰했다.
- 같은 시각 Google 8.8.8.8·Cloudflare 1.1.1.1·Quad9 9.9.9.9는 모두 새 aida·keanu NS와 유효한 A/AAAA를 반환했다. 각각의 DNS를 사용한 HOME·sitemap·robots HTTPS 요청18건은 모두200이다. 원래 호스트·SNI·인증서 검증을 유지했다. sitemap은 application/xml,506바이트이며 실제 XML 파서로 표준 namespace와 정식7개 URL을 확인했다. robots는 전체 허용·API 제한·정확한 sitemap URL을 제공한다. Googlebot·Google-InspectionTool User-Agent 요청도200이며 Google의 실제 크롤러 요청 검증과 구분한다.
- 16:29 KST 실제 Playwright 브라우저에서 https://on-onf.com/을 열어 회사 정보·HOME 워드마크·카드·메뉴가 표시된 화면을 캡처했다. 이어 sitemap.xml을 직접 열어 네트워크 HTTP200과 브라우저의7개 URL XML 트리를 확인했다. 이 브라우저의 성공과 PC 기본 DNS의 실패가 공존하므로 전체 회선 정상으로 설명하지 않는다.
- 실제 새 계정 API에서 zone active·paused=false, 두 Custom Domain enabled=true, SSL active, DNSSEC disabled, 사용자 firewall rule 없음, Bot Fight Mode off를 확인했다. Google 공개 DNS의 DS 조회에 DS 레코드가 없었다. 운영 버전은 기존 fb6b805f-104f-49d1-933d-96c8f2b9c7fd의100% 배포를 유지한다. 사이트 코드·Cloudflare 설정·가비아 네임서버·PC의 DNS 서버 설정은 변경하지 않았다.
- 확인된 장애는 계정 이전 후 일부 DNS에 남은 이전 정보/실패 응답이다. Search Console 실패도 이 영향일 가능성이 있으나 실제 Google 가져오기 상세는 확인하지 않아 원인을 확정하지 않는다. 상위 캐시가 갱신된 뒤 실제 URL 테스트와 사이트맵 재제출로 확인한다. [Cloudflare 설명](https://developers.cloudflare.com/dns/troubleshooting/dns-issues/), [Google 진단 절차](https://support.google.com/webmasters/answer/7451001?hl=ko).
- 로그·XML·브라우저 캡처는 Git 제외 outputs/qa/2026-09-15/sitemap-fetch/에 보관한다. 등록 안내의 이전 네임서버를 새 값으로 정정했고 이번 진단 문서는 로컬만 저장한다.

## 2026-09-15 — Google Ads 공통 태그 설치

- **16:21~16:22 KST 배포 완료:** 소스 커밋 `d3f313ab6bebe613d8576b6fcdbe508fe33509fb`를 GitHub main에 반영했고 새 계정 Build `6c51391d-158d-4fd7-9809-9c0ee19bb676`가 stopped/success로 종료됐다. 16:21:36 KST에 Worker 버전 `fb6b805f-104f-49d1-933d-96c8f2b9c7fd`가100% 배포됐다. 운영7개 경로가 HTTP200이며 각각 head 안에 정확한 ID의 async 로더1개·초기화1개를 확인했다. 이 결과 기록은 로컬 문서와 Git 제외 `deployment.json`·`production-verification.json`에 남긴다. Google Ads 계정 진단·실제 데이터 수신·전환 집계는 확인하지 않았다.
- 사용자가 전달한 Google 태그 `AW-18383031274`를 공통 `app/layout.tsx`의 head에 설치했다. `https://www.googletagmanager.com/gtag/js?id=AW-18383031274`를 async로 로드하고, 제공된 dataLayer 초기화와 js/config 호출을 그대로 사용한다. 기존 Google 태그는 없었다.
- 루트 레이아웃을 사용하는 HOME·상세5개·문의 화면에 같은 기본 태그가 적용된다. 화면·모션·SEO·문의 처리와 새 Cloudflare 계정의 기존 main 자동 배포를 유지한다. 전환 이벤트·전환 라벨·고객 입력 데이터·향상된 전환 설정은 제공되지 않아 추가하지 않았다.
- `next/script`의 `beforeInteractive`로 초기 HTML head에 제공하고 고유 ID로 로더·초기화를 구분한다. 로컬 전체161개 검사·린트·타입·빌드·CSS/자산 검사를 통과했으며7개 페이지의 head에서 async 로더1개·초기화1개·정확한 ID와 순서를 확인했다. 분리된 JavaScript 실행 환경에서 js/config 두 큐 항목도 확인했다. Google 스크립트를 실제 브라우저에서 실행한 검증과 구분한다.
- [Google 공식 설치 안내](https://developers.google.com/tag-platform/gtagjs), [Google Ads 수동 설치](https://support.google.com/google-ads/answer/12985952?hl=en)를 기준으로 공통 head 적용과 중복 여부를 확인한다. 빌드·실제 HTML 설치 확인은 Google Ads 계정의 태그 진단·데이터 수신·전환 집계 확인과 구분한다.
- 로컬 검사·운영 검증 결과는 Git 제외 `outputs/deploy/2026-09-15/google-tag/`에 보관하며, 최종 자동 배포 결과는 후속 기록을 따른다.

## 2026-09-15 — 새 Cloudflare 계정으로 홈페이지 이전

- **16:09~16:10 KST 완료:** GitHub main 커밋 `4a5f55e16112073da4ac5408f98da07056fffc7c`의 push_event로 새 계정 Build `df65ab04-f0f0-4ab3-8f56-848cd47968a9`가 실행돼 stopped/success로 종료됐다. 전체161개 검사·린트·타입·빌드·CSS/자산 검사 후 새 계정에 배포됐으며 16:09:04 KST의 Worker 버전 `23673416-3ba7-4168-81f7-4360166f6695`가100%다. 배포 ID는 `34fb49c8-9831-465f-afad-8f633ac33c5b`, 배포자 이메일은 `onoff3738@naver.com`이며 원격 빌드 로그와 실제 배포 버전이 일치한다. 뒤따르는 완료 기록 커밋은 동일한 앱 소스를 유지한다.
- 새 자동 배포 후 공개7개 경로·SEO/robots/sitemap/404·www 경로/쿼리 보존308·두 호스트 HTTP301·자산 및 영상21개의 HTTP200을 다시 확인했다. 자산19개는 로컬 빌드와 SHA-256이 같고 원격 빌드에서 이름이 바뀐 JS2개는 실제 HTML 참조와 HTTP200을 확인했다. 문의 GET은200/enabled=true/개인정보 버전2026-09-13이며 두 secret을 유지한다. GitHub 검사 링크도 새 계정 Build를 가리킨다. 검증 근거는 Git 제외 `automatic-deployment.json`, `seo-after-autodeploy.json`, `public-verification.json`에 보관한다. 문의 실제 전송과 브라우저 시각 검수는 하지 않았다.
- **16:05~16:06 KST 자동 배포 연결 후속:** 사용자가 새 Worker의 등록을 완료했고, 16:05 KST 재조회에서 GitHub 연결 `691a4b91-954d-4a7e-beed-aae1fdad1428`과 새 build token `4769e459-139d-433e-acf6-6b693ef1d026`을 확인했다. 운영 트리거 `5eb2192a-102e-4e3b-ab0a-3547335d22dd`를 `main`·루트 `/`·`npm run ci:build`·`npx wrangler deploy --config dist/server/wrangler.json`으로 맞췄다. 새 연결에서 자동 생성된 비운영 브랜치 트리거는 제거했다. 아래 Git 연결 오류·목록0개는 연결 전 이력이다. 인증서3개는 모두 active로 전환됐다. 이어지는 GitHub push로 실제 새 계정 자동 배포를 검증한다.
- **16:02~16:04 KST 운영 확인:** 새 계정의 홈페이지는 운영 중이다. Google·Cloudflare 공개 DNS를 사용하고 호스트·SNI·TLS 인증서 검증을 유지한 HTTPS 요청으로 HOME·서비스 상세5개·문의7개 경로의200, 제목·설명·canonical·구조화 데이터·robots·sitemap·실제404·Googlebot/Yeti 응답을 확인했다. HTTPS www의5개 요청은 경로·쿼리를 보존해308, HTTP 두 호스트는 HTTPS301이다. 직접 참조 자산19개와 영상2개의 총21개가 HTTP200이고 로컬 빌드와 SHA-256이 모두 일치한다. 문의 GET은200·enabled=true·기존 개인정보 버전이다. 실제 문의/Slack 전송과 브라우저 시각 검수는 수행하지 않았다.
- Universal 인증서 `bc70a9df-3855-460f-9eb4-ebb100b2d282`가 active로 루트·와일드카드를 포괄한다. Worker Custom Domain이 만든 추가 인증서2개는 당시 검증 대기였으며 실제 HTTPS 성공과 구분한다. 이 컴퓨터의 기본 DNS 조회에는 당시 ENOTFOUND가 남아 있어 모든 회선의 전파 완료로 설명하지 않는다.
- 새 계정 설정과 이전 기록은 커밋 `7a7f45e`로 GitHub main에 반영했다. 16:04 KST의 실제 MCP 조회에서 새 계정의 `onoff-hero-preview`, 두 Custom Domain, 문의 secret 반영 버전의100% 배포를 다시 확인했다. 사용자가 자동 배포 연결 완료를 알렸으나 해당 Worker의 트리거·build token은0개이고 GitHub 연결 API는8000008이어서 **자동 배포 이전은 아직 미완료**다. 사용자가 Worker가 안 보인다고 해 계정 ID가 들어간 Workers & Pages 목록으로 안내했으며 대시보드 표시 상태를 확인 중이다.
- 사용자 승인 범위는 새 계정의 도메인 재등록·홈페이지 배포·문의 설정·GitHub 자동 배포 이전 및 결과 보고다. MCP와 Wrangler 모두 사용자 이메일 `onoff3738@naver.com`, 계정 `f446e31d575c7e7135b7486ada7c35c4`를 실제 API로 확인했다.
- Free Website zone `76e8a080d3391f997a0106e5f4d3c8e5`에 `on-onf.com`을 등록했다. 사용자가 가비아에서 `aida.ns.cloudflare.com`, `keanu.ns.cloudflare.com`으로 변경했고 Google 공개 DNS의 NS 일치와 15:57:00 KST의 zone active를 확인했다.
- `vite.config.ts`의 계정 ID만 새 계정으로 변경했다. 전체161개 테스트·린트·타입·프로덕션 빌드·CSS/자산 검사를 통과했다. 앱 화면·회사 정보·SEO·문의 정책과 `workers_dev:false`, `preview_urls:false`는 유지한다.
- 15:57:44 KST에 새 Worker `onoff-hero-preview`에 초기 버전 `f0d242bf-9b80-4d1c-9f32-1cefba4eec39`를 배포했다. Git 제외 `.env.local`의 기존 `INQUIRY_PRIVACY_VERSION`·`SLACK_INQUIRY_WEBHOOK_URL`을 새 Worker의 secret으로 옮긴 뒤 15:57:59 KST에 버전 `a6f33774-aafe-44e6-a777-cc09283a1408`의100% 배포를 확인했다. 비밀값은 출력·문서·Git·빌드 로그에 기록하지 않았다.
- 새 Worker tag는 `c9634ec0232345d49a758453ec8b24ff`다. `on-onf.com`·`www.on-onf.com` Custom Domain을 연결하고 `always_use_https=on`을 적용했다. 두 연결의 enabled=true, previews_enabled=false와 Worker의 workers.dev·Preview 비활성을 확인했다. 인증서 발급·정식 HTTPS의 최종 검증은 후속 기록으로 구분한다.
- GitHub 저장소 `G-bak/onoff-hero`(repository ID `1362249366`, owner ID `166082000`)를 새 계정에 연결하는 API는8000008, Git 계정 연결 끊김 오류를 반환했다. 새 계정의 build token도0개이며, 현재 자동 배포 이전은 미완료다. 대시보드에서 GitHub 재연결과 Builds 배포 토큰 생성이 필요하다. [Cloudflare GitHub 연결 안내](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/), [Builds 설정](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).
- 기존 계정의 Worker·비밀 설정·GitHub 저장소·기타 자원은 삭제하지 않았다. 기존 Wrangler 인증으로 Builds 조회를 시도했지만403이어서 이전 트리거의 중단·수정을 수행하지 않았다. 이후 push의 소스는 새 계정 ID를 명시하므로 이전 계정으로 수동 배포하지 않는다.
- 로그·검증 도구·안전한 API 결과는 Git 제외 `outputs/deploy/2026-09-15/account-migration/`에 보관한다. 실제 문의·Slack 메시지는 이번 이전 과정에서 전송하지 않았다. 자동 배포와 공개 HTTP/SEO 검증의 최종 상태는 후속 항목에 기록한다.

## 2026-09-15 — 새 Cloudflare 계정 MCP 연결 확인

- 사용자의 재확인 요청으로 15:49 KST에 현재 MCP 연결에서 `/user`·`/accounts`를 조회했다. 두 요청 모두 HTTP200·success=true이며 사용자 이메일 `onoff3738@naver.com`, 계정 `f446e31d575c7e7135b7486ada7c35c4` (`Onoff3738@naver.com's Account`)를 확인했다. `/accounts`는 이 새 계정1개만 반환했다. 아래 기존 계정만 반환한다는 내용은 재연결 전의 이력이다.
- 같은 새 계정 ID로 `on-onf.com` zone, Worker 목록, 해당 zone 이름의 Worker Custom Domain 목록을 조회했고 모두 HTTP200·success=true·0개였다. 새 계정으로의 실제 연결은 확인됐으며 도메인 재등록과 앱 이전은 아직 수행하지 않았다.
- 이번 작업은 읽기 전용 API 확인과 로컬 문서 기록이다. 도메인 생성·Cloudflare 설정 변경·앱 배포·커밋·push는 하지 않았다. `vite.config.ts`와 기존 GitHub 자동 배포는 아직 이전 계정 대상이므로 후속 이전 때 새 계정에 맞춰야 한다. 홈페이지 공개 이메일 `onoff3739@naver.com`은 유지한다.

## 2026-09-15 — 계정 이전 준비: 기존 on-onf.com 등록 삭제

- 재인증 후속: 사용자가 새 Cloudflare 계정 이메일을 **onoff3738@naver.com**으로 확인했다. `cloudflare_api` MCP의 저장된 인증을 로그아웃하고 OAuth 로그인을 다시 완료했다. 사용자는 새 계정으로 인증했다고 답했지만 현재 대화의 MCP `/accounts` 조회는 여전히 기존 계정 ID만 반환한다. 새 연결에서 실제 계정 ID를 확인할 때까지 신규 도메인 등록·배포를 보류한다. 홈페이지 공개 연락처 `onoff3739@naver.com`은 유지한다. 다른 Cloudflare OAuth 서버6개의 저장된 인증은 로그아웃 상태이며, 기본 API 인증은 CLI에서 `o_auth`로 확인했다.
- 사용자가 Cloudflare 계정 변경을 알리고 다른 자원은 그대로 둔 채 기존 계정의 `on-onf.com` 관련 등록만 전부 삭제하도록 명시했다. 새 계정에 재등록할 계획이며 실제 새 계정 MCP 연결은 아직 확인하지 않았다.
- 2026-09-15 15:37 KST에 기존 계정 `4c692f878ebb293ad79ef0d8c9c7cfcc`의 www·루트 Custom Domain 연결2개를 먼저 해제한 뒤 zone `0674bbf17783acacb5ee2220a00e260a`를 삭제했다. 각 DELETE는 HTTP200·success=true다. 후속 조회의 해당 zone 목록과 `on-onf.com`·하위 도메인 Worker 연결 목록은 모두0개다.
- 가비아의 도메인 소유권·네임서버 설정, 기존 Worker `onoff-hero-preview`, 문의 환경변수 `INQUIRY_PRIVACY_VERSION`·`SLACK_INQUIRY_WEBHOOK_URL`, GitHub 저장소·기존 자동 배포와 다른 자원은 변경하지 않았다. Worker 설정 GET200과 두 환경변수 이름을 확인했다. workers.dev·버전 Preview는 계속 비활성이다.
- DNS 기록·Worker 설정과 환경변수 이름은 삭제 전에 Git 제외 `outputs/deploy/2026-09-15/account-migration/source-inventory.json`에 보관했다. 비밀값을 기록·출력하지 않았다. 삭제 및 후속 조회는 같은 폴더의 `domain-removal.json`에 보관한다.
- 정식 도메인은 새 계정에 재등록·연결하기 전까지 기존 홈페이지에 연결되지 않는다. 앱 소스의 대표 도메인·SEO 설정은 새 계정에서도 같은 주소를 사용할 예정이므로 유지했다. 새 MCP 연결 후 실제 계정 ID·배포 대상·DNS·인증서·자동 배포·문의 설정을 확인해야 한다. [Cloudflare 공식 계정 이전 안내](https://developers.cloudflare.com/fundamentals/manage-domains/move-domain/).
- 이번 변경은 Cloudflare 도메인 삭제와 로컬 운영 기록이며 앱 커밋·push·재배포는 하지 않았다. 아래 배포 성공 기록은 도메인 삭제 전 상태다.

## 2026-09-15 — Google·네이버 SEO 최적화 배포 완료

- 사용자가 공식 자료 조사·문서화·SEO 코드 수정·GitHub 반영·운영 배포와 검색 도구 등록 안내를 요청했다. [SEO 문서 모음](../seo/README.md)에 조사·적용·검증·Google Search Console·네이버 서치어드바이저 등록 안내5개를 작성했다.
- 최종 앱 소스 커밋은 `3e271634b6377bea9e477105e608f57af4847c48`이다. Cloudflare Build `aaec3f02-9113-4a30-bae6-3f537704bd62`가 해당 커밋의 `stopped/success`이며 기존 `npm run ci:build` → `npx wrangler deploy --config dist/server/wrangler.json`을 사용했다.
- 2026-09-15 **15:19:40 KST**에 Worker 버전 `c588f169-1e77-4a8f-83bb-a34dc1c9d28e`가100% 배포됐다. 배포 ID는 `e11b3fed-3e81-400c-a9c6-736ecc487aac`이며 빌드 로그의 버전과 일치한다. 뒤따르는 결과 기록 커밋은 동일 앱 소스를 유지한다.
- 최초 SEO 커밋 `230a57c2f0223f790cca0a2502c55aefd39620aa`도 배포됐으나 운영 검사에서 설정형 www redirect의 쿼리 누락을 발견했다. 최종 소스는 URL의 호스트·프로토콜만 바꾸는 middleware를 사용한다. 문의 선택값·광고 추적값·인코딩·반복 쿼리의 회귀 검사를 보강하고 운영의 문의·광고 쿼리 보존까지 확인했다.
- 로컬 전체161개 검사(SEO8개 포함)·린트·타입·프로덕션 빌드·CSS/자산 검사와 원격 자동 빌드를 통과했다. SEO 문서 외부 링크35개 중34개 정상·깨진 링크0개이며 Cloudflare 로그인 대시보드1개는403으로 자동 확인 불가다.
- 운영 홈·서비스 상세5개·문의의7개 경로는 HTTP200이며 고유한 한국어 제목·설명, head 안의 정식 canonical·Open Graph·index/follow가 일치한다. HOME 회사·사이트 JSON-LD와 상세 서비스·경로 JSON-LD를 파싱하고 SSR 서비스 링크·이미지 alt·페이지별 h1 한 개를 확인했다.
- `/robots.txt`는200 텍스트, `/sitemap.xml`은200 XML로 정확한 정식7개 URL을 제공한다. Cloudflare 관리 설명과 함께 실제 수집 규칙·사이트맵 안내가 나온다. 없는 일반·서비스 경로는 실제404·noindex이며 HOME canonical을 상속하지 않는다. Googlebot·Yeti User-Agent로 대표 HTML·robots·sitemap200도 확인했다.
- HTTPS www의 홈·상세·문의·robots·sitemap5개 요청은308이며 경로·문의 선택값·광고 쿼리가 보존된다. HTTP 두 호스트의 HTTPS301, 두 Custom Domain 활성, workers.dev·버전 Preview 비활성도 유지된다. 임시 주소의 홈·상세·API3개 요청은404다.
- HTML의 직접 참조 이미지·CSS·JS와 로고·파비콘 등19개 자산이200이다. 문의 API GET은200·enabled=true·기존 개인정보 버전이며 `no-store`와 `X-Robots-Tag:noindex,nofollow`를 확인했다. 문의·Slack 메시지를 실제 전송하지 않았다.
- 이번 검증은 회귀·빌드·HTTP/SSR이다. 실제 브라우저 검수, Google·네이버 계정 소유 확인·사이트맵 제출·색인·검색 순위 확인은 포함하지 않는다. PageSpeed 모바일 API는429로 측정하지 못했다. 상세 범위와 운영 후속은 [SEO 구현 기록](../seo/IMPLEMENTATION.md)을 따른다.
- 로그·상태·검증 JSON은 Git 제외 `outputs/deploy/2026-09-15/seo/`, 조사·로컬 검증은 Git 제외 `outputs/qa/2026-09-15/seo/`에 보관한다. 운영 주소는 [on-onf.com](https://on-onf.com)이다.

## 2026-09-15 — 임시 workers.dev 주소 비활성화

- 정식 도메인 운영에 맞춰 임시 주소를 끄자는 사용자 요청을 적용했다. 기존 `onoff-hero-preview`의 Worker subdomain API에 `enabled:false`, `previews_enabled:false`를 적용하고 성공 응답을 확인했다.
- `vite.config.ts`의 `workers_dev:false`, `preview_urls:false`가 이후 배포의 원본이다. 대시보드만 끄고 다음 배포에서 되살아나는 일을 방지한다. 이 설정은 기존 main → Workers Builds로 반영한다. Custom Domain 연결·Worker 이름·앱 화면·문의 API·비공개 설정은 유지한다.
- 정식 주소는 [on-onf.com](https://on-onf.com)이며 [www.on-onf.com](https://www.on-onf.com)도 같은 홈페이지를 제공한다. 아래 도메인 연결 시점의 workers.dev 유지 기록은 이번 요청 전의 이력이다.
- 로컬 `npm run ci:build`의153개 테스트·린트·타입·빌드·CSS/자산 검사를 통과했다. 생성된 `dist/server/wrangler.json`에서도 두 임시 주소 설정이 false임을 확인했다.
- 2026-09-15 14:40:40 KST에 정식 도메인7개 경로·자산36개가200이고 자산 해시가 도메인 연결 직후와 동일함을 확인했다. www 상세200, 두 호스트의 HTTP→HTTPS301과 경로·쿼리 보존, 문의 GET200·enabled=true도 유지된다. 임시 주소의 홈·상세·문의 API·정적 자산4개 요청은 모두404이며 홈페이지 본문을 제공하지 않는다. Worker subdomain API도 두 값이 false다.
- 검증·자동 배포 결과와 Cloudflare 상태는 Git 제외 `outputs/deploy/2026-09-15/disable-workers-dev/`에 보관한다. 실제 문의 전송·브라우저 시각 검수는 이번 설정 변경의 검증 범위에 포함하지 않는다.

## 2026-09-15 — on-onf.com 도메인 연결 완료

- 사용자가 가비아에서 구매한 `on-onf.com`의 Cloudflare 추가를 요청하고 네임서버 변경 완료를 알렸다. Free Website 요금제로 등록한 zone `0674bbf17783acacb5ee2220a00e260a`가 active이며 Google 공개 DNS에서도 `ashley.ns.cloudflare.com`, `trevor.ns.cloudflare.com`을 확인했다.
- 운영 안내 주소는 [ON&OFF](https://on-onf.com)다. `on-onf.com`과 `www.on-onf.com` 모두 기존 `onoff-hero-preview`의 production Custom Domain에 연결했다. 연결 ID는 각각 `678533c05ac5ff63c5d3ca6a1248a5453a811f74`, `3bf61e0b5c8e952a5fb49ca31c6063c2bad936a5`이며 두 항목 모두 enabled다. Worker가 관리하는 proxied DNS 레코드는 자동 생성됐다.
- `always_use_https=on`을 적용했다. 두 호스트의 HTTP 문의 주소는 경로와 `from`·`service` 쿼리를 보존해 동일 호스트의 HTTPS로301 이동한다. www와 기본 도메인 사이의 강제 이동은 설정하지 않았다.
- 2026-09-15 14:30:42~14:31:00 KST에 인증서 검증을 우회하지 않은 Node fetch와 Windows curl로 HTTPS 접속을 확인했다. `on-onf.com` 및 `*.on-onf.com` 인증서 `d10bfcf8-57b5-42d2-b7c4-4ee1e6c3b3a5`가 active여서 두 공개 호스트를 포괄한다. 별도 www 인증서와 Universal 인증서는 이 시점의 API에서 아직 발급·배포 대기였으며, 두 호스트의 실제 HTTPS 응답은200이다.
- 새 기본 도메인의 HOME·상세5개·문의7개 경로가 모두 HTTP200이며 상세의 공통 푸터가 유지된다. 참조 JS·CSS·WebP36개가 HTTP200이고, 그중 JS/CSS25개의 SHA-256이 기존 workers.dev 배포와 일치한다. `/api/inquiry` GET은200·enabled=true·개인정보 버전 `2026-09-13`이다. 실제 문의 전송과 브라우저 시각·클릭 검수는 하지 않았다.
- 앱 소스는 기존 배포 기록 커밋 `4605e8db443c59a0d6452cbea3a4111dddf90676` 상태이며 이번에는 Cloudflare 도메인 설정만 적용했다. 기존 workers.dev 주소·문의 비공개 설정·main 자동 배포를 유지한다. 현재 `vite.config.ts`는 routes를 지정하지 않으며 설치된 Wrangler4.130.0은 Custom Domain 목록이 있을 때만 해당 배포 API를 호출한다. 추후 routes를 명시해 관리할 때는 현재 두 도메인을 포함한다.
- 연결 기록은 로컬 문서에 남겼으며 Git push나 앱 재배포는 하지 않았다. 상세 검증·Cloudflare 상태는 Git 제외 `outputs/deploy/2026-09-15/custom-domain/`에 보관한다.

## 2026-09-15 — 상세 개선·공통 푸터·스크롤 이동 배포 완료

- 사용자가 현재 변경 전체의 GitHub 반영과 운영 배포를 승인했다. 운영 상세의 선택형 작업 안내·완료 체크, 상세 효과와 전체 장식 대각선 화살표 제거, 주소 해시 없는 섹션 이동, 상세5개 회사 정보 공통 푸터를 함께 반영했다.
- 소스 커밋 `1c9c96d1ba15123e9ea35091a710aac099b5f69c`을 기존 `G-bak/onoff-hero`의 `main`에 push했다. Cloudflare Build `da40e7c2-5136-4148-8563-ddb42d0f2265`의 정확한 커밋 일치와 `stopped/success`를 확인했다. 빌드 명령은 `npm run ci:build`, 배포 명령은 기존 `npx wrangler deploy --config dist/server/wrangler.json`이다.
- 2026-09-15 13:35:58 KST(04:35:58 UTC), Worker 버전 `4382bf71-7967-4c5c-a238-9aab7292ac6e`가100% 반영됐다. 배포 ID는 `5691849d-76fb-4cae-9429-ca06ae185209`이며 빌드 로그의 버전도 일치한다. 뒤따르는 결과 기록 커밋은 동일 앱 소스의 문서 갱신이다.
- 로컬 최종 테스트153개·린트·타입·빌드·CSS/자산 검사와 원격 자동 빌드를 통과했다. 커밋 전 원격 `main`과 동기화 상태, 문서 링크와 diff를 확인했으며 환경변수·빌드·로그·검증 도구는 Git에서 제외했다.
- 운영 HOME·서비스 상세5개·문의7개 경로 모두 HTTP200이다. 상세마다 새 푸터1개·확정 회사 정보6항목·전화/이메일/서비스별 문의 링크·서비스 메뉴·개인정보 안내를 확인했고, 웹의 자료·사진 출처도 유지된다. HOME에는 상세용 푸터가 추가되지 않았다.
- 운영 상세는 작업 선택 탭2개·기본 활성 패널1개·JS 미사용 안내·완료 체크를 확인했다. 제거한 장식 클래스와 이전 운영 비교 구성은 없으며, 운영 페이지가 참조하는 JS·CSS·WebP36개가 HTTP200이다. 운영 CSS의 SHA-256은 로컬에서 검증한 빌드와 같다.
- 운영 `/api/inquiry` GET은 HTTP200·`enabled=true`이며 기존 개인정보 버전을 유지한다. 이번 검수는 HTTP·서버 HTML·참조 자산 확인이다. 실제 브라우저의 탭 클릭·스크롤·뒤로가기·모바일 시각 검수나 문의 전송은 수행하지 않았다.
- 운영 주소: [홈페이지](https://onoff-hero-preview.ajdhfbx1836203.workers.dev), [운영 상세](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/services/operations), [디자인 상세](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/services/design). 로그·검증 결과는 Git 제외 `outputs/deploy/2026-09-15/service-improvements/`에 보관한다. 로컬 미리보기도 유지한다.

## 2026-09-15 — 디자인 상세 첫 화면 문구 배포 완료

- 사용자 제공 수정 이미지에 따라 `/services/design`의 제목·소개·서비스 분류·하단 태그를 변경하고 **디자인 서비스 안내** 버튼을 기존 작업 범위 `#service-scope`로 연결했다. 로컬 검증 후 사용자가 커밋·운영 배포를 승인했다.
- 소스 커밋 `0ba7f35fc7fd53b64df697c61fdce7e9e6ee8fa9`을 `G-bak/onoff-hero`의 `main`에 push했다. Cloudflare Build `5d282d02-2990-45c1-a20c-aa90f1e3e10a`의 정확한 커밋 일치와 `stopped/success`를 확인했다. 기존 Workers Builds의 검사·배포 명령을 사용했다.
- 2026-09-15 11:19:27 KST(02:19:27 UTC), Worker 버전 `9c041269-4d75-46c8-9b4c-4816a58e1466`가100% 반영됐다. 배포 ID는 `3e3580e7-0f2b-4414-8b44-b5c6ae669a31`이며 빌드 로그의 버전도 일치한다. 뒤따르는 결과 기록 커밋은 동일 앱 소스의 문서 갱신이다.
- 로컬 테스트143개·린트·타입·빌드·CSS/자산 검사와 원격 자동 빌드를 통과했다. 문서 갱신 후 로컬 링크·`git diff --check`도 확인했다. 환경변수·로그·빌드·검증 도구는 Git에서 제외한다.
- 운영 HOME·서비스 상세5개·문의의7개 경로가 HTTP200이다. 디자인 표지의 새 문구5개·하단 태그3개·이전 표지 문구 제거, 버튼의 `#service-scope` 연결과 실제 대상 HTML을 확인했다. 페이지가 참조하는 JS·CSS·WebP도 HTTP200이며 기획·마케팅·운영의 기존 가격 안내 버튼은 유지된다.
- 이번 운영 확인은 HTTP와 서버 렌더링 HTML 검사다. 실제 브라우저의 화면·모바일·클릭·영상 재생 검증이나 문의 전송은 수행하지 않았다.
- 운영 주소: [디자인 서비스](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/services/design). 로그·운영 JSON·검증 스크립트는 Git 제외 `outputs/deploy/2026-09-15/design-detail/`에 보관한다.

## 2026-09-14 — WEB·TOGETHER 영상 조작부 제거 배포 완료

- 로컬 검수 후 사용자가 현재 변경 전체의 GitHub 반영·운영 배포를 승인했다. WEB의 재생·음량 버튼·시간·진행바·장면 목차, TOGETHER의 하단 조작·상태 라벨·진행바를 제거했다. 두 영상은 무음 자동 반복 재생하며 기존 제목·소개·문의 안내와 MOTION 제어를 유지한다. 차단·실패·움직임 감소에서는 최소 재생/재시도 버튼을 제공한다.
- 소스 커밋 `0097ee3b8d1c57a0354dfb8975ee00ab18b8695e`을 기존 `main`에 push했다. Cloudflare Build `32d3444d-629b-479e-80ea-3665e0051672`의 `stopped/success`와 정확한 커밋 일치를 확인했다. 기존 Workers Builds만 사용했으며 새 배포 설정은 만들지 않았다.
- 2026-09-14 15:12:01 KST(06:12:01 UTC)에 Worker 버전 `53f2cc1d-ca3f-4956-a2e2-7a78b5807b5f`가100% 반영됐다. 배포 ID는 `f9e38b66-8bba-4a8b-888c-f227433c21a4`다. 뒤따르는 결과 기록 커밋은 동일 앱 소스의 문서 갱신이다.
- 로컬 `npm run ci:build`의143개 테스트·린트·타입·빌드·CSS/자산 검사와 원격 자동 빌드를 통과했다. 로컬 Chromium 1440×900·390×844·844×390의 화면, PC의 실제 반복 경계·MOTION 정지/재개·움직임 감소의 초기 정지와 직접 재생을 확인했다.
- 운영 Chromium 1440×900·390×844에서 두 영상 모두 `controls=false`, `muted=true`, `loop=true`, 실제 재생을 확인했다. 지속 조작부 DOM은0개, 가로 넘침·실행 오류도 없으며 PC에서 두 영상의 끝→처음 반복과 TOGETHER 진입 후 WEB 정지를 확인했다. 실제 모바일 기기 검증과 구분한다.
- 운영 HOME·실제 브라우저가 읽은 페이지 JS2개·CSS는 HTTP200이다. CSS는 로컬 빌드와 SHA-256이 같다. Vinext가 빌드마다 새 식별자를 만들기 때문에 페이지 JS 파일명의 로컬 일치를 배포 판정으로 사용하지 않고, 정확한 Git 커밋의 원격 빌드 성공·현재 Worker 버전·운영에서 로드한 JS·실제 동작으로 확인했다.
- 운영 주소: [WEB](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/#web), [TOGETHER](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/#together). 로컬 `http://localhost:5187`은 HTTP200이며 계속 실행한다.
- 기록은 Git 제외 `outputs/deploy/2026-09-14/video-autoloop/`의 빌드 로그·운영 JSON·캡처에 보관한다. 소스·문서는 GitHub 관리 대상이며 환경변수·빌드·로그는 제외한다.

## 2026-09-14 — 회사 정보·인트로·SYSTEM 확정 버전 배포 완료

- 사용자가 로컬의 최종 결과를 확인한 뒤 전체 GitHub 반영·운영 배포를 승인했다. HOME 인트로6.8초·고화질·브랜드 앞면 색, 대표이사 조은준/사업자번호879-88-03852/회사번호031-647-6396/이메일onoff3739@naver.com/주소 경기도 평택시 모곡동447-3 엠에스원타워407호 (주)온앤오프를 반영했다. SYSTEM은 고화질·안개 불투명도25%·은하만1.2배 확대하며 글자·정거장과 다섯 비행체의 크기·위치는 유지한다.
- 소스 커밋 `42ac432fabec775c7cdceccf629dafe9fd85aca7`을 기존 GitHub `G-bak/onoff-hero`의 `main`에 정상 push했다. Cloudflare Build `fadbcdff-f8c9-4e6e-b479-eb082a927d7d`는 `npm run ci:build`와 기존 배포 명령으로 `stopped/success`가 됐다. 별도 배포 워크플로·수동 배포·새 호스팅을 만들지 않았다.
- 2026-09-14 14:52:39 KST(05:52:39 UTC), Worker 버전 `73915978-c33d-46cf-b676-a6f7e1c19a52`가100% 반영됐다. 배포 ID는 `45c445d6-8982-4f88-80e0-8d6798bd74b6`이다. 뒤따르는 결과 기록 커밋은 동일 앱 소스의 문서 갱신이다.
- 로컬143개 자동 검사·린트·타입·빌드·CSS/자산 검사 통과 후 원격에서도 자동 빌드가 성공했다. 추적 중인 ignore 대상은 없으며 환경변수·비밀·의존성·빌드·캡처·로그는 Git에서 제외했다.
- 운영 HOME·서비스 상세5개·문의의7개 경로가 HTTP200이며 새 이메일과 이전 이메일·전화 제거를 확인했다. HOME의 새 사업자번호·주소·`tel:0316476396`도 일치한다. `/api/inquiry`의 HTTP200·`enabled=true`와 기존 개인정보 버전·갱신 연락처를 확인했다. 이번 검증은 GET만 사용했으며 실제 문의·Slack 메시지는 전송하지 않았다.
- 운영 `galaxy`·`galaxy-scene`·`home-opening`·`opening-scene`의4개 JS는 로컬 최종 빌드와 SHA-256이 모두 같다. 실제 Chromium1440×900에서2850×1800 오프닝 캔버스·재생 완료와 SYSTEM의 안개25%·확대된 은하·비행체5개·`ready`를 확인했다. 320×568 HOME은 가로 넘침이 없고 회사 정보 하단199.375px, kicker 상단230px로 분리된다. 실제 모바일 기기 테스트와는 구분한다.
- 운영 주소: [ON&OFF](https://onoff-hero-preview.ajdhfbx1836203.workers.dev), [SYSTEM 바로 보기](https://onoff-hero-preview.ajdhfbx1836203.workers.dev/#why). 로컬 `http://localhost:5187`도 HTTP200이며 계속 실행한다.
- 빌드 로그·운영 검증 JSON·실제 화면은 Git 제외 `outputs/deploy/2026-09-14/release/`에 보관한다. 소스와 이 배포 기록은 GitHub 관리 대상이다.

## 2026-09-13 — Slack 알림 양식 개선

- 실제 수신 메시지를 현업 양식으로 정리하라는 사용자 요청이다. 제목·한국시간·문의자/연락처·서비스/예산/일정·문의 본문·하단 접수 기록의 순서로 구분한다. 표제 굵기·구분선·예산/일정 두 열·명시적 메일/참고 링크를 사용한다. 기존 메시지는 변경하지 않는다.
- 고객 원문·두 동의·보관 운영·전송 성공 판정·중복 방지는 유지한다. 전체 내용의 접근성 대체 텍스트와 멘션 방지, 날짜 경계·URL 판별 검증을 포함한다. 상세 구성과 공식 근거는 [Slack 안내](SLACK-INQUIRY.md)를 따른다.
- 새 양식의 로컬 실제 Slack 테스트는 `2026-09-13T11:55:38.353Z`에 HTTP 200/`delivered`로 완료했다. 요청 ID `50a88519-3100-437e-97e5-d31127da7b6b`이며 가상 검증 정보만 사용했다.
- 전체 139개 검사·린트·타입·빌드·CSS/자산 검사를 통과한 소스를 기존 main 자동 배포로 반영한다. 전체 검사 로그, 샘플 payload, 운영 전송 결과와 최종 배포 버전은 Git 제외 `outputs/deploy/2026-09-13/slack-message-format/`에 보관한다. 실제 Slack 채널의 화면을 직접 열람한 검증으로 설명하지 않는다.

## 2026-09-13 — 운영 문의 502 수정 배포·실제 접수 성공 확인

- 사용자 신고 후 운영 문의 POST의 HTTP 502를 8ms·13ms에 확인했다. 기존 실제 Slack 성공 1건은 로컬 Node 브라우저 테스트였으며, 앞선 운영 접수 검증은 GET 200/활성 상태와 동의 없는 POST 400에 한정됐다. 운영 전송 성공까지 검증한 것으로 해석하지 않는다.
- Cloudflare [workerd 소스](https://github.com/cloudflare/workerd/blob/main/src/workerd/api/http.c%2B%2B#L447)는 `redirect: 'error'`를 요청 생성 단계에서 거절한다. `redirect: 'manual'`로 수정하고 route의 전송 함수는 fetch 래퍼로 주입했다. 리디렉션을 따라가지 않고 HTTP 200/`ok`만 성공으로 인정한다.
- 301·302·307·308 응답 거절 검증을 확장한 뒤 `npm run ci:build`의 137개 검사·린트·타입·빌드·CSS/자산 검사를 통과했다.
- 코드 커밋 `052822586bfeb74884c2d0dfd724565d707da8d6`, Cloudflare Build `b46fb66e-c549-4d83-b370-45245d8f1e83`의 success와 Worker 버전 `d49c8001-fced-40b7-9354-2b1c50e1dedd`의 100% 배포를 확인했다.
- 첫 실제 운영 테스트는 375px Playwright에서 제출 도중 도구가 `Transport closed`로 종료됐다. 운영 로그의 `2026-09-13T11:30:13.922Z`, HTTP 200, wall 304ms, Cloudflare 요청 ID `93236816f98826c4b6905807a393b0d8`를 확인했다. 이 요청의 앱 요청 ID·응답 JSON·완료 화면은 확보하지 못했다.
- 완료 화면 검증을 위해 별도의 가상 문의 `운영 완료 화면 검증용 테스트` 1건을 추가 전송했다. `2026-09-13T11:32:52.570Z`에 앱 HTTP 200, `ok:true`, `code:delivered`, 요청 ID `6ada2ac0-19ed-4798-bebd-5de56b3cf0b4`, 438ms, POST 1회를 확인했다. 1440×900에서 실제 접수 완료 문구·비활성 버튼 캡처를 확보했다.
- 운영 테스트 2요청 모두 HTTP 200이며 두 번째는 결과 JSON과 완료 UI까지 확인했다. 375px·320px 리사이즈에서도 완료 DOM이 유지되고 가로 넘침은 없었다(너비 차이 -15px는 stable scrollbar gutter). 실제 모바일 기기 검증이나 Slack 채널 UI 열람으로 설명하지 않는다.
- 실제 운영 HOME 320×568도 주소 오른쪽 내부 여백 28px, 가로 넘침 0, 주소와 메뉴의 분리를 확인했다. `production-home-320.json`과 `production-home-320.png`에 측정·화면을 보관한다.
- 증거는 Git 제외 `outputs/deploy/2026-09-13/inquiry-runtime-fix/`의 `ci-build.log`, `production-verification.json`, `production-success-1440.png` 등에 보관한다.

## 2026-09-13 — 확정 회사 정보·연락처 후속 반영

- 사용자 제공 정보: 대표자 조은준, 주소 경기도 평택시 산단로16번길 26 엠에스원타워 407호, 이메일 jej4628@naver.com, 전화010-5838-6781. 홈페이지와 현재 기준 문서에 적용했다. 홈페이지·서비스 상세·문의·개인정보 안내는 공통 연락처를 재사용하며 전화는 모바일에서 바로 걸 수 있다.
- 320~1920px 12개 너비로 회사 정보 배치를 확인했다. 320px에서 주소가 두 줄이 되어 헤더 아래 간격이 부족했던 부분은 360px 이하의 kicker·워드마크를 18px 아래로 옮겨 보완했다.
- 320×568·1440×900 실제 오프닝 종료 후 주소·대표자, 앞뒤 캔버스, 가로 넘침 0, 실행 오류 0을 확인했다. 320px의 헤더 아래 간격은 9.42px다. 전체 검사 137개·린트·타입·빌드·CSS/자산 검사 통과.
- 연락처 확정 후 HOME·서비스 상세 5개·문의의 7개 경로에서 새 이메일 링크와 이전 연락처 제거를 확인했다. 320px 넘침 0, 전화 링크 `tel:01058386781`, 접수 활성 및 개인정보 안내의 새 이메일·전화가 일치한다. 공통 연락처 의존성을 기존 HOME 오류 테스트에도 연결해 137개 검사를 다시 통과했다.
- 기존 main 자동 배포 연결을 사용하는 후속 수정이다. 로컬 검증 화면·빌드 로그와 최종 운영 확인은 `outputs/deploy/2026-09-13/company-info/`에 보관한다.

## 2026-09-13 — 전체 개선과 Slack 문의 배포 완료

- HOME 오프닝·일곱 섹션·서비스 상세·문의 화면과 전체 감사 후속 개선을 반영한다. 기존 Cloudflare Worker와 `G-bak/onoff-hero`의 main 자동 배포 연결을 재확인했다.
- Slack 실제 테스트 문의 1건을 로컬 Node 미리보기의 브라우저에서 제출해 앱 HTTP200/delivered와 Slack HTTP200/ok 성공 경로를 확인했다. 운영 Worker의 성공 POST 검증은 아니었다. 가상 정보만 사용했으며 채널 화면을 직접 열람하지는 않았다.
- 최대 90일 보관, 담당 업무명/기존 이메일, 수집·이용과 국외 처리위탁 동의, 서버 정책 버전 검증을 적용했다. 웹훅과 정책 버전은 기존 Worker의 secret으로 설정했다. 비밀 값은 Git과 빌드에 넣지 않았다.
- 전체 검사 137개·린트·타입·운영 빌드·CSS/자산 검사를 통과했다. 실제 웹훅 문자열이 빌드 377파일에 없는지 확인했다. 기존 대형 Three.js 청크 경고는 오류와 구분한다.
- outputs 2,946파일 이동·원본 해시 일치를 확인했다. 로컬 서버 PID14112와 현재 로그는 유지한다. [정리 기준](OUTPUTS.md).
- 소스 커밋 `71afb146e64a8765ee55fea47bbfc03a4d20f9a9`를 main에 push했다. Cloudflare Build `b8aaf327-9a86-47fa-b67d-4ea216489761`가 success로 종료했고 2026-09-13 19:55 KST에 Worker 버전 `8839fa3b-66b4-4766-8d28-0c52d885f7c0`을 100% 배포했다. 이 뒤의 결과 기록 커밋은 동일 앱 소스의 문서 갱신이다.
- 운영 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev . `/api/inquiry`는 HTTP200·enabled=true·현재 안내 버전을 반환하고 두 secret이 유지됐다. 동의가 없는 실제 Worker POST는 HTTP400으로 거절되며 Slack 메시지를 보내지 않았다.
- 운영 브라우저 1440×900·375×812에서 오프닝 종료, 7섹션 이동과 HOME 복귀 16상태, 활성 메뉴 단일 표시, 가로 넘침 0, 실행 오류 0, 홈에서 문의 페이지 연결·접수 활성 표시를 확인했다. 서비스 상세 5개와 문의 HTTP200, 잘못된 서비스 주소의 실제404도 확인했다. 실제 Slack 테스트는 앞서 수행한 1건이며 운영 확인에서는 추가 발송하지 않았다.
- 검증 로그·운영 화면·JSON은 `outputs/deploy/2026-09-13/release/`, 실제 접수 캡처는 `outputs/maintenance-2026-09-13/inquiry-slack-live-success.png`다. 로그·비밀·검증 산출물은 Git 제외, 소스·원본·프로젝트 문서는 GitHub에 반영했다. 로컬 5187은 HTTP200이며 계속 실행한다.

## 2026-09-10 — GitHub 자동 배포 연결

- 사용자가 Cloudflare GitHub 앱의 접근 대상에 `G-bak/onoff-hero`를 추가한 뒤 저장소 연결 성공.
- 기존 Worker `onoff-hero-preview`에 `main` 전용 운영 트리거 연결. 빌드 명령 `npm run ci:build`, 배포 명령 `npx wrangler deploy --config dist/server/wrangler.json`, 루트 `/`. 기본값으로 생성된 비운영 브랜치 미리보기 트리거는 제거.
- 배포 토큰은 Cloudflare Workers Builds가 관리. GitHub에 비밀 값을 저장하지 않음.
- 이 설정 문서의 `main` push로 최초 자동 배포를 검증한다. 실제 실행 상태와 대상 커밋은 Cloudflare Builds 및 GitHub 커밋 검사에 표시된다.

## 2026-09-10 — GitHub 소스 동기화 및 자동 배포 준비

- 최신 배포본의 소스·글꼴·카드 이미지와 렌더링 최적화 테스트를 GitHub에 반영하도록 정리.
- Node.js 24.19.0 고정, `npm run check`와 `npm run ci:build` 추가. Git 대상 파일만 별도 디렉터리에 내보내 의존성 새 설치 후 타입 검사·테스트 12개·빌드·배포 CSS 검사 통과.
- Cloudflare Workers Builds에 GitHub `G-bak/onoff-hero` 연결을 요청했으나 저장소 접근 오류 `8000012` 반환. 현재 빌드 트리거와 빌드 토큰은 없음. 자동 배포는 아직 활성화되지 않았으며 최초 저장소 연결이 필요함. 구체적인 설정값은 `AUTO-DEPLOY.md`에 기록.
- 이 단계는 저장소 동기화와 CI 준비이며, 운영 배포는 직전 마침표 제거 버전을 유지.

## 2026-09-10 13:38 KST — 메인 문구 마침표 제거

- 사용자 요청: `당신은 사업만 ON / 복잡한 마케팅은 OFF`의 각 줄 끝 마침표를 제거한 버전까지 배포.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `2c564734-32df-4c38-ac28-c65e1374111a`, 트래픽 100% 반영 확인.
- 직전 배포 버전: `8951d833-6d60-477d-a388-7cb9b7fc9c6b`.
- 직전 빌드와 배포 CSS 검사를 통과한 산출물을 배포. 원격 홈 HTTP 200, 실제 문구의 마침표 제거, 페이지 JS·CSS와 로컬 빌드의 SHA-256 일치 확인.
- 검증 기록: `outputs/deploy/2026-09-10/verification/verification-no-periods.json`. Git 커밋·push는 하지 않음.

## 2026-09-10 13:35 KST — 카드 상단 영역 축소, 문구 위치 교대, 브랜드 색상 변경

- 사용자 요청: 현재 로컬 변경분을 기존 주소에 배포.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `8951d833-6d60-477d-a388-7cb9b7fc9c6b`, 트래픽 100% 반영 확인.
- 직전 배포 버전: `2146ee51-8c70-4292-be16-2688df8e953d`.
- 카드 상단 ON&OFF 로고·TEAM 번호·구분선 영역 98px을 제거. 카드 텍스처를 640×880에서 640×782로 줄이고, 내부 텍스트·배경판·인물을 98px 위로 이동. 3D 카드 높이도 같은 비율로 줄이고 위쪽 가장자리는 고정. 대체 카드도 동일한 비율 적용.
- `당신은 사업만 ON. / 복잡한 마케팅은 OFF.`를 중앙 왼쪽으로, `ONE TEAM. / MANY MINDS.`를 하단 왼쪽으로 교대.
- 브랜드 색상: 검정 `#333333`, 연두 네온 `#D8FF3E`, 파랑 `#343CFF`. 3D 카드, 대체 카드, 버튼, 강조 문구, 테두리와 그림자의 관련 색상까지 반영.
- 직전에 타입 검사·빌드·기존 배포 CSS 검사를 통과한 산출물을 그대로 배포. 카드 위쪽 가장자리 고정, 인물 하단 여백 32px, 대체 화면 좌표 일치를 계산 확인.
- 배포 후 홈·CSS·페이지 JS·인물 PNG HTTP 200 및 CSS·JS·PNG의 로컬 빌드 대비 SHA-256 일치 확인. 홈이 최신 CSS를 참조하고 문구 위치 교대와 카드 상단 제거가 반영됨을 확인. 실제 브라우저 시각 검증은 수행하지 않음.
- 검증 기록: `outputs/deploy/2026-09-10/verification/verification.json`. 로컬 5187 서버 유지 및 HTTP 200 확인. Git 커밋·push는 하지 않음.

## 2026-09-09 18:05 KST — 참고 이미지에 맞춘 카드 구성

- 사용자 요청: 새 Photoroom 누끼 이미지로 카드를 제공한 예시처럼 변경하고 배포.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `2146ee51-8c70-4292-be16-2688df8e953d`
- 직전 배포 버전: `a1c9e3ab-cf71-4600-a359-0ecfe8a15bab`
- 현재 이미지: `public/images/team-realistic-figurines-v3-photoroom.png`. 사용자 파일을 변경 없이 복사했고 기존 이미지는 보관.
- 카드 상단에 분야·직무명·소개·에디션 문구를 모음. 직무명은 58px, 소개는 19px. 아래쪽에 둥근 회색 판을 두고 인물을 오른쪽 아래에 겹쳐 배치. 인물의 발·소품·받침대는 유지.
- 640×880 텍스처에서 배경판은 `(214, 354, 366, 416)`, 인물 원본 셀은 `(340, 462)`부터 높이 `386`. 실제 불투명 인물 높이는 약 350px로 카드 높이의 약 40%. 이전 중앙 35% 배치를 대체하며 CSS 대체 화면도 같은 비율.
- Montserrat 큰 로고, 3D 카드 크기·곡면·회전, 초기 MOTION ON 및 OFF의 수동 조작은 유지.

검증: 타입 검사·빌드·기존 배포 CSS 검사 통과. 6명 모두 실제 알파 영역이 카드 경계 안에 들어오는지 계산 확인. 배포 후 홈·CSS·페이지 JS·새 PNG의 HTTP 200 및 로컬 빌드와 원격 자산의 SHA-256 일치 확인. 홈이 최신 CSS를 참조하며 CSS와 JS 모두 새 누끼를 요청. 로컬 5187도 HTTP 200, 서버 유지. 실제 브라우저 시각·조작 검증은 수행하지 않음. 기록: `outputs/qa/2026-09-09/card-style/`.

검사 과정에서 이전 배포 백업의 `vite.config.ts`가 프로젝트 타입 검사에 포함되는 문제를 확인하여 백업 확장자를 `.ts.bak`으로 변경했다. 실제 프로젝트 설정은 변경하지 않았다. 이번 배포를 위한 Git 커밋·push는 하지 않았다.

## 2026-09-09 17:52 KST — 큰 ON&OFF 로고 Montserrat 적용

- 사용자 요청: 큰 ON&OFF 로고를 Montserrat로 변경.
- 큰 워드마크에 Montserrat Bold(700) 적용. 기존 크기·자간·위치·코발트 앰퍼샌드는 유지.
- `@fontsource/montserrat` 5.3.0의 Latin 700만 불러오고 폰트 파일을 사이트에서 직접 제공. 헤더 이미지 로고와 나머지 글꼴은 기존 설정 유지.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `a1c9e3ab-cf71-4600-a359-0ecfe8a15bab`
- 직전 배포 버전: `3ccfe463-1197-4f16-8da1-fc9969f81245`
- 피규어 이미지와 인물 크기 35%는 유지. 캐릭터 복원은 이후 요청 시 진행.

검증: 빌드와 기존 배포 CSS 검사 통과. 산출 CSS의 Montserrat 700 적용 및 폰트 파일 포함 확인. 배포 후 홈·CSS·WOFF2·WOFF 응답 HTTP 200, 원격 CSS·폰트와 로컬 빌드의 SHA-256 일치, 홈의 최신 CSS 참조 확인. 실제 브라우저 시각 검증은 수행하지 않음. 로컬 5187 서버 유지. 검증 기록은 `outputs/deploy/2026-09-09/montserrat/`에 보관.

## 2026-09-09 17:32 KST — 실사 피규어 누끼 임시 배포

- 사용자 요청: 현재 버전을 일단 배포. 나중에 캐릭터 이미지로 되돌릴 예정이며, 이번에는 되돌리지 않음.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- Cloudflare Worker: `onoff-hero-preview`
- 배포 버전: `3ccfe463-1197-4f16-8da1-fc9969f81245`, 트래픽 100% 반영 확인.
- 직전 배포 버전: `bf23dd75-ecc7-4b80-8dc1-7d16e405b50c`
- 현재 이미지: `design/archive/public/images/team-realistic-figurines-photoroom.png`
- 인물 크기: 최초 가로·세로의 35%. 카드 크기와 모션 설정은 유지.
- 앞서 로컬에서 수정한 보안 의존성과 필요할 때만 그리는 렌더링 최적화도 포함.
- 이번 배포를 위한 Git 커밋이나 원격 저장소 push는 하지 않음.

검증: 직전 단계의 성공한 빌드를 재사용. 타입 검사, 로딩 테스트 5개, 렌더링 테스트 7개 통과. 배포 후 홈·실제 누끼 PNG·페이지 JS·CSS의 HTTP 200 확인. 이미지·JS·CSS는 로컬 빌드와 SHA-256이 같고, JS와 CSS 모두 Photoroom 파일을 참조한다. 실제 브라우저 조작 검증은 수행하지 않았다. 로컬 5187 서버도 계속 실행 중이며 HTTP 200 확인.

## 나중에 캐릭터로 복원할 때

- 원본 캐릭터 이미지 `design/archive/public/images/team-miniatures.png`를 그대로 보관하고 있다.
- 현재 복원 절차는 `scripts/team-asset.config.mjs`의 `source`와 `maxWidth`를 수정하고 `npm run prepare:assets`를 실행하는 것이다. 보관 원본은 `design/archive/public/images/team-miniatures.png`다. 3D와 대체 화면은 동일한 생성 WebP import를 유지하며, 개별 컴포넌트나 CSS를 원본 PNG URL로 직접 바꾸지 않는다.
- 이미지 참조만 복원하면 보안 업데이트, 로딩 처리와 렌더링 최적화를 유지할 수 있다.
- 현재 인물 배치는 참고 카드에 맞춘 높이 `386`, 오른쪽 아래 정렬이며 이미지 경로와 별개다. 이전 `.35` 중앙 축소 설정은 최신 카드 구성으로 대체되었다. 캐릭터 복원 시 배치·크기도 바꿀지는 그때의 사용자 요청에 따른다.
- 사용자의 복원 요청 전에는 현재 배포 이미지를 유지한다.

배포 직전 관련 소스와 원본 이미지 해시, 배포 후 응답 확인 결과는 `outputs/deploy/2026-09-09/photoroom/`에 보관했다.
