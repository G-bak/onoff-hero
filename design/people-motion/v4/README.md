# 현재 DESIGN / 이전 WEB 인물 — 원본 기준, 실제 포즈 반복

WEB은 후속 요청으로 [v5의 새 칠판·WEB 쓰기](../v5/README.md)로 교체했다. 아래 WEB의 작은 윤곽 필기와 SVG 마스크는 이전 기록이며 현재 런타임에서 사용하지 않는다. DESIGN의 아래 기준은 현재도 유지한다.

2026-09-12 최신 사용자 지시: 5페이지 마케터처럼 원본에 가깝게 만들고 같은 제작 방식으로 재생한다. DESIGN은 팔꿈치를 굽혔다 펴며 양손을 적당한 폭으로 위아래로 흔든다. DESIGN과 WEB의 원통 받침대는 제거한다. 두 페이지 모두 반복하며, 마지막 자세 유지는 SYSTEM에만 적용한다. OS 움직임 감소 설정은 모든 장면에서 별도의 정적 대체 화면을 제공한다.

## 직접 참고한 원본

최초 `public/images/team-realistic-figurines-v3-photoroom.png`의 실제 인물을 주 참조로 사용했다. 1254×1254 원본 중 DESIGN은 x836/y0/418×627, WEB은 x418/y627/418×627 영역이다. 중간에 재생성한 SYSTEM/v3 인물 시트를 주 참조로 쓰지 않았다. 보조는 `design/marketing/marketer-poses.png`와 그 프롬프트, 5페이지 실제 브라우저 재생이다.

DESIGN의 길고 넉넉한 아이보리 셔츠·비대칭 밑단·낮게 묶은 머리·차콜 바지·회색/크림 운동화, WEB의 긴 리브 니트 카디건·큰 단추·흰 티·안경·층진 단발·넉넉한 바지·오프화이트 신발을 기준으로 했다. 바닥판 제거는 두 인물에만 적용하며 SYSTEM과 MARKETING의 승인된 자산은 수정하지 않는다.

## 생성물과 정확한 프롬프트

모두 내장 ImageGen의 identity-preserve 생성/편집이며 CLI/API 생성은 사용하지 않았다.

- DESIGN: `designer/source.png`(1536×1024, 4×2), `designer/prompt.txt`, `designer/source-review.md`, 실제 분리한 `designer/frames/0..7.png`.
- WEB: `web/source.png`(1536×1024, 4×2), `web/prompt.txt`. 첫 원본의 마지막 포즈만 몸 방향이 갑자기 바뀌어 `web/correction.png`, `web/correction-prompt.txt`로 수정했다. 원본의0~6번은 보존하고 수정 시트의7번만 채택했다. `web/source-review.md`, `web/frames/0..7.png`, 실제 손끝·칠판 영역은 `web/tip-guides.json`.

## 5페이지와 같은 제작·재생 방식

광학 흐름, MCI, 얼굴/몸 합성 보간과 CSS 몸 회전을 사용하지 않는다. 생성된8포즈의 실제 픽셀을 분리하고 한 배율로 정렬해 WebP 스트립과 GIF로 만든다. DESIGN은 발 위치, WEB은 칠판 기준점을 사용하며 개별 포즈의 체형을 다시 늘이거나 줄이지 않는다.

DESIGN은 손을 머리 가까이 당기는 끝부분0~1번 포즈만 제외한다. 0~3번을 모두 뺀 시도는 팔을 너무 적게 내려 사용자 피드백에 따라 수정했다. 현재는2→3→4→5→6→7→6→5→4→3→2의11단계 왕복, 한 주기1120ms다. 2·3번의 팔을 내리는 구간을 복원하고 각 포즈의 표시 시간은 유지했다. 최초 표시·움직임 감소·JavaScript 없는 화면도2번 포즈다. 원본8포즈 시트는 보존하며 제외한 포즈는 실제 재생 순서와 GIF에서만 뺀다. 5페이지처럼 실제 포즈별 시간표를 사용한다. 최상단 손이 원본 셀 가장자리에 가까웠지만 손 픽셀은 잘리지 않았고 최종 프레임에는 여백을 확보했다.

WEB은8개 포즈의1320ms 반복이다. 첫 주기에는 실제 분필 끝 지점을 따라 둥근 윤곽을 누적하고, 이후에는 그린 표식을 유지하면서 같은 필기 동작을 반복한다. 글자가 새로 쓰인다고 주장하지 않는다. 이미 그린 선이 소매나 손 위에 보이지 않도록 프레임별 칠판 표면 마스크를 사용한다. 큰 카메라 회전이나 마지막→처음의 강제 뒤집기는 없다. 손의 동작 범위는 최초 계획보다 넓어졌지만 원본의 인물 방향과 반복 연결을 우선해 실제 화면에서 검토했다.

`lib/person-motion.ts`가 GIF와 사이트의 포즈·시간표를 공유한다. `PersonMotion`은 마케터와 같은 `createSceneFrameLoop`를 사용하고, 포즈가 바뀔 때만 시트 위치를 갱신한다. 인물과 프레임별 SVG 필기는 같은 시트 안에 있어 서로 다른 타이머를 쓰지 않는다. 첫 주기와 이후 주기의 그림 상태만 다를 뿐 실제 인물 포즈는 동일한8개다. GIF는 그리기가 끝난 뒤의 반복 구간을 미리 보여준다.

MOTION OFF·탭 숨김·화면 밖·앞면에 가려짐·inert에서는 프레임 예약을 중지하고 현재 시간/자세를 보존한다. 다시 보이면 이어서 반복한다. 이미지와 마스크가 준비되기 전에는 진행하지 않으며, SVG 이미지가 HOME의 React 초기화 전에 캐시되어도 준비 상태를 확인한다. 움직임 감소는 정지 자세이며 실제 영상은 사용자 재생 조작을 유지한다.

## 파일과 재생성

```powershell
node --experimental-strip-types scripts/prepare-designer-v4.mjs
node --experimental-strip-types scripts/prepare-web-person-v4.mjs
```

실행 자산은 `app/assets/people-motion/designer-rhythm-v4.webp`, `web-writer-v4.webp`, `web-board-visibility-v4.webp`, `web-writer-v4.paths.json`이다. GIF는 `design/archive/public/images/people-motion/designer-rhythm-v4.gif`, `web-writer-v4.gif`. 각 폴더의 `animation.json`에 크기·정렬·시간을 기록한다. 정상 빌드에서는 저장한 자산을 사용하므로 이미지 생성이나 FFmpeg가 필요 없다.

## 검토 기록

원본과 복장/실루엣 비교 → 분리한 포즈 확대 → 실제 홈페이지 크기에서 여러 반복 구간 캡처 순으로 검토했다. `outputs/assets/2026-09-12/people-v4/designer-poses.png`, `designer-live-contact.png`, `web-poses.png`, `web-live-contact.png`에 기록했다. DESIGN의 팔꿈치 굽힘과 올라갔다 내려오는 동작, WEB의 표식 누적/팔의 가림/두 번째 이후 반복을 확인한다. 실사 촬영 영상과 동일한 관절 운동이라고 설명하지 않는다.

현재 변경은 로컬만 반영하며 커밋·GitHub push·운영 배포하지 않는다.

검증 완료: `outputs/qa/2026-09-12/design/people-v4-ci.log`에서 필수 빌드·63개 테스트 통과. `outputs/qa/2026-09-12/design/motion-v4-browser.json`에서12화면 크기·두 인물의 반복/정지/복귀·영상 조작·움직임 감소·no-JS 대체를 확인했다. `outputs/qa/2026-09-12/web/web-wheel-people-v4.json`에서4화면의 실제 휠 진입 직후 영상 재생·역방향 복귀·해시 없는 중간 위치 새로고침을 확인했다. 앱/콘솔 오류0개다. Chrome/소프트웨어 WebGL로 확인했으며 휴대폰 실기기·Safari 테스트는 수행하지 않았다.
