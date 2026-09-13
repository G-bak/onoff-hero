# DESIGN / WEB presenter motion

현재 DESIGN은 [v4 원본 기준·실제 포즈 반복](v4/README.md), WEB은 [v5 WEB 쓰기·새 칠판](v5/README.md)이다. 두 인물 모두 받침대 없이 반복하며, 마지막 자세 유지는 SYSTEM에만 적용한다. 아래와 v2/v3, v4의 이전 WEB은 보관 기록이다.

2026-09-12 earlier request: add a designer to the approved page03 and a web presenter to the new video-led page04. These are fictional role characters, matching the existing SYSTEM crew identities, not representations of real employees.

Built-in ImageGen generated one eight-pose sheet per character, then corrected the baked checkerboard into controlled chroma green. The two final generated sheets are `designer-presentation-chroma.png` and `web-presentation-chroma.png`. All four exact generation/edit prompts are saved alongside them as `*.prompt.txt`. Initial unusable checkerboard versions remain outside the checkout in `../onoff-person-assets-20260912/` and are not runtime assets.

Designer: cream shirt, dark trousers, portfolio, natural arm lift and presenting gesture. Developer: navy cardigan, glasses, slim laptop, natural gesture toward the film. Eight photographed poses per character retain face, clothing and complete feet. No CSS rotation/flip is used to simulate body motion. Designer source poses are ordered 0,1,4,2,3,5,6,7 to make the intermediate arm movement more continuous.

`node scripts/prepare-presenter-assets.mjs` separates the controlled chroma, aligns feet and preserves each pose at one shared scale. It outputs 240×320 frames, a 1920×320 WebP strip for each person and a seven-second, 15-frame ping-pong GIF. Runtime files: `app/assets/people-motion/designer-motion.webp` (96,828B), `developer-motion.webp` (94,528B). GIF copies: `design/archive/public/images/people-motion/designer.gif` and `web.gif`. Exact frame timing lives in `animation.json`; CSS keyframes in `app/people-motion.css` mirror this timing.

The site uses the strip to control pause/resume without continuously scheduling JavaScript frames. `PersonMotion` waits for image loading; `useSceneActivity` observes actual visibility, document hidden, ancestor inert, active chapter and covered state. MOTION OFF pauses at the current frame, reduced motion displays the final gesture. These two presenters loop gently; the SYSTEM crew's one-shot/final-back-pose behavior is unchanged.
