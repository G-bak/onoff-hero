> 이전 파란 배경 WHY 인물의 보존 기록입니다. 현재 인물과 재생성 명령은 [새 우주 인물 기록](../galaxy-crew/README.md)을 따릅니다.

# 2페이지 인물 모션

2026-09-11 사용자 요청으로 제작한 독립 인물 애니메이션. 현재는 로컬 시안이며 GitHub push·운영 배포하지 않았다.

## 레퍼런스와 적용 방향

- [IDEO — How We Did It: GIF Dance Party](https://www.ideo.com/journal/how-we-did-it-gif-dance-party): 제작자가 인물 GIF의 배경을 프레임마다 제거해 웹사이트에 배치한 과정을 설명한다. [실제 GIF Dance Party](https://gifdanceparty.com/)의 공개 GIF도 내려받아 여러 프레임으로 확인했다. 사람 자체의 포즈가 바뀌는 투명 컷아웃 방식을 참고했다.
- [Viz-People — Casual in Motion v2](https://www.viz-people.com/shop/casual-in-motion-v2/): 일상 동작의 배경 분리 인물 영상 자료. 페이지의 소개를 참고해 동작을 작게 잡았다. 해당 판매 자산을 사용하지 않았다.
- 인물은 기존 파란 재킷 여성의 옆뒤 모습을 새로 생성했다. 발을 고정하고 제목의 왼쪽 위 방향을 가리킨 뒤 돌아온다. 본문 읽기를 방해하지 않도록 약 1.5초의 휴지, 팔 올리기, 약 0.8초 유지, 팔 내리기로 구성했다.

## 파일

- `pose-sheet-green.png`: 내장 이미지 생성 도구로 만든 4열×2행 원본. 얼굴·복장·소품의 기준은 기존 첫 번째 팀 인물이다.
- `frames/pose-01.png` ~ `pose-08.png`: 배경 제거와 발 위치 정렬을 마친 256×337 투명 PNG 8장.
- `animation.json`: 프레임 순서·시간·정렬 보정·출력 크기 기록.
- `generation.prompt.md`: 실제 포즈 생성·배경 교정 프롬프트와 도구 기록.
- [보관 GIF](../archive/public/images/why-person/gesture.gif): 14프레임, 3,880ms 반복 GIF. 2026-09-13 public에서 이동했으며 옛 공개 URL은 제공하지 않는다.
- `../../app/assets/why-person/gesture-sprite.webp`: 웹에서 사용하는 8포즈 스프라이트. 약 113KB, 알파 포함. GIF 약 310KB를 페이지에서 중복 요청하지 않는다.
- `../../app/assets/why-person/gesture.css`: GIF와 같은 시간표로 생성한 CSS. 임의로 편집하지 않고 아래 명령으로 다시 만든다.

## 수정과 재생성

프로젝트 루트에서 `node scripts/prepare-why-person.mjs`을 실행한다. 기존 `sharp` 의존성만 사용한다. 스크립트가 크로마 배경을 제거하고, 프레임별 발의 중심과 바닥선을 맞춘 뒤 GIF·스프라이트·CSS·메타데이터를 함께 만든다. 생성 파일은 Git에 포함하므로 서버 시작 시 이미지 편집을 다시 실행하지 않는다. 시간 조정은 `scripts/prepare-why-person.mjs`의 `sequence`·`delays`에서 한다.

GIF를 `<img>`로 자동 재생하는 대신 동일한 포즈의 WebP를 CSS로 재생한다. 1페이지가 걷히는 중부터 뷰포트 안의 인물을 재생하며, HOME 시작·3페이지 완료·화면 밖·숨겨진 탭·MOTION OFF에서는 정지한다. 생성 CSS는 해당 전환의 뒷면에 한정해 `is-turning`과 `is-turned`를 함께 처리한다. 움직임 감소 또는 JavaScript 미사용 시 첫 자세를 표시한다. `WhyPerson`의 관찰자와 가시성 이벤트는 컴포넌트 해제 시 정리한다.

1페이지 3D 카드와 그 인물 아틀라스·원본은 변경하지 않았다. 기존 2페이지의 인물 위치·글자 위 발 정렬·모바일 상담 버튼 여백은 유지한다.

후속 표시 크기 조정(2026-09-11): 사용자 요청으로 PC·모바일 인물을 기존 너비·높이의 85%로 줄였다. `app/globals.css`의 `--person-scale: .85`로 관리하며, 원래 인물 영역의 하단 중앙을 고정해 발 위치를 유지한다. 스프라이트 해상도·GIF·포즈·재생 시간은 변경하지 않는다.

1920·1440·768·390·320px 브라우저에서 변경 전후 너비·높이 85%, 하단 중앙 위치 유지, 가로 넘침 없음을 확인했다. 실제 표시 크기는 1920px 화면에서 약 128×169px, 1440px에서 96×126px, 390px에서 64×84px다. 결과는 `outputs/qa/2026-09-11/system/why-person-size-before.json`·`outputs/qa/2026-09-11/system/why-person-size-after.json`, 통과한 39개 테스트·빌드 로그는 `outputs/qa/2026-09-11/system/why-person-smaller-ci.log`다.

## 검증

### 전환 직전 정지 수정 — 2026-09-11

수정 전 1440×900·390×900에서 전환 끝 30px 전에 스크롤을 멈추면, 화면에 드러난 인물의 `animation-play-state`가 `paused`가 되고 시간과 포즈가 고정되는 것을 재현했다. 전환을 완전히 마치거나 50px 더 내렸을 때만 재생됐다. 크기 조정은 정적 화면으로 확인했으므로 이 경계 조건을 검증하지 못했다.

생성기의 CSS 재생 조건을 전환 중에도 적용하도록 수정했다. 로컬 프로덕션 빌드의 Chrome 1440·390·320px 화면에서 첫 진입의 완료 30px 전, WHY 앵커, 작은 역스크롤 각각 8포즈 한 바퀴를 실제 재생해 확인했다. 고정된 발 기준선, HOME·DESIGN 왕복과 정지·재개, MOTION OFF, 숨겨진 탭 이벤트 모의, 움직임 감소·JavaScript 미사용·직접 WHY 진입을 통과했다. 브라우저 오류는 0건이다. `npm run ci:build`의 39개 테스트·린트·타입·빌드·CSS/자산 검사도 통과했다. 로컬에만 반영했다.

결과는 `outputs/qa/2026-09-11/system/why-motion-production.json`, 재현은 `outputs/qa/2026-09-11/system/why-motion-probe.json`, 빌드 로그는 `outputs/qa/2026-09-11/system/why-motion-fix-ci.log`다. `outputs/qa/2026-09-11/system/why-motion-regression.mjs`로 실제 재생을 검사한다. 이미지 재생성 직후 개발 서버가 이미지 URL의 HMR 쿼리를 서버·클라이언트에 다르게 제공한 경고는 해당 서버를 재시작해 해소했다. 개발 서버에서도 같은 3개 화면 크기와 모든 모드 검사를 다시 통과했고 브라우저 오류는 0건이다(`outputs/qa/2026-09-11/system/why-motion-dev-final.json`).

### 최초 인물 모션 적용

`npm run ci:build`의 린트·타입 검사·기존 테스트 38개·프로덕션 빌드·CSS/자산 검사를 통과했다. Chrome에서 개발 서버와 최종 로컬 프로덕션 빌드를 각각 검사했다. 1440×900·390×844·320×640에서 8개 포즈가 실제 순서대로 표시되고, 발의 바닥선이 이동하지 않으며, 상담톡과 겹치거나 가로 스크롤이 생기지 않았다. HOME에서 정지, 기존 MOTION OFF 적용, 숨겨진 탭 이벤트 모의 시 정지·복귀, 움직임 감소, JavaScript 미사용도 통과했다. 페이지가 GIF나 생성 원본을 중복 다운로드하지 않는지 확인했으며 브라우저 오류는 없었다.

개발 서버가 수정 전 클라이언트 모듈과 새 이미지 URL을 섞어서 제공해 한 차례 hydration 경고가 발생했다. 해당 프로젝트 서버 프로세스를 확인해 재시작한 뒤, 개발·프로덕션의 최종 검사에서 경고가 사라지고 MOTION OFF 연동도 정상 동작했다. 관련 재현 로그와 화면은 Git에서 제외되는 `outputs/why-person-*`에 보관한다.
