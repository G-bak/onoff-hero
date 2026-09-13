# WHY 인물 동작 생성 기록

- 생성일: 2026-09-11
- 방식: 내장 image_gen 도구, 포즈 시트 생성 후 배경 교정
- 참고 인물: public/images/team-realistic-figurines-v3-photoroom.png의 왼쪽 위 파란 재킷 여성
- 최종 생성 원본: pose-sheet-green.png
- 첫 결과는 투명도 대신 체크 패턴이 들어가 사용하지 않았다. 인물과 8개 포즈를 보존하면서 단색 크로마 배경으로 교정한 후, scripts/prepare-why-person.mjs에서 배경 분리·발 기준 정렬·프레임 분할·GIF/스프라이트 조립을 수행한다.

## 포즈 생성 프롬프트

Create a production-ready photorealistic stop-motion CHARACTER SPRITE SHEET for an agency website. This is one single animation asset, exactly EIGHT consecutive poses of ONE identical adult woman in a strict 4 columns × 2 rows equal-cell grid, chronological left to right top row then bottom row. Landscape canvas 3:2. Every cell is exactly the same size.

REFERENCE: attached image is a style/character reference only. Use ONLY the TOP-LEFT woman: short dark bob haircut, cobalt-blue tailored blazer, white shirt, charcoal wide-leg trousers, white low sneakers, small black notebook in her left arm. Preserve her realistic adult proportions, clothes, hair and fine fabric detail. Do not use the other five characters. Remove the round pedestal. She stands on an invisible flat ground.

VIEW AND ACTION: fixed camera sees her from her REAR THREE-QUARTER angle, oriented diagonally toward screen LEFT. Mostly the back of the blue blazer and side of her hair are visible, only a tiny facial profile. In the same planted stance she gradually raises her free RIGHT arm to indicate something high at screen upper-left, with a small natural turn of the shoulders/head. Her left arm keeps the black notebook at her hip throughout. This will be played forward and backward as a gentle 'look, connect, return' loop on top of giant typography.
Eight sequential key poses:
1 relaxed rear-three-quarter stance, right hand near hip;
2 subtle weight shift, right elbow begins to lift;
3 right forearm rises in front of chest;
4 forearm extends toward upper-left, elbow still bent;
5 arm opens further diagonally upward;
6 right arm nearly extended, hand gently indicates upper-left;
7 reaches the pointing gesture with relaxed wrist;
8 holds the fully extended elegant diagonal pointing gesture, small upward glance.

CRITICAL ANIMATION CONSISTENCY: absolutely same woman, anatomy, outfit, color, camera angle, light, lens, distance, body scale, hips, legs and shoes across all eight cells. BOTH FEET stay planted at the identical local cell coordinates and identical baseline. Whole body and raised hand entirely inside each cell with margin. No horizontal locomotion, jumping, changing stature, back/front flip, cloned arms or changing notebook. The progression should be small adjacent changes, not eight different character designs. Soft neutral photographic studio light, crisp realistic cutout edges, no motion blur. No shadow baked on a floor.

BACKGROUND: genuine alpha transparency over the entire sheet and between figures. NOT a drawn checkerboard, NOT a white, black or colored background. No grid lines, cell borders, numbers, letters, labels, typography, watermark, panels, scene, floor, pedestal or props except the notebook. Clean transparent PNG sprite-sheet asset, eight complete full-body figures at equal spacing.

## 배경 교정 프롬프트

Edit ONLY the background of this exact 8-pose sprite sheet. Preserve every figure pixel and every pose, size, location, outfit, notebook, hair, shoes, fixed camera, and the exact 4-by-2 grid composition as faithfully as possible. Replace ALL the gray-white checkerboard (including all gaps between arms/torso and between legs) with one perfectly flat, unlit, completely uniform bright chroma green RGB #00FF00. No green spill or lighting on the subjects. This is a technical green-screen source plate for extracting transparent animation frames. Do NOT draw a checkerboard or pretend transparency. Background must be entirely uniform saturated pure green. Keep the original 1536 by 1024 dimensions and preserve all eight full-body figures. No new poses, no text, no grid lines, no outlines, no shadows, no floor, no pedestal. Change the background ONLY.
