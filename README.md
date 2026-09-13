# ON&OFF

브랜드 기획부터 디자인·웹사이트·마케팅·운영까지 소개하는 사이트다. React·TypeScript, Vinext·Vite, Tailwind CSS, Three.js와 Cloudflare Worker 구성을 사용한다.

현재 로컬 홈페이지는 **HOME → SYSTEM → DESIGN → WEB → MARKETING → SERVICES → TOGETHER**의 7개 섹션과 6개 면 전환이다. 마지막 메뉴명은 TOGETHER, 내부 주소 ID는 `film`이다. 다섯 서비스 상세와 프로젝트 문의 페이지를 제공한다. 자세한 현재 기준은 [문서 색인](docs/README.md)에 있다.

## 로컬 실행

Node 버전은 [.node-version](.node-version)의 24.19.0, 패키지 관리자는 npm이다. 새 체크아웃에서는 `npm ci`로 설치한다.

```powershell
npm run preview:node
```

주소는 http://localhost:5187 이다. [start-local.cmd](start-local.cmd)도 같은 명령을 실행한다. 이 PC는 Windows Application Control이 Cloudflare workerd를 차단하므로 Node/Vite로 UI를 미리 본다. Worker 바인딩과 실제 Cloudflare 런타임 검증은 별도다.

Cloudflare 로컬 런타임을 실행할 수 있는 환경에서는 다음 명령을 사용한다.

```powershell
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

이미 실행 중인 이 프로젝트 서버는 재사용한다. 5187을 다른 프로세스가 쓰면 임의 종료하거나 포트를 바꾸지 않는다. 로그·임시 출력은 Git에서 제외되는 `outputs/`에 둔다.

## 현재 동작과 콘텐츠

- 새 홈페이지 로드에서 글자별 네 번의 탄성 도약 → `&` 낙하·정렬 → 기존 워드마크 안착 → 카드·문구 등장으로 이어지는 약 5.8초(기존 대비 1.5배속) 3D 오프닝을 제공한다. 도킹과 카드 하강은 Ease Out이며 건너뛰기·움직임 감소·직접 섹션 주소·뒤로가기를 처리한다. [구현·참고·검증](docs/pages/HOME-OPENING-NOTES.md).
- TOGETHER가 보이고 화면 준비가 끝난 뒤 2.2초 후 구체적인 서비스 안내 말풍선과 프로젝트 문의 버튼 강조를 표시한다. 닫기·모션 중지·문의 페이지 연결을 제공한다. [문구·PC·모바일 검증](docs/reviews/OPENING-AND-INQUIRY-2026-09-13.md).
- 첫 화면 3D 카드, SYSTEM 은하, DESIGN 편집 지면, WEB 영상, MARKETING 광고 카드, SERVICES 목록, TOGETHER 브랜드 영상. 움직임 감소·MOTION OFF·화면 밖 정지·오류 대체 화면을 유지한다.
- 고정 링크는 **프로젝트 문의**로 이동한다. 상담톡은 `lib/consultation.ts`의 `consultationChatEnabled=false`로 숨기며 컴포넌트와 스타일은 보존한다.
- `/inquiry`는 입력·참고 링크를 Slack 메시지로 전달하며 실제 테스트 성공 응답을 확인했다. 최대 90일 보관과 담당 업무명·이메일을 안내하고 수집·이용/국외 처리위탁 동의를 따로 받는다. 웹훅과 현재 정책 버전이 없으면 접수를 잠근다. 파일 업로드·메일 자동 발송·DB는 추가하지 않았다. [연결과 검증](docs/operations/SLACK-INQUIRY.md), [로컬 산출물 정리](docs/operations/OUTPUTS.md).
- `/services/` 아래 `planning`, `design`, `web`, `marketing`, `operations`의 다섯 상세 경로를 제공한다. 금액·납기·수정 횟수는 확정하지 않고 상담 후 견적으로 안내한다.
- 포트폴리오와 인물은 가상 브랜드 시안·직무별 캐릭터다. 실제 고객 실적·직원·성과로 설명하지 않는다. 참고 사진과 글꼴의 출처·라이선스를 보존한다.
- 홈페이지의 부드러운 섹션 이동을 유지한다. 별도 페이지는 `PageLink`와 루트 `scroll-behavior:auto` 규칙으로 진입·뒤로가기·직접 해시를 처리한다.

## 디렉터리

| 위치 | 역할 |
| --- | --- |
| `app/` | 라우트, 제품 컴포넌트, CSS |
| `app/assets/` | Vite 해시 주소로 제공하는 미디어; `generated/`는 자동 생성 |
| `components/ui/`, `hooks/` | 공통 UI와 공유 훅 |
| `lib/` | 서비스 데이터·장면 수학·프레임 루프·복구·재생 정책 |
| `scripts/` | [검사·자산 생성 명령](scripts/README.md) |
| `tests/` | 상태·모션·복구 회귀 검사 |
| `docs/` | [페이지 기준·운영·검토·참고 문서](docs/README.md) |
| `design/` | 원본·프롬프트·제작 근거·해시·버전 이력 |
| `design/archive/public/` | public에서 분리한 과거 시안·비교 GIF·자산 기록 |
| `public/` | 공개 고정 자산·라이선스와 현재 팀·로고 원본 |
| `outputs/` | 로컬 로그·검증 결과·임시 도구; Git 제외 |

현재 팀 원본은 `public/images/team-realistic-figurines-v3-photoroom.png`다. `scripts/team-asset.config.mjs`의 설정으로 768×768 무손실 WebP를 만들며, 3D와 대체 카드가 같은 생성물을 사용한다. `predev`·`prebuild`·`preview:node`에서 자동 준비한다. 보관된 다른 실행 자산에는 현재 생성기의 입력도 있으므로 단순 미참조 검색으로 삭제하지 않는다.

## 검증과 배포

```powershell
npm run ci:build
```

`check`는 문서의 로컬 링크 경로·공개 자산 목록, 린트, 타입, 회귀 검사를 실행한다. `build`는 자산 준비·Vinext 빌드 후 배포 CSS와 글꼴·미디어 바이트, 보관 자료의 배포 제외를 검사한다. 두 단계는 `ci:build`에 포함된다. 문서 외부 URL·제목 앵커, 브라우저 조작, Cloudflare 런타임 검증을 자동으로 수행한다는 의미는 아니다.

`main` push는 기존 Cloudflare 자동 배포를 실행한다. 로컬 검토 중에는 push나 `npm run deploy`를 실행하지 않는다. Worker `onoff-hero-preview`, `.openai/hosting.json`, `vite.config.ts`를 보존한다. [자동 배포 절차](docs/operations/AUTO-DEPLOY.md)와 [날짜별 배포 이력](docs/operations/DEPLOYMENT-NOTES.md)을 구분하며, 과거 기록만으로 현재 운영 버전을 단정하지 않는다.

2026-09-13 전체 점검은 로컬에만 반영했다. [문제·수정·검증·후속 항목](docs/reviews/PROJECT-AUDIT-2026-09-13.md)에 작업을 기록한다. 커밋·GitHub push·운영 배포는 하지 않았다.
