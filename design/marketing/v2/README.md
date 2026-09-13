# MARKETING v2 — 한국형 채널 캠페인

후속 적용은 [v3](../v3/README.md)가 현재 기준이다. 이 문서의3개 원본 생성과 인물 보존 기록은 유지하며, 단일 포스터 런타임/간단한 플랫폼 머리말은 v3의 실제 게시글 UI·긴 기사·설치 사진으로 교체했다.

2026-09-12. 시안은 고객 데이터로 확정한 실제 타깃이 아닌, 앞선 DESIGN 작업의 **뷰티 D2C·온라인 리빙·카페/베이커리** 고객 가설을 이어 만든 가상 브랜드 포트폴리오다.

## 조사와 적용

- [블링크애드 브랜드 블로그](https://www.blinkad.kr/blog-marketing): 실제 고객 질문과 검색 의도를 먼저 정리하고 주제·발행·업데이트로 이어가는 접근을 확인했다. 이를 **이불 구매 전에 확인할 소재·계절·세탁** 정보형 콘텐츠로 해석했다. 특정 검색 순위나 AI 추천 성과를 보장하지 않는다.
- [블랙애드 서비스](https://www.blackad.co.kr/): 업종에 맞춘 기획·제작·매체 운영 및 SNS/배너/포스터 접점을 확인했다. 추상적인 예술 문장보다 광고할 상품·선택 기준·세트 구성을 직접 보여주는 캠페인으로 적용했다. 사이트의 성과 수치나 최고 주장, 문구를 복제하지 않았다.
- 이전 고객 가설과 참고 자료: [DESIGN v2](../../design-showcase/v2/README.md).

| 채널 | 고객 가설과 필요한 콘텐츠 | 새 시안의 메시지 |
| --- | --- | --- |
| 인스타그램 | 화장품 브랜드의 일상 제품 홍보 | 온결 — 오늘의 보습 루틴 / 데일리 크림 |
| 블로그 | 침구 구매자가 비교하는 선택 정보 | 루움 — 이불 고를 때 꼭 확인할3가지 / 소재·계절·세탁 |
| 광고 포스터 | 매장 방문 전 빠르게 이해할 식사 제안 | 모닝오븐 — 점심 고민 끝 / 샌드위치+아메리카노 |

본문: **홍보할 시간 없다면 / 온앤오프에 맡기세요**. 사업자의 홍보 운영 부담과 맡길 서비스를 직접 표현했다. 이는 조사에서 추론해 작성한 새 카피이며 인용이 아니다. 가격·후기·매출·할인·효능 수치를 지어내지 않는다. 앱의 가상 브랜드 시안 표기를 유지한다.

## 생성과 파일

도구 모드는 내장 image_gen이다. 독립 자산 담당이 새 광고3장을 한 병렬 배치로 생성했으며 재생성/변형본은 없다. 각원본1122×1402; 소스는 sources/instagram.png, sources/blog.png, sources/poster.png. **정확한 전체 요청 프롬프트, 원본 출력 경로, 모드, 검토 내용은 [PROMPTS.json](PROMPTS.json)**에 있다. 앱 상단 플랫폼 UI는 이미지에 생성하지 않고 로컬 코드로 붙였다. 최초 PNG와 최종 WebP를 실제로 열어 한국어·제품·분위기를 확인했다.

| 실행 자산 | 해상도 | 용량 |
| --- | --- | --- |
| app/assets/marketing/instagram-ongyeol.webp |720×900|63036B|
| app/assets/marketing/blog-ruum.webp |720×900|144466B|
| app/assets/marketing/poster-morning-oven.webp |720×900|149212B|

합계356714B. sharp의 리사이즈와WebP 인코딩만 적용했으며 새 픽셀 그림을 코드로 그리지 않았다. scripts/prepare-marketing-channels.mjs와 assets.json이 원본/실행 SHA256을 관리한다. 앱에서는 세 장 모두 Vite 내용 해시 URL을 쓴다.

## 마케터: 받침대만 제거

인물은 새로 생성하지 않았다. 원래8포즈를4×2로 무손실 배치한 자료로 내장 ImageGen **편집1회**를 호출해 분리 마스크를 요청했다. [정확한 프롬프트](marketer/MATTE-PROMPT.json), [초기 정합 오차](marketer/MATTE-REGISTRATION.json), 원본sheet/생성matte/정합matte를 함께 보관한다. 생성 마스크는최대7px 어긋났으므로 그대로 인물에 적용하지 않았다. 신발 확대 검토 후 SHOE-BOUNDARIES.json의 원본 경계로 y≥278 alpha만 보정한 removal-masks/가 최종이다. 실제 재현 입력은 이 확정 마스크이며 생성 마스크가 최종과 완벽히 일치했다고 설명하지 않는다.

scripts/prepare-marketing-person-v2.mjs는 기존 runtime marketer-sprite.webp의 디코딩 RGB에 이 마스크만 적용하고 무손실로 저장한다. 발 위/얼굴/팔/의상/위치가 동일함을 비교하며, GIF도 lib/card-showcase.ts의 원래15프레임4890ms 시간표로 만든다. [runtime 검사·해시](marketer/runtime-checks.json), [최종8포즈](marketer/marketer-cleaned-contact-pink.png). RGB를 재생성하거나 프레임을 회전/리샘플링하지 않았다.

재생성: **npm run prepare:marketing**. 이전 자산을 만들던 scripts/prepare-marketing-assets.mjs는 이력 도구로 남아 있으나 기본명령은 최신 v2를 만든다. [에이전트 원시 생성 검토 기록](GENERATION-REVIEW.md)의 절대 경로는 당시 외부 작업 폴더이며, 프로젝트의 영구 입력은 이 문서의 상대경로다.

모션·반응형·테스트·로컬 URL: [PAGE5-NOTES.md](../../../docs/pages/PAGE5-NOTES.md). 이번 작업은 로컬 반영이며 커밋·push·배포하지 않았다.
