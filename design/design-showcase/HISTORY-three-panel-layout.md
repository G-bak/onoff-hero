# 3페이지 DESIGN — 2026-09-12

현재 순서는 01 HOME → 02 SYSTEM → 03 DESIGN → 04 WEB → 05 MARKETING이다. 이번 작업은 DESIGN 추가이며, 기존 마케팅 화면과 자산은 5페이지로 이동했다. WEB은 기본 소개 화면만 두었고 상세 작업물·연출은 후속 제작 범위다. 로컬 확인: http://localhost:5187/#design. 커밋·push·배포하지 않는다.

## 화면과 모션

기존 마케팅 페이지의 큰 영문 제목, 평면 작업물의 입체 배치, 짧은 하단 문구를 이어간다. 배경은 #D8FF3E, 글자는 #090A0F. DESIGN은 로컬 Montserrat700, 한글은 Pretendard Variable이다. 문구는 MAKE YOUR MARK. / 생각에 형태를 / 브랜드에 고유함을.

작업물은 모두 신규 생성한 자체 콘셉트다. ON / FORM 브랜드 아이덴티티 포스터, FORM 패키지 디자인, OFF GRID 편집 디자인을 4:5 이미지로 보여준다. 실제 고객 작업이나 성과를 주장하지 않는다. 세 얇은 작업판이 겹친 깊이에서 좌우·앞쪽으로 펼쳐지고 스크롤에 따라 간격과 깊이가 변한다. 완성 뒤 작은 부유와 포인터 시점 변화를 준다. 이미지 비율만 유지하며 페이지 전체 가로세로 비율은 고정하지 않는다.

## 유지보수

- `app/components/card-showcase.tsx`: category=design 또는 marketing을 받는 공통 장면. 렌더러·프레임 제어·메모리 해제·이미지 실패·컨텍스트 복구 코드를 공유한다. DESIGN에는 인스타그램 UI·동영상·마케터를 생성하지 않는다.
- `lib/card-showcase.ts`: 카테고리별 작업판 크기·깊이·각도와 공통 스크롤 모션.
- `app/marketing-showcase.css`: 공통 쇼케이스와 마케팅 스타일.
- `app/creative-sections.css`: 디자인 스타일, WEB 기본 소개, 신규 메뉴 테마. 높이600px 이하에서는 5개 링크가 상담 버튼을 가리지 않도록44px 행으로 조정한다.
- `app/components/web-section.tsx`: 파란색 WEB 기본 소개 화면. 다음 MARKETING으로 실제 이동하는 링크를 둔다.
- `app/page.tsx`: 네 개의 중첩 SectionEntry로 다섯 페이지를 연결한다. DESIGN이 다음 면에 가려지면 렌더링을 멈춘다. SYSTEM 인물은 다음 페이지에서 돌아와도 최종 자세를 보존한다.
- `lib/site-sections.ts`: 5개 메뉴·번호·연속 진행률. 마케팅의 기존 #card 주소는 호환성을 위해 유지한다. DESIGN은 #design, WEB은 #web.
- `app/assets/design-showcase/`: 720×900 WebP 세 장, 합계136,572B. Three.js와 정적 대체 화면에서 같은 내용 해시 URL 사용.
- `design/design-showcase/`: 생성 원본, 정확한 프롬프트, 출처와 해시 기록. 재생성: `node scripts/prepare-design-assets.mjs`.

MOTION OFF, 움직임 감소, 탭 숨김과 화면 이탈의 정지 정책을 유지한다. WebGL 손실 시 정적 작업물로 전환하고 복원 시 새 장면을 만든다. JavaScript 없이도 작업물과 문구를 읽을 수 있다. 1페이지와 SYSTEM 연출·마케팅 동영상 및 마케터 자산은 보존한다.

## 검증

`npm run ci:build`로 린트·타입·동작 테스트·배포 CSS·자산 해시·전체 한글 폰트를 검사한다. 브라우저 기록은 `outputs/qa/2026-09-12/design/design-browser.json`. 실제 네이티브 스크롤바를 보이는 Chrome과 소프트웨어 WebGL로 검사하며 실제 휴대폰 FPS 측정은 아니다.

1440×900, 2048×1020, 390×844, 320×740, 768×1024, 844×390에서 확인한다. 검사 범위: 모든 메뉴 앞뒤 이동, 단일 인디케이터·상담 버튼, DESIGN 3개 작업판, 5페이지 영상 재생/이탈 정지, SYSTEM 재방문 자세 보존, WebGL 손실/복원, 숨긴 탭·MOTION OFF, 움직임 감소와 JavaScript 미사용. 최종 화면은 outputs/qa/2026-09-12/design/design-final-*.png.

최종 결과: npm run ci:build 통과(동작 테스트54개 포함). outputs/qa/2026-09-12/design/design-browser.json의 전체 기능 검증과 outputs/qa/2026-09-12/design/design-layout.json의 최종6뷰포트 검사가 통과했고 정상 실행의 콘솔/페이지 오류는 없었다. 짧은 가로 화면에서 모든 페이지의05메뉴를 실제 hit-test로 확인했으며 상담 버튼에 가리지 않는다. DESIGN→WEB 전환의 연속 진행률은0.5625→0.625→0.6875로 확인했다. 최종 모바일 작업물은 메뉴 숫자 왼쪽에 배치하고 표기는 작업물 아래의3열에 맞췄다. 소프트웨어 WebGL 검증이며 실제 휴대폰 성능 검증은 포함하지 않는다.
