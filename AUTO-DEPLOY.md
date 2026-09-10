# GitHub 자동 배포 설정

기존 Cloudflare Worker `onoff-hero-preview`를 GitHub의 `G-bak/onoff-hero` 저장소에 연결한다. `main`에 push하면 검사·빌드가 성공한 버전만 현재 사이트에 배포하는 구성이다.

## 현재 상태

2026-09-10에 GitHub 앱의 `onoff-hero` 접근 권한을 추가한 뒤 기존 Worker에 연결했다. 현재 `main` push를 받는 운영 트리거가 활성화돼 있다. 빌드 명령은 `npm run ci:build`, 배포 명령은 `npx wrangler deploy --config dist/server/wrangler.json`이다. 비운영 브랜치 미리보기 빌드는 비활성화했다.

앞서 발생했던 저장소 접근 오류 `8000012`는 접근 권한 추가로 해결됐다. 배포 토큰은 Cloudflare Workers Builds에서 관리한다. 이 저장소를 다시 연결할 때만 아래 최초 연결 절차를 사용한다.

최초 연결 검증: Git에 포함할 파일만 별도 빈 디렉터리에 내보낸 뒤 `npm ci`와 `npm run ci:build`를 실행했다. 타입 검사, 로딩 테스트 5개, 렌더링 테스트 7개, 빌드와 배포 CSS 검사에 모두 통과했다. 기존 로컬 서버는 유지했다.

현재 검사 구성: `ci:build`의 첫 단계에 린트(경고도 실패)를 연결했고 글꼴·공용 상태·3D 복구·섹션 전환 테스트와 배포 자산 검사도 포함했다. 수동 `npm run deploy` 역시 같은 검사 후 배포한다. 기존 원격 트리거가 이 명령을 실행하므로 별도 설정 변경은 필요 없다. [검사와 예외 기록](LINT-NOTES.md), [3D 복구 검증](RECOVERY-NOTES.md).

2026-09-10 반영 묶음: WHY 섹션, 오른쪽으로 기울며 위로 넘어가는 전환, 스크롤 진행률에 따른 공통 메뉴 표시, 로딩 종료 시 스크롤바 공간 유지와 기존 안정성 수정을 함께 반영한다. 로컬에서 린트·타입 검사·테스트 38개·프로덕션 빌드·CSS/자산 검사를 통과했고, 실제 스크롤바를 표시한 Chrome에서 느린 자산 로딩·직접 WHY 진입·모바일·움직임 감소·WebGL 대체 화면·JavaScript 미사용을 확인했다. 운영 반영 여부는 해당 커밋의 Cloudflare Builds 결과와 실제 사이트를 기준으로 확인한다. [2페이지와 전환 기록](PAGE2-NOTES.md).

## 최초 연결

1. Cloudflare 대시보드에서 **Workers & Pages → onoff-hero-preview → Settings → Builds → Connect**를 연다.
2. GitHub 계정 **G-bak**, 저장소 **onoff-hero**를 선택한다. 저장소가 보이지 않으면 Cloudflare GitHub App의 접근 대상에 이 저장소를 추가한다.
3. 다음 값을 설정하고 연결한다.

| 항목 | 값 |
| --- | --- |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm run ci:build` |
| Deploy command | `npx wrangler deploy --config dist/server/wrangler.json` |
| Non-production branch builds | 비활성화 |
| Node.js | `.node-version`의 `24.19.0` |
| API token | Cloudflare의 Builds에서 생성·보관하는 배포 토큰 |

Cloudflare의 기본 의존성 설치와 저장소의 `package-lock.json`을 사용한다. 빌드에 개발 의존성이 필요하므로 설치 단계에 `NODE_ENV=production` 또는 `NPM_CONFIG_PRODUCTION=true`를 설정하지 않는다. 현재 프로젝트는 D1·R2를 사용하지 않는다.

이 프로젝트는 Vite의 Cloudflare 플러그인이 `dist/server/wrangler.json`을 생성하므로 배포 명령의 `--config` 경로를 그대로 사용한다. 이 설정의 Worker 이름은 기존 `onoff-hero-preview`와 일치한다.

## 연결 후 확인

- 첫 빌드를 실행하거나 `main`에 변경을 push한다.
- Cloudflare Builds에서 GitHub의 최신 커밋 SHA와 빌드 성공을 확인한다.
- 배포가 기존 주소 `https://onoff-hero-preview.ajdhfbx1836203.workers.dev`에 반영됐는지 확인한다.
- 이후에는 변경을 커밋하고 `main`에 push한다. 로컬 검사 구성 반영 후에는 린트·타입·테스트·빌드·CSS/자산 검사 중 하나라도 실패하면 배포 단계가 실행되지 않는다.

배포 인증 정보는 Cloudflare에 보관하며 저장소에 기록하지 않는다. GitHub Actions의 별도 배포 워크플로는 만들지 않아 중복 배포를 방지한다.

## 로컬에서 같은 검사 실행

```sh
npm ci
npm run ci:build
```

수동 배포가 필요하면 기존 `npm run deploy`를 사용할 수 있다. 평소에는 변경을 커밋하고 `main`에 push하여 자동 배포한다.

참고: [Cloudflare Git 연결](https://developers.cloudflare.com/workers/ci-cd/builds/), [빌드 설정](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [Node 버전 설정](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).
