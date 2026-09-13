# MARKETING 제목 모션 v3 — FOLLOW.ART 시연 재검토

2026-09-12. 사용자가 이전 글자별 rotateX 등장 효과가 밋밋하다고 지적해 FOLLOW.ART의 실제 연출 자료를 다시 확인했다. 이 문서는 제목 조사 기록이다. 후속 사용자 지시로 반복 파동은 삭제했으며 카드와 로딩은 [채널 v3](../v3/README.md)에서 다시 구성했다. 로컬 반영이며 commit/push/deploy하지 않는다.

## 직접 확인한 자료

- https://follow.art/ : 이번 데스크톱 브라우저 접속은 Cloudflare 보안 확인 화면이었다. 이번에 현재 본사이트를 직접 스크롤했다고 주장하지 않는다.
- [제작사 Vide Infra 프로젝트](https://videinfra.com/work/follow-art): 실제 페이지에 접속해 공개된 Kinescope 영상11개와 설명을 확인했다.
- [전체 전환 시연](https://kinescope.io/5KkG6bNMXRW7E4jQ8SEEzW): 기존 보관 영상 promo.mp4(5.03초,30fps)를 다시 프레임으로 읽었다. 특히3.25~4.875초를0.125초 간격으로 추출해 다음 분홍 면과 큰 NEXUS CARD 제목이 함께 올라오는 흐름을 확인했다. 제목만 독립적으로 나타나지 않고 면·카드와 같은 구도에서 이어진다.
- [첫 화면 시연](https://kinescope.io/r54B6XpUwoz7U7cbVekBiZ): 기존 hero.mp4를0~2.75초,0.25초 간격으로 다시 읽었다. 큰 FOLLOW.ART 글자의 위쪽 기준은 대체로 유지되며 각 글자의 세로 길이가 서로 다른 시점에 변한다. 이는 영상 관찰이며 제작사의 정확한 애니메이션 수식/수치를 확인한 것은 아니다.
- [제작사 기술·아트디렉션 설명](https://videinfra.com/blog/the-art-of-getting-noticed-product-design-and-development-for-an-artist-social-network-startup): kinetic typography, stretched letters, 그래피티에서 가져온 장식, 앨범 면 같은 전환을 의도한 표현이라고 명시한다. 폰트/레이아웃의 과감함과 읽기 편의 사이에서 조정했다고 설명한다.

참고 영상·추출 화면은 배포하지 않는 outputs/research/2026-09-09/follow-art/에만 있다. 이번 추출은 title-arrival-detailed.png와 title-wave-detailed.png. 외부 영상·코드·로고를 앱 자산으로 가져오지 않았다. 생성 이미지 추가는 없다.

## 적용한 자체 모션

영문 MARKETING, 로컬 Montserrat700, 기존 크기·배치·색을 유지한다. 아홉 글자를 각자의 고정 가로 칸에 두고 **압축 → 크게 신장 → 반대 방향으로 수축 → 작은 반동 → 완성된 제목 고정**을 준다. 회전해서 앞면이 보이는 rotateX 연출과 CSS keyframes는 제거했다.

글자당 기본1.15초, 인접 글자65ms 차이로 왼쪽에서 오른쪽으로 충격이 전달된다. 시작 세로 비율0.16, 예비 압축0.12, 최대1.42, 수축0.83, 작은 반동1.075를 지나1로 돌아온다. 후속 사용자 지시로 후반 파동은 삭제했고, 전체1.67초가 지나면 모든 글자가 원래 크기에서 완전히 멈춘다. 가로 칸과 읽는 순서는 고정하고 신장 중 너비만 소폭 보정한다. opacity는항상1이다. 수치와 타이밍은 이번 페이지를 위해 정한 값이며 레퍼런스 복제 값이 아니다.

lib/marketing-title.ts가 유일한 모션 계산이다. CardShowcase의 기존 프레임 루프 안에서 별도의 titleTime을 사용하며 마케터 time과 카드 entryTime은 실제 로딩 완료 뒤부터 흐른다. WEB 면이 실제 제목을 드러내는 조건이 충족될 때부터 진행한다. 위쪽 페이지로 완전히 이탈한 뒤 재진입하면 제목 시간이0으로 돌아간다. 숨김·가려짐에는 시간이 멈추며, MOTION OFF/OS 움직임 감소에는 기존 크기의 정적 제목이다. JavaScript가 없으면 읽을 수 있는 HTML 제목을 유지한다.

CSS 원근 모션이나 Three.js 입체 메시로 설명하지 않는다. 실제 구현은 HTML 글자 각각의2D transform이며, 참고한 핵심은 변형의 리듬과 장면의 연속성이다. 새 렌더링 엔진·패키지·독립 requestAnimationFrame 루프는 추가하지 않았다.

## 검증

tests/card-showcase.test.mjs에서9글자의12초 범위를240Hz 간격으로 검사한다. 양수 크기와 최대 신장, 프레임 연속성, 좌우 전달 순서, 완료 후 영구 고정, 정지 자세, 유효하지 않은 시간 입력을 검증한다. 기존 카드 카메라 투영·인물 시간표 테스트도 유지한다.

실제 브라우저에서 제목이 다른 높이를 거치는0.3~3.2초 화면을 직접 확인했다. 전체 검사 결과는 outputs/qa/2026-09-12/marketing/marketing-title-wave-browser.json, 빌드 로그는 outputs/qa/2026-09-12/marketing/marketing-title-wave-ci.log이다. 최종 상태와 결과는 PAGE5-NOTES.md에 기록한다.
