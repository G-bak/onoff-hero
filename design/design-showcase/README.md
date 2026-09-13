# DESIGN / 03 assets — 이전 추상 시안 보관

현재 화면은 [고객 목적별 v2 포트폴리오](v2/README.md)를 사용한다. 아래 ON / FORM·FORM·OFF GRID는 이전 시안의 원본과 생성 기록이며 현재 앱에서 불러오지 않는다.

Original fictional in-house ON&OFF design studies, created with the built-in `image_gen` tool. These are concept work, not real client credits. One request per asset, three requests in one parallel batch; no variants or retries. All original images were inspected before integration.

| Asset | Original | Runtime WebP | Size |
| --- | --- | --- | --- |
| Brand identity / ON FORM | `sources/identity.png` | `../../app/assets/design-showcase/design-identity.webp` | 720×900, 34,618 bytes |
| Packaging / FORM | `sources/package.png` | `../../app/assets/design-showcase/design-package.webp` | 720×900, 59,300 bytes |
| Editorial / OFF GRID | `sources/editorial.png` | `../../app/assets/design-showcase/design-editorial.webp` | 720×900, 42,654 bytes |

Originals: 1122×1402 PNG. Archived exports preserve the portrait composition at 4:5, quality86 WebP. Combined artwork:136,572 bytes. `node scripts/prepare-design-assets.mjs --legacy` regenerates these archived exports and their `assets.json` hashes. These were previously shared by Three.js and fallback HTML, then reused in the CSS3D editorial layout. They are no longer imported by the app; raw sources are not served.

## Exact generation prompts

### BRAND

```text
Use case: logo-brand
Asset type: original full-bleed portrait 4:5 brand identity artwork for a fictional in-house ON&OFF agency design study, intended to be mapped directly onto a rigid 3D portfolio board.
Primary request: Create one exceptionally polished graphic identity poster, modern Swiss design meets Seoul experimental editorial. Strong graphic composition with large sophisticated expressive Montserrat-style bold geometric sans-serif typography reading "ON / FORM", and an abstract sculptural folded ribbon or cut-paper letterform as the centerpiece.
Color palette: electric cobalt #343CFF, clean cream-white #FFFFFF, near-black #090A0F, with only a tiny neon-lime #D8FF3E accent.
Style/medium: flat finished poster artwork with a beautifully rendered sculptural folded-paper/ribbon centerpiece, crisp intentional graphic edges, sophisticated print-ready visual hierarchy, spacious but striking.
Text (verbatim): "ON / FORM" and "IDENTITY STUDY 01". These are the only visible text strings. Make every letter crisp and correctly spelled.
Composition/framing: full bleed portrait 4:5, high resolution suitable for a 720x900 final export, the composition fills the entire image. Present the poster straight on; no perspective frame or surrounding room.
Constraints: one final image only. Original fictional in-house design study; no invented client claims, awards, credits, extra logos or brands. No website UI, interface panels, devices, photo mockup surroundings, frame, mat, outer border, watermark, or extra text.
```

### PACKAGE

```text
Use case: product-mockup
Asset type: original full-bleed portrait 4:5 packaging design photograph for a fictional in-house ON&OFF agency portfolio study, intended to be mapped directly onto a rigid 3D board.
Primary request: Create one high-end studio packaging concept photograph for fictional brand "FORM": a cobalt rectangular paper box, a cream tube or bottle, and neon-lime flat labels. Use strong sophisticated geometric typography and a small circular graphic identity system. Design the actual packages beautifully and make the object arrangement fill the portrait composition.
Scene/backdrop: warm-white studio background and floor flowing continuously to the image edges, with hard directional shadows.
Style/medium: realistic luxury art-directed product photography in a three-quarter view, clean sculptural arrangement, premium paper and subtle embossed textures, detailed believable materials.
Color palette: electric cobalt #343CFF, cream-white, near-black #090A0F typography and lime #D8FF3E label accents.
Text (verbatim): "FORM" and "DAILY OBJECTS". These are the only visible text strings; they may repeat across the coordinated packaging. Crisp, accurate lettering.
Composition/framing: portrait 4:5, high resolution suitable for a 720x900 final export, full bleed, objects confidently occupying most of the image with deliberate breathing room.
Constraints: one final image only. Original fictional in-house design study, no real brand, no client/award claims. No website UI, interface panels, devices, people, hands, frame, border, watermark, additional copy, ingredient lists, or random tiny illegible text.
```

### EDITORIAL

```text
Use case: ads-marketing
Asset type: original full-bleed portrait 4:5 editorial magazine cover artwork for a fictional in-house ON&OFF agency design study, intended to be mapped directly onto a rigid 3D portfolio board.
Primary request: Create one striking independent creative magazine cover, a sophisticated fashion/art publication with a huge confident title "OFF GRID" and a tiny precise line "DESIGN JOURNAL / 03". White and near-black art direction accented with neon lime, featuring a blue geometric sculptural still life across the lower two-thirds: a beautifully folded translucent cobalt acetate sculpture with luminous facets on pale paper.
Style/medium: flat completed magazine cover graphic, editorial typography and beautifully photographed or photoreal sculptural still life, tactile pale paper, premium contemporary art direction.
Color palette: white, near-black #090A0F, lime #D8FF3E accents and electric cobalt #343CFF sculpture.
Text (verbatim): "OFF GRID" and "DESIGN JOURNAL / 03". These are the only visible text strings. Make typography crisp, correctly spelled, and elegantly aligned.
Composition/framing: full-bleed portrait 4:5, high resolution suitable for a 720x900 final export. Present the cover artwork perfectly front-on, filling the entire image, huge title above and sculpture dominating the lower two-thirds with deliberate editorial spacing.
Constraints: one final image only. Original fictional in-house concept; no real publication or client claims, no bylines or extra text. No website UI, interface panels, devices, book mockup edges, room surroundings, frame, border, watermark, barcode, or extra logos.
```

2026-09-12 editorial redesign: the same three assets now appear in a single large CSS3D print proof and functional thumbnail index, with five staggered vertical print strips. No new image generation. app/components/design-editorial.tsx and app/design-editorial.css replace the former three-board DESIGN variant; marketing keeps its independent Three.js scene. Sources and export hashes are unchanged.
