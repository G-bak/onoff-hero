# 5페이지 MARKETING — 2026-09-12

최신 사용자 요청으로 곡면 두 장과 V자 접힘을 제거하고 마케팅 콘텐츠를 소개하는 화면으로 바꿨다. 로컬 주소는 http://localhost:5187/#card 이며 커밋·push·배포하지 않았다. 이전 구현 기록은 design/card-showcase/HISTORY-2026-09-11.md에 보관한다.

## 구성과 모션

분홍 #C5939D 배경과 검정 #090A0F을 유지하고 제목을 MARKETING으로 바꿨다. 제목은 로컬 Montserrat 700 HTML 텍스트이며 이전 THE CARD SVG는 요청하지 않는다. 한글은 Pretendard를 사용한다. 현재 메뉴 표기는 HOME · SYSTEM · DESIGN · WEB · MARKETING이고 기존 #why / #card 앵커와 연속 인디케이터는 유지한다.

인스타그램 피드 광고 두 장과 가운데 세로 영상 광고 한 장, 총 세 개의 입체 광고판을 배치했다. 서로 겹친 깊이에서 출발해 양옆과 앞쪽으로 펼쳐지고 스크롤에 따라 앞뒤 간격이 변한다. 각 화면은 BoxGeometry의 얇은 몸체와 평평한 PlaneGeometry 앞면이며 곡률·원통 감기·V자 변형 계산은 없다. 완성 뒤에는 작은 높낮이·시점 변화만 준다. 모바일은 간격과 크기를 줄이고 짧은 가로 화면은 뷰포트 높이에 맞춘다.

- LUMA: 코발트 스킨케어 제품, 배·투명 젤, MAKE IT GLOW. 인스타그램 피드 형식.
- DAYBREAK: 코럴 배경의 아이스 커피, GOOD MOOD. GREAT COFFEE. 인스타그램 피드 형식.
- MOVE YOUR WAY: 운동화 캠페인, 540×960 / 약6초 / 무음 WebM. 생성된 사진을 바탕으로 시점 크기 변화와 세 컷의 키네틱 타이포그래피를 편집한 모션 광고다. 실제 촬영 동영상이나 생성형 동작 영상이라고 설명하지 않는다. 화면에 Three.js VideoTexture로 재생한다.
- 마케터: 기존 회색 셔츠 캐릭터를 참조한 새8포즈. 고개 돌림→손바닥 소개→위쪽 가리키기→정면 미소→팔 내리기. 왼쪽 아래 여백에 배치한다. 생성 이미지의 팔·상체 동작이며 CSS로 몸 전체를 회전시키지 않는다.

모든 광고는 가상 브랜드의 생성 콘셉트다. 실제 고객 실적·노출 수·성과 수치를 만들어 붙이지 않았다. 인스타그램 모양의 프로필·아이콘은 장식이며 실제 계정에 연결된 조작이 아니다.

## 자산과 코드

- app/components/card-showcase.tsx: 제목·피드 텍스처·평면 광고판·비디오·마케터·수명 관리.
- app/marketing-showcase.css: 새 마케팅 페이지와 반응형. 이전 app/card-showcase.css는 제거했다.
- lib/card-showcase.ts: 광고판 크기·깊이·스크롤 함수, 마케터의 공유 시간표.
- app/assets/marketing/: feed-luma.webp (110366B), feed-daybreak.webp (138024B), shorts-poster.webp (62226B), shorts-campaign.webm (827954B), marketer-sprite.webp (92488B). 모두 Vite 내용 해시 URL로 제공한다.
- shorts-master.webp는 영상 제작용이며 앱에서 가져오지 않는다. design/marketing/에는 ImageGen 원본4장, 정확한 프롬프트, 마케터 프레임, 모션 편집 소스를 보관한다.
- design/archive/public/images/marketing/marketer.gif: 240×320, 15프레임, 209637B. 원본8포즈를 왕복 순서로 재생하며 마지막 소개 자세를 약2.2초 유지한다. 웹은 같은 시간표의 WebP를 사용해 모션 정지와 탭 숨김을 제어한다.

재생성은 npm run prepare:marketing. 영상은 scripts/render-marketing-video.mjs에 설치된 Playwright 모듈 경로와 브라우저 실행 파일을 인자로 전달한다. 현재 서버·빌드에서 이 오프라인 영상 제작 도구를 실행하지 않으며 새 런타임 의존성은 추가하지 않았다. 기존 디자인 원본은 보관하지만 앱에서 불러오지 않는다.

## 수명과 검증

숨긴 탭·다른 페이지에서는 영상과 렌더링·마케터 프레임을 중지한다. MOTION OFF는 영상·장면 정지, 움직임 감소는 영상 포스터와 마케터의 소개 자세다. WebGL 컨텍스트 손실 시 GPU 자원을 정리하고 정적 광고를 보이며 복원 후 새 장면을 만든다. 이미지 로드 실패나 WebGL 미지원에서도 광고와 제목을 유지한다. 비디오 자동재생 거부 시 포스터가 남는다. JavaScript 없이도 제목과 광고 이미지가 보인다.

최종 결과는 outputs/qa/2026-09-12/marketing/marketing-ci.log와 outputs/qa/2026-09-12/marketing/marketing-browser.json에 기록한다. 브라우저에서는 초기 SYSTEM 로딩, MARKETING→SYSTEM 인물 유지, HOME→SYSTEM 재생, 실제 영상·마케터 모션, 탭 숨김, MOTION OFF, WebGL 손실·복원, 움직임 감소, JavaScript 미사용과 6개 화면 크기를 검사한다. 소프트웨어 WebGL 환경의 Chrome 검사이며 실제 휴대폰 FPS 측정은 아니다.

최종 브라우저 결과: 초기HTML 단계에서 문구·정적그래픽 숨김과 로더 표시를 확인했고 실제 장면 준비 후 로더가 사라졌다. MARKETING→SYSTEM 인물15번 유지, HOME→SYSTEM 전체 재생, 쇼츠 실제 재생·반복, 마케터 프레임 변화, 숨긴 탭 정지, MOTION OFF, WebGL 손실·복원, 움직임 감소, JavaScript 미사용이 통과했다. 1440×900·2048×1020·390×844·320×740·768×1024·844×390에서 화면을 검사했다. 320px의 가로 넘침은 루트/본문320px 최소너비를 제거해 해결했고 인물 옆 문구는 상담 버튼 앞에서 줄바꿈한다. 짧은 가로 화면은 높이를100svh로 맞춰 광고·마케터가 보이게 했으며 제목과 발행 표기 겹침도 분리했다. 정상 브라우저 실행의 페이지·콘솔 오류는 없었다.

영상 반복은 실제 브라우저에서5.63초→1.04초로 돌아가며 계속 재생되는 것을 확인했다. 로컬 서버는 http://localhost:5187에 유지했다. 이전 CSS가 보이던 미리보기는 새 마케팅 스타일 경로를 적용해 갱신했고 실제 계산 스타일과 스크린샷을 재확인했다. 커밋·push·배포는 하지 않았다.


2026-09-12 페이지 순서 변경: 마케팅은05로 이동했다. 이 문서의 광고·영상·마케터 자산과 동작은 보존했다. 마케팅은 전용 CardShowcase를 사용하며 기존 DESIGN 분기는 제거했다. 03 DESIGN과04 WEB 뒤에 위치하고 #card 앵커를 유지한다. 최신 다섯 페이지 이동 검증은 outputs/qa/2026-09-12/design/design-browser.json, 관련 구현 기록은 PAGE3-NOTES.md다.
