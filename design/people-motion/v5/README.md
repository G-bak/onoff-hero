# WEB 인물 v5 — 칠판에 WEB 쓰기

2026-09-12 사용자 요청: 칠판·낙서·인물 비율·동작을 다시 만들고, 원본 인물에 가깝게 실제 WEB을 쓰는 생동감 있는 모션으로 바꾼다. 중간의 작은 컷은 허용한다. DESIGN은 v4의 현재 동작을 유지한다.

## 원본과 생성

- [원본 인물](web/identity-reference.png): 최초 팀 아틀라스의 WEB 담당자. 긴 리브 네이비 카디건·큰 단추·안경·단발·차콜 바지·오프화이트 운동화를 참조했다. 노트북과 원통 받침대는 제거한다.
- [현재 생성 원본](web/source.png): 1448×1086, 4×3의 실제12포즈. 가로형 슬레이트 칠판·얇은 은색 테두리·금속 다리로 교체했다. 어깨·팔꿈치뿐 아니라 숙이는 몸, 무릎, 한 발 물러서는 자세가 달라진다. 정면 인사 대신 측면과 뒷사선을 사용한다.
- [정확한 생성 프롬프트](web/prompt.txt), [배경 교정 프롬프트](web/background-edit-prompt.txt), [생성 측정 정보](web/generation-metadata.json), [프레임별 검토](web/source-review.md).

내장 ImageGen을 사용했다. 처음 요청한 투명 배경은 체크무늬가 박힌 RGB 이미지로 돌아와 [첫 결과](web/initial-checkerboard.png)를 실행 자산으로 사용하지 않았다. 배경만 초록색으로 교정한 뒤 기존 크로마 처리로 알파를 만들었다. 배경의 실제 RGB는 대략(3,249,7)이며 정확한 #00FF00은 아니다. CLI/API 생성이나 영상 보간은 사용하지 않았다.

## 실제 동작

0 준비 → 1~2 W → 3~5 E → 6~8 B → 9 밑줄 → 10 물러서 확인 → 11 지우기 → 다시 쓰기.

2760ms 반복이며 WEB 완성 장면도 잠깐 읽을 수 있다. 정지는 페이지 이탈·가려짐·MOTION OFF·탭 숨김에만 적용하고 현재 시간에서 재개한다. OS 움직임 감소와 JavaScript 없는 화면에는 WEB이 완성된10번 포즈를 표시한다. 마지막 자세를 영구 유지하는 정책은 SYSTEM만 해당한다.

글씨·분필·손이 각 래스터 포즈에 함께 들어 있다. 기존 SVG 낙서·손 위치 보간·별도 칠판 마스크는 런타임에서 제거했다. 글씨를 완성하고 지우는 장면은 실제 생성 포즈의 컷 연결이다. W 첫 획의 모양, 글자 위치와 지우기→빈 칠판 경계에 작은 불연속이 남아 있으며 연속 촬영 영상이나 완전한 보간이라고 표현하지 않는다.

## 조립과 실행 자산

```powershell
node --experimental-strip-types scripts/prepare-web-person-v5.mjs
```

[sheet.json](web/sheet.json)의 개별 추출 범위와 칠판 왼쪽 위 기준점으로 정렬한다. 8·9번 신발이 명목상 셀을 넘어가므로 362px 고정 셀로 자르지 않는다. 인물·칠판을 한 배율로 줄여 몸 비율과 자연스러운 자세 차이를 보존한다.

- 사이트: `app/assets/people-motion/web-writer-v5.webp`, 3456×288, 198,454B.
- GIF: `design/archive/public/images/people-motion/web-writer-v5.gif`, 288×288, 331,469B.
- [재생 시간표](web/animation.json), [분리 포즈](web/frames/0.png).

`lib/person-motion.ts`의 동일한 순서·시간을 사이트와 GIF가 공유한다. 기존12개 화면 크기 검사 및 실제 휠 진입 영상 재생 검사를 이번 자산에도 수행한다. 최종 검증 결과는 PAGE4-NOTES.md에 기록한다. 로컬 작업이며 커밋·push·배포하지 않는다.
