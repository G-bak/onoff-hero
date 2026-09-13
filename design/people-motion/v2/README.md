# DESIGN dance / WEB chalk writing — 2026-09-12

> 과거 v2 동작의 보관 이력이다. 현재 DESIGN은 [v4](../v4/README.md), WEB은 [v5](../v5/README.md)를 따른다.

최신 요청에 따라 정면 소개 제스처를 제거했다. 기존 SYSTEM 인물의 크림색 셔츠·짙은 바지, 네이비 카디건·안경을 기준으로 가상 직무 캐릭터의 외형을 유지했다. 실제 직원 사진이나 레퍼런스 영상의 인물을 사용한 것이 아니다.

## 먼저 확인한 자료

- [STEEZY: Billy Bounce](https://www.steezy.co/posts/how-to-do-the-billy-bounce): 무릎의 굽힘/펴기, 어깨의 높낮이, 팔 스윙과 체중 이동에 대한 동작 설명을 읽었다.
- [cottonbro studio: hip-hop dance](https://www.pexels.com/video/woman-dancing-in-hip-hop-style-10264579/): 공개 MP4의14초를1초 간격으로 추출해 확인했다. 측면·뒷면으로 돌아설 때 발과 무릎이 먼저 이동하고 몸통/팔이 따라가는 흐름을 참고했다.
- [Ivan S: writing on a blackboard](https://www.pexels.com/video/woman-writing-on-blackboard-5676140/): 공개 MP4의10초를1초 간격으로 확인했다. 시선은 칠판에 두고 어깨·팔꿈치·손목의 작은 움직임으로 필기하는 자세를 참고했다.

검토용 영상 접촉 시트는 Git 제외 outputs/research/2026-09-12/motion/에 있다. 외부 영상은 사이트 자산으로 배포하지 않는다. Pexels 웹 페이지는 브라우저 확인 중 접근 검사를 표시했으나 공개 영상 파일은 확인할 수 있었다. 안무를 그대로 복제하지 않고 동작 원리를 반영했다.

## 생성과 재생

내장 ImageGen으로 한 병렬 배치에서16포즈 시트 두 장과 빈 칠판 한 장을 생성했다. 실제 원본은1254×1254이며 요청 해상도와 다르다. 원본을 임의로 고해상도라고 표기하지 않는다. `designer-dance/`, `web-write/`, `blank-chalkboard/`에 원본과 정확한 prompt.txt가 있다. generation-metadata.json과 inspection.json은 생성/육안 확인 기록이다.

- DESIGN: 옆·뒷모습만 사용하며 발 바꾸기, 무릎 굽힘, 어깨와 팔 스윙으로 춤춘다.16포즈×140ms,2.24초 순환이다. 이전 포트폴리오 소품과 정면 대기를 없앴다.
- WEB: 측면부터 뒤로 돌아 팔을 드는8포즈를0.96초에 재생하고, 뒷모습의 필기8포즈만0.96초 주기로 반복한다. 생성 결과의 왼손 필기를 유지했다. 몸 전체를 CSS로 회전하거나 앞뒤로 뒤집지 않는다.
- 생성한 빈 칠판에 WEB 글자와 웹 화면 구조를 그리는 단순 SVG 획을 얹었다. 필기 동작과 같은 활성 시간으로 획을 표시한다. 인물과 칠판 이미지가 모두 준비된 뒤 재생한다.
- 인물은240×320×16의3840×320 투명 WebP 스트립으로 제공한다. 한 카메라 크기·셀 원점으로 정렬해 춤의 좌우 이동과 무릎 굽힘을 보존한다. 각 포즈마다 발/머리를 같은 위치로 강제하지 않는다.
- CSS 스프라이트 재생이며 실제 연속 촬영 동영상이 아니다. DESIGN 등장에는 짧은 투명도 전환만 사용하고 제목의 clip-path 밖에 둬 몸과 발이 잘리지 않게 했다.
- 화면 밖·다른 면에 가려짐·탭 숨김·inert·MOTION OFF는 현재 동작을 멈춘다. 움직임 감소는 뒷모습 정지와 완성된 칠판이다. SYSTEM의 기존1회 동작 정책은 바꾸지 않았다.

재생성: `node scripts/prepare-motion-v2.mjs`. 애니메이션 수치는 animation.json, 실행 타이밍은 app/people-motion.css에 있다. GIF 미리보기는 design/archive/public/images/people-motion/*-v2.gif이며 WEB GIF는 인물의1회 전체 동작이다. 실제 WEB의 칠판과 뒤돌기 후 필기 반복은 컴포넌트가 담당한다. 이전8포즈 자산은 상위 폴더의 보관 기록이며 현재 앱에서 import하지 않는다.

로컬 확인: [DESIGN](http://localhost:5187/#design), [WEB](http://localhost:5187/#web). 커밋·push·배포하지 않았다.
