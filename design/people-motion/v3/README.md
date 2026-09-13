# 이전 v3 시도 — 현재 앱에서 사용하지 않음

최신 사용자 수정으로 원본 직접 참조·실제8포즈·받침대 제거·두 페이지 반복의 [v4](../v4/README.md)로 교체했다. 아래 MCI·작은 리듬·WEB 최종 자세 유지 설명은 이전 시도 기록이다.

이번 기준은 기존 SYSTEM 캐릭터의 외형을 유지하고, 한 동작씩 느리게 연결하는 것이다. v2의 단발 디자이너·체형 변화·받침대 누락·과한 춤·독립 SVG 필기 연출을 교체한다. 실제 직원의 사진이 아닌 기존 가상 직무 캐릭터다. 페이지 구성·웹 영상·스크롤 전환은 보존한다. 로컬 작업이며 커밋·push·배포하지 않는다.

## 외형과 움직임 기준

- DESIGN: `../../galaxy-crew/v3/pose-sheets/design.png`의 묶은 머리, 아이보리 셔츠, 가는 체형, 차콜 바지, 연한 둥근 받침대. 뒷모습에서 양팔을 올린 채 발을 고정하고 무릎·상체·팔이 작고 느리게 같은 리듬을 따른다. 정면 소개·발놀림·큰 몸 회전은 없다.
- WEB: `../../galaxy-crew/v3/pose-sheets/website.png`와 뒤쪽 최종 포즈의 둥근 단발, 안경, 남색 카디건, 흰 티셔츠, 차콜 바지와 둥근 받침대. 옆·뒤 방향으로 칠판을 보며 한 번 필기하고 완성된 글씨를 보는 자세를 유지한다.

## 사전 관찰

[Matt Steffanina의 기초 리듬 설명](https://howcast.com/videos/499527-how-to-dance-at-a-club-hip-hop-how-to/)의 공개 설명문에서 무릎·머리·팔이 같은 박자를 따르는 원리만 참고했다. 영상 전체를 시청했다고 주장하지 않으며, 사용자가 거부한 스텝·슬라이드·큰 춤은 도입하지 않았다.

[Ivan S.의 실제 칠판 필기 영상](https://www.pexels.com/video/person-writing-on-the-blackboard-7252932/)을 2fps로 추출해 손끝과 획을 연속 관찰했다. 분필이 닿은 지점에 획이 쌓이고, 다음 획으로 갈 때 손이 잠시 떨어지는 것을 기준으로 한다. [MART PRODUCTION의 전신 필기 영상](https://www.pexels.com/video/woman-writing-on-blackboard-5676140/)은 몸과 칠판의 방향 참고다. 조사 영상은 홈페이지 자산으로 사용하지 않는다. 검토용 추출물은 Git 제외 `outputs/assets/2026-09-12/people-v3/chalk-hand-study.png`에 있다.

## 생성 및 조립

내장 ImageGen의 identity-preserve 편집을 사용했다. API/CLI 생성은 사용하지 않았다. 원본 시트와 실제 프롬프트를 캐릭터별 폴더에 보존한다. 런타임은 `app/assets/people-motion/`, 동작 GIF는 `design/archive/public/images/people-motion/`에 있다.

DESIGN: `designer/source.png`, `designer/prompt.txt`, `designer/keyframes/0..7.png`, `designer/animation.json`. 1536×1024 원본의 8포즈를 원형 받침대 기준으로 정렬하고 하나의 공통 배율을 적용했다. 무릎·상체의 높낮이는 개별 포즈 정규화로 지우지 않는다. 4초 순환, 24fps의 96프레임이며 런타임 파일은 `designer-groove-v3.webp`, GIF는 `designer-groove-v3.gif`다.

```powershell
node scripts/prepare-groove-assets.mjs <ffmpeg.exe 절대 경로>
node scripts/prepare-writing-assets.mjs <ffmpeg.exe 절대 경로>
```

두 조립기는 기존 Sharp와 별도 FFmpeg 실행 파일을 사용한다. FFmpeg는 앱 의존성이나 배포 런타임에 추가하지 않는다. 저장된 최종 자산은 일반 빌드에서 다시 생성할 필요가 없다. `person-motion-chroma.mjs`가 녹색 배경과 가장자리 번짐을 제거한다. 포즈 사이의 추가 프레임은 FFmpeg의 움직임 추정 보간(MCI/AOBMC)으로 만든다. 모든 24fps 프레임을 ImageGen이 직접 만들었거나 실제 인물을 촬영한 영상이라고 설명하지 않는다. CSS 회전·좌우 뒤집기·두 포즈의 투명도 교차로 동작을 대신하지 않는다.

## 검토 과정

DESIGN 원본, 정렬한 8포즈, 브라우저 4초 이상 연속 캡처와 반복 지점을 확대해 확인했다. 웹 애니메이션의 전역 `steps(1)`이 한 포즈를 4초간 고정하던 중간 구현 오류를 발견하고, 각 프레임 구간에 개별 steps easing을 적용했다. 실제 화면 변환 값이 바뀌는 것을 확인한다. 애니메이션 객체의 시간 증가만으로 움직임 검증을 대신하지 않는다.

WEB의 첫 생성과 타깃 수정은 글자가 늘면서 기존 글씨가 왼쪽으로 밀리는 문제를 해결하지 못했다. 두 시트를 채택하지 않고, 빈 칠판에서 손으로 웹 화면 구조를 그리는 포즈를 다시 생성했다. 필기 팔의 좌우는 사용자의 지정 사항이 아니므로 자연스러운 왼팔을 유지했다. 실패 시트는 저장소 밖 `onoff-people-v3-review/web/`에 보존했다.

채택 원본은 `web/source.png`, 정확한 프롬프트는 `web/prompt.txt`, 원본의 부족한 점과 좌표 검토는 `web/source-review.md`다. 원본 12포즈 중 1번에는 불필요한 흰 선이 있어서 같은 왼쪽 위 접촉 자세의 5번 픽셀로 대체했다. 11개 고유 포즈를 12개 시간 지점에 배치한 것이며 새로운 12개 포즈를 모두 채택했다고 주장하지 않는다. 새 원본의 어깨·팔·손 이미지를 사용하고 두 팔과 머리·받침대를 유지한다.

`web/tip-guides.json`에 실제 분필 끝 위치를 기록했다. `prepare-writing-assets.mjs`는 고정된 칠판 윗부분을 기준으로 정렬하고, `writing-strokes.mjs`는 중간 프레임의 분필 끝을 관찰해 선을 누적한다. 사각형 외곽→상단 구획→내용 선의 작은 웹 화면 구조이며 영문 글씨를 생성해 쓴다고 설명하지 않는다. 선은 기능적인 SVG 다이어그램으로 구현한다. 그림을 그릴 때 이미 쓴 선이 팔·손 위로 겹치지 않도록 프레임별 칠판 표면 마스크를 사용한다. 내부 선은 외곽 안에만 표시한다.

WEB 런타임은 `web-chalk-v3.webp`(3072×3072, 144프레임), `web-chalk-v3.paths.json`, `web-board-visibility-v3.webp`다. GIF는 `web-chalk-v3.gif`. 24fps/6초의 1회 재생이며 마지막 포즈를 유지한다. 페이지 밖이나 모션 정지에서 재생 위치를 초기화하지 않는다. 영상은 기존대로 별도 재생 조작을 갖는다.

`PersonMotion`은 인물과 프레임별 SVG를 하나의 큰 시트 안에 둔다. 한 Web Animations 타임라인이 전체 시트를 함께 이동하므로 필기용 독립 타이머나 프레임별 React 상태 갱신이 없다. 이미지와 표면 마스크가 준비되기 전에는 진행하지 않는다. DESIGN은 반복하고 WEB은 끝에서 유지한다. 가시성·가려짐·inert·탭 숨김·MOTION OFF에서 같은 프레임으로 멈춘다. OS 움직임 감소는 DESIGN 첫 뒷모습과 WEB 마지막 자세를 선택한다.

DESIGN 동작은 각 포즈의 차이가 작아 전체 몸의 흔들림을 크게 증폭하지 않았다. WEB은 생성된 포즈 사이에 움직임 보간을 사용하므로 촬영 영상과 같은 정확한 관절 운동이라고 주장하지 않는다. 최종 판단은 확대 원본뿐 아니라 실제 홈페이지 크기에서 연속 재생한 결과를 함께 사용한다.
