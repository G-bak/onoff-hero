# 마케팅 상세 사용자 제공 카드 3종 — 2026-09-18

사용자가 직접 첨부한 SNS·블로그·캠페인 이미지를 `/services/marketing`의02 작업 범위 예시 카드에 순서대로 적용한다. 세 원본은 모두720×1460 PNG이며 이미지의 문구·여백·배치를 변경하지 않는다.

| 카드 | 사용자 원본 이름 | 보관 원본 | 실행 자산 |
| --- | --- | --- | --- |
| SNS | 가상사례이미지-SNS.png | [sns-lumet.png](sources/sns-lumet.png) | [detail-sns-lumet-v2.webp](../../../app/assets/marketing/detail-sns-lumet-v2.webp) |
| 블로그 | 가상사례이미지-블로그.png | [blog-nourve.png](sources/blog-nourve.png) | [detail-blog-nourve-v2.webp](../../../app/assets/marketing/detail-blog-nourve-v2.webp) |
| 캠페인 | 가상사례이미지-캠페인.png | [campaign-ploop.png](sources/campaign-ploop.png) | [detail-campaign-ploop-v2.webp](../../../app/assets/marketing/detail-campaign-ploop-v2.webp) |

`node scripts/prepare-marketing-detail-cards-v2.mjs`로 무손실 WebP를 만든다. 크롭·리사이즈·이미지 생성 없이 형식만 변환하며 변환 전후 픽셀 일치를 검사한다. 원본과 실행 자산의 크기·용량·SHA-256은 [자산 기록](assets.json)에 있다.

SNS 원본에 이미 게시물 UI가 포함돼 있으므로 상세02의 기존 HTML 인스타그램 미리보기를 새 이미지로 바꾼다. HERO와 HOME의 기존 인스타그램·블로그·포스터 및 콘텐츠 데이터는 유지한다. 세 카드의 공통 프레임·전체 이미지 맞춤·ResizeObserver·반응형 배치는 유지하고 기본 프레임 비율만720/1460으로 맞춘다.

블로그 분류는 새 영양제 콘텐츠에 맞춰 `HEALTH / BLOG`로 변경한다. 이미지 대체 텍스트도 LUMET·NOURVE·PLOOP 시안에 맞춘다. 나머지 제목·설명·반응 안내와 가상 브랜드/수치 예시 고지는 유지한다. 이미지 속 반응 수와 상품 표현을 회사의 실제 실적이나 보장 문구로 옮기지 않는다.

이전 생성 카드2개와 원본은 [v1 기록](../detail-cards-v1/README.md)에 보존한다. 로컬 검증 후 사용자 요청으로 GitHub 반영·운영 배포를 진행한다. 실제 완료는 [배포 기록](../../../docs/operations/DEPLOYMENT-NOTES.md)을 따른다.
