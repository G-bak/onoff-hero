# 검사와 자산 생성 명령

모든 명령은 프로젝트 루트에서 실행한다. 새 이미지 생성이나 영상 변환은 정상 개발·빌드의 필수 단계가 아니다. Node 버전은 `.node-version`을 따른다. 기존 스크립트 위치는 상대 import와 원본 경로의 안정성을 위해 유지한다.

## 자동 실행·검사

| 명령/파일 | 역할 |
| --- | --- |
| `npm run prepare:assets` | `team-asset.config.mjs`의 원본을 768×768 무손실 WebP로 검증·생성 |
| `npm run preview:node` | workerd 차단 환경에서 5187 UI 미리보기 |
| `npm run check:repository` | 링크 parser 회귀 검사, Markdown 로컬 경로·제목 앵커·로컬 전용 경로 금지·공개 파일 목록 검사 |
| `npm run check:links` | 명시적인 외부 HTTP 링크 응답 검사. 401/403/429·네트워크 실패는 미확인, GET 확인404/410만 실패 |
| `npm run check` | 저장소 검사·린트·타입·전체 회귀 검사 |
| `npm run test:seo` | 페이지 URL·구조화 데이터·인증값·www 주소 이동 회귀 검사 |
| `npm run check:seo -- https://on-onf.com` | 운영 HTTP·SSR 메타데이터·사이트맵·robots·404·www 이동 검사. 인수를 생략하면 로컬5187 |
| `npm run build` | 자산 준비·Vinext 빌드·`check-production-css.mjs`·`check-production-assets.mjs` |

팀 생성물은 `app/assets/generated/`에 두고 Git에서 제외한다. 그 외 승인된 실행 자산은 저장소에 보관한다. public에 공개 파일을 추가할 때는 실제 서비스 용도인지 확인하고 `public-assets.config.json`도 갱신한다. 프롬프트·검토 출력·비교 GIF는 `design/` 또는 `outputs/`에 둔다.

## 현재 자산 수동 재생성

| 명령 | 입력·정책 |
| --- | --- |
| `npm run prepare:galaxy-crew` | [SYSTEM v3](../design/galaxy-crew/README.md); v2 팔 올리기 프레임도 필요 |
| `node scripts/prepare-opening-font.mjs` | [HOME 오프닝](../docs/pages/HOME-OPENING-NOTES.md); 설치 Montserrat 700의 원본 O/N/&/F 윤곽·구멍·상하좌우 경계를 검증해 실행 JSON 생성 |
| `node scripts/prepare-design-assets.mjs` | [DESIGN 브랜드 v2](../design/design-showcase/v2/README.md); `--legacy`는 이전 추상 시안 |
| `node --experimental-strip-types scripts/prepare-designer-v4.mjs` | [DESIGN 춤 v4](../design/people-motion/v4/README.md) |
| `node --experimental-strip-types scripts/prepare-web-person-v5.mjs` | [WEB 쓰기 v5](../design/people-motion/v5/README.md) |
| `npm run prepare:marketing` | 현재 채널 사진·포스터와 마케터 받침대 제거; [v3](../design/marketing/v3/README.md), [v2 입력](../design/marketing/v2/README.md) |
| `node scripts/prepare-brand-assets.mjs` | 회사 로고 원본에서 헤더·흰 배경32/64px PNG·16/32/48/64px ICO 파비콘 생성 |
| `prepare-web-film.mjs`, `prepare-brand-film.mjs` | 사용자 원본과 외부 FFmpeg 경로 필요. [WEB 영상](../design/web-showcase/README.md), [마무리 영상](../design/brand-film/README.md) |

비교 GIF는 `design/archive/public/images/`에, 페이지가 사용하는 WebP는 기존 `app/assets/`에 출력한다. 마케터 v2는 이전 `marketer-sprite.webp`와 보관 마스크를 입력으로 사용한다. 이 원재료를 만드는 `prepare-marketing-assets.mjs`는 과거 자산도 함께 쓰므로 일상 빌드에서 실행하지 않는다.

## 역사 자료 전용

`npm run prepare:why-person`은 폐기된 매듭 장면의 지휘자 생성 명령이다. 현재 SYSTEM은 `prepare:galaxy-crew`를 사용한다. 기존 명령은 과거 재현용으로 보존한다.

`prepare-why-person`, `prepare-why-universe-person`, `prepare-card-showcase`, `prepare-presenter-assets`, `prepare-motion-v2`, `prepare-groove-assets`, `prepare-writing-assets`, `prepare-web-person-v4`, `render-marketing-video`, `build-wordmark-font`는 과거 시안 재현용이다. 같은 이름의 `.mjs`를 가리킨다. `crew-sheet`, `person-motion-chroma`, `writing-strokes`는 생성기의 보조 모듈이다.

과거 보간·영상 명령에는 FFmpeg 등 외부 도구가 필요하고, 기본 `outputs/` 도구 경로는 새 체크아웃에 없다. 필요한 실행 파일의 위치를 해당 스크립트 인수로 전달한다. 거절된 동작·시안을 현재 사이트에 다시 연결하지 않는다. 이전 글자 지오메트리 JSON은 `design/archive/public/fonts/`에 쓰되 라이선스는 public에 유지한다.
