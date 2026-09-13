# 슬랙 프로젝트 문의 접수

2026-09-13 최신 사용자 요청은 문의 내용을 슬랙 메시지로 받는 것이다. 이전 UI 미리보기·파일 선택 이력보다 이 문서가 우선한다. 실제 브라우저에서 테스트 문의 1건의 Slack 성공 응답을 확인한 뒤 전체 변경을 GitHub에 반영하고 운영 배포했다. 운영 API의 접수 활성·안내 버전과 두 secret 유지, 동의 없는 요청 거절을 확인했다. 상세 결과는 [배포 기록](DEPLOYMENT-NOTES.md)에서 확인한다.

## 현재 흐름

서비스 선택 → 프로젝트·담당자 입력 → 내용 확인 → 수집·이용 및 국외 처리위탁에 각각 동의 → 접수 결과를 표시한다. 전송 내용은 서비스, 요청 내용, 희망 예산·일정, 참고 링크, 회사·성함·이메일·선택 연락처다. 참고 자료는 공유 링크로 받으며 파일 선택·업로드는 제거했다. 메일 자동 발송·DB·R2·실시간 상담톡은 추가하지 않았다.

`GET /api/inquiry`는 사용 가능 여부와 안내 버전, 공개 수집·이용/국외 처리위탁 안내만 반환한다. 설정이 없거나 잘못되면 기존 미리보기와 이메일 문의를 유지하며 전송 버튼은 비활성이다. 로컬 설정은 완료돼 `enabled:true`, 안내 버전 `2026-09-13`이다. 회신 시간을 임의로 약속하지 않는다.

## 연결에 필요한 운영 정보

개인정보 안내는 [운영 기준](INQUIRY-PRIVACY-DRAFT.md)과 [공개 문구 원본](../../lib/inquiry-privacy.ts)에 정리했다. 사용자가 기간 선정을 위임해 최대 90일, 담당자는 실명 대신 온앤오프 프로젝트 문의 담당으로 안내한다. 확정 연락처는 jej4628@naver.com / 010-5838-6781이다. 무료 Slack의 채널별 자동 삭제는 지원되지 않는다. 기존 전체 보관 설정을 바꾸지 않고 매주 문의 채널에서 80일 이상 지난 기록·사본을 삭제하며, 목적 달성·삭제 요청은 더 일찍 처리한다.

사용자가 만든 `프로젝트-문의` 채널의 웹훅은 Git 제외 `.env.local`에 저장했다. 실제 값은 문서·로그·소스에 복사하지 않는다. 2026-09-13 19:44 KST에 가상 정보로 브라우저 문의폼을 제출했고 앱 HTTP 200/`delivered`, Slack HTTP 200/`ok` 성공 경로를 확인했다. 요청 ID는 `c2ef28bf-3a7a-47f9-8ae2-8dc2b5b545e8`이다. Slack 화면 열람은 하지 않았으므로 실제 채널 UI까지 확인했다고 설명하지 않는다.

| 서버 환경변수 | 의미 |
| --- | --- |
| `SLACK_INQUIRY_WEBHOOK_URL` | 문의를 받을 채널에 연결한 Slack Incoming Webhook 비밀 URL |
| `INQUIRY_PRIVACY_VERSION` | 공개 정책 원본과 일치하는 버전. 현재 `2026-09-13` |

두 값이 모두 유효해야 실제 전송 UI가 열린다. 두 안내 문구는 소스 한 곳에서 관리하며 구버전 동의로 전송하지 않는다. 이전 `INQUIRY_PRIVACY_NOTICE` 전체 문구 환경변수는 버전 설정으로 교체했다. URL은 표준 `https://hooks.slack.com/services/…/…/…` 형태만 허용한다. 채널은 웹훅 생성 시 정하며 방문자가 바꾸지 못한다. 웹훅 URL에는 비밀이 포함된다. [Slack 공식 연결 안내](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/).

로컬 Node/Vite에서는 Git 제외된 `.env.local`에 설정한 뒤 **이 프로젝트의** 5187 서버를 다시 시작한다. 현재 서버 PID는 14112, 로그는 `outputs/runtime/2026-09-13/preview-server*.log`다. 값 없이 테스트하려면 `npm run test:ui-state`를 사용한다. 테스트는 주입한 모의 fetch만 호출하며 Slack에 접속하지 않는다. 운영 연결은 별도 배포 요청 때 기존 Worker의 런타임 환경에 설정한다. 비밀을 `VITE_`·`NEXT_PUBLIC_` 변수, 소스, 문서, 빌드 설정에 넣지 않는다. 기존 `nodejs_compat`와 compatibility date에서 제공하는 서버 `process.env`를 사용하며 Cloudflare 모듈 import를 추가하지 않았다. [Cloudflare process 환경변수 설명](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/).

## 구현과 오류 처리

- [route.ts](../../app/api/inquiry/route.ts)는 서버 설정을 읽는다. [inquiry-delivery.ts](../../lib/inquiry-delivery.ts)는 입력 검증과 Slack 전송, [project-inquiry.tsx](../../app/components/project-inquiry.tsx)는 입력·검토·상태 표시를 담당한다.
- POST는 같은 Origin, JSON, 실제 스트림 기준 32KiB 이하, 전체 필드 타입·길이·허용값, 두 동의와 정책 버전, UUID 요청 ID를 검사한다. 브라우저 검증을 우회해도 서버에서 다시 검사한다.
- 고객 입력은 Slack `plain_text` 블록에 담는다. 3,000자 설명은 별도 블록이며 `<!channel>` 같은 입력을 채널 알림 문법으로 해석하지 않는다. [Slack 텍스트 블록 규칙](https://docs.slack.dev/reference/block-kit/composition-objects/text-object/).
- 서버 응답은 `no-store`, 비밀 주소·문의 원문·상위 서버 오류 내용을 응답이나 로그에 남기지 않는다. 브라우저 공개 빌드에도 서버 환경변수명과 전송 모듈이 포함되지 않는지 확인했다.
- Slack HTTP 200과 `ok` 응답일 때만 완료 표시한다. 타임아웃은 8초이며 네트워크 오류·응답 불명은 접수 여부 확인 안내와 이메일 링크를 제공한다. 자동 재전송하지 않는다. Slack 메시지에 접수 시각·요청 ID·동의한 안내 버전을 기록한다.
- 더블 클릭을 즉시 잠그고 같은 작성 내용은 같은 요청 ID를 사용한다. 같은 isolate의 임시 메모리에서 ID·본문 SHA-256·결과 상태를 최대 1,024개, 10분 보관해 중복을 억제한다. 원문 저장소나 조회 가능한 영구 접수 번호가 아니다.
- Cloudflare 요청 메타데이터가 있는 경우에만 실제 연결 주소의 SHA-256으로 1분 3회 보조 제한을 적용한다. Node는 전달 헤더를 신뢰하지 않는다. 이 메모리 방식은 여러 isolate·재시작을 아우르는 분산 중복 방지나 스팸 차단을 보장하지 않는다. Slack에 전달된 정보는 해당 워크스페이스의 운영 정책을 따른다.

## 검증

[서버 테스트](../../tests/inquiry-delivery.test.mjs) 16개에서 정상 전송, 필드·본문 검증, Slack 문법 입력, 구성 누락, 비밀 노출, 상위 서버 실패, 응답 본문 지연, 8초 제한 경로, 동시 중복·TTL·크기 제한·CF 주소 정책을 모의 응답으로 검증했다.

375×812 Chromium에서 개발/운영 빌드 각각 성공·거절·응답 불명 3경로를 API 가로채기로 검증했다. 동의 전 비활성, 더블 클릭당 요청 1회, 성공 후 재전송 잠금, 명확한 실패의 수동 재시도, 불명 상태의 이메일 확인, 가로 넘침 0을 확인했다. 위 첫 검증은 모의 API만 사용했다. 후속으로 1440×900·375×812·320×640에서 두 동의 전 차단, 정책 버전 전송, 중복 요청 1회, 가로 넘침 0과 콘솔 오류 0을 확인했다. 이후 사용자 승인으로 실제 Slack 테스트 1건을 전송해 성공 응답을 확인했다. 운영 Worker 상태는 배포 후 별도로 확인한다.

로컬 증거는 Git 제외 `outputs/maintenance-2026-09-13/`에 보관한다. 전체 후속 결과는 [개선 기록](../reviews/MAINTENANCE-2026-09-13.md)을 따른다.
