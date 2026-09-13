# ONF 로고 이미지 검수 시안 01

- 날짜: 2026-09-11
- 방식: built-in `image_gen`, 기존 로고를 참조한 2D 이미지 생성
- 참조: `outputs/qa/2026-09-09/home/logo-inspection.png` (회사 제공 `public/images/onoff-logo-new.png`의 검수용 배경 합성본)
- 결과: `onf-signature-v1.png` (1536 × 1024)
- 용도: 사용자 이미지 검수용. 승인 전이며 사이트 적용·3D 변환·커밋·배포하지 않음.
- 방향: 기존 손글씨 ONF의 형태를 유지하며 획과 연결부를 보강한 흰색 평면 시안. 실제 벡터/3D 형상은 승인 후 별도 제작한다.
- 원본 생성 파일: `C:/Users/usewr/.codex/generated_images/01a0898e-9e7f-7921-9c0e-77cb6fd8b824/exec-5ab187fc-c950-474d-bbe3-62f15f37a50a.png`

## 사용 프롬프트

```text
Use case: logo-brand
Asset type: a single flat 2D company logo concept image for client approval, prior to any 3D modeling.
Input image: the reference is the company's EXISTING handwritten ONF monogram. It is the identity reference, not a scene to reproduce.
Primary request: refine this existing ONF signature into a strong, beautifully resolved central emblem for ON&OFF, a creative marketing agency. Retain the recognizable large forward-leaning O, flowing connected N, and signature F with its long sweeping top stroke. Preserve its distinctive handwritten rhythm and character. Make the strokes somewhat fuller, more optically balanced, and the narrow connections robust enough for later extrusion, without making it clumsy or losing the expressive original silhouette. The mark must read as O N F, not an abstract knot, and not an ampersand or a generic power button.
Style/medium: immaculate flat graphic identity artwork, smooth crisp vector-like edges rendered as a high quality bitmap. One continuous confident white ink signature, consistent professionally finished contours and generous clean counters. No sketch fuzz, no distressed texture.
Composition: landscape 3:2 canvas. One very large centered emblem with generous margins, its complete sweeping F terminal visible, occupying approximately 72 percent of canvas width. Only this one emblem, no duplicate marks, no presentation grids.
Color palette: solid #FFFFFF mark on a uniform flat #090A0F background.
Constraints: flat front-on 2D silhouette ONLY, no perspective, no bevels, no extrusion, no metallic material, no highlights, no shadows, no glow, no stars, no orbits, no mockups, no scene background, no captions or additional text, no watermark. This is a review of the actual company logo shape before it becomes 3D.
```
