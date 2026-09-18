# 마케팅 상세 전용 카드 — 2026-09-17

2026-09-18 후속으로 사용자가 제공한 [SNS·블로그·캠페인3개 이미지](../detail-cards-v2/README.md)가 현재 로컬 상세02에 적용됐다. 이 문서와 생성 원본·실행 자산은 이전 버전 재현용으로 보존한다.

사용자가 기존 블로그·광고 이미지를 새로 만들도록 요청했다. 왼쪽 인스타그램 카드와 나란히 사용할 수 있도록 두 이미지를 처음부터1:2 세로 구성으로 다시 생성했다. 이 요청은 앞선 원본 이미지를 여백 안에 맞추는 작업의 후속 지시다.

2026-09-17 후속으로 사용자가 마케팅 수정 전체의 운영 배포를 승인했다. 아래 로컬 전용 표기는 제작 당시의 기록이며 새 이미지2개도 이번 배포에 포함한다. 실제 결과는 [배포 기록](../../../docs/operations/DEPLOYMENT-NOTES.md)에 남긴다.

내장 ImageGen으로 각 이미지1회씩 총2회 생성했다. 원본은887×1774 PNG이며 두 이미지 모두 정확한1:2다. 생성 이미지의 문구·구도는 육안으로 확인했다. 사이트에서의 브라우저 시각 검수와는 구분한다.

| 이미지 | 원본 | 실행 자산 |
| --- | --- | --- |
| 루움 침구 블로그 | [blog-ruum.png](sources/blog-ruum.png) | [detail-blog-ruum-v1.webp](../../../app/assets/marketing/detail-blog-ruum-v1.webp) |
| 모닝오븐 입간판 광고 | [poster-morning-oven.png](sources/poster-morning-oven.png) | [detail-campaign-morning-oven-v1.webp](../../../app/assets/marketing/detail-campaign-morning-oven-v1.webp) |

블로그는 라임 머리글·큰 제목·침구 사진·소재/두께/세탁의3개 항목과 마무리를 한 장에 담는다. 광고는 모닝오븐의 노랑/빨강 인쇄물, 샌드위치·아이스 아메리카노, 나무 입간판과 빵집을 세로 구도로 구성한다. 블로그 제목·세 항목·하단 문구와 광고의 브랜드·메뉴·간판 발이 온전히 보이는 것을 확인했다. 모두 가상 브랜드·제작 시안이며 실제 실적이나 설치 사진으로 소개하지 않는다.

정확한 전체 프롬프트는 [블로그](blog.prompt.txt)와 [광고](campaign.prompt.txt), 입력·도구 정보는 [생성 기록](generation.json), 해시는 [자산 기록](assets.json)에 보관한다.

사이트용 자산은 `node scripts/prepare-marketing-detail-cards.mjs`로720×1440 WebP를 만든다. 이 변환은 구도를 자르거나 늘이지 않고 크기와 인코딩만 조정한다. 생성 PNG는 배포 자산으로 가져오지 않는다. `ServiceExampleImage`의 `blogDetail`·`campaignDetail`을 마케팅 상세02에서만 사용한다. 기존 인스타그램 카드와 HOME·HERO에 쓰는 이전 미디어는 보존한다. 상세의 기존 하단 설명·가상 시안 고지·반응형은 유지한다. 로컬만 반영하며 배포하지 않는다.
