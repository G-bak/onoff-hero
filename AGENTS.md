# ON&OFF 프로젝트 작업 지침

## 2026-09-16 마케팅 상세 HERO·고민·장점 문구

사용자 제공 문구로 `/services/marketing`의 상단 분류·HERO 제목/소개·하단 키워드, 첫 본문 제목/설명·고민3개·장점3개를 수정한다. HERO 제목은 **많이 보여주는 것보다, / 제대로 꽂히게.**, 첫 본문 제목은 **이런 고민이라면, / 마케팅의 방향부터 다시 봐야 합니다.**다. 마케팅 전용 문구와 줄바꿈만 적용하고 기존 화면·이미지·모션·버튼·후속 섹션·다른 서비스는 유지한다. [서비스 상세 기록](docs/pages/SERVICE-DETAILS-NOTES.md)이 기준이다. 로컬 검증 후 사용자가 GitHub 반영·운영 배포를 승인했다. 기존 `main` → 새 회사 계정의 Cloudflare Workers Builds 자동 배포를 사용하며 실제 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)에 남긴다. 사용자가 켜 달라고 한 로컬 서버는 유지한다.

## 2026-09-15 DNS 진단 문서 GitHub 반영 승인

사용자가 네임서버 이전의 반영 지연 설명을 받은 뒤 현재 올릴 변경을 GitHub에 반영하도록 요청했다. 현재 변경은 이 지침과 운영 문서5개이며 앱 소스·DNS·배포 설정 변경은 없다. 아래 로컬 전용·commit/push 금지는 해당 기록 작성 시점의 이력이고 이번 문서 반영 승인이 우선한다. 원본 진단 로그·설정 백업·관리자 복구 스크립트·환경변수는 Git 제외 상태를 유지한다. 기존 `G-bak/onoff-hero` main에 반영하고 연결된 자동 배포 설정은 유지한다. GitHub 반영이나 같은 앱 소스의 자동 배포를 DNS 장애 복구 완료로 설명하지 않는다. 일반 접속 복구는 계속 미확인이며 현재 DNS를 재등록하거나 PC 설정을 변경하지 않는다.

## 2026-09-15 17:28 KST 일반 접속 실패 확인·DNS 재등록 보류

사용자가 모바일 데이터에서도 실패한다고 알렸고 PC DNS 변경 방향을 지적했다. 최신 요청은 검색 색인 조사를 보류하고 일반 접속과 DNS 이전 문제의 근본 복구에 집중하는 것이다. PC·공유기 DNS 변경이나 통신사 질문을 반복하지 않는다. 17:24 기본 DNS 접속은 ENOTFOUND이며, 정상 resolver를 별도 지정한 56개 페이지 응답200·30개 정상 리다이렉트는 일반 방문자 복구가 아니다. 실제 Cloudflare 중복 route·사용자 firewall rule 없음, Access 미사용, 봇/크롤러 차단 비활성, 조회한 보안 이벤트0개를 확인했다. 현재 확인된 직접 실패는 구 NS 경로의 주소 없음 응답이며 휴대폰 실패 원인은 별도 미확인이다.

새 zone 해제·재등록은 구 NS·외부 캐시를 지우지 않고 새 NS를 추가 배정하므로 수행하지 않는다. 구 삭제 zone의 DNS 복원·즉시 authoritative purge는 공개 API에서 지원 경로를 찾지 못했다. Cloudflare 내부 조기 정리 가능성은 조사 요청 대상으로만 설명하고 보장하지 않는다. [현재 복구 기록](docs/operations/DNS-RECOVERY-2026-09-15.md)과 [Cloudflare 요청 초안](docs/operations/CLOUDFLARE-DNS-INCIDENT-2026-09-15.md)을 남겼다. 외부 요청은 미전송, 운영/PC 설정 변경·commit·push·배포 없음, 전체 복구 미완료다.

## 2026-09-15 17:19 KST 회사 계정 확인·DNS 복구 조치와 남은 장애

사용자가 가능한 최선의 홈페이지 접속 복구를 요청했다. 17:11:28 KST 실제 MCP `/user`·`/accounts`에서 회사 계정 `onoff3738@naver.com` / `f446e31d575c7e7135b7486ada7c35c4`를 확인했다. 새 zone active·aida/keanu·루트/www Custom Domain·인증서·현재 배포는 정상이다. 17:11~17:17 KST 공유기192.168.0.1뿐 아니라 KT168.126.63.1 직접 UDP/TCP에서도 이전 ashley/trevor·루트 주소 없음·www NXDOMAIN을 반복 확인했다. KT168.126.63.2도 정상/이전 응답이 혼재한다. Google·Cloudflare·Quad9·SKB·LG의 검사 경로는 정상이며, 7페이지·23자산·문의 GET 활성 상태·TLS·리다이렉트 검증을 통과했다. 모든 KT 방문자의 상태나 복구 시간을 단정하지 않는다.

Cloudflare1.1.1.1의 루트 NS 및 루트/www A·AAAA 캐시 갱신5건은 HTTP200·queued로 접수했고 이후 새 정보 응답을 확인했다. KT 캐시는 별개이며 17:17 재조회에서도 장애가 남았다. 새 zone·위임·배포를 재생성하거나 변경하지 않았다. PC 이더넷16의 IPv4 DNS는 DHCP192.168.0.1로 백업했다. 비관리자 변경 시도는 Windows CIM 접근 거부로 실패해 설정은 그대로였다. Git 제외 `outputs/qa/2026-09-15/dns-recovery/repair-pc-dns.ps1`에 정상 DNS1.1.1.1·8.8.8.8 적용·HTTPS 검증·실패 시 자동 원복·`-Rollback`을 준비하고 Windows 관리자 권한 요청을 띄웠으나 `The operation was canceled by the user`로 종료돼 관리자 프로세스는 시작하지 못했다. **PC DNS는192.168.0.1 그대로이며 PC·전체 방문자 복구 완료가 아니다. 관리자 권한 요청을 새 지시 없이 반복하지 않는다.** 후속에서는 실제 DNS와 `windows-dns-final.json`을 먼저 확인한다. 상세는 [복구 기록](docs/operations/DNS-RECOVERY-2026-09-15.md), 원본 근거는 위 Git 제외 디렉터리에 보관한다. KT 캐시 갱신 요청문은 준비만 했고 전송하지 않았다. 이번 기록은 로컬만 저장하며 commit·push·배포하지 않는다.

## 2026-09-15 17:08 KST 사용자 요청 재로그인 완료·실제 연결 재확인 필요

사용자가 현재 Cloudflare MCP 로그아웃 후 재로그인 링크를 요청했고 인증 완료를 알렸다. `codex mcp logout cloudflare_api`와 새 OAuth 로그인을 수행했으며 CLI는 `Successfully logged in to MCP server 'cloudflare_api'.`로 종료됐다. 다만17:08:09 KST 현재 열린 MCP `/user`·`/accounts`는 초기 계정 `ajdhfbx1836203@naver.com` / `4c692f878ebb293ad79ef0d8c9c7cfcc`를 반환한다. 저장된 인증 성공과 현재 세션의 계정 응답을 구분한다. 새 세션에서는 실제 계정을 먼저 조회하고 확인 없이 재로그인을 반복하지 않는다. 이번 요청에서 사용자가 로그인한 이메일을 직접 명시하지는 않았으므로 새 운영 계정 전환을 완료로 설명하지 않는다. Wrangler·운영 배포·DNS 설정은 변경하지 않았다.

## 2026-09-15 16:57 KST 초기 계정 조회 완료·DNS 장애 확인

재시작 후16:54 KST MCP `/user`·`/accounts`에서 초기 계정 `ajdhfbx1836203@naver.com` / `4c692f878ebb293ad79ef0d8c9c7cfcc`를 실제 확인했다. 재로그인은 필요 없다. 초기 `on-onf.com` zone·루트/www Custom Domain은0개다. 초기 `onoff-hero-preview`도 없으며 감사 로그에16:48:23 KST 삭제가 기록돼 있다. 해당 tag의 Builds 설정 없음·트리거0개도 확인했다. 남은 `onoff-redesign-temp-20260909`는 정식 도메인/route/binding/Builds 연결이 없고 자체 workers.dev만 활성이다. 이번 세션은 삭제하지 않았다.

16:55~16:57 KST 기본 DNS192.168.0.1에서 HTTPS 해석 실패를 재현했고, 같은 시각 새 권한 NS·공개 DNS3곳·com parent·등록 위임은 정상이다. 공유기 경로는 이전/새 NS가 혼재하고 www가 NXDOMAIN→정상A→NXDOMAIN으로 바뀐다. 확인된 실패는 DNS 경로이며 공유기 내부와 통신사 상위 캐시의 위치는 미확정이다. Deleted zone의 구 NS 응답은 Cloudflare 공식 동작과 양립하므로 삭제 실패로 단정하지 않는다. 전체 방문자 복구는 아직 확인되지 않았다. 후속은 [진단·복구 방안](docs/operations/DNS-RECURRENCE-2026-09-15.md)을 먼저 읽는다. PC/공유기 DNS·가비아 위임·새 운영 계정·Wrangler·앱 소스는 변경하지 않았다. 기록은 로컬만 보관하고 commit·push·배포하지 않는다.

## 2026-09-15 16:50 KST 재시작 인수인계 — 여기부터 재개

사용자가 초기 Cloudflare 계정 재로그인·인증 성공을 알렸고 Codex 재시작 후 이어서 작업하도록 메모를 요청했다. CLI도 `Successfully logged in to MCP server 'cloudflare_api'.`로 종료됐다. **현재 대화의16:50:47 KST MCP `/user`·`/accounts` 응답은 여전히 새 운영 계정 onoff3738@naver.com / f446e31d575c7e7135b7486ada7c35c4다. 저장된 OAuth 인증 성공과 열린 MCP 세션의 전환을 혼동하지 않는다.** 재시작한 다음 세션에서 먼저 실제 `/user`·`/accounts`를 조회하고 초기 계정 ajdhfbx1836203@naver.com / 4c692f878ebb293ad79ef0d8c9c7cfcc인지 확인한다. 이미 성공한 로그인을 확인 없이 다시 시작하지 않는다.

**최우선 미완료 작업은 접속 장애 재발 원인 및 초기 계정 잔존 자원 조회**다. 파비콘은 이미 흰 배경으로 운영 배포·검증까지 완료했다. 상세 상태·계정/자원 ID·읽기 조회 순서·검증 근거는 [다음 세션 인수인계](docs/operations/HANDOFF-2026-09-15-MCP-RECONNECT.md)를 먼저 읽는다. 이번 메모와 후속 배포 기록은 로컬에만 저장한다. 메모 작성만을 위해 commit·push·추가 배포하지 않는다.

## 2026-09-15 접속 재발·초기 계정 MCP 재연결 요청

사용자가 접속 장애 재발을 알리고 초기 계정에 남은 자원을 의심해 Cloudflare MCP를 초기 계정으로 다시 연결하도록 요청했다.16:47 KST registry RDAP는 새 aida·keanu만 등록했고 새 네임서버2개와 Google/Cloudflare/Quad9 DNS는 정상 A/AAAA를 제공했다. 반면 공유기192.168.0.1과 이전 ashley·trevor 네임서버 직접 조회는 이전 NS/SOA 및 A/AAAA 없음으로 응답했다. 조회 시점의 PC 양성 캐시로 HTTPS200이 잠시 가능해도 상위 DNS 정상화와 구분한다. 기존 계정 자원 존재 여부와 이 응답의 관계는 직접 재조회 전 확정하지 않는다.

`codex mcp logout cloudflare_api`를 완료하고 `codex mcp login cloudflare_api`로 초기 이메일 `ajdhfbx1836203@naver.com`의 사용자 인증을 요청했다. 인증 성공 로그와 현재 대화 MCP의 실제 `/user`·`/accounts` 응답을 구분한다. 초기 계정 ID `4c692f878ebb293ad79ef0d8c9c7cfcc` 확인 후 도메인·DNS·Worker Custom Domain·route를 읽기 조회한다. 이번 요청은 연결·조회이며 기존 자원의 삭제나 네임서버 변경 지시는 아니다. 새 계정 운영 배포와 Wrangler 인증·vite.config.ts는 유지한다. 진단은 Git 제외 outputs/qa/2026-09-15/sitemap-fetch/dns-recurrence.json에 보관한다.

## 2026-09-15 운영 전체 점검·흰 배경 파비콘

사용자가 사이트 접속과 광고 테스트 성공을 알리고 전체 점검 및 다크모드에서 보이는 흰 배경 파비콘을 요청했다. 파비콘은 기존 ONF 로고·배치·크기를 유지하고 정사각형 전체를 불투명 흰색으로 만든다. `scripts/prepare-brand-assets.mjs`에서32·64px PNG와16·32·48·64px ICO를 함께 생성한다. 리사이즈·여백 적용 후 별도 단계에서 흰색으로 합성해 여백의 투명도가 다시 생기지 않게 한다. `app/layout.tsx`의 모든 아이콘 주소는 `v=white-20260915`로 갱신한다. 헤더 로고·회사 원본은 변경하지 않는다. 기존 새 Cloudflare 계정의 main 자동 배포를 사용한다.

전체 점검의 기준은 [운영 검토](docs/reviews/PRODUCTION-REVIEW-2026-09-15.md)다. 사용자 확인 광고 테스트와 실제 Google Ads 계정의 전환 집계·Search Console 수집 완료·네이버 등록 완료를 구분한다. 문의의 실제 Slack 전송은 이번 점검에서 수행하지 않는다. Google Ads 문의 완료 전환 라벨과 네이버 인증값은 아직 제공되지 않았으며 임의로 만들지 않는다.

## 2026-09-15 Google Ads 공통 태그

사용자가 제공한 Google 태그 ID는 `AW-18383031274`다. `app/layout.tsx`의 공통 head에 비동기 `gtag.js`와 사용자 제공 `dataLayer`·`gtag('js')`·`gtag('config')` 초기화를 넣어 HOME·서비스 상세·문의 화면에 적용한다. 기존 Google 태그는 없었으며 태그를 중복 설치하지 않는다. 이번 범위는 제공된 기본 태그 설치다. 별도 전환 이벤트·전환 라벨·고객 입력값 전송·Google Ads 계정 설정을 추가하지 않는다. 기존 SEO·화면·문의 처리·새 Cloudflare 계정의 main 자동 배포를 유지하고 검증 및 배포 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)을 따른다.

## 2026-09-15 새 계정 이전·자동 배포 완료

새 계정 `f446e31d575c7e7135b7486ada7c35c4` / `onoff3738@naver.com`의 `onoff-hero-preview`가 운영 대상이다. `on-onf.com`·`www.on-onf.com`, 새 zone `76e8a080d3391f997a0106e5f4d3c8e5`, 가비아 네임서버 `aida.ns.cloudflare.com`·`keanu.ns.cloudflare.com`이 연결됐고 인증서3개가 active다. GitHub main 커밋 `4a5f55e16112073da4ac5408f98da07056fffc7c`를 감지한 새 계정 Build `df65ab04-f0f0-4ab3-8f56-848cd47968a9`가 성공해 16:09 KST 버전 `23673416-3ba7-4168-81f7-4360166f6695`를100% 배포했다. 이후 완료 기록 커밋은 같은 앱 소스다.

배포 후 공개7개 경로·SEO·www308·HTTP301·자산/영상21개·문의 GET200/enabled=true를 확인했다. 문의 secret2개·공개 연락처·디자인·SEO·workers.dev/Preview 비활성을 유지한다. 실제 문의/Slack 메시지 전송·브라우저 시각 검수는 이번 범위에 포함하지 않는다. 일부 기본 DNS 조회에는 당시 ENOTFOUND가 남았으며 Google/Cloudflare 공개 DNS를 사용한 HTTPS 검증은 통과했다. 아래 연결 미완료 항목은 이전 이력이다. [배포 기록](docs/operations/DEPLOYMENT-NOTES.md), [자동 배포 설정](docs/operations/AUTO-DEPLOY.md)을 따른다.

## 2026-09-15 새 Cloudflare 계정으로 홈페이지 이전 진행

사용자가 새 계정 연결 확인 후 도메인 재등록·홈페이지 이전·문의 설정·GitHub 자동 배포 이전을 진행하고 결과를 보고하도록 승인했다. 새 계정은 `f446e31d575c7e7135b7486ada7c35c4` / `onoff3738@naver.com`이다. 새 Free zone `76e8a080d3391f997a0106e5f4d3c8e5`를 만들었고 사용자가 가비아 네임서버를 `aida.ns.cloudflare.com`, `keanu.ns.cloudflare.com`으로 변경했다. 15:57 KST에 zone active를 확인했다. Wrangler도 새 계정으로 재인증했으며 `vite.config.ts`의 배포 계정 ID를 새 계정으로 변경했다. 로컬 전체 검사·빌드를 통과하고 새 `onoff-hero-preview`에 홈페이지와 기존 문의 비밀 설정2개를 배포했다. 루트·www Custom Domain과 HTTPS 강제 이동을 구성했고 workers.dev·Preview 비활성을 유지한다.

16:04 KST에 사용자가 새 Worker의 GitHub 연결을 완료했고 API에서 `G-bak/onoff-hero` 연결을 확인했다. 운영 트리거는 `main` 전용이며 `npm run ci:build` → `npx wrangler deploy --config dist/server/wrangler.json`으로 맞췄다. 연결 시 자동 생성된 비운영 브랜치 트리거는 제거했다. 정식 HTTPS의7개 경로·SEO·www308/HTTP301·직접 참조 자산과 영상21개·문의 접수 활성 상태를 확인했다. 실제 문의 전송·브라우저 시각 검수는 수행하지 않았다. 기존 계정의 Worker·환경변수·기타 자원은 삭제하지 않았으며 이전 Builds 조회는 Wrangler 권한으로403이어서 기존 트리거 중단·변경을 수행하지 않았다. 새 계정 ID를 명시한 소스가 배포 원본이며 이전 계정으로 수동 배포하지 않는다. 자동 배포의 최종 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)을 따른다. 홈페이지 공개 이메일 `onoff3739@naver.com`은 유지한다.

## 2026-09-15 Cloudflare 새 계정 연결 확인

사용자의 재확인 요청으로 2026-09-15 15:49 KST에 실제 MCP `/user`·`/accounts`를 다시 조회해 사용자 이메일 **onoff3738@naver.com**, 계정 **f446e31d575c7e7135b7486ada7c35c4** (`Onoff3738@naver.com's Account`)를 HTTP200·success=true로 확인했다. 아래 기존 계정만 반환한다는 내용은 재연결 전 이력이다. 새 계정의 `on-onf.com` zone·Worker 목록·해당 도메인의 Worker 연결은 모두0개다. 이번 요청에서는 조회와 로컬 기록만 수행했고 도메인 생성·설정 변경·배포·Git push는 하지 않았다. `vite.config.ts`와 기존 자동 배포는 아직 이전 계정 대상이므로 후속 이전 작업에서 새 계정에 맞춘 뒤 배포해야 한다. 홈페이지 공개 이메일은 `onoff3739@naver.com`을 유지한다. [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)을 따른다.

## 2026-09-15 Cloudflare 계정 변경을 위한 도메인 등록 삭제

새 Cloudflare 계정의 사용자 확인 이메일은 **onoff3738@naver.com**이다. 홈페이지 공개 이메일 `onoff3739@naver.com`과 다르므로 회사 정보는 바꾸지 않는다. `codex mcp logout cloudflare_api` 후 새 OAuth 로그인을 완료했고 사용자가 새 계정 인증 완료를 알렸으나, 현재 대화의 MCP `/accounts` 응답은 여전히 기존 계정만 반환한다. 저장된 CLI 인증 완료와 실제 MCP 계정 전환 확인을 구분한다. 연결을 새로 시작한 뒤 계정 ID를 다시 확인해야 하며, 새 계정 확인 전에는 도메인 생성·설정 변경·배포를 진행하지 않는다.

최신 사용자가 다른 계정으로 재로그인·MCP 연결 후 재등록하기 위해 **다른 것은 삭제하지 않고 기존 계정의 on-onf.com만 전부 삭제**하도록 명시했다. 2026-09-15 15:37 KST에 기존 계정 `4c692f878ebb293ad79ef0d8c9c7cfcc`에서 `on-onf.com`·`www.on-onf.com`의 Worker Custom Domain 연결과 zone `0674bbf17783acacb5ee2220a00e260a`를 삭제했다. 재조회한 해당 zone·도메인 연결 목록은 모두0개다. 가비아 도메인 등록·기존 Worker `onoff-hero-preview`·환경변수2개·GitHub 저장소·자동 배포 연결·다른 자원은 유지했다. DNS 설정과 삭제 결과는 Git 제외 `outputs/deploy/2026-09-15/account-migration/`에 보관한다.

아래 on-onf.com 운영 성공 기록은 삭제 전의 이력이다. 새 계정으로 MCP를 재연결한 뒤 실제 계정 ID를 확인하고 배포 설정·도메인·자동 배포를 맞춰야 한다. 현재 `vite.config.ts`는 여전히 기존 계정을 가리키며, 새 계정 연결 전에 기존 계정으로 추가 push·배포하지 않는다. 이번 삭제 기록은 로컬 문서에만 남긴다. [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)을 따른다.

## 2026-09-15 SEO 최적화·등록 안내·운영 배포 승인

사용자가 Google·네이버 공식 SEO 조사·문서화·사이트 코드 최적화·GitHub 반영·운영 배포와 두 검색 도구의 등록 안내를 요청했다. [SEO 문서 모음](docs/seo/README.md), [조사 근거](docs/seo/RESEARCH.md), [구현·검증](docs/seo/IMPLEMENTATION.md)이 기준이다. 대표 주소는 `https://on-onf.com`이며 HTTPS www는 경로·쿼리를 보존해308 이동한다. 공개7개 페이지의 noindex 상속을 해제하고 `lib/seo.ts`에서 고유 제목·설명·canonical·사이트맵·구조화 데이터를 관리한다. robots는 공개 문서·렌더링 자산을 허용하고 API만 제한한다. API는 X-Robots-Tag, 실제404는 noindex를 유지한다.

HOME 화면 원본은 `app/home-content.tsx`, 서버 메타데이터·JSON-LD 진입점은 `app/page.tsx`다. `htmlLimitedBots: /.*/`로 모든 요청의 head를 먼저 완성하며 메타데이터는 외부 요청 없이 로컬 데이터·환경값만 읽는다. 회사 정보는 기존 `companyInfo`를 공유한다. Google·네이버 계정 인증값은 각각 `GOOGLE_SITE_VERIFICATION`·`NAVER_SITE_VERIFICATION`으로 선택 제공하며 미입력 시 태그를 만들지 않는다. Google 도메인 인증용 TXT는 현재 권한 DNS인 Cloudflare에 추가한다. 실제 계정 소유 확인·사이트맵 제출은 안내만 준비했으며 완료로 설명하지 않는다. 기존 디자인·6.8초 오프닝·고화질·해시 없는 이동·임시 주소 비활성·문의·자동 배포를 유지한다. 검증은 회귀·빌드·HTTP/SSR이며 실제 브라우저 검수·검색 순위·실사용 성능 측정과 구분한다. PageSpeed API는429로 측정하지 못했다. 배포 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)에 남긴다.

## 2026-09-15 임시 workers.dev 주소 비활성화

사용자가 정식 도메인 운영에 맞춰 임시 주소 종료를 요청했다. 기존 `onoff-hero-preview` Worker의 workers.dev·버전별 Preview URL을 비활성화하고 `vite.config.ts`에 `workers_dev:false`, `preview_urls:false`를 명시해 다음 자동 배포에도 유지한다. `on-onf.com`·`www.on-onf.com` Custom Domain과 HTTPS 이동, 기존 main 자동 배포·문의 설정은 보존한다. 이번 요청은 설정을 GitHub에 반영하고 기존 자동 배포로 지속 적용하는 작업까지 포함한다. 아래 임시 주소 유지 문장은 연결 당시의 이력이다. 실제 검증과 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md), Git 제외 `outputs/deploy/2026-09-15/disable-workers-dev/`를 따른다.

## 2026-09-15 가비아 도메인 연결

사용자가 구매한 `on-onf.com`의 Cloudflare 등록·홈페이지 연결을 요청하고 가비아 네임서버 변경을 완료했다. `ashley.ns.cloudflare.com`, `trevor.ns.cloudflare.com`을 사용하는 Free zone은 active이며, `on-onf.com`과 `www.on-onf.com`을 기존 `onoff-hero-preview`의 production Custom Domain으로 연결했다. 운영 안내 주소는 **https://on-onf.com**이다. 두 주소는 HTTPS로 같은 홈페이지를 제공하며 HTTP 요청은 경로·쿼리를 보존해 같은 호스트의 HTTPS로301 이동한다. 2026-09-15 14:30~14:31 KST에 새 도메인의7개 경로·36개 자산과 문의 설정, 기존 배포와 JS/CSS25개 해시 일치를 확인했다. 앱 소스와 기존 GitHub 자동 배포는 유지하며 별도 앱 배포는 하지 않았다. [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)에 연결 정보·검증 범위를 남겼다.

## 2026-09-15 상세 개선 전체 GitHub 반영·운영 배포 승인

사용자가 상세 작업 범위·푸터·화살표 정리·해시 없는 스크롤 이동까지 현재 변경 전체의 GitHub 반영과 운영 배포를 승인했다. 기존 `G-bak/onoff-hero`의 `main` → Cloudflare Workers Builds 자동 배포를 사용한다. 아래 로컬 전용 표기는 각 변경 검토 시점의 이력이며 이번 승인이 우선한다. 최종 앱 소스의 로컬 테스트153개·린트·타입·빌드·CSS/자산 검사를 통과했다. 검증 도구·로그·환경변수는 Git에서 제외하고 실제 배포 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)과 Git 제외 `outputs/deploy/2026-09-15/service-improvements/`에 남긴다.

소스 커밋 `1c9c96d1ba15123e9ea35091a710aac099b5f69c`의 Cloudflare Build `da40e7c2-5136-4148-8563-ddb42d0f2265`가 성공했고 2026-09-15 13:35 KST에 Worker 버전 `4382bf71-7967-4c5c-a238-9aab7292ac6e`가100% 배포됐다. 운영7개 경로 HTTP200, 상세5개 공통 회사 푸터·운영 탭과 완료 체크, 참조 자산36개와 로컬 빌드 CSS 해시 일치, 문의 접수 설정 유지를 확인했다. 이번 운영 검수는 HTTP·서버 HTML·자산 확인이며 실제 브라우저 클릭·스크롤·모바일 시각 검수와 문의 전송은 수행하지 않았다. 뒤따르는 결과 기록 커밋은 동일 앱 소스를 유지한다.

## 2026-09-15 상세페이지 공통 회사 푸터

최신 사용자 요청으로 서비스 상세5개의 하단을 `ServiceFooter` 공통 푸터로 다시 구성했다. 회사명·대표이사·사업자번호·주소, 전화·이메일·서비스별 문의, 전체5개 서비스 메뉴, 개인정보 안내와 하단 이동을 제공한다. 회사 정보 공통 원본은 `lib/consultation.ts`의 `companyInfo`이며 HOME 상단은 같은 값을 사용하되 기존 표시·배치는 유지한다. 개인정보 문구는 기존 `lib/inquiry-privacy.ts`를 그대로 재사용하며 웹 상세의 참고 자료·이미지 출처도 보존한다. 새 영업시간·계약 조건·정책을 추가하지 않는다. 디자인은 검정 배경에 회사·문의·서비스3열, 작은 화면에서는 순차 배치하며 `service-footer.css`에 한정한다. 장식 대각선 화살표를 되살리지 않고 기존 해시 없는 이동을 유지한다. [공통 푸터 기록](docs/pages/SERVICE-FOOTER-NOTES.md)이 기준이며 로컬만 반영한다.

## 2026-09-15 섹션 이동 시 주소 해시 제거

최신 사용자 요청으로 `#home` 등 페이지 내 위치를 주소창에 남기지 않는다. 사이드 메뉴·로고·다음 섹션·상세 목차·문의 목차는 스크롤만 이동하고 해시 방문 기록을 추가하지 않는다. 공통 `ScrollNavigation`과 `lib/scroll-navigation.ts`가 처리하며 기존 섹션 ID·링크의 HTML 대체 동작·메뉴 활성 표시·스크롤 곡선을 보존한다. 상세/문의에서 홈으로 복귀하거나 기존 해시 주소로 진입하면 대상 위치를 맞춘 뒤 router history state와 쿼리를 유지한 `replaceState`로 해시를 정리한다. HOME은 준비 UI가 스크롤을 해제한 뒤 정리해 직접 섹션 진입에서 인트로를 잘못 재생하지 않는다. 예전 `#film`도 TOGETHER로 이동 후 정리하며, 아래 해시 주소 유지 지시는 이전 이력이다. 해시 없는 뒤로가기 위치 복원은 기존 라우터에 맡긴다. [이동·검증 기록](docs/reviews/SCROLL-NAVIGATION-2026-09-15.md)이 기준이며 로컬만 반영한다.

## 2026-09-15 전체 장식 대각선 화살표 제거

최신 사용자 요청으로 홈·서비스 상세 전체의 링크나 동작이 없는 장식 `↗`를 제거한다. HOME 카드의 Canvas 그림과 정적 대체 화면, SYSTEM 인물 설명, DESIGN·WEB 제목, SERVICES 콜라주, 상세 표지·기획 예시·과정 마지막·웹 제작 유형 목록·문의 배경이 대상이다. 실제 링크·동작 버튼의 화살표와 과정 흐름의 가로 화살표, 운영 상세 완료 체크는 유지한다. 장식 전용 요소·스타일을 함께 정리하며 앞선 운영 작업 범위 탭과 효과 설명 화살표 제거를 보존한다. 아래 다른 섹션을 유지한다는 문장은 이전 요청의 범위이며 이번 전체 제거 요청이 우선한다. [변경 기록](docs/reviews/DECORATIVE-ARROWS-2026-09-15.md)을 따르며 이번 변경은 로컬만 반영한다.

## 2026-09-15 운영 상세 작업 범위 재구성·완료 아이콘

운영·유지관리 `/services/operations`의02 작업 범위는 **기존 내용 수정·점검 / 새 페이지·기능 제작** 두 탭으로 안내한다. 기존 UPDATE/BUILD 비교와 중복 작업 목록을 합쳐, 선택한 작업의 고객 요청 예시3개·처리 방식·요청 자료를 아래에 표시한다. `lib/operations-scope.ts`가 문구, `operations-service-scope.tsx`와 기존 공통 Tabs가 표시를 담당한다. JS 미사용은 두 범주의 본문을 모두 읽을 수 있게 제공한다. 비용·일정·월 포함 여부·새 기능 가능성은 사전 확인 기준을 유지한다. 운영 상세03의 마지막 **검수·내역 정리** 카드에만 기존 바깥 방향 화살표 대신 원 안의 완료 체크를 쓴다. 직전 상세 효과 화살표 제거도 유지한다. [서비스 상세 기록](docs/pages/SERVICE-DETAILS-NOTES.md)이 기준이며 로컬만 반영한다.

## 2026-09-15 상세 효과 설명의 장식 화살표 제거

사용자 요청으로 기획·디자인·마케팅·운영 상세의 `#service-effects` 설명 카드에서 링크가 아닌 장식 `↗`를 모두 제거했다. 공통 `professional-service-detail.tsx`의 화살표 요소와 `service-details.css`의 화살표 전용 위치·오른쪽 여백만 없앤다. 제목·본문·세 항목 구성·모션·앵커는 유지한다. 웹 상세의 같은 기대 효과 영역에는 독립 장식 화살표가 없으며 실제 참고 자료 링크의 화살표는 유지한다. 다른 섹션·버튼·바로가기는 변경하지 않는다. [서비스 상세 기록](docs/pages/SERVICE-DETAILS-NOTES.md)이 기준이며 이번 변경은 로컬만 반영한다.

## 2026-09-15 디자인 상세 첫 화면 문구

사용자 제공 `상세페이지 디자인쪽 메인 UI 개선.png`에 따라 `/services/design`의 분류는 **로고 · 브랜드 | 상세페이지 | 홍보 · 인쇄물**, 제목은 **무엇을 보여줄지부터, / 어떻게 보일지까지.**다. 소개는 **사업의 특징과 전달해야 할 내용을 먼저 살펴보고 로고, 상세페이지, 홍보·인쇄물까지 필요한 디자인을 하나의 방향으로 만들어갑니다.**를 사용한다. **디자인 서비스 안내** 버튼은 기존 `#service-scope`로 연결하며 하단 태그도 **로고 · 브랜드 / 상세페이지 / 홍보 · 인쇄물**로 맞춘다. 기존 분홍 배경·이미지·모션·상세 본문·다른 서비스는 보존한다. [서비스 상세 기록](docs/pages/SERVICE-DETAILS-NOTES.md)이 기준이다. 로컬 검사 완료 후 사용자가 커밋·운영 배포를 승인했다. 기존 `main` → Cloudflare Workers Builds 자동 배포를 사용하며 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)에 남긴다.

소스 커밋 `0ba7f35fc7fd53b64df697c61fdce7e9e6ee8fa9`의 Cloudflare Build `5d282d02-2990-45c1-a20c-aa90f1e3e10a`가 성공했고 2026-09-15 11:19 KST에 Worker 버전 `9c041269-4d75-46c8-9b4c-4816a58e1466`가100% 배포됐다. 운영7개 경로 HTTP200·디자인 표지 새 문구·태그·안내 앵커·참조 자산을 확인했다. 실제 브라우저 시각·클릭 검수는 이번에 수행하지 않았다. 뒤따르는 결과 기록 커밋은 동일 앱 소스를 유지한다. 로그·검증 결과는 Git 제외 `outputs/deploy/2026-09-15/design-detail/`에 보관한다.

## 2026-09-14 WEB·TOGETHER 영상 조작부 제거·배포 승인

최신 사용자 요청은4페이지 WEB의 재생·음량 조작, 시간·진행바, 장면 목차를 제거하고7페이지 TOGETHER도 하단 조작·재생 상태 라벨·진행바 없이 무음 자동 반복 재생하는 것이다. 영상 밖 제목·본문·인물·문의 안내는 유지한다. 기존 `createWebFilmPlayback`으로 보이는 동안 재생하고 화면 밖·가려짐·숨김 탭·MOTION OFF 정지는 유지한다. 자동재생 차단·로드 실패·움직임 감소에서만 최소 재생/재시도 버튼을 제공하며 평상시에는 표시하지 않는다. JS 미사용은 조작 없는 포스터·본문을 제공한다. WEB은 제거한 조작부의 높이·가로 목차 공간도 해제한다. [PAGE4-NOTES.md](docs/pages/PAGE4-NOTES.md), [PAGE7-NOTES.md](docs/pages/PAGE7-NOTES.md)가 기준이다. 로컬 검수 후 사용자가 현재 변경 전체의 GitHub 반영·운영 배포를 승인했다. 기존 `main` → Cloudflare Workers Builds 자동 배포를 사용하며 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)에 남긴다. 이전 로컬 전용 지시는 이번 승인 전의 이력이다.

소스 커밋 `0097ee3b8d1c57a0354dfb8975ee00ab18b8695e`의 Cloudflare Build `32d3444d-629b-479e-80ea-3665e0051672`가 성공했고 2026-09-14 15:12 KST에 Worker 버전 `53f2cc1d-ca3f-4956-a2e2-7a78b5807b5f`가100% 배포됐다. 운영 Chromium PC·모바일의 두 영상 자동 재생·조작부 제거, PC의 끝→처음 반복, 가로 넘침·실행 오류 없음을 확인했다. 뒤따르는 결과 기록 커밋은 동일 앱 소스를 유지한다. 로그·캡처는 Git 제외 `outputs/deploy/2026-09-14/video-autoloop/`에 보관한다.

## 2026-09-14 GitHub 반영·운영 배포 승인

사용자가 회사 정보·6.8초 인트로와 선명도 개선·SYSTEM 고화질·안개25%·은하1.2배를 확인한 뒤 현재 변경 전체의 GitHub 반영과 운영 배포를 승인했다. 기존 `G-bak/onoff-hero`의 `main` → Cloudflare Workers Builds 자동 배포를 사용한다. 아래 로컬 전용 문장은 각 변경을 확인하던 시점의 이력이며 이번 배포 승인이 우선한다. 캡처·로그·환경변수는 Git 제외 상태를 유지하고 실제 배포 결과는 [배포 기록](docs/operations/DEPLOYMENT-NOTES.md)과 Git 제외 `outputs/deploy/2026-09-14/release/`에 남긴다.

소스 커밋 `42ac432fabec775c7cdceccf629dafe9fd85aca7`의 Cloudflare Build `fadbcdff-f8c9-4e6e-b479-eb082a927d7d`가 성공했고 2026-09-14 14:52 KST에 Worker 버전 `73915978-c33d-46cf-b676-a6f7e1c19a52`가100% 배포됐다. 운영7개 경로의 새 연락처·주요4개 JS의 로컬 빌드 해시 일치, 실제 브라우저의 HOME 오프닝·SYSTEM 확대·320px 회사 정보 배치를 확인했다. 뒤따르는 결과 기록 커밋은 같은 앱 소스를 유지한다.

## 2026-09-14 SYSTEM 안개 25%·은하 확대

최신 사용자 요청으로 밝은 성운 불투명도를 원래의0.25배로 낮추고 은하 영역만 정적1.2배로 확대했다. `lib/galaxy-field.ts`가 농도, `lib/galaxy-scene.ts`의 `disk.scale`이 별·구름·먼지 분포의 확대를 담당한다. 카메라와 상위 `system`은 유지해 글자·서비스 앵커·정거장과 다섯 비행체의 크기·좌표·궤도는 바꾸지 않는다. 등장 시간표·고화질 설정·bloom도 유지한다. 아래50%는 이전 기록이다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 SYSTEM 안개 50% 적용

사용자가 배포 사이트를 보고 있었음을 확인하고 로컬 주소를 안내받은 뒤 안개50%를 요청했다. `lib/galaxy-field.ts`의 밝은 성운 `clouds` 메시 비표시를 해제하고 원래 불투명도에0.5를 곱한다. 별·어두운 먼지층·비행체·조명·bloom·고화질 설정·배치·모션은 유지한다. 아래 완전 비표시·원상 복원은 이전 기록이다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 SYSTEM 안개 완전 비표시 적용

사용자가 직전 비교의 안개를 완전히 끈 버전을 실제 사이트에 적용하도록 요청했다. `lib/galaxy-field.ts`에서 `clouds` 메시의 `visible`을 `false`로 설정해 밝은 성운 구름층 전체를 렌더링하지 않는다. 원본 구름 데이터는 보존하며 화면 크기 변경·재진입·움직임 감소에서도 비표시를 유지한다. 별·어두운 먼지층·비행체·조명·bloom·고화질 설정·모션은 유지한다. 아래 원상 복원 상태는 이전 기록이다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 SYSTEM 안개 실제 화면 재검증

사용자가 원본과 이전 안개 조정 캡처가 같다고 지적해 실제 Chromium에서 같은 카메라·6.42초 정지 장면으로 원본, 이전0.6배, 구름 완전 비표시, 별 비표시, bloom 비표시를 비교했다. 조정 대상은 실제 밝은 성운층이 맞으며0.6배 재현에는 픽셀 차이가 있지만 넓은 구름 형태는 유지된다. 불투명도40% 감소를 화면의 안개가40% 제거됐다는 뜻으로 설명하지 않는다. 사용자가 비교했던 두 캡처가 같았던 원인은 확정하지 않았다. 소스 제공·빌드 통과만으로 시각 변경을 확인했다고 하지 않는다. 이번 진단은 브라우저 요청 가로채기로만 진행하고 모두 해제했으며 제품의 안개 농도는 아래 원상 복원 상태를 유지한다. 캡처·수치는 Git 제외 `outputs/qa/2026-09-14/system-haze-diagnosis/`, 상세는 [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)에 기록한다. 로컬만 저장한다.

## 2026-09-14 SYSTEM 안개층 원상 복원

사용자가 구름·안개를0.8배·0.6배로 옅게 한 뒤 원래대로 되돌리도록 요청했다. `lib/galaxy-field.ts`의 밝은 성운 구름 불투명도에서 추가 배율을 제거해 안개 조정 전 원래 농도로 복원했다. 별·어두운 먼지층·구름 개수와 좌표·색상·크기·비행체·조명·bloom·고화질 설정·모션은 유지한다. 앞서 높인 해상도와512px 질감은 그대로다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 HOME 인트로 해상도·색상

사용자가 인트로 로고의 흐릿한 해상도와 색감을 지적해 인트로 전용 렌더링을 개선했다. `getOpeningPixelRatio`는 큰 화면8,294,400·700px 이하4,500,000픽셀 상한과 DPR3을 사용하며 큰 화면의 목표 DPR은 최소2다. 1920×1080은3840×2160, 390×844/DPR3은1170×2532로 그린다. 글자 곡선 분할은18→36, 그림자 맵은1024→2048이다. 로고 앞면은 조명 영향을 받지 않는 `MeshBasicMaterial`로 `#333333`·`#343CFF`를 유지해 흰 금속 반사로 색이 씻기는 현상을 없애며 측면 재질·반사·두께·그림자는 유지한다. 6.8초 시간표·도약·낙하·정렬·HTML 도킹·건너뛰기·GPU 정리를 보존한다. [HOME-OPENING-NOTES.md](docs/pages/HOME-OPENING-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 SYSTEM 선명도 개선

사용자가 2페이지 스타일·구성을 유지하면서 고화질로 개선하도록 요청한 뒤 최대한 더 높이도록 요청했다. 최신 화질 우선 설정은 `getGalaxyQuality`의 내부 버퍼 상한 큰 화면8,294,400·작은 화면4,500,000픽셀, DPR 상한3이다. 큰 화면은 일반1배 디스플레이에서도 목표 DPR2로 그려1920×1080에서3840×2160을 제공하며 픽셀 상한을 우선한다. 기존 별·구름·먼지 수, 모델·색·광원·bloom·MSAA·카메라·궤도·시간표·HTML·인물은 유지한다. 작은 성운 질감은 같은 노이즈·크기·불투명도 곡선을512px로 더 촘촘하게 샘플링한다. 무제한·모든GPU의 기술적 최대라는 뜻은 아니며 실제 기기의FPS·발열은 측정하지 않았다. 앞선400만/200만·256px와 아래165만/95만·128px는 이전 구현 이력이다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md)가 현재 기준이며 로컬만 반영한다.

## 2026-09-14 회사 정보 갱신

최신 사용자 제공 값은 **대표이사 조은준**, **사업자번호 879-88-03852**, **회사번호 031-647-6396**, **이메일 onoff3739@naver.com**, **주소 경기도 평택시 모곡동 447-3 엠에스원타워 407호 (주)온앤오프**다. HOME은 이 순서로 표시하며 이메일·전화의 공통 원본은 `lib/consultation.ts`다. 개인정보 처리자 표기는 `(주)온앤오프`, 문의 창구는 기존 온앤오프 프로젝트 문의 담당을 사용한다. 회사 정보가 늘어 HOME 헤더는 모든 너비에서 줄바꿈하며, 모바일 kicker·워드마크 top은 각각208px·234px, 360px 이하는230px·256px다. 주소 오른쪽28px 여백은 유지한다. 아래 2026-09-13 회사 정보·위치는 이전 기록이다. 로컬만 반영하며 커밋·push·배포하지 않는다.

## 2026-09-14 HOME 인트로 1초 연장

사용자 요청으로 전체 인트로를 약 5.8초에서 6.8초로 늘렸다. `lib/home-opening.ts`의 `openingPlaybackRate`는 `8.7 / 6.8`(약 1.2794)이며 기존 장면 시간표·도약·낙하·정렬·도킹·카드·본문을 같은 비율로 늦춘다. 곡선과 재생 순서, 준비·오류 제한, 건너뛰기·접근성·GPU 정리는 유지한다. 아래 1.5배속·5.8초 표기는 이전 구현 이력이다. 현재 실제 시간표는 [HOME-OPENING-NOTES.md](docs/pages/HOME-OPENING-NOTES.md)를 따른다. 로컬만 반영하며 커밋·push·배포하지 않는다.

## 2026-09-13 TOGETHER 주소 정리

최신 요청으로 마지막 섹션의 공개 주소·내부 섹션 ID·문의 복귀 값을 `together`로 통일했다. 기본 링크는 `/#together`, 문의는 `/inquiry?from=together`다. 이전 `#film`은 실제 새 앵커와 같은 위치의 SSR 별칭으로 연결하며 JavaScript 사용 시 기존 history state를 보존한 `replaceState`로 주소만 정리한다. `from=film`도 허용 목록에서 `together`로 해석한다. 뒤로가기·직접 해시·JS 미사용을 위해 이 호환 처리를 유지한다. `BrandFilm`·영상 파일·CSS 클래스 이름은 영상 구현을 설명하는 명칭이므로 유지한다. [7페이지 기록](docs/pages/PAGE7-NOTES.md)이 기준이다.

## 2026-09-13 최종 전체 검사

[최종 검사 기록](docs/reviews/FINAL-AUDIT-2026-09-13.md)이 이번 마무리 점검의 기준이다. 문의 ID는 `lib/inquiry-request-id.ts`에서 네이티브 UUID 또는 안전한 난수 바이트로 생성한다. ID 생성과 전송 준비를 오류 처리 안에 두고 브라우저 전송 제한은 `AbortController`와 15초 타이머를 사용한다. 전송 시작 전 실패는 작성 화면을 다시 열 수 있게 하며, 실제 요청 후 결과 불명은 기존 재전송 잠금·이메일 확인을 유지한다. 접수 ID의 Slack 표시·서버 중복 방지 정책은 유지한다. 로컬 전용이라는 과거 문장은 해당 기록 시점의 이력이며 이후 사용자 승인으로 GitHub 반영·운영 배포를 진행했다. 검증 출력은 `outputs/qa/2026-09-13/final-audit/`에 보관한다.

## 2026-09-13 확정 회사 정보

대표자는 **조은준**, 주소는 **경기도 평택시 산단로16번길 26 엠에스원타워 407호**, 이메일은 **jej4628@naver.com**, 전화번호는 **010-5838-6781**이다. 사용자가 직접 제공한 표기를 사용한다. 이메일과 전화는 `lib/consultation.ts`가 공통 원본이며 홈페이지·서비스 상세·문의 화면·개인정보 안내에 재사용한다. 개인정보 문의 창구는 실명 대신 온앤오프 프로젝트 문의 담당이다. 긴 주소가 두 줄이 되는 360px 이하에서는 HOME의 kicker와 워드마크를 각각 204px·230px에 두어 헤더 아래 간격을 확보한다. 주소 오른쪽에는 28px 내부 여백을 두어 섹션 번호와 실제 글자가 겹치지 않도록 한다.

> 2026-09-13 전체 점검: 현재 안내는 [문서 색인](docs/README.md), 점검·수정 결과는 [전체 감사 기록](docs/reviews/PROJECT-AUDIT-2026-09-13.md)을 따른다. 아래 날짜별 구현 이력은 최신 항목이 우선한다. 문서는 `docs/`, 비교 GIF·과거 public 자료는 `design/archive/public/`로 이동했으며 원본을 삭제하지 않았다. 현재 팀·로고 원본 경로는 유지한다.

이 파일은 이 저장소 전체에 적용한다. 현재 사용자의 명시적 요청을 우선하며, 이후 디자인 변경이 확정되면 아래 현재 상태도 함께 갱신한다.

## 2026-09-13 최신 감사 후속·Slack 문의

최신 사용자 요청으로 Slack 알림을 신규 문의 헤더 → 한국시간 접수 시각 → 회사·브랜드/문의자/연락처 → 희망 서비스·예산·일정 → 문의 원문·참고 자료 → 동의·보관·접수 ID 순으로 정리했다. 예산·일정만 두 열이며 긴 본문은 전체 폭이다. 고객 입력은 `rich_text`의 리터럴 `text` 또는 `plain_text`로 보존하고, 검증된 이메일과 단일 HTTP(S) 참고 URL만 명시적 링크로 만든다. 전체 내용을 포함하는 접근성 대체 텍스트는 Slack 제어문자를 이스케이프하고 자동 해석을 끈다. 동의/보관 기준·중복 방지·전송 API는 유지한다. 새 알림에 적용되며 기존 Slack 메시지는 변경하지 않는다. [알림 구성·검증](docs/operations/SLACK-INQUIRY.md)이 기준이다.

운영 문의의 즉시 502 후속 수정: Cloudflare workerd에서 허용하지 않는 `redirect:'error'` 대신 `manual`을 사용한다. HTTP 200과 `ok` 본문만 성공이며 3xx는 거절한다. 전역 fetch는 route의 화살표 함수로 호출해 주입 객체의 메서드로 실행하지 않는다. 로컬 Node 성공만으로 운영 Slack 전송 성공을 판단하지 않는다. 수정본을 배포한 뒤 운영 테스트 2건의 HTTP 200을 확인했고, 두 번째는 실제 브라우저의 `delivered` 응답·접수 완료 표시·전송 버튼 잠금까지 확인했다. 첫 번째는 전송 후 검증 도구 연결이 끊겨 운영 로그로 성공을 확인했다. 실제 Slack 채널 화면을 열람했다고 설명하지 않는다. 상세 결과는 [Slack 연결](docs/operations/SLACK-INQUIRY.md)의 최신 기록을 따른다.

사용자가 정보 제공 없이 가능한 개선을 요청하고 문의 접수는 Slack 메시지만 받도록 지정했다. [후속 개선](docs/reviews/MAINTENANCE-2026-09-13.md), [Slack 연결](docs/operations/SLACK-INQUIRY.md)이 최신 기준이다. `lib/inquiry-privacy.ts`의 최대 90일 보관·온앤오프 프로젝트 문의 담당/기존 이메일 안내를 적용한다. `SLACK_INQUIRY_WEBHOOK_URL`과 현재 `INQUIRY_PRIVACY_VERSION`이 있어야 접수 UI가 열린다. 수집·이용과 국외 처리위탁에 각각 동의하고 서버가 두 동의와 버전을 검증한다. 무료 Slack의 채널별 자동 삭제는 지원되지 않으므로 기존 워크스페이스 설정을 바꾸지 않고 문의 채널만 매주 확인해 80일 이상 지난 기록을 수동 삭제한다. 처리 목적 달성·삭제 요청은 더 일찍 처리한다. 웹훅은 비공개 환경에만 저장한다. 2026-09-13 사용자 승인으로 실제 브라우저 테스트 문의 1건의 Slack 성공 응답을 확인했다. 참고 자료는 공유 링크로 받고 파일 업로드·숨긴 상담톡·기존 이메일 상태를 유지한다. 최신 사용자 요청은 테스트 통과 후 전체 변경의 GitHub 반영·운영 배포이며, 이전 로컬 전용 지시보다 우선한다. 배포 결과는 운영 기록으로 확인한다.

HOME 카드의 Three.js 동적 import는 `lib/card-three.ts`의 명시적 export를 사용한다. 은하·마케팅 3D 엔진은 활성 시 지연 로드하되 초기 HTML·높이·앵커는 유지한다. 마케팅 구현은 `lib/marketing-scene-controller.ts`로 분리했다. import 실패·12초 제한·늦은 결과·언마운트·covered 상태에서 기본 화면과 GPU 정리를 보존한다. TOGETHER 포스터는 보일 때 로드하고 JS 미사용은 별도 기본 video로 제공한다. 오프닝 시간표·Ease 곡선·디자인 스크롤·말풍선 위치는 바꾸지 않았다.

`service-example-image.tsx`의 작은 Image 경계가 공유 미디어 URL을 소유해 RSC/클라이언트 중복 방출 경고를 제거한다. 주변 상세 본문은 서버 렌더링이다. 문서 검사는 제목 앵커·로컬 전용 경로도 검사하며 외부 HTTP 확인은 별도 `check:links`다. Firefox·Windows WebKit 검증은 실제 모바일 Safari 검증과 구분한다. 로컬만 저장하며 커밋·push·배포하지 않는다.

Firefox 데스크톱 SYSTEM의 웹사이트 보조 문구와 공통 메뉴07이 겹쳐 `.galaxy-service-2`의 X 오프셋을 -24px에서 -48px로 조정했다. 작은 화면의 서비스 격자와 은하·비행체 좌표는 유지한다.

## 2026-09-13 전체 반응형 점검

홈 7개 섹션과 상세 5개·문의 화면을 9개 크기(320×568부터1920×1080, 가로667×320·844×390 포함), 총117조건에서 실제 Chromium으로 점검하고 수정했다. [반응형 QA 기록](docs/reviews/RESPONSIVE-QA-2026-09-13.md)이 최신 검증 기준이다. 로컬만 반영했으며 커밋·push·배포는 하지 않았다. 실제 모바일 기기·iOS Safari 검증과 혼동하지 않는다.

높이760px 이하 메뉴는52px, 기존600px 이하는44px다. TOGETHER 말풍선 표시 중 메뉴를44px로 줄이고 위로 옮겨 모든 항목을 누를 수 있게 한다. PC 말풍선의 오른쪽 끝·36px 간격은 유지하며360px 이하 말풍선은`100vw - 64px` 너비다. 짧은 세로·가로 TOGETHER 설명을 말풍선과 분리하고 SYSTEM의 작은 화면·DESIGN의 낮은 가로 화면에서는 문의 버튼을 아이콘으로 표시한다. SYSTEM·SERVICES의 낮은 가로 푸터는 문의 버튼 공간을 확보한다.

홈 WEB은 높이360px 이하·너비560px 이상에서 최소380px 높이로 챕터와 푸터의 겹침을 막는다. 상세 모바일 표지는 실제 한 열 grid와 간격을 사용하고 마케팅 표지는 내용 높이를 확보해 CTA를 가리지 않는다. 상세 푸터는360px 이하에서 한 열이다. 웹 제작 과정 사진은 높이600px 이하에서 고정을 해제한다. 카드 resize는 앞·뒤 DPR을 함께 갱신하며 window resize 리스너를 정리한다. 기존 스크롤 앵커·오프닝 시간표·문의 미리보기 정책은 보존한다.

## 2026-09-13 최신 HOME 3D 오프닝

최신 둥근 도약 요청: 1.5배속·약 5.8초 시간표를 유지하면서 글자가 뾰족하게 빠르게 튀는 느낌을 완화했다. 높이는 코사인 기반 둥근 곡선으로 시작·정점·착지의 속도가0이며 정점은 도약 중간이다. 회전도 같은 곡선을 조금 늦게 따라가며 착지 속도가0이다. 가로 이동은 `cubic-bezier(.36,0,.64,1)`로 완만하게 가속·감속하고 첫 두 도약의 가로 반동은1.8%에서0.8%로 줄여 후반에만 적용한다. 준비 압축·작아지는 네 번의 도약·정렬은 유지한다. `&`의 낙하 시간은 최신 요청으로0.72→0.48초(1.5배속)이며 초기 낙하는 3차 Ease In으로 천천히 출발해 착지할수록 빨라지며, 착지 후 반동은 둥근 곡선이다. 로고·카드·본문의 Ease Out은 `cubic-bezier(.16,1,.3,1)`이며 실제 HTML 도킹·접근성·GPU 정리 정책을 유지한다.

새 문서의 HOME 첫 진입에 글자별 통통 튀는 입장 → 하늘에서 `&` 낙하·간격/기울기 정렬 → 기존 워드마크 위치로 안착 → 원통 카드 앞·뒤 하강과 헤더·본문·조작 등장으로 연결하는 약 5.8초(기존 대비 1.5배속) 오프닝을 제공한다. 최신 요청으로 글자마다 점차 작아지는 네 번의 도약과 착지 압축을 적용하고 비행 같은 회전·깊이 이동을 줄였다. 안쪽 글자가 먼저 입장해 뒤따르는 글자와의 겹침을 줄인다. 정렬 후 약 0.21초 유지하고, 로고 도킹과 카드 하강은 빠르게 출발해 길게 감속하는 Ease Out이다. 기존 Montserrat 700 윤곽의 실제 돌출 geometry이며 Spline 유료 파일·런타임·새 영상은 쓰지 않는다. 사용자 Spline 공개 설명은 확인했지만 미리보기 GPU 오류로 원본 모션을 재생 확인했다고 설명하지 않는다. [HOME-OPENING-NOTES.md](docs/pages/HOME-OPENING-NOTES.md)에 참고·타임라인·검증을 기록한다.

`lib/home-opening.ts`, `lib/opening-scene.ts`, `hero-opening.tsx`, `home-opening.css`가 오프닝 전용이다. SceneLoader의 실제 카드 준비와 연결하며 준비 전 기존 UI·오류·기본 화면을 보존한다. 글자별 DOM Range와 baseline으로 목표 위치를 측정한다. 기존 HTML 워드마크 크기·위치·색과 카드 transform을 바꾸지 않는다. 같은 문서의 라우터 복귀·뒤로가기·다른 섹션 직접 해시·복원 스크롤·움직임 감소에서는 생략한다. 건너뛰기/Escape, 숨김 탭 정지, 초기화 실패·컨텍스트 손실 시 종료, GPU 정리를 제공한다. 스크롤 잠금은 조작 잠금보다 먼저 풀고 완료 시 강제 scrollTo를 하지 않는다. 전역 MOTION과 2–7페이지를 보존한다. 로컬만 반영하며 배포하지 않는다.

## 2026-09-13 최신 TOGETHER 문의 안내

최신 위치 조정은 PC 말풍선의 오른쪽 끝을 문의 버튼 오른쪽에 맞추고 몸체와 버튼 사이를36px 띄운 상태다. 더 오른쪽·위로 옮긴 뒤 너무 높다는 요청에 따라12px 내렸다. 모바일 right는8px, 간격은34px(높이700px 이하는30px)이며 내부 여백을 줄여 본문과의 간격을 보존한다. 문의 버튼 좌표는 유지하고 모바일 꼬리 right12px로 기존 버튼을 향하게 한다. `inquiry-nudge.css`가 기준이다.

TOGETHER가 보이고 실제 영상 프레임 또는 정적 대체 화면이 준비된 상태에서 2.2초 후 프로젝트 문의 말풍선을 표시한다. 문구는 “사업만 해도 바쁜데, 홍보까지 혼자 하시나요?”와 “홈페이지·디자인·마케팅, 필요한 작업부터 골라보세요.”다. 버튼에 라임 테두리와 최대 두 번의 작은 들썩임을 적용하며 반복 재생하지 않는다. 화면 이탈·모션 중지는 진행 중 강조를 종료하고, 움직임 감소·MOTION OFF는 정적인 안내를 제공한다. 닫으면 문의 링크에 포커스를 돌리고 같은 문서에서 다시 안내를 시작하지 않는다. 문의 페이지 왕복도 새 안내를 시작하지 않으며, 닫지 않고 섹션만 왕복하면 기존 말풍선은 다시 보일 수 있다. 실시간 상담톡·전송 기능은 여전히 비활성 상태다. `SiteControls`, `BrandFilm`의 준비 신호, `inquiry-nudge.css`를 사용한다. [최신 연출·문의 QA](docs/reviews/OPENING-AND-INQUIRY-2026-09-13.md)에 문구 근거와 PC·모바일 검증을 기록한다. 로컬만 반영한다.

## 2026-09-13 전체 감사 후 유지 기준

오프닝 후속 브라우저 검증: [HOME QA](docs/reviews/HOME-OPENING-QA-2026-09-13.md)의 PC·모바일 검증을 완료했다. SectionEntry는 layout effect와 조상 sticky 배치 후 1회 microtask 재측정으로 라우터가 해시 위치를 읽기 전에 앵커를 완성한다. 뒤로가기 후 강제 해시 재이동으로 바꾸지 않는다. 초기 GPU 실패도 runtime fallback으로 기록하되 로더가 닫히기 전에는 별도 복구 안내를 노출하지 않는다. 건너뛰기는 로고 도킹 후 숨기고 Escape는 종료까지 유지한다. HOME의 짧은 모바일(700px 이하·760px 높이 이하)은 문의 버튼을 하단 24px 아이콘으로 표시해 본문과 겹치지 않게 한다. 그 외 글자 버튼·페이지 동작을 보존한다.

`npm run check:repository`는 문서 로컬 파일 링크와 `scripts/public-assets.config.json`의 공개 자산 목록을 검사하며 `npm run check`의 첫 단계다. 원본·비교 GIF·제작 기록은 `design/`에 보관한다. `start-local.cmd`는 이 PC에서 동작하는 `preview:node`를 사용한다. 타입 검사에서 `outputs/` 등 임시 산출물을 제외하지만 제품 소스·공통 UI는 계속 검사한다.

전역 MOTION 스위치는 첫 카드의 준비·실패 상태와 독립적으로 조작한다. 카드 방향 버튼만 카드 준비에 의존한다. WEB 오류/차단 화면의 재생 버튼도 MOTION OFF를 따르며, 은하 resize/draw 실패는 대체 화면 표시·프레임 정지·GPU 해제를 함께 처리한다. 서비스 공용 화살표는 `service-arrow.tsx`이고 고정 프로젝트 문의 이동도 기존 `PageLink`를 사용한다. 오류 주입 회귀 검사는 `tests/component-failures.test.mjs`에 있다.

## 2026-09-13 최신 서비스 상세 네 페이지

최신 사용자 요청으로 기획·전략, 브랜드·디자인, 콘텐츠·마케팅, 운영·유지관리 상세를 경쟁사 공식 서비스 안내 조사 후 확장했다. `lib/services.ts`는 요약·메타데이터, `lib/service-details.ts`는 구체적인 작업 범위·산출물·과정·견적·FAQ다. `professional-service-detail.tsx` 공통 서버 템플릿과 `service-detail-visuals.tsx`의 서비스별 시각 자료를 사용한다. 스타일은 `service-details.css`의 `guide-*`에 한정한다. 웹 전용 상세 분기는 그대로 유지한다. [SERVICE-DETAILS-NOTES.md](docs/pages/SERVICE-DETAILS-NOTES.md)에 조사·근거·검증을 기록했다.

기획서와 유지관리 흐름은 안내용 HTML 예시, 디자인은 기존 승인된 업종별 가상 브랜드 시안, 마케팅은 기존 `marketing-content.ts`를 사용하는 HTML 인스타그램·블로그 미리보기다. 원본 마케팅 사진 720×900과 홈페이지의 게시물 캔버스 크기를 혼동하지 않는다. 가상 브랜드·반응 수 예시 표기를 유지한다. 경쟁사 실적·이미지·가격을 우리 것으로 가져오지 않는다. 미확정 견적과 계약 조건을 임의로 수치화하지 않는다. 기존 ServiceDetailMotion 준비·등장 UI, PageLink 이동, 움직임 감소·JS 미사용, 서비스별 문의 연결과 숨긴 상담톡을 보존한다. 로컬만 적용하며 배포하지 않는다.

## 2026-09-13 최신 웹 서비스 상세

바탕화면 `프롬프트 02.txt` 요청으로 `/services/web`만 전용 고객 안내 페이지로 구성했다. 홈페이지의 WEB 섹션이나 다른 서비스 상세는 보존한다. 홈페이지 의미·필요성·효과·제작 과정·세 제작 유형·가격 산정/유지보수·FAQ·하단 푸터를 제공한다. 추상적인 광고 표현 대신 한국 소비자가 읽을 수 있는 구체적인 문구를 쓴다. 이미지는 생성하지 않고 출처·라이선스를 확인한 외부 참고 사진 2개를 로컬에 보관하며, 본문 캡션과 푸터에 출처를 표시한다.

사용자 PDF v4에는 확정 금액이 없다. STARTER/BUSINESS/BRAND는 상담 후 견적으로 안내하고, 승인 전 제안인 페이지 한도·월 처리 건수·제작 일정·수정 횟수를 확정 판매 조건으로 만들지 않는다. 배포/도메인/SSL은 4쪽 포함, 다른 가격·견적 쪽은 별도라는 충돌이 있어 견적서에서 포함 여부를 확인하는 표현을 쓴다. 고객용 편집 관리자·회원/예약/결제 기능을 제공 범위에 추가하지 않는다. `lib/web-service.ts`, `web-service-detail.tsx`, `web-service.css`와 [WEB-SERVICE-NOTES.md](docs/pages/WEB-SERVICE-NOTES.md)가 기준이다. 기존 준비 UI·PageLink·움직임 감소·JS 미사용 처리를 유지한다. `web-detail-chapter`와 기존 영상 버튼의 `web-chapter` 클래스는 분리한다. 로컬만 반영했다.

## 2026-09-13 최신 프로젝트 문의 UI

최신 사용자 요청으로 실시간 상담톡은 화면에 표시하지 않는다. `lib/consultation.ts`의 `consultationChatEnabled=false`로 문의 페이지의 버튼·대화창을 렌더링하지 않는다. 상담톡 컴포넌트·스타일·기존 안내 코드는 보존하며, 나중에 구현할 때 다시 연결한다. 프로젝트 문의 링크와 입력폼·이메일은 유지한다. 아래 상담톡 이용 가능 설명은 이전 상태의 기록이다.

홈페이지 고정 ‘실시간 상담톡’ 버튼은 별도 `/inquiry`로 이동하는 ‘프로젝트 문의’ 링크로 변경했다. 기존 상담톡 컴포넌트·대화창은 삭제하지 않고 문의 페이지에서 열 수 있도록 구현했으나 현재는 위 설정으로 숨긴다. 이전 기록의 단일 상담 버튼 지침보다 이 요청이 우선한다. 서비스 상세의 문의 CTA도 해당 서비스가 미리 선택된 문의 페이지로 연결한다. 홈 복귀 위치는 유효한 섹션 ID만 허용한다.

이번에는 UI만 구현했다. 서비스 선택·입력 확인·파일 선택/제거·검토 대화창까지 동작하며 실제 전송·저장·업로드·메일 발송은 없다. 미리보기임을 표시하고 전송 버튼은 비활성화한다. 개인정보 보관 기간·가격·납기를 임의로 확정하지 않는다. 기존 서비스 정보와 공통 폼·Dialog 컴포넌트를 재사용한다. [PROJECT-INQUIRY-NOTES.md](docs/pages/PROJECT-INQUIRY-NOTES.md)에 조사·범위·검증을 기록했다. 로컬만 반영했으며 배포하지 않았다.

서비스 상세·문의 페이지에서는 `html:has(.service-detail, .inquiry-page)`의 `scroll-behavior:auto`를 유지한다. 전역 smooth가 라우터의 맨 위 이동에도 적용되어 새 화면이 아래에서 위로 길게 움직이던 문제를 수정한 규칙이다. `data-scroll-behavior` 속성만으로 해결됐다고 판단하지 않는다. 별도 페이지의 첫 진입은 즉시 맨 위, 브라우저 뒤로가기는 저장 위치, 직접 해시는 대상 위치를 보존한다. 홈페이지의 부드러운 섹션 이동은 유지한다. 검증 기준은 [PAGE6-NOTES.md](docs/pages/PAGE6-NOTES.md)의 최신 기록이다.

서비스 목록·상세의 페이지 이동은 `PageLink`로 진행 중이던 네이티브 부드러운 스크롤을 현재 위치에서 중단한 뒤 라우터에 맡긴다. 목적지 마운트 후 강제로 0으로 재설정하면 뒤로가기·해시를 망가뜨리므로 그런 방식으로 바꾸지 않는다.

## 2026-09-13 최신 일곱 페이지 구성

최신 크기 조정: 7페이지 `FROM START / TO RESULTS.` 제목은 기존 반응형 크기의 92%다. `--film-title-size`에 기존 화면별 기준값을 유지하고 공통 배율을 적용한다. 등장·발광·영상 연출은 유지한다. 고정 `프로젝트 문의` 링크의 글자는 16px이며 기존 작은 화면의 아이콘 전용 표시 조건은 보존한다.

최신 메뉴명: 7페이지 사이드 메뉴는 `TOGETHER`다. 사용자가 FILM이라는 목적 구분을 원하지 않아 마무리 의미로 변경했다. 주소와 내부 ID도 최신 요청으로 `together`이며, 아래 FILM 표기는 구현 이력이다. 접근성 설명은 ‘온앤오프 마무리 페이지 보기’다.

현재 홈페이지 메뉴는 HOME → SYSTEM → DESIGN → WEB → MARKETING → SERVICES → TOGETHER다. 마지막 내부 ID는 `together`다. 공통 메뉴 7개, 전환 6개이며 `lib/site-sections.ts` 목록 길이로 계산한다. 이전 페이지 수 표기는 작업 이력이다. FILM은 사용자가 지정한 이웃 프로젝트 `onoff-website-redesign`의 배경 영상 섹션을 분석해 이 사이트의 공통 전환·재생 정책에 맞춘 7페이지다. 이웃 프로젝트는 수정하지 않는다. 원본 5초 영상과 포스터를 보존하고, `FROM START / TO RESULTS.` 및 한국어 문구를 유지한다. 핵심 `RESULTS.`는 사용자 요청에 따라 라임 그라데이션·라임/파랑 발광·한 번 지나가는 빛을 사용한다. 제목은 등장 후 고정한다. 첫 실제 영상 프레임 전에는 준비 UI를 표시하며 자동재생 차단·네트워크 오류·움직임 감소·MOTION OFF·JS 미사용을 처리한다. [PAGE7-NOTES.md](docs/pages/PAGE7-NOTES.md), [영상 출처](design/brand-film/README.md)가 기준이다. 로컬만 반영했다.

최신 SERVICES 진입 수정: 이전 MARKETING 면이 넘어가는 도중부터 사진·문구가 등장한다. `useSceneActivity`의 기존 `duringTransition` 옵션을 장식 미디어에 사용하되 링크·버튼의 `inert`는 공통 전환에서 유지한다. 글꼴과 실제 이미지 디코딩 전에는 전용 준비 UI를 표시한다. 임의 최소 지연은 없으며 12초 지연 또는 실패 시 본문과 이미지 재시도를 제공한다. 호버는 승인된 0.2초 교차 페이드를 유지하고 큰 펼침은 첫 등장에서만 사용한다. 새 WebGL 장면을 추가한 것이 아니라 기존 CSS 입체 연출의 준비 상태를 일관되게 처리한다. [PAGE6-NOTES.md](docs/pages/PAGE6-NOTES.md)의 최신 기록을 따른다.

## 서비스 확장 이력

당시 홈페이지 순서는 HOME → SYSTEM → DESIGN → WEB → MARKETING → SERVICES(06)였다. 아래 다섯 페이지라는 과거 표기는 이전 상태의 기록이다. 마케팅 다음에 라임색 서비스 목록 #services를 추가했다. 각 행 전체를 클릭하면 /services/planning·design·web·marketing·operations 상세 페이지로 이동한다. 설명·필요성·기대 효과·제공 범위·가격 정책의 원본은 lib/services.ts 한 곳이다. 가격 금액과 계약 조건은 아직 받지 않았으므로 서비스별 개별 견적 기준을 안내한다. 임의의 정가·납기·수정 횟수·성과 보장을 확정하지 않는다. 상세 페이지는 공통 서버 템플릿과 메타데이터, 목차, 목록 복귀, 관련 서비스, 기존 이메일 문의를 제공한다. 내부 링크는 next/link, 잘못된 slug는 실제 404다. 새 상세 화면에는 홈의 3D 로더를 넣지 않는다. 공통 섹션 메뉴는 6개, 전환은 5개이며 수를 목록 길이에서 계산한다. MARKETING이 SERVICES에 가려지면 covered로 일시 정지하고 복귀 시 이전 장면을 이어간다. [PAGE6-NOTES.md](docs/pages/PAGE6-NOTES.md)가 최신 구현/검증 기준이다. 이번 작업은 로컬만 반영했다.

2026-09-13 후속 재설계: SERVICES는 작은 제목의 정적 목록이 아니라 대형 영문 타이포와 서비스별 작업물 콜라주가 결합된 서비스 데스크다. 글자 압축·신장·반동, 목록의 원근 펼침, 호버/포커스 시 인쇄물·티켓 교체를 사용한다. 공통 useSceneActivity로 화면 밖/inert/MOTION OFF/움직임 감소를 따른다. 상세 페이지에도 서비스별 표지·콜라주, 제목 등장, 장별 본문 펼침, 활성 목차·읽기 진행선을 넣었다. 홈의 3D 로더는 사용하지 않고 글꼴·이미지 준비에만 가벼운 UI를 표시한다(임의 최소 대기 없음, 최대 2.4초). 본문 등장 감지는 클리핑한 자식이 아닌 장 컨테이너에 적용해야 한다. 새 WebGL·라이브러리·이미지 생성 없이 기존 승인된 시안과 CSS 원근을 사용하며 CONCEPT VISUAL 표기를 유지한다. [검토·방향](design/services/v2/ART-DIRECTION.md), [최신 검증](docs/pages/PAGE6-NOTES.md)의 v2가 기준이다. 로컬만 반영했다.

최신 호버 수정: 사용자가 눈이 아프다고 한 SERVICES의 반복적인 인쇄물·티켓 펼침과 검정 띠 와이프를 제거했다. 호버/포커스는 0.2초 이미지 교차 페이드와 기존의 단순 배경색·화살표 전환이다. 콜라주의 입체 펼침은 페이지 첫 등장에만 재생하고, 서비스 선택으로 재시작하지 않는다. 나머지 디자인·상세 페이지·첫 등장 모션은 보존한다.

## 작업 범위와 진행 방식

- 작업 디렉터리는 이 저장소다. 인접한 다른 프로젝트를 수정하거나 새 프로젝트로 대체하지 않는다.
- 작업 전 `git status --short`를 확인한다. 사용자의 기존 수정·미추적 파일을 보존하고 작업에 필요한 파일만 변경·스테이징한다.
- 커밋 전 `.gitignore`를 확인한다. 환경변수·`.dev.vars`·인증 파일·의존성·캐시·로그·빌드 결과·테스트 산출물·임시 백업은 제외한다. `AGENTS.md`, 프로젝트 문서, 소스, 잠금 파일, 실제 사용하는 자산은 관리 대상이다. 이미 추적 중인 파일은 ignore 규칙만으로 제외되지 않으므로 추적 목록도 확인한다.
- 짧은 한국어로 변경 내용을 설명하고 요청받은 작업을 실행한다. 이미 승인된 작업에 반복해서 확인을 요구하지 않는다.
- 완료 보고에는 로컬 저장, 커밋, GitHub push, 운영 배포 중 어디까지 완료했는지 명확히 밝힌다. 로컬에만 만든 문서를 GitHub에도 반영한 것처럼 설명하지 않는다.
- 사용자가 로컬 확인을 요청했으면 로컬에만 반영한다. 배포 지시 없이 디자인을 수정하는 단계에서는 로컬 결과를 제공한다.
- `main` push는 실제 사이트를 바꾸는 배포다. 로컬 작업 중에는 push하거나 `npm run deploy`를 실행하지 않는다. 배포 요청이 있으면 아래 자동 배포 절차를 완료한다.
- 단순 문구·스타일 변경 때문에 전체 파일을 재포맷하거나 의존성·아키텍처를 교체하지 않는다.

## 실행 환경

- Node.js 버전은 [.node-version](.node-version)을 따른다. 패키지 관리자는 npm이며 `package-lock.json`을 유지한다.
- 앱은 React·TypeScript, Vinext·Vite, Tailwind CSS, Three.js, Cloudflare Vite 플러그인으로 구성된다. `app/` 구조를 사용하지만 일반 Next.js 서버로 실행하거나 설정을 초기화하지 않는다.
- 기존 UI는 `components/ui/`의 공통 컴포넌트를 우선 사용한다.
- `.openai/hosting.json`과 기존 `vite.config.ts`를 보존한다. 현재 호스팅은 아래의 기존 Cloudflare Worker이며 D1·R2는 사용하지 않는다.

### 로컬 서버

```powershell
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

- 2026-09-11 현재 PC에서 Windows Application Control이 Cloudflare `workerd.exe` 실행을 차단한다. OS 정책을 변경하지 않고 `npm run preview:node`로 동일 앱의 Node/Vite UI 미리보기를 실행할 수 있다. 이 명령은 Worker 바인딩을 제공하지 않으며 Cloudflare 런타임 검증을 대체하지 않는다. `vite.config.ts`·기존 배포 설정은 보존한다.
- 로컬 주소: `http://localhost:5187`. `start-local.cmd`도 같은 서버를 실행한다.
- 서버가 이미 실행 중이면 재사용한다. 5187 포트를 다른 프로세스가 사용 중이면 그 프로세스를 종료하거나 임의로 포트를 바꾸지 않는다.
- 백그라운드 실행은 숨김 창으로 하고, 프로세스와 로그 위치를 추적한다. 로그와 임시 결과는 Git에서 제외되는 `outputs/`에 둔다.
- 사용자가 켜 달라고 한 로컬 서버는 작업·배포 후에도 유지한다. 실제 HTTP 응답을 확인하고 주소를 제공한다.
- 개발 서버에서 새 JS와 이전 CSS가 섞여 제공된 이력이 있다. 실제 화면과 소스가 어긋나면 내려받은 CSS 규칙을 확인하고, 해당 프로젝트의 서버 프로세스를 확인한 뒤 재시작한다. HTTP 200만으로 최신 스타일이 반영됐다고 판단하지 않는다.
- PowerShell에서 한글 파일은 UTF-8로 읽고 쓴다. 스크립트를 다른 프로세스의 표준 입력으로 전달할 때도 인코딩을 확인한다.

## 주요 코드

| 파일 | 역할 |
| --- | --- |
| `app/page.tsx`, `app/home-content.tsx` | HOME 서버 SEO 진입점과 첫 화면 구성·문구·모션 제어 |
| `app/globals.css` | 색상, 글꼴, 배치, 반응형, 대체 카드 |
| `app/layout.tsx` | 메타데이터, 글꼴 로딩 |
| `app/components/wordmark.tsx` | 큰 ON&OFF 워드마크 |
| `app/components/why-section.tsx` | 두 번째 섹션의 짧은 문구와 입체 연결 장면 |
| `app/components/why-galaxy.tsx`, `app/why-galaxy.css`, `lib/galaxy*.ts` | 2페이지 은하·정거장·비행선·순차 등장·반응형 |
| `app/components/card-showcase.tsx`, `app/marketing-showcase.css`, `lib/card-showcase.ts` | 5페이지 MARKETING의 입체 광고 쇼케이스 |
| `lib/site-sections.ts` | HOME부터 TOGETHER까지 7개 메뉴와 연속 진행률 |
| `app/components/brand-film.tsx`, `app/brand-film.css` | 7페이지 원본 브랜드 영상, 발광 제목, 준비·재생 UI |
| `app/components/section-entry.tsx`, `lib/section-entry.ts` | 스크롤 면 전환과 첫 화면 가림 상태 |
| `app/components/card-ribbon.tsx` | 3D 카드 형상, 캔버스 텍스처, 드래그 |
| `lib/team.ts` | 직무·소개와 인물 이미지 셀 매핑 |
| `lib/scene-fonts.ts` | 실제 카드 이름·소개에 필요한 글꼴 로딩 |
| `scripts/team-asset.config.mjs` | 팀 이미지 원본과 자동 생성 경로 |
| `lib/scene-orbit.ts` | 카드와 로딩 타원이 공유하는 궤도 |
| `lib/scene-frame-loop.ts` | 필요한 동안만 실행하는 프레임 예약 |
| `lib/scene-loading.ts` | 로딩 시간, 오류 분류, 복구 처리 |
| `lib/scene-recovery.ts` | 사용 중 앞·뒤 컨텍스트 복구, 보이는 시간 기준 제한 |
| `app/components/scene-recovery-notice.tsx` | 기본 카드 안내와 장면 재시도 |
| `app/components/consultation-chat.tsx` | 상담 안내 창 |
| `app/components/site-controls.tsx` | 일곱 페이지 공통 메뉴와 프로젝트 문의 링크 |

## 현재 디자인과 동작

- 브랜드 색상: 검정 `#333333`, 연두 네온 `#D8FF3E`, 파랑 `#343CFF`. 배경은 `#e9edef`다.
- 보조 글자색은 `#596569`다. 페이지 배경과의 대비는 약 5.11:1이며 회사 정보·로딩 안내·상담 안내에 같은 변수를 사용한다. 일반 HTML 안내 글자와 조작 라벨은 모바일에서도 12px 미만으로 줄이지 않는다. 모바일 하단은 왼쪽 문구와 오른쪽 상담 버튼 아래에 모션 조작을 한 줄로 배치한다.
- 색상 변경은 CSS 변수뿐 아니라 3D 카드의 캔버스 색상과 관련 투명도 색상에도 반영한다.
- 큰 워드마크는 Montserrat Bold 700, 일반 영문은 Inter, 한글은 Pretendard Variable을 사용한다. 글꼴은 로컬 자산으로 제공하며 라이선스를 보존한다.
- Pretendard는 설치된 패키지의 공식 `pretendardvariable-dynamic-subset.css`를 사용한다. 전체 문자 범위를 배포하고 브라우저가 필요한 조각만 선택한다. 현재 문구만 남기는 수동 서브셋이나 외부 CDN 주소로 바꾸지 않는다. 캔버스는 DOM이 아니므로 새 이름·직무·소개도 `loadCardFonts`가 먼저 준비한 뒤 그린다.
- 중앙 왼쪽 문구는 `당신은 사업만 ON` / `복잡한 마케팅은 OFF` 두 줄이며 끝에 마침표를 붙이지 않는다.
- 해당 문구는 2026-09-11 사용자가 제공한 데스크톱 가이드(Pretendard / 98pt / SemiBold)의 보이는 크기와 비율을 기준으로 한다. 한글은 로컬 Pretendard Variable 600, 두 줄은 문구 영역 안에서 가운데 정렬한다. 인쇄용 pt를 CSS에 고정하지 않고 데스크톱 26~44px, 모바일 24~28px 범위에서 화면 너비에 맞춘다. ON/OFF의 기존 파란색과 Inter 600을 보존한다.
- `ONE TEAM.` / `MANY MINDS.`는 하단 왼쪽에 있다. 위치 변경 시 모바일 배치와 텍스트 접근성도 확인한다.
- 카드 상단의 ON&OFF 로고·TEAM 번호·구분선 행은 삭제된 상태다. 해당 영역 98px을 제거하여 텍스처는 **640×782**이며, 모든 내부 내용도 98px 위로 이동했다.
- 3D 카드의 높이도 같은 비율로 줄이고 위쪽 가장자리는 유지했다. 카드 너비와 인물 자체의 크기는 보존한다.
- 행이나 영역 전체의 삭제를 요청받으면 텍스트만 지우고 빈 높이를 남기지 않는다. 카드가 캔버스·3D 형상으로 그려진다는 점을 고려해 실제 높이, 내용 좌표, 정렬도 함께 수정한다.
- 3D 카드와 `.fallback-*` 대체 화면의 비율·배치를 맞춘다. WebGL 화면만 고치고 대체 화면을 빠뜨리지 않는다.
- 2026-09-11 사용자 요청으로 1페이지 카드 인물의 표시 너비·높이를 기존의 90%로 줄였다. 원래 인물 영역(높이 386px)의 하단 중앙을 기준으로 축소해 발·받침대 기준선을 유지하며, 3D와 `.fallback-visual`에 동일하게 적용한다. 카드·배경 패널·글자·2페이지 인물은 그대로다. 이미지 해상도는 아래의 768×768 상태를 유지한다.
- 현재 인물 원본은 `public/images/team-realistic-figurines-v3-photoroom.png`다. 원본 1254×1254는 보존하고 `npm run prepare:assets`가 768×768로 축소한 뒤 무손실 WebP를 `app/assets/generated/team-atlas.webp`에 만든다. 인물당 256×384로 카드 텍스처의 인물 영역 높이 386px에 맞춘다. 3D·대체 화면은 같은 Vite URL을 사용한다. 3열×2행의 여섯 인물을 직무 매핑에 따라 사용하며 얼굴·소품·발·받침대를 자르지 않는다. 원본과 이전 이미지는 보존한다.
- 이미지 교체 시 `scripts/team-asset.config.mjs`의 원본 경로와 최대 너비 `maxWidth`를 관리한다. 생성 WebP는 Git에서 제외하며 `predev`·`prebuild`에서 재생성한다. 생성기는 3열×2행 분할을 확인하고 축소 결과를 기준으로 WebP의 크기·보이는 RGB·모든 투명도 값 보존을 검사한다. Vite가 배포 파일명에 해시를 붙여 이미지 교체 시 캐시 주소도 갱신한다.
- 3D 카드를 워드마크 앞·뒤로 나누는 렌더링, 드래그·방향키·스페이스 키, 회전 방향 전환, 움직임 감소 설정을 보존한다.
- MOTION OFF에서도 수동 조작은 동작한다. 움직임이 끝나거나 탭이 숨겨졌을 때 프레임 예약이 계속 돌지 않도록 한다.
- 사용 중 WebGL 손실 시 양쪽 캔버스를 즉시 숨기고 기본 카드를 표시한다. 양쪽 복원 및 렌더 완료 후 복귀하며, 보이는 시간 합산 10초를 넘으면 기본 화면을 유지한다. 재시도는 장면만 새로 만들고 모션·방향 설정을 보존한다. 손실 직후 이전 GPU 자원을 정리하고 복원 시 다시 업로드한다. 자세한 정책과 재현 방법은 [RECOVERY-NOTES.md](docs/operations/RECOVERY-NOTES.md)를 따른다.
- 모션 스위치는 `--motion-thumb-x`와 단일 `translate`로 손잡이를 이동한다. 변환을 중복 적용하면 배포 CSS에서 이동 거리가 달라질 수 있다.
- 상담톡은 서비스 준비 안내 상태이며 입력·전송은 비활성화돼 있다. 요청 없이 실제 상담 서비스처럼 동작하게 만들지 않는다. 회사의 임시 정보나 실제 직원 정보를 임의로 지어내지 않는다.
- 우측 섹션 메뉴와 프로젝트 문의 링크는 `SiteControls`에 한 번만 렌더링하며, `.hero`·회전하는 면·가려진 장면의 `inert` 범위 안에 넣지 않는다. 초기 로더가 잠그는 페이지 `main` 안의 공통 고정 영역이다. 페이지 전환 중 고정 위치를 유지한다. 상담톡 컴포넌트는 현재 문의 페이지에서도 숨긴다.
- 루트의 `scrollbar-gutter: stable`로 기본 세로 스크롤바 공간을 확보한다. 초기 로더의 스크롤 잠금은 준비 완료 후 페이드가 시작될 때 풀고, main의 `inert`는 페이드 종료까지 유지한다. 두 수명을 합치면 화면이 드러난 뒤 스크롤바가 나타나고 폭이 바뀔 수 있다. 2페이지는 첫 HTML에 포함되며 별도 지연 로딩으로 문서 높이를 늘리는 구조가 아니다.
- 메뉴의 `aria-current`는 현재 섹션 한 항목에만 적용한다. 색상 바는 메뉴 전체에 `.section-nav-indicator` 하나만 두고, `--section-progress`의 0~1 진행률에 맞춰 HOME부터 TOGETHER까지 메뉴 중심을 연속 이동한다. 항목별 활성 막대 `::after`를 다시 만들지 않는다. 마우스 휠의 큰 이동은 120ms CSS 전환으로 이어주며 움직임 감소에서는 전환을 생략한다. 진행률은 ref로 CSS 변수에 전달하고 매 프레임 React 상태를 갱신하지 않는다. 1페이지는 파랑, 2페이지는 라임색 활성 표시와 흰색 보조 항목을 사용한다. 모바일 본문·인물·모션 조작과 공통 조작이 겹치지 않게 배치한다.
- 2페이지는 2026-09-11 최신 사용자 지시로 기존 매듭 로고·선·은색 지휘자와 실행 코드를 제거하고 우주 진입→은하 확대→정거장/비행선 합류→다섯 서비스와 팀 등장으로 교체했다. 제목은 `마케팅 전부, / 온앤오프 하나로`, 보조는 `기획부터 제작·운영까지`, 통합 주제는 `다섯 분야를 한 번에`다. 기획·디자인·웹사이트·마케팅·운영을 명확히 구분한다. [PAGE2-NOTES.md](docs/pages/PAGE2-NOTES.md), [광고 표현 조사·연출 계획](design/galaxy/ART-DIRECTION.md)이 현재 기준이다. 이전 `design/why-universe/`는 기록이며 그 매듭을 되살리지 않는다.
- `WhyGalaxy`는 별마다 실제 체적이 있는 8면체 인스턴스·개별 깊이와 나선 경로·가스/먼지층·금속 정거장·셔틀/비행선/로켓/탐사선/화물선으로 구현한다. 장면 시간 6.42초의 진입 시간표는 1.75배로 시작해 완성 직전 원래 공전 속도 1.4배로 연속 전환한다. 인물은 제목의 마지막 펼침과 겹쳐 약 2.69–3.0초에 등장하고 모든 서비스 표시는 약 3.75초에 완료되며 이후 은하와 비행체가 천천히 공전한다. 인물 제스처의 실제 재생 시간은 바꾸지 않는다. 은하 전체를 그린 평면과 워프 흰 선·미리 그린 닫힌 궤도는 삭제했다. 0.6초 이후 별들이 개별로 형성되며 비행체는 작아진 크기로 궤도 위치에서 0.42초 팝 등장한다. 비행한 구간에만 짧고 서서히 사라지는 잔광을 남기며 위에서 내려오는 이동을 넣지 않는다. HTML 글자와 캔버스를 분리하고 Pretendard/Montserrat 로컬 글꼴을 유지한다. 삭제했던 `why-header`는 다시 넣지 않는다.
- 2페이지 인물은 2026-09-12 후속 요청으로 뒤돌기 8포즈씩 총 40개 이미지를 다시 생성했다. 발을 들고 체중을 옮긴 뒤 반대발을 따라 딛는 동작이며, 기존 팔 올리기 8포즈씩은 보존해 인물별 총 16포즈를 사용한다. 정면 대기는 0.18초, 마지막 뒷모습까지 약 1.37초다. 손목 X와 각기 다른 오른팔·서 있는 자세를 유지한다. 뒤집기·CSS 회전으로 동작을 대신하지 않는다. 정렬은 받침대와 정면/뒷면의 키만 기준으로 삼아 중간 무릎 굽힘의 높낮이를 지우지 않는다. lib/galaxy-crew.ts가 단일 WebP와 1회 재생 GIF의 시간을 공유한다. 인물 등장 완료·이미지 디코딩·인물 가시성 확인 후 한 번 재생하고, HOME에서 은하 진입을 다시 시작할 때만 함께 재생한다. MARKETING에서 SYSTEM으로 돌아올 때는 최종 뒷모습을 유지하며, 인물 영역만 벗어났을 때도 초기화하지 않는다. 탭 숨김·MOTION OFF는 일시 정지만 하며 움직임 감소는 최종 뒷모습이다. 현재 원본·80프레임·정렬 정보는 design/galaxy-crew/v3/에 있고 v2는 원본 보관 자료다. [생성·재생 기준](design/galaxy-crew/README.md)을 따른다.
- 은하 진입은 첫 면 전환 48% 이후 시작한다. #why에서 새로고침하면 공통 로더의 인위적인 최소 대기는 0ms, 종료 페이드는 180ms다. 실제 자산/첫 렌더 준비 확인과 섹션 준비 UI는 유지한다. 다른 진입 주소의 공통 로더는 기존 1000ms/500ms다. 데스크톱 최소 높이 800px, 1100px 이하 1240px, 600px 이하 1280px이다. 좁은 화면은 제목·은하·서비스 격자·팀 순서로 배치하며 페이지 비율을 고정하지 않는다. 렌더러는 변환 전 clientWidth/clientHeight로 리사이즈한다.
- `lib/galaxy-scene.ts`는 프레임마다 형상을 만들지 않고 형상·재질을 재사용한다. WebGL 손실 즉시 기존 자원을 정리하고 SVG/HTML을 표시하며 복원 후 환경 맵·후처리 버퍼를 새로 만든다. 입체 별 32,000/14,000개·개별 구름 스프라이트 3,600/1,800개·먼지 1,200/600개, 약 165만/95만 픽셀 버퍼 상한이며 작은 화면은 bloom을 생략한다. 별의 실제 입체 형상과 구름 스프라이트를 혼동하지 않는다. 128px 구름 질감만 공유하며 은하 전체 이미지로 대체하지 않는다. 새 외부 자산·의존성·배포 설정은 추가하지 않는다.
- 사용자는 종이가 말리는 효과를 취소하고 원래 FOLLOW.ART의 그래픽한 면 전환을 살리도록 지시했다. 왼쪽 방향을 시험한 뒤 원래 오른쪽으로 쏠리는 전환을 선택했다. 현재는 뒤의 2페이지를 고정하고, 앞의 1페이지 전체가 오른쪽으로 쏠리며 위로 빠져나간다. 회전 중심은 왼쪽 위(`0 0`), 회전 각도는 반시계 방향 음수다. 종이 뒷면·접힘 SVG·곡선 클리핑·입체 그림자 DOM과 계산은 삭제했다. 첫 페이지의 실제 HTML과 3D 캔버스를 함께 움직이며 복제하거나 이미지로 대체하지 않는다. 낮은 화면은 첫 페이지 하단까지 자연스럽게 스크롤한 뒤 전환하며, 긴 두 번째 본문은 전환 이후 일반 스크롤로 이어진다. 페이지 전체 종횡비를 고정하지 않는다.
- 첫 페이지가 완전히 빠져나가면 3D 렌더링·복구 시간은 쉬며, 역방향 스크롤 시 모션·방향 상태를 유지해 재개한다. 메뉴는 우측 인디게이터 위치가 앞면의 하단 또는 기울어진 옆면 밖으로 드러나면 WHY로 바뀐다. `#home`은 페이지 시작점, `#why`는 첫 페이지 높이 위치의 고정된 바깥 앵커다. 움직임 감소 설정과 JavaScript 미사용 시 두 섹션은 일반 문서 흐름을 사용한다. 초기 로더의 조작 잠금과 장면별 `inert` 처리를 혼동하지 않는다.
- 회전된 면의 `getBoundingClientRect()` 크기로 렌더러를 리사이즈하지 않는다. 장면 버퍼와 전환 기준 크기는 `clientWidth`·`clientHeight` 또는 `offsetWidth`·`offsetHeight`의 변환 전 레이아웃 값을 사용한다. 전환 중 창 크기를 바꿔도 카드와 면 크기가 부풀지 않아야 한다.
- 앞면이 가려진 상태와 뒤쪽 inert 해제는 명목상 앵커 도달 여부가 아니라 sticky 오프셋과 회전/이동 후 앞면의 가장 낮은 모서리가 화면을 벗어나는 시점으로 판단한다. 긴 DESIGN은 앵커570px 전에도 완전히 사라질 수 있다. scroll >= sheetHeight만 사용하면 보이는 WEB 영상·버튼이 잠긴다. 반대 스크롤로 실제 앞면이 돌아오면 원래 잠금 상태를 복구한다. 궤적과 앵커 위치는 이 판단 때문에 바꾸지 않는다. 움직임 감소는 일반 문서 경계다.
- 전환 중 가려진 첫 페이지 조작에 키보드 포커스가 들어가면 앞면을 펼쳐 조작을 보여준다. 낮은 화면에서는 하단 조작이 보이는 스크롤 위치로 복귀한다. `.page-turn-runway`는 투명한 스크롤 여백이므로 포인터 입력을 가로채지 않아야 한다.

5페이지 MARKETING의 최신 기준은 채널 캠페인 v3다. 분홍 #C5939D 배경·검정 #090A0F·Montserrat 700 제목·Pretendard 본문을 보존한다. 왼쪽부터 인스타그램(온결 보습 루틴), 블로그(루움 이불 선택), 광고 포스터(모닝오븐 점심 세트)이며 모두 가상 브랜드 시안이다. 이전 쇼츠 비디오 실행 코드는 제거했다. 큰 제목은 최신 FOLLOW.ART 영상 재조사에 따라 HTML 글자의 세로 압축·신장·반동이 왼쪽에서 오른쪽으로 이어지고 총1.67초 뒤 완성된 제목을 고정한다. 이후 반복 파동을 넣지 않는다. 이전 rotateX는 제거했으며 lib/marketing-title.ts와 기존 프레임 루프의 별도 titleTime을 사용한다. 가로 칸·가독성·모션 정지·역스크롤 재진입을 보존하고 Three.js 입체 글자라고 설명하지 않는다. 상세는 design/marketing/v2/TITLE-MOTION-v3.md다. 인스타그램은 계정·4:5 사진·광고 CTA·좋아요/댓글/저장·캡션을 포함한720×1420, 블로그는 작성자·커버·3개 소제목/본문·체크리스트·공감을 포함한720×1720의 긴 지면이다. 포스터는 매장 입간판 설치 장면 poster-installed.webp다. 가상 브랜드와 반응 수/댓글 예시임을 명시한다. 세 카드는 서로 다른 높이를 유지하고 감쇠 스프링으로 가속·초과 이동·반동을 거쳐 정착한다. 펼침 중 앞뒤 깊이와 기울기, 넓고 얕은 곡률·미세 비틀림, 표면 조명을 적용한다. V자 접힘은 사용하지 않는다. 최신 사용자 요청으로 펼침 후반 양옆 카드가 양의 곡률에서 음의 곡률로 반전하고, 좌우로 비스듬하게 휘어진 상태를 유지한다. 최종 곡률은 −0.78/0.24/−0.84, 면 안의 곡률 축은 +0.24/0/−0.24rad다. 양옆은 반대로 오목하게, 중앙 블로그는 완만하게 두며 서로 다른 yaw/pitch/roll을 유지한다. 모바일 곡률은 데스크톱의 78%다. 비틀림만 0으로 돌아오며 카드 표면을 평평하게 되돌리지 않는다. lib/marketing-surface.ts가 원본 좌표를 기울어진 곡률 축으로 옮겨 앞면과 몸체를 함께 변형하고 다시 되돌린다. UV와 실제 법선 방향 두께를 보존한다. 앞면은 지오메트리 자체를 z=0.045에 배치해 몸체와 겹치지 않게 한다. 카메라는 펼침 도중에만 조금 멀어져 긴 블로그가 잘리지 않게 한다. [입체 모션 기록](design/marketing/v3/DEPTH-MOTION.md)을 따른다. 첫HTML pending 준비 UI는 사진·글꼴·인물 준비와 실제 첫3D 프레임 전까지 본문을 가리며12초 오류 제한과 noscript 대체를 제공한다. 카드는 최종 x−2.7/0/+2.7·공통z0에 펼쳐져야 하며 실제 곡면의 앞뒤와 중간 지점을 카메라에 투영해 겹침을 검사한다. 추가 스크롤은 데스크탑30vw·모바일50svh이고 실제 stage와 section 높이 차이를 진행률에 사용한다. 문구는 홍보할 시간 없다면 / 온앤오프에 맡기세요다. 마케터는 원본8포즈·4890ms 반복 그대로이며 받침대 alpha만 제거한 marketer-no-plinth-v2.webp를 사용한다. 얼굴·팔 동작·타이밍·위치를 바꾸지 않는다. npm run prepare:marketing은 최신3이미지와 무손실 인물 스프라이트/GIF를 재생성한다. [PAGE5-NOTES.md](docs/pages/PAGE5-NOTES.md), [조사·프롬프트·자산](design/marketing/v3/README.md)을 따른다.

메뉴 표기는 HOME·SYSTEM·DESIGN·WEB·MARKETING이고 기존 #why·#card 앵커는 유지한다. 기존 중첩 SectionEntry·상담·단일 연속 인디케이터를 보존한다. 2페이지 첫 HTML은 pending 로딩 UI로 시작해 실제 첫3D 렌더 전까지 문구·인물·정적 은하를 숨긴다. WebGL 실패 시 읽을 수 있는 대체 화면으로 전환하고 noscript는 로딩 대신 본문을 표시한다. 마케터·영상·3D는 MOTION OFF·탭 숨김·페이지 이탈에서 멈추고 움직임 감소는 포스터·최종 소개 자세다.

## 검증

WEB의 최신 문구는 고객 문의로 이어지는 / 우리 회사 홈페이지, 업종에 맞게 기획하고 / 필요한 기능을 만듭니다, 제작부터 유지보수까지다. 추상적인 경험 중심 문구를 되살리지 않는다. 왼쪽 파란 배경 ::before는 삭제했고 오른쪽 선은 중립색이다. WEB→MARKETING을 감싸는 SectionEntry에만 scrollRatio=0.8을 적용해 넘김 스크롤을20% 줄인다. getSectionScrollLength의 결과를 진행률·runway·중첩 앵커에 함께 사용하며 화면/영상 높이를 줄이는 방식으로 대체하지 않는다. 다른 세 전환은 기본1을 보존하고 움직임 감소/JavaScript 미사용은 일반 문서 흐름이다. 자세한 변경 기준은 PAGE4-NOTES.md다.

5페이지 측면 메뉴는 후속 사용자 수정에 따라 큰 분홍 배경·그림자 박스를 사용하지 않는다. 공통 메뉴 링크 바깥에 트랙 1개와 연속 이동 막대 1개를 두며, 5페이지 막대는 브랜드 파랑이고 현재 항목은 굵은 검정이다. 검은 제목·카드 위의 가독성은 글자·얇은 트랙의 외곽선으로 확보한다. 공통 메뉴를 중복 렌더링하거나 항목별 활성 막대를 다시 만들지 않는다.

앱 코드·의존성·빌드 설정 변경 후에는 다음을 실행한다.

```powershell
npm run ci:build
```

- 이 명령은 린트, 타입 검사, 로딩·렌더링·글꼴·공용 상태·3D 복구 테스트, 프로덕션 빌드와 배포 CSS/자산 검사를 실행한다. `npm run lint`는 경고도 실패로 처리한다. 실패를 숨기거나 검사 자체를 제거해 통과시키지 않는다.
- 린트 예외는 `.oxlintrc.json`의 파일·규칙 단위로만 유지하며 이유는 [LINT-NOTES.md](docs/operations/LINT-NOTES.md)에 기록한다. 공용 UI·테스트 폴더 전체를 검사에서 제외하지 않는다. 상태 구독 변경 시 초기 값과 이벤트 해제를 확인한다.
- `scripts/check-production-css.mjs`는 상담창 클래스 병합, 스위치 이동, 화면 크기별 팝업 경계를 검사한다.
- `scripts/check-production-assets.mjs`는 공식 글꼴 조각 전체의 파일·문자 범위·가변 굵기, 한글 11,172자 범위, 로컬 URL, 생성 이미지와 배포 이미지의 일치를 확인한다. 이 검사는 일반 빌드와 자동 배포에도 포함되므로 오류를 건너뛰지 않는다.
- 문서만 수정했다면 링크·명령·사실관계와 `git diff --check`를 확인한다. 문서 수정만을 위해 앱 테스트를 새로 만들거나 빌드를 반복하지 않는다.
- 단순 문구·스타일 변경에 구현 내용을 그대로 되풀이하는 테스트를 추가하지 않는다. 로딩·프레임 제어 등 동작 변경에는 의미 있는 기존 테스트를 보완한다.
- 깨끗한 설치 검증이 필요하면 프로젝트 밖의 임시 디렉터리에 Git 대상 파일만 내보내 `npm ci` 후 검사한다. 기존 로컬 서버의 의존성을 교체하지 않는다.
- 이 프로젝트의 TypeScript 검색 범위가 넓으므로 백업 `.ts` 파일을 저장소 안에 만들지 않는다. 백업이 필요하면 프로젝트 밖에 두거나 `.ts.bak`처럼 검사 대상에서 제외되는 확장자를 쓴다.
- 브라우저 확인을 수행했는지 정확히 구분한다. HTTP 200이나 빌드 성공만으로 화면·드래그·모바일 동작까지 확인했다고 보고하지 않는다. 브라우저 도구를 사용할 수 없으면 그 한계를 짧게 알린다.
- 영상 재생 검증은 #web 직접 이동뿐 아니라 마우스 휠로 내려와 앞면이 사라지는 즉시 멈추는 구간을 반드시 포함한다. 테스트에서 scrollIntoView(#web)로 위치를 보정하면 실제 잠금 오류를 숨길 수 있다. 멈춘 위치에서 실제 표시 프레임 증가·버튼 클릭·역방향 복귀·해시 없는 새로고침을 확인한다. 재현 기록은 PAGE4-NOTES.md를 따른다.
- 네이티브 스크롤바 문제를 검사할 때는 실제 스크롤바가 보이는 환경을 사용한다. Playwright Chrome의 기본 `--hide-scrollbars`를 제외하고, 로딩 전후 `.site-pages`의 실제 폭과 잠금 해제 시점을 확인한다. 루트 `clientWidth`만으로 예약된 gutter의 레이아웃 폭을 판단하지 않는다.

## GitHub와 자동 배포

- 저장소: `https://github.com/G-bak/onoff-hero` (비공개)
- 운영 브랜치: `main`
- Cloudflare Worker: `onoff-hero-preview`
- 배포 주소: `https://onoff-hero-preview.ajdhfbx1836203.workers.dev`
- 자동 배포는 **Cloudflare Workers Builds의 GitHub 연결**이 담당한다. GitHub Actions의 별도 배포 워크플로를 추가하여 중복 배포하지 않는다.
- 빌드 명령: `npm run ci:build`
- 배포 명령: `npx wrangler deploy --config dist/server/wrangler.json`
- 루트 디렉터리는 `/`이며 `main`만 자동 배포한다. 다른 브랜치의 미리보기 빌드는 비활성화돼 있다.

배포 요청을 받으면 다음 순서로 진행한다.

1. 변경 범위와 검증 결과를 확인하고 필요한 소스·자산·설정만 커밋한다.
2. 원격 변경을 확인한 뒤 `main`에 정상 push한다. 강제 push나 기존 사용자 변경 초기화를 하지 않는다.
3. 해당 커밋 SHA의 Cloudflare Builds 또는 GitHub 체크가 성공할 때까지 확인한다. push 성공만으로 배포 완료라고 하지 않는다.
4. 실제 운영 버전과 사이트 응답, 변경 관련 문구·자산이 반영됐는지 확인하고 배포 URL을 제공한다.

- 배포 실패 시 빌드 로그에서 원인을 찾아 수정하고 새 커밋으로 재시도한다. 자동 배포를 우회한 로컬 직접 배포로 실패를 감추지 않는다.
- 수동 배포는 사용자가 요청했거나 복구 작업상 필요할 때만 사용한다. 자동 배포와 동시에 실행하지 않으며 소스와 배포 버전의 관계를 기록한다.
- 수동 `npm run deploy`도 `npm run ci:build`를 먼저 실행한다. 직접 Wrangler 명령으로 린트·테스트 실패를 우회하지 않는다.
- API 토큰은 Cloudflare에서 관리한다. 인증 정보는 코드·문서·Git 원격 URL·로그·응답에 넣지 않는다.
- 과거 문서의 배포 시각만으로 현재 버전을 단정하지 않는다. 현재 Cloudflare 실행 상태와 원격 커밋을 기준으로 판단한다.

상세 자료: [README.md](README.md), [AUTO-DEPLOY.md](docs/operations/AUTO-DEPLOY.md), [DEPLOYMENT-NOTES.md](docs/operations/DEPLOYMENT-NOTES.md), [이미지 기록](design/archive/public/images/ASSET-NOTES.md).


## 2026-09-12 DESIGN·WEB 구현 이력

당시 요청으로 페이지 순서는 HOME(01) → SYSTEM(02) → DESIGN(03) → WEB(04) → MARKETING(05)이다. 위 마케팅 구현 기록은 현재5페이지를 설명한다. DESIGN은 종이색 #F0F0E9 편집 지면·왼쪽 DE/SIGN 분할 제목·오른쪽 큰 단일 작업물·썸네일 목차다. 전용 app/components/design-editorial.tsx와 app/design-editorial.css를 사용한다. 기존 마케팅의3장 펼침을 재사용하지 않는다. 스크롤/버튼 선택과 다섯 세로 구획의 인쇄 모션, CSS3D 원근을 사용하며 별도 WebGL 모델링이라고 보고하지 않는다.5페이지는 마케팅 전용 CardShowcase를 유지한다. 기준은 [PAGE3-NOTES.md](docs/pages/PAGE3-NOTES.md), 마케팅 기준은 [PAGE5-NOTES.md](docs/pages/PAGE5-NOTES.md)다.

WEB은 사용자 제공15초 영상을 중심으로 하는 검정/흰색 Film edition이다. 전용 app/components/web-section.tsx와 app/web-cinema.css를 사용한다. 후속 지시로100svh 안에서 제목·영상·조작·인물·하단을 배치하며 영상은 가용 너비와 남은 높이 중 작은16:9 크기를 사용한다. 짧은 휴대폰은 제목/문구를 가로로, 낮은 가로 화면은 장면 목록을 영상 옆으로 배치한다. 로딩·오류·수동 재생·음소거·키보드 탐색·모션/가시성 정지를 제공하며 상세 기준은 PAGE4-NOTES.md다. 기존 마케팅 #card 앵커는 주소 호환성을 위해 보존한다. 신규 앵커는 #design과 #web이다. 당시에는 네 개의 중첩 SectionEntry, 5개 항목의 연속 인디케이터, 단일 상담 버튼을 사용했다. 현재 메뉴·문의 기준은 위 최신 항목을 따른다. 짧은 가로 화면의 메뉴와 상담 버튼 겹침을 확인한다. 2페이지의 최종 인물 자세 유지 정책은 이제 바로 다음 DESIGN으로 나갔다 돌아올 때도 동일하게 적용한다.

DESIGN의 최신 문구는 눈길을 사로잡고 / 구매로 이어지게, 보조는 DESIGN THAT SELLS다. 고객 가설은 카페·베이커리, 뷰티 D2C, 온라인 리빙이며 실제 회사 고객 분석으로 확정한 타깃이 아니다. 새 가상 브랜드 모닝오븐·온결·루움의 포스터/포장·뷰티 패키지/제형·침구 사용 장면/소재 콘텐츠를 보여준다. 실제 고객 실적으로 설명하지 말고 CONCEPT PORTFOLIO 및 가상 브랜드 디자인 시안 표기를 보존한다. 원본·조사 출처·프롬프트는 design/design-showcase/v2/, 런타임은 app/assets/design-showcase/의 design-bakery.webp·design-beauty.webp·design-living.webp(720×900, 합계267,820B)다. node scripts/prepare-design-assets.mjs로 재생성하며 --legacy는 이전 추상 시안 전용이다. 생산 자산 검사에서 실제 배포 이미지와 실행 자산 해시 일치를 검증한다. 최신 사용자 요청으로 전체 높이를 stage+125svh로 조정했다. 추가 감상 구간이 직전100svh보다25% 늘어나 세 작업물이 덜 급하게 바뀐다. 1440×900에서 전체2025px·작업물별375px이며, 썸네일 선택·WEB 앵커는 실측 높이에 자동으로 맞춘다. 공통 면 전환 거리·움직임 감소의 일반 지면은 유지한다. 현재 변경은 로컬만 반영한다.

DESIGN 인물은 페이지가 드러날 때부터 보여야 하므로 별도 투명도 등장 효과를 쓰지 않는다. useSceneActivity의 duringTransition은 dance 인물에만 적용해 앞면 전환의 section-surface inert 동안 실제 포즈를 재생한다. 페이지 입력 잠금은 유지하며 main의 초기 로딩 잠금은 반드시 우선한다. 이 예외를 WEB 영상이나 다른 입력 요소에 적용하지 않는다. 화면 밖·가려짐·탭 숨김·MOTION OFF·움직임 감소 동작은 계속 보존한다.

DESIGN과 WEB 인물의 최신 기준은 5페이지 마케터의 제작 방식이다. 최초 팀 아틀라스 원본을 직접 참고한 실제 포즈를 사용하며 재생성된 SYSTEM 인물을 주 참조로 쓰지 않는다. DESIGN은 원본의 긴 아이보리 셔츠·넓은 바지·회색 운동화를 유지하고 팔꿈치를 굽힌 양팔을 위아래로 움직이는1120ms 왕복 춤이다. 후속 요청으로 손을 머리 가까이 당기는0~1번 포즈만 제외한다. 팔을 내리는2·3번을 복원해2~7번 구간을 재생한다. WEB은 v5에서 원본의 긴 리브 니트 카디건·안경·바지·신발과 자연스러운 머리 비율을 참고해12포즈로 다시 제작했다. 가로형 슬레이트 칠판·은색 금속 테두리를 사용하며 WEB 쓰기→밑줄→물러서 확인→지우기를2760ms로 반복한다. 두 인물 모두 원통 받침대가 없으며 SYSTEM의 받침대는 보존한다. MARKETING은 최신 요청으로 받침대만 제거했다. 마지막 자세 유지는 SYSTEM만의 정책이고 DESIGN/WEB에 적용하지 않는다(OS 움직임 감소는 정적 대체). 광학 흐름/MCI·CSS 몸 회전·이미지 교차 합성은 쓰지 않는다. lib/person-motion.ts와 마케터와 같은 createSceneFrameLoop를 사용한다. WEB은 글씨와 실제 손을 같은 래스터 포즈에 포함한다. 이전 SVG 윤곽·마스크·별도 필기 지시 JSON은 런타임에서 제거했다. 움직임 감소/JavaScript 없는 화면은 WEB이 완성된10번 포즈다. 작은 컷은 허용하되 몸 회전이나 광학 흐름으로 포즈를 대체하지 않는다. 가려짐·탭 숨김·inert·MOTION OFF에서 시간과 자세를 보존하며 재개한다. 원본·프롬프트·검토와 재생성 명령은 DESIGN은 design/people-motion/v4/README.md, WEB은 design/people-motion/v5/README.md다. 실행 자산은 designer-rhythm-v4.webp와 web-writer-v5.webp다. v2/v3는 거절된 이전 시도 기록이다. lib/web-film-playback.ts가 초기 재생 중단의1회 복구와 준비 이벤트·오래된 Promise 무효화를 관리한다. 자동 재생 정책 차단은 사용자 재생 버튼을 표시하고 클릭 안에서 동기적으로 play를 호출한다. 수동 일시정지는 페이지 복귀 후에도 유지한다. WEB 원본15초 MP4는 AI-Video-Studio에 보존하고3.1MB 전송본만 사용한다. 새 라이브러리나 외부 플레이어를 추가하지 않는다.
