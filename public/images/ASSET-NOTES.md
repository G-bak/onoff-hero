# ON&OFF visual assets

## Supplied company logo

`onoff-logo-new.png`: user-provided 1536 × 1024 transparent PNG. This is the source of the handwritten header logo and both favicons. The original is preserved unchanged.

`onoff-logo.png`: same logo, transparent outer padding trimmed and resized to 420px wide. Header displays only this image.

`../favicon-onoff-32.png` and `../favicon-onoff-64.png`: the complete supplied mark, resized on a fully transparent canvas. The source alpha is preserved; no background color, generated artwork or redrawn logo is added. Preparation is reproducible with `node scripts/prepare-brand-assets.mjs`. The page requests the transparent version with a cache-busting query.

## Archived: team-miniatures.png

Generated with OpenAI ImageGen, 2026-09-09. 1254 × 1254 px, flush 3-column × 2-row atlas; each panel is 418 × 627 px.

Six fictional adult creative-agency miniatures in a cohesive resin/clay collectible style. Full-body figures and plinths are visible. Reading order: strategist with notebook / creative director with color swatches / designer with tablet / filmmaker with camera / developer with laptop / media planner with chart board.

No real employee likenesses or personal names were supplied. The avatars illustrate role placeholders; employee data lives in `lib/team.ts`. Characters occupy most of each panel, so the full source cell is contained in the card without a cover crop. Source asset is preserved as generated. The cards identify the imagery as `CHARACTER EDITION`.

## Preview: team-realistic-figurines.png

Generated with the built-in OpenAI ImageGen tool, 2026-09-09, using `team-miniatures.png` as the reference. Copied into this project at the user's request; the generated original is retained. 1254 × 1254 px, 3 columns × 2 rows, with the same role order as the active atlas. The source image and copied file have matching SHA-256 hashes.

Realistic adult proportions, lifelike sculpted faces, detailed clothing and miniature accessories, photographed as physical collectible figurines on circular plinths. This is an alternative preview and is not currently loaded by the page. The original `team-miniatures.png` remains intact.

Generation prompt:

> Create ONE new alternative image from the supplied reference, changing the stylized characters into photorealistic physical collectible figurines. Use case: product-mockup, a creative agency team figurine contact sheet. Preserve the reference's exact 3 columns by 2 rows composition, exactly six separate full-body adult figures with round pale-gray display bases, the role order, clothing palette and role props. Completely replace the cute cartoon anatomy and faces with realistic adult human anatomy: natural small heads at approximately 1:7.5 body proportions, realistic eyes, noses, lips, facial bone structure and believable hands. These must look like tangible, high-end 1:6 scale sculpted resin statues of fictional Korean creative professionals aged roughly 28–42, photographed in a product photography studio. Give them lifelike individually sculpted faces, fine realistic hair detail, subtly hand-painted skin with restrained resin sheen, finely detailed garments and miniature accessories. Their bases, sculpted materials and tabletop studio photography should clearly communicate real collectible figurines. Upper left: female brand strategist, chin-length black bob, cobalt blue blazer, dark trousers, notebook. Upper center: male art director, wavy black hair, round glasses, charcoal casual suit, color swatch fan. Upper right: female visual designer, tied-back dark hair, ivory shirt, dark trousers, pen tablet and stylus. Lower left: male filmmaker, dark knit beanie, short realistic beard, black T-shirt and cargo trousers, detailed miniature cinema camera. Lower center: female developer, short dark hair, glasses, navy cardigan, light shirt, open silver laptop. Lower right: male media planner, short dark hair, gray shirt and trousers, chart board with simple blue graphics and a restrained lime color. Calm professional expressions and relaxed standing poses. Cohesive cool light-gray seamless studio backgrounds in all six equal cells, uniform soft side lighting, realistic contact shadows beneath bases, high-quality macro product photography with all figurines in sharp focus. Square overall image; each of the six cells has a 2:3 portrait aspect ratio. Full head, hands, feet, props and complete pedestal comfortably inside each cell, aligned scales and ample headroom. No dividing lines, no panel borders, no written labels, no text, no logos, no watermark, no extra people. No chibi, no oversized heads, no animation character look, no toy-like large eyes, no clay cartoon simplification. Produce exactly one composite image containing all six figurines.

## Preview: team-realistic-figurines-v2.png

Generated with the built-in OpenAI ImageGen tool, 2026-09-09, in response to the request for less artificial-looking people. 1254 × 1254 px; six fictional adults in the same 3-column × 2-row role arrangement, with full-body framing and circular plinths. Faces, proportions, skin texture, expressions and clothing drape use a more natural photographic treatment. The previous preview was used for layout, clothing and props.

Saved in the project and verified against the generated original using SHA-256. Earlier images remain intact. This preview is not currently loaded by the website and has not been deployed. Exact prompt: [team-realistic-figurines-v2.prompt.md](team-realistic-figurines-v2.prompt.md).

## Preview: team-realistic-figurines-v3.png

Generated with the built-in OpenAI ImageGen tool, 2026-09-09, after the user found v2 too gloomy. 1254 × 1254 px, same six roles in a 3-column × 2-row sheet. The edit adds varied natural smiles and brighter, warmer-neutral lighting while preserving realistic faces, clothing, props and plinths.

Copied into the project and verified against the generated original using SHA-256. Previous versions remain intact. This is a preview, not connected to the page or deployed. Exact prompt: [team-realistic-figurines-v3.prompt.md](team-realistic-figurines-v3.prompt.md).

## Archived original: team-realistic-figurines-v4.png

Generated with the built-in OpenAI ImageGen tool, 2026-09-09, from v3 after the user requested a more recognizable realistic figurine treatment. 1254 × 1254 px; the same six roles, full-body 3-column × 2-row composition, plinths and friendly expressions. The material direction emphasizes painted resin skin, sculpted hair, modeled garment folds and miniature accessories while retaining adult proportions.

Copied into the project and verified against the generated original using SHA-256. Initially applied to the local site at the user's request on 2026-09-09; subsequently replaced in the WebGL atlas loader and CSS fallback by the user-supplied Photoroom cutout. The original and previous versions remain intact. Not deployed. Exact prompt: [team-realistic-figurines-v4.prompt.md](team-realistic-figurines-v4.prompt.md).

Local presentation adjustment: render the full portrait cell at 35% of its original width and height, centered in the existing portrait area, to reduce facial prominence. The user requested a substantially smaller figure after the first 75% preview. The fallback uses the same scale. Card dimensions, typography, motion and the original image file are unchanged; no image regeneration was needed.

## Supplied cutout: team-realistic-figurines-cutout.png

Supplied by the user on 2026-09-09 as `Firefly_RemoveBackground.png`. Copied unchanged into the project. 1254 × 1254 px, RGBA PNG, same 3-column × 2-row arrangement. Verified actual alpha transparency: 1,097,364 fully transparent pixels, 65,734 partially transparent pixels and 409,418 opaque pixels. The checkerboard seen in the attachment preview is not an opaque background in this file.

Copy SHA-256: `d4ad2a926f13041eeb60df24697bdcb9c513db0b56ccec5654e5bcba50dabc29`. The original `team-realistic-figurines-v4.png` remains unchanged (SHA-256 `287f6647bce3d94e7975cf58f798d6e15a75492285866cf9504d15906f980966`). This user-supplied cutout supersedes the assistant's pending background-removal work. The two earlier generated checkerboard attempts were not valid transparent PNGs and were not integrated.

Stored separately; not connected to the page or deployed. Superseded by the later user-supplied Photoroom cutout below.

## Previous cutout: team-realistic-figurines-photoroom.png

Supplied by the user on 2026-09-09 as `exec-273b28cc-bbd6-401c-bb14-d617f7c9d1f6-Photoroom.png`. Copied without modification and applied to both the WebGL cards and CSS fallback at the user's request. The 35% portrait scale, card dimensions and motion settings remain unchanged. Earlier source images and the Firefly cutout are preserved. No deployment.

1254 × 1254 px, RGBA PNG, same 3-column × 2-row layout. Actual transparency verified: 1,083,318 fully transparent pixels, 47,813 partially transparent pixels and 441,385 opaque pixels. SHA-256: `e2e3fe9a15128b144e5140f6567dac06b44790c0f0927546062a424f62c56a5b`.

## Active card atlas: team-realistic-figurines-v3-photoroom.png

Supplied by the user on 2026-09-09 as `C:/Users/usewr/Downloads/team-realistic-figurines-v3-checker-Photoroom.png`. Copied unchanged, preserving the original and all previous variants. This replaces the older Photoroom atlas in both the WebGL cards and the CSS fallback. The preceding red and checkerboard variants were background-edit previews; the user removed the background externally and supplied this actual transparent PNG.

1254 × 1254 px, RGBA, 3 columns × 2 rows, original role mapping. Alpha verified: 1,089,035 fully transparent pixels, 49,373 partial pixels and 434,108 opaque pixels. SHA-256: `74a2d097b4d6a11b70b967933335cd6038b9551856abc4df5d1c9ef8ed466fd9`.

The user supplied `KakaoTalk_20260909_174935801.png` as the card-layout reference: copy grouped above a light gray rounded panel, with a small figure overlapping the panel at lower right. The site's native canvas texture implements this layout; the reference screenshot itself is not used as a card. Six role-to-person mappings remain intact rather than copying the reference's designer figure onto the media-planner card. Full figures, props, feet and plinths remain visible. The current reference-based layout supersedes the earlier centered 35% placement: source-cell height is now 386 on an 880px-tall texture, and visible silhouettes occupy roughly 350px. CSS fallback mirrors the same proportions.

Reference and source-alpha verification: `outputs/card-style-2026-09-09/`. The user explicitly requested deployment of the completed style; see root `DEPLOYMENT-NOTES.md` for the final deployment status.

## Runtime delivery: generated lossless WebP — 2026-09-10

The active PNG above remains the unchanged source. `scripts/team-asset.config.mjs` selects it; `npm run prepare:assets` uses the existing Sharp dependency to generate `app/assets/generated/team-atlas.webp`. This directory is ignored by Git and regenerated automatically before development and production builds.

Original PNG: 1,237,554 bytes. Lossless WebP: 669,962 bytes (45.86% smaller). Both are 1254 × 1254. Generation verifies every alpha value and every RGB value with nonzero alpha: zero differences. RGB hidden under fully transparent pixels may be normalized by WebP and is not used to judge visual fidelity. No resize, crop, palette reduction, or character redesign is performed.

Both the WebGL loader and fallback backgrounds use the same imported URL. Vite emits a content-hashed filename for cache updates. The production asset check compares its bytes with the verified generated image. Old source variants remain archived; they are not requested by the active card loader.

## Page 02 supplied graphics — 2026-09-10

The user supplied `2페이지 시안/page2.png`, its guide, and `2페이지 시안/05_Digital/page2-graphic1.png` / `page2-graphic2.png`. The two transparent brush PNGs are imported with Vite content hashes. The mockup itself is a reference, not a screenshot used in place of HTML.

The page 02 character reuses the first cell of the existing verified team atlas as a decorative CSS background. The original atlas, first-screen card crop, and all other characters remain unchanged. No new character image was generated. Layout and responsive decisions are recorded in `PAGE2-NOTES.md` at the repository root.

## Archived: studio-atlas.png

Generated with OpenAI ImageGen, 2026-09-09. 1254 × 1254 px, flush 3-column × 2-row grid. Each cell is 418 × 627 px.

Reading order: cobalt glass loop / folded silver ribbon / chartreuse acrylic block / glossy black sphere with blue light / folded white and blue paper / coral glass disc and brushed metal cylinder.

Invented studio still-life photography for creative explorations. These are not real client projects, product endorsements, or company achievements. Image contains no logos or text; all labels and ON&OFF marks are drawn in the interface. The generated atlas is preserved; each card uses a cover crop at render time.

## Archived: artist-atlas.png

Generated for the first reference study. Six fictional adult portraits, 1254 × 1254 px. Retained in the project for history and no longer loaded by the ON&OFF page.
