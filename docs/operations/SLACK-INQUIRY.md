# 슬랙 프로젝트 문의 접수

2026-09-13 최신 사용자 요청은 문의 내용을 슬랙 메시지로 받는 것이다. 이전 UI 미리보기·파일 선택 이력보다 이 문서가 우선한다. 로컬 Node 미리보기의 실제 브라우저에서 테스트 문의 1건의 Slack 성공 응답을 확인한 뒤 전체 변경을 GitHub에 반영하고 운영 배포했다. 당시 운영 API는 접수 활성·안내 버전·두 secret 유지와 동의 없는 요청 거절까지 확인했으며, 성공하는 운영 POST는 확인하지 않았다. 아래 오류 후속과 [배포 기록](DEPLOYMENT-NOTES.md)이 최신 상태다.

## 2026-09-13 최신 알림 양식 개선

사용자가 실제 수신 메시지를 확인한 뒤 현업에서 읽고 처리하기 좋은 양식으로 정리하고 배포하도록 요청했다. 새로 접수되는 알림에 적용하며, 이미 전송된 메시지는 수정하지 않는다.

- 헤더는 `ON&OFF | 신규 프로젝트 문의`, 바로 아래에는 `홈페이지 접수 · 2026.09.13 20:47:20 (한국시간)`처럼 표시한다. 서버 위치와 관계없이 `Asia/Seoul` 기준이며 연말·자정 경계를 검증한다.
- 회사·브랜드, 문의자, 이메일, 연락처의 표제를 굵게 구분한다. 외부 문의자를 내부 배정 담당자와 혼동하지 않게 표시하고, 전화 미기재 시 이메일 회신을 안내한다.
- 희망 서비스는 전체 폭, 희망 예산·희망 일정은 두 열이다. 예산 기준은 금액 아래에 놓으며, `상담 후 결정`일 때 불필요한 기준을 붙이지 않는다. 확정 견적·납기나 회신 기한으로 표현하지 않는다.
- 문의 본문은 구분선 아래에 독립 배치해 최대 3,000자와 원래 줄바꿈을 보존한다. 이메일은 명시적 mailto 링크, 참고란 전체가 올바른 HTTP(S) URL일 때만 원문을 보이는 링크로 제공한다. 여러 URL·메모·불명확한 주소는 리터럴로 보존한다. 별도의 인터랙션 서버가 필요한 버튼은 추가하지 않는다.
- 동의 두 항목·안내 버전·최대 90일과 조기 삭제·전체 접수 ID는 하단 보조 글자로 분리한다. 기존 수집 범위와 보관 운영은 바꾸지 않는다.
- 표제와 고객 입력을 분리한 [rich text](https://docs.slack.dev/reference/block-kit/blocks/rich-text-block/), [두 열 section](https://docs.slack.dev/reference/block-kit/blocks/section-block/), [context](https://docs.slack.dev/reference/block-kit/blocks/context-block/)를 사용한다. 화면 읽기 프로그램에도 전체 내용을 제공하도록 최상위 대체 텍스트를 포함한다. 대체 텍스트의 `&<>`는 이스케이프하고 Markdown·자동 파싱을 끈다. [Slack 접근성 기준](https://docs.slack.dev/block-kit/#accessibility-considerations).

서버 테스트는 18개로 확장했다. 연말의 한국시간 날짜 변경, 본문 3,000자, 특수문자·멘션 입력, 이메일 별칭, URL/메모 구분과 블록 제한을 확인한다. 로컬 API에서 새 양식의 가상 문의 1건을 실제 Slack으로 보내 HTTP 200/`delivered`를 확인했다(`2026-09-13T11:55:38.353Z`, 요청 ID `50a88519-3100-437e-97e5-d31127da7b6b`). 이는 Slack의 HTTP 200/`ok` 수신 검증이며 채널 화면 직접 열람과 구분한다. 샘플 payload·전체 빌드 로그·운영 배포 및 전송 확인 기록은 Git 제외 `outputs/deploy/2026-09-13/slack-message-format/`에 보관한다.

## 2026-09-13 운영 문의 502 후속 — 배포·실제 접수 성공 확인

- 사용자 오류 신고 후 운영 문의 POST가 8ms·13ms에 HTTP 502를 반환하는 현상을 확인했다. 8초 제한에 도달한 실패가 아니며 화면에는 접수 여부를 확인하지 못했다는 안내가 표시됐다.
- Cloudflare의 [workerd 요청 생성 코드](https://github.com/cloudflare/workerd/blob/main/src/workerd/api/http.c%2B%2B#L447)는 `redirect: 'error'`를 요청 생성 단계에서 무조건 거절한다. 로컬 Node의 실제 Slack 성공은 이 운영 런타임 차이를 검증하지 못했다.
- 전송 옵션을 `redirect: 'manual'`로 바꾸고 API route는 `(input, init) => fetch(input, init)` 래퍼로 전송 함수를 주입한다. 자동 리디렉션을 따르지 않으며 기존 HTTP 200/`ok`만 성공하는 기준을 유지한다. 301·302·307·308 거절 검증을 기존 서버 테스트에 추가했다.
- `npm run ci:build`의 137개 검사·린트·타입·빌드·CSS/자산 검사를 통과한 코드 `052822586bfeb74884c2d0dfd724565d707da8d6`가 운영 Worker `d49c8001-fced-40b7-9354-2b1c50e1dedd`에 100% 배포됐다.
- 실제 운영 테스트 POST 2건의 HTTP 200을 확인했다. 첫 요청은 자동화 연결이 끊겨 운영 로그만 확보했다. 두 번째 가상 테스트는 HTTP 200/`ok:true`/`delivered`, POST 1회, 1440×900의 접수 완료 문구·비활성 버튼 캡처까지 확보했다. 요청 ID는 `6ada2ac0-19ed-4798-bebd-5de56b3cf0b4`다.
- 375px·320px로 크기를 바꾼 후에도 완료 DOM이 유지되고 가로 넘침이 없었다. 실제 모바일 기기나 Slack 채널 UI를 열람한 검증은 아니다. 기존 실제 성공 1건은 로컬 테스트였고 종전 운영 검증이 GET 200/POST 400에 한정됐다는 이력은 보존한다. 배포·요청별 시각과 증거는 [배포 기록](DEPLOYMENT-NOTES.md)에 정리했다.

## 현재 흐름

최종 전체 검사에서 일부 브라우저의 `crypto.randomUUID()`·`AbortSignal.timeout()` 미지원 시 전송 전 오류가 나거나 전송 중 상태가 풀리지 않는 문제를 재현해 수정했다. ID는 `lib/inquiry-request-id.ts`의 네이티브 UUID 또는 `crypto.getRandomValues()` 기반 UUIDv4로 생성하고, 전송 제한은 `AbortController`와 15초 타이머로 처리한다. 전송 전 준비 실패는 닫기·수정이 가능하며 실제 요청 후 결과 불명은 기존 이메일 확인·재전송 잠금을 유지한다. 접수 ID 표시와 서버 정책은 변경하지 않았다. PC·모바일에서 API 미지원·난수 실패·네트워크 실패·더블 클릭 10조건을 모의 POST로 확인했으며 이번 호환성 검사에서는 Slack 테스트 메시지를 추가 전송하지 않았다. [최종 검사](../reviews/FINAL-AUDIT-2026-09-13.md).

서비스 선택 → 프로젝트·담당자 입력 → 내용 확인 → 수집·이용 및 국외 처리위탁에 각각 동의 → 접수 결과를 표시한다. 전송 내용은 서비스, 요청 내용, 희망 예산·일정, 참고 링크, 회사·성함·이메일·선택 연락처다. 참고 자료는 공유 링크로 받으며 파일 선택·업로드는 제거했다. 메일 자동 발송·DB·R2·실시간 상담톡은 추가하지 않았다.

`GET /api/inquiry`는 사용 가능 여부와 안내 버전, 공개 수집·이용/국외 처리위탁 안내만 반환한다. 설정이 없거나 잘못되면 기존 미리보기와 이메일 문의를 유지하며 전송 버튼은 비활성이다. 로컬 설정은 완료돼 `enabled:true`, 안내 버전 `2026-09-13`이다. 회신 시간을 임의로 약속하지 않는다.

## 연결에 필요한 운영 정보

개인정보 안내는 [운영 기준](INQUIRY-PRIVACY-DRAFT.md)과 [공개 문구 원본](../../lib/inquiry-privacy.ts)에 정리했다. 사용자가 기간 선정을 위임해 최대 90일, 담당자는 실명 대신 온앤오프 프로젝트 문의 담당으로 안내한다. 확정 연락처는 jej4628@naver.com / 010-5838-6781이다. 무료 Slack의 채널별 자동 삭제는 지원되지 않는다. 기존 전체 보관 설정을 바꾸지 않고 매주 문의 채널에서 80일 이상 지난 기록·사본을 삭제하며, 목적 달성·삭제 요청은 더 일찍 처리한다.

사용자가 만든 `프로젝트-문의` 채널의 웹훅은 Git 제외 `.env.local`에 저장했다. 실제 값은 문서·로그·소스에 복사하지 않는다. 2026-09-13 19:44 KST에 가상 정보로 로컬 Node 미리보기의 브라우저 문의폼을 제출했고 앱 HTTP 200/`delivered`, Slack HTTP 200/`ok` 성공 경로를 확인했다. 요청 ID는 `c2ef28bf-3a7a-47f9-8ae2-8dc2b5b545e8`이다. 운영 Worker에서 전송한 결과가 아니며, Slack 화면도 열람하지 않았으므로 실제 채널 UI까지 확인했다고 설명하지 않는다.

| 서버 환경변수 | 의미 |
| --- | --- |
| `SLACK_INQUIRY_WEBHOOK_URL` | 문의를 받을 채널에 연결한 Slack Incoming Webhook 비밀 URL |
| `INQUIRY_PRIVACY_VERSION` | 공개 정책 원본과 일치하는 버전. 현재 `2026-09-13` |

두 값이 모두 유효해야 실제 전송 UI가 열린다. 두 안내 문구는 소스 한 곳에서 관리하며 구버전 동의로 전송하지 않는다. 이전 `INQUIRY_PRIVACY_NOTICE` 전체 문구 환경변수는 버전 설정으로 교체했다. URL은 표준 `https://hooks.slack.com/services/…/…/…` 형태만 허용한다. 채널은 웹훅 생성 시 정하며 방문자가 바꾸지 못한다. 웹훅 URL에는 비밀이 포함된다. [Slack 공식 연결 안내](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/).

로컬 Node/Vite에서는 Git 제외된 `.env.local`에 설정한 뒤 **이 프로젝트의** 5187 서버를 다시 시작한다. 현재 서버 PID는 14112, 로그는 `outputs/runtime/2026-09-13/preview-server*.log`다. 값 없이 테스트하려면 `npm run test:ui-state`를 사용한다. 테스트는 주입한 모의 fetch만 호출하며 Slack에 접속하지 않는다. 운영 연결은 별도 배포 요청 때 기존 Worker의 런타임 환경에 설정한다. 비밀을 `VITE_`·`NEXT_PUBLIC_` 변수, 소스, 문서, 빌드 설정에 넣지 않는다. 기존 `nodejs_compat`와 compatibility date에서 제공하는 서버 `process.env`를 사용하며 Cloudflare 모듈 import를 추가하지 않았다. [Cloudflare process 환경변수 설명](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/).

## 구현과 오류 처리

- [route.ts](../../app/api/inquiry/route.ts)는 서버 설정을 읽는다. [inquiry-delivery.ts](../../lib/inquiry-delivery.ts)는 입력 검증과 Slack 전송, [project-inquiry.tsx](../../app/components/project-inquiry.tsx)는 입력·검토·상태 표시를 담당한다.
- POST는 같은 Origin, JSON, 실제 스트림 기준 32KiB 이하, 전체 필드 타입·길이·허용값, 두 동의와 정책 버전, UUID 요청 ID를 검사한다. 브라우저 검증을 우회해도 서버에서 다시 검사한다.
- 고객 입력은 Slack `rich_text`의 리터럴 `text` 또는 `plain_text`에 담는다. 자유 입력을 Markdown 문자열에 삽입하지 않으며 3,000자 설명은 별도 블록이다. `<!channel>` 같은 입력을 채널 알림 문법으로 해석하지 않는다. [Slack 텍스트 블록 규칙](https://docs.slack.dev/reference/block-kit/composition-objects/text-object/).
- 서버 응답은 `no-store`, 비밀 주소·문의 원문·상위 서버 오류 내용을 응답이나 로그에 남기지 않는다. 브라우저 공개 빌드에도 서버 환경변수명과 전송 모듈이 포함되지 않는지 확인했다.
- Slack HTTP 200과 `ok` 응답일 때만 완료 표시한다. 타임아웃은 8초이며 네트워크 오류·응답 불명은 접수 여부 확인 안내와 이메일 링크를 제공한다. 자동 재전송하지 않는다. Slack 메시지에 접수 시각·요청 ID·동의한 안내 버전을 기록한다.
- 더블 클릭을 즉시 잠그고 같은 작성 내용은 같은 요청 ID를 사용한다. 같은 isolate의 임시 메모리에서 ID·본문 SHA-256·결과 상태를 최대 1,024개, 10분 보관해 중복을 억제한다. 원문 저장소나 조회 가능한 영구 접수 번호가 아니다.
- Cloudflare 요청 메타데이터가 있는 경우에만 실제 연결 주소의 SHA-256으로 1분 3회 보조 제한을 적용한다. Node는 전달 헤더를 신뢰하지 않는다. 이 메모리 방식은 여러 isolate·재시작을 아우르는 분산 중복 방지나 스팸 차단을 보장하지 않는다. Slack에 전달된 정보는 해당 워크스페이스의 운영 정책을 따른다.

## 검증

[서버 테스트](../../tests/inquiry-delivery.test.mjs) 18개에서 정상 전송, 알림 구성·한국시간·링크, 필드·본문 검증, Slack 문법 입력, 구성 누락, 비밀 노출, 상위 서버 실패, 응답 본문 지연, 8초 제한 경로, 동시 중복·TTL·크기 제한·CF 주소 정책을 모의 응답으로 검증했다.

375×812 Chromium에서 개발/운영 빌드 각각 성공·거절·응답 불명 3경로를 API 가로채기로 검증했다. 동의 전 비활성, 더블 클릭당 요청 1회, 성공 후 재전송 잠금, 명확한 실패의 수동 재시도, 불명 상태의 이메일 확인, 가로 넘침 0을 확인했다. 위 첫 검증은 모의 API만 사용했다. 후속으로 1440×900·375×812·320×640에서 두 동의 전 차단, 정책 버전 전송, 중복 요청 1회, 가로 넘침 0과 콘솔 오류 0을 확인했다. 이후 사용자 승인으로 로컬 실제 Slack 테스트 1건을 전송해 성공 응답을 확인했다. 운영 오류 수정 후 실제 Worker POST 2건과 두 번째 요청의 완료 UI 확인은 위 최신 후속에 별도로 기록했다.

로컬 증거는 Git 제외 `outputs/maintenance-2026-09-13/`에 보관한다. 전체 후속 결과는 [개선 기록](../reviews/MAINTENANCE-2026-09-13.md)을 따른다.
