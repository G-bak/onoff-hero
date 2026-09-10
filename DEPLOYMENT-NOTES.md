# 배포 기록

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
- 검증 기록: `outputs/deployment-2026-09-10/verification-no-periods.json`. Git 커밋·push는 하지 않음.

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
- 검증 기록: `outputs/deployment-2026-09-10/verification.json`. 로컬 5187 서버 유지 및 HTTP 200 확인. Git 커밋·push는 하지 않음.

## 2026-09-09 18:05 KST — 참고 이미지에 맞춘 카드 구성

- 사용자 요청: 새 Photoroom 누끼 이미지로 카드를 제공한 예시처럼 변경하고 배포.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `2146ee51-8c70-4292-be16-2688df8e953d`
- 직전 배포 버전: `a1c9e3ab-cf71-4600-a359-0ecfe8a15bab`
- 현재 이미지: `public/images/team-realistic-figurines-v3-photoroom.png`. 사용자 파일을 변경 없이 복사했고 기존 이미지는 보관.
- 카드 상단에 분야·직무명·소개·에디션 문구를 모음. 직무명은 58px, 소개는 19px. 아래쪽에 둥근 회색 판을 두고 인물을 오른쪽 아래에 겹쳐 배치. 인물의 발·소품·받침대는 유지.
- 640×880 텍스처에서 배경판은 `(214, 354, 366, 416)`, 인물 원본 셀은 `(340, 462)`부터 높이 `386`. 실제 불투명 인물 높이는 약 350px로 카드 높이의 약 40%. 이전 중앙 35% 배치를 대체하며 CSS 대체 화면도 같은 비율.
- Montserrat 큰 로고, 3D 카드 크기·곡면·회전, 초기 MOTION ON 및 OFF의 수동 조작은 유지.

검증: 타입 검사·빌드·기존 배포 CSS 검사 통과. 6명 모두 실제 알파 영역이 카드 경계 안에 들어오는지 계산 확인. 배포 후 홈·CSS·페이지 JS·새 PNG의 HTTP 200 및 로컬 빌드와 원격 자산의 SHA-256 일치 확인. 홈이 최신 CSS를 참조하며 CSS와 JS 모두 새 누끼를 요청. 로컬 5187도 HTTP 200, 서버 유지. 실제 브라우저 시각·조작 검증은 수행하지 않음. 기록: `outputs/card-style-2026-09-09/`.

검사 과정에서 이전 배포 백업의 `vite.config.ts`가 프로젝트 타입 검사에 포함되는 문제를 확인하여 백업 확장자를 `.ts.bak`으로 변경했다. 실제 프로젝트 설정은 변경하지 않았다. 이번 배포를 위한 Git 커밋·push는 하지 않았다.

## 2026-09-09 17:52 KST — 큰 ON&OFF 로고 Montserrat 적용

- 사용자 요청: 큰 ON&OFF 로고를 Montserrat로 변경.
- 큰 워드마크에 Montserrat Bold(700) 적용. 기존 크기·자간·위치·코발트 앰퍼샌드는 유지.
- `@fontsource/montserrat` 5.3.0의 Latin 700만 불러오고 폰트 파일을 사이트에서 직접 제공. 헤더 이미지 로고와 나머지 글꼴은 기존 설정 유지.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 배포 버전: `a1c9e3ab-cf71-4600-a359-0ecfe8a15bab`
- 직전 배포 버전: `3ccfe463-1197-4f16-8da1-fc9969f81245`
- 피규어 이미지와 인물 크기 35%는 유지. 캐릭터 복원은 이후 요청 시 진행.

검증: 빌드와 기존 배포 CSS 검사 통과. 산출 CSS의 Montserrat 700 적용 및 폰트 파일 포함 확인. 배포 후 홈·CSS·WOFF2·WOFF 응답 HTTP 200, 원격 CSS·폰트와 로컬 빌드의 SHA-256 일치, 홈의 최신 CSS 참조 확인. 실제 브라우저 시각 검증은 수행하지 않음. 로컬 5187 서버 유지. 검증 기록은 `outputs/deployment-2026-09-09-montserrat/`에 보관.

## 2026-09-09 17:32 KST — 실사 피규어 누끼 임시 배포

- 사용자 요청: 현재 버전을 일단 배포. 나중에 캐릭터 이미지로 되돌릴 예정이며, 이번에는 되돌리지 않음.
- 배포 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- Cloudflare Worker: `onoff-hero-preview`
- 배포 버전: `3ccfe463-1197-4f16-8da1-fc9969f81245`, 트래픽 100% 반영 확인.
- 직전 배포 버전: `bf23dd75-ecc7-4b80-8dc1-7d16e405b50c`
- 현재 이미지: `public/images/team-realistic-figurines-photoroom.png`
- 인물 크기: 최초 가로·세로의 35%. 카드 크기와 모션 설정은 유지.
- 앞서 로컬에서 수정한 보안 의존성과 필요할 때만 그리는 렌더링 최적화도 포함.
- 이번 배포를 위한 Git 커밋이나 원격 저장소 push는 하지 않음.

검증: 직전 단계의 성공한 빌드를 재사용. 타입 검사, 로딩 테스트 5개, 렌더링 테스트 7개 통과. 배포 후 홈·실제 누끼 PNG·페이지 JS·CSS의 HTTP 200 확인. 이미지·JS·CSS는 로컬 빌드와 SHA-256이 같고, JS와 CSS 모두 Photoroom 파일을 참조한다. 실제 브라우저 조작 검증은 수행하지 않았다. 로컬 5187 서버도 계속 실행 중이며 HTTP 200 확인.

## 나중에 캐릭터로 복원할 때

- 원본 캐릭터 이미지 `public/images/team-miniatures.png`를 그대로 보관하고 있다.
- `app/components/card-ribbon.tsx`의 atlas 요청과 `app/globals.css`의 `.fallback-visual` 이미지 경로를 `/images/team-miniatures.png`로 변경하면 두 화면을 함께 복원할 수 있다.
- 이미지 참조만 복원하면 보안 업데이트, 로딩 처리와 렌더링 최적화를 유지할 수 있다.
- 현재 인물 배치는 참고 카드에 맞춘 높이 `386`, 오른쪽 아래 정렬이며 이미지 경로와 별개다. 이전 `.35` 중앙 축소 설정은 최신 카드 구성으로 대체되었다. 캐릭터 복원 시 배치·크기도 바꿀지는 그때의 사용자 요청에 따른다.
- 사용자의 복원 요청 전에는 현재 배포 이미지를 유지한다.

배포 직전 관련 소스와 원본 이미지 해시, 배포 후 응답 확인 결과는 `outputs/deployment-2026-09-09-photoroom/`에 보관했다.
