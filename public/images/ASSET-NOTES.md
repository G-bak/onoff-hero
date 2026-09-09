# ON&OFF visual assets

## Supplied company logo

`onoff-logo-new.png`: user-provided 1536 × 1024 transparent PNG. This is the source of the handwritten header logo and both favicons. The original is preserved unchanged.

`onoff-logo.png`: same logo, transparent outer padding trimmed and resized to 420px wide. Header displays only this image.

`../favicon-onoff-32.png` and `../favicon-onoff-64.png`: the complete supplied mark, resized on a fully transparent canvas. The source alpha is preserved; no background color, generated artwork or redrawn logo is added. Preparation is reproducible with `node scripts/prepare-brand-assets.mjs`. The page requests the transparent version with a cache-busting query.

## Active: team-miniatures.png

Generated with OpenAI ImageGen, 2026-09-09. 1254 × 1254 px, flush 3-column × 2-row atlas; each panel is 418 × 627 px.

Six fictional adult creative-agency miniatures in a cohesive resin/clay collectible style. Full-body figures and plinths are visible. Reading order: strategist with notebook / creative director with color swatches / designer with tablet / filmmaker with camera / developer with laptop / media planner with chart board.

No real employee likenesses or personal names were supplied. The avatars illustrate role placeholders; employee data lives in `lib/team.ts`. Characters occupy most of each panel, so the full source cell is contained in the card without a cover crop. Source asset is preserved as generated. The cards identify the imagery as `CHARACTER EDITION`.

## Archived: studio-atlas.png

Generated with OpenAI ImageGen, 2026-09-09. 1254 × 1254 px, flush 3-column × 2-row grid. Each cell is 418 × 627 px.

Reading order: cobalt glass loop / folded silver ribbon / chartreuse acrylic block / glossy black sphere with blue light / folded white and blue paper / coral glass disc and brushed metal cylinder.

Invented studio still-life photography for creative explorations. These are not real client projects, product endorsements, or company achievements. Image contains no logos or text; all labels and ON&OFF marks are drawn in the interface. The generated atlas is preserved; each card uses a cover crop at render time.

## Archived: artist-atlas.png

Generated for the first reference study. Six fictional adult portraits, 1254 × 1254 px. Retained in the project for history and no longer loaded by the ON&OFF page.
