# ON&OFF visual assets

> 원본·생성 과정의 날짜별 보관 기록이다. 당시 Active/current 표현은 각 기록 시점에 한정한다. 현재 자산 기준은 [문서 색인](../../../../docs/README.md)과 각 최신 design README를 따른다. 비교 GIF와 구형 이미지·폰트는 2026-09-13 public에서 이 폴더로 이동했다.

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

Reference and source-alpha verification: `outputs/qa/2026-09-09/card-style/`. The user explicitly requested deployment of the completed style; see root `DEPLOYMENT-NOTES.md` for the final deployment status.

## Runtime delivery: generated lossless WebP — 2026-09-10

The active PNG above remains the unchanged source. `scripts/team-asset.config.mjs` selects it; `npm run prepare:assets` uses the existing Sharp dependency to generate `app/assets/generated/team-atlas.webp`. This directory is ignored by Git and regenerated automatically before development and production builds.

Initial conversion on 2026-09-10: original PNG 1,237,554 bytes; lossless WebP 669,962 bytes (45.86% smaller), both 1254 × 1254. Generation verified every alpha value and every RGB value with nonzero alpha: zero differences. RGB hidden under fully transparent pixels may be normalized by WebP and is not used to judge visual fidelity. This initial conversion did not resize or crop the source.

Resolution reduction on 2026-09-11, requested by the user: the current runtime atlas is 768 × 768, with six 256 × 384 cells matching the card texture's 386px portrait height. Sharp uses Lanczos3 resampling, then lossless WebP encoding. The original PNG remains unchanged; full cells, role mapping, card dimensions and text resolution are preserved. Current WebP: **291,928 bytes**, down **56.43%** from the prior WebP. The generator checks equal 3 × 2 cell divisions and compares all alpha and visible RGB values against the resized reference. Desktop, mobile and WebGL fallback browser checks passed; the production build verifies the emitted image matches. This reduction is local only pending deployment.

Both the WebGL loader and fallback backgrounds use the same imported URL. Vite emits a content-hashed filename for cache updates. The production asset check compares its bytes with the verified generated image. Old source variants remain archived; they are not requested by the active card loader.

Display-size adjustment on 2026-09-11: the user chose a slightly smaller first-page figure instead of a further resolution reduction. The canvas and CSS fallback now draw each figure at 90% of its previous width and height, anchored at the original cell's bottom center. The 386px base portrait height becomes 347.4px on the card texture. The 768 × 768 WebP and its 291,928-byte file remain unchanged, as do the card, backdrop, typography and separate second-page character. Local only.

## Active Page 02 step-turn gesture v3 — 2026-09-12

The user requested a shorter gap between galaxy formation and fleet arrival, plus a more lifelike turn. ImageGen produced five new eight-pose turn sheets (40 new poses), each 1536 × 1024. The figures lift a foot, bend the knee, shift weight, pass through a side view and plant the following foot. A targeted Strategy edit aligns its first footfall stages with the other four. Source sheets, prompts, provenance and inspection are in `design/galaxy-crew/v3/`.

The generator normalizes the two standing endpoints and interpolates only their framing correction; it no longer flattens every intermediate pose to the same crown height. The plinth baseline remains aligned. Existing v2 frames 08–15, including the left-wrist X and individual final stances, are copied byte-for-byte. No figure is mirrored or CSS-rotated.

Active WebP: `app/assets/galaxy-crew/crew-sprite.webp`, 3840 × 1600, **852,290 bytes**. GIF: `design/archive/public/images/galaxy-crew/team-salute.gif`, 912 × 320, 16 frames, **885,180 bytes**, **one iteration**. All five share the same nonuniform footfall timetable: front 180ms, final pose reached at 1370ms and held. Scroll replay, visibility pause, reduced-motion final pose and title-immediate crew entrance remain. Fleet entry starts at scene time 3.05s instead of 4.1s, about 0.75 real seconds earlier at the unchanged 1.4× galaxy rate. Local only; no commit, push or deployment.

## Archived Page 02 one-pass gesture v2 with wrist X — 2026-09-12

The user's follow-up requested a shorter front pause, smoother anatomical turning, an X on the raised left wrist, different final stances, and a single play ending on the back pose. Five new 16-pose sheets were generated and corrected using the existing agency identities and the supplied gesture reference. Selected sources, exact prompts and inspection notes are under `design/galaxy-crew/v2/`. The active poses are not mirrored and their X marks are generated pixels.

`scripts/crew-sheet.mjs` extracts complete connected silhouettes, including fists that cross nominal contact-sheet rows, and normalizes crown-to-base height before aligning feet. `npm run prepare:galaxy-crew` produces 80 transparent 240 × 320 frames and validates that alignment clips no body/wrist. Existing eight-pose sources are archived.

At this archived revision, the WebP was 3840 × 1600 and **791,866 bytes**; the GIF was 912 × 320, 16 frames and **858,147 bytes**, with **one iteration**. The front pause was 180ms and the final pose was reached at 1240ms. These exported runtime files have been superseded by v3; original sheets and extracted v2 frames remain available for reproduction and the retained lift sequence.

## Archived Page 02 eight-pose synchronized team gesture — 2026-09-12

The user requested five characters turning from the front to the back and raising their left wrists together, using the gesture illustrated in [this Media Today article](https://www.mediatoday.co.kr/news/articleView.html?idxno=121889) as a reference. The built-in image tool generated eight poses for each of the existing five fictional agency characters. The article image, manga characters, wrist marks and costumes are not website assets.

Selected green-background sheets, exact prompts, reviewed frame orientation, transparent frames and alignment metadata are preserved in `design/galaxy-crew/`. `npm run prepare:galaxy-crew` keys the backgrounds, aligns the feet without clipping, corrects selected rear-facing poses to the same anatomical left arm, and builds both delivery formats from one shared timeline. See `design/galaxy-crew/README.md`.

The website uses one imported, content-hashed WebP: `app/assets/galaxy-crew/crew-sprite.webp`, 1920 × 1600, **413,024 bytes**, eight pose columns and five character rows. All five rows share one CSS frame position driven by the galaxy clock. The independent preview is `design/archive/public/images/galaxy-crew/team-salute.gif`, 912 × 320, 14 playback frames, **822,302 bytes**, a 4.54-second loop. The website does not load five independent GIF players. Decoding failure keeps the existing front portraits. Page 01's atlas is unchanged. Local only; no commit, push or deployment.

## Archived Page 02 universe conductor — 2026-09-11

The user requested a new space-inspired 3D connection scene and matching character animation. The built-in image tool generated one fictional adult woman in a silver jacket, rear three-quarter view, gradually gathering and directing an imaginary constellation. Original and exact prompt: `design/why-universe/pose-sheet.png` and `generation.prompt.md`. The returned 1536×1024 PNG contains actual alpha transparency; no chroma-key removal is needed.

Eight aligned 240×320 poses become a forward/reverse 2.62-second loop. Active website image: `app/assets/why-universe/conductor-sprite.webp`, 1920×320, 100,376 bytes. Independent transparent GIF: `design/archive/public/images/why-universe/conductor.gif`, 14 playback frames, 240,264 bytes. The website requests only the hashed WebP and uses the same generated timing as the GIF. The generator validates alpha, cell divisions, alignment without clipping, GIF frame count and delays. Regenerate with `npm run prepare:why-person`; see `design/why-universe/README.md`.

The central star, orbiting stars and connections are native Three.js geometry with an SVG fallback. Previous brush marks and the blue-jacket character are archived and no longer imported. Page 01 team images and page 03 magazine artwork remain unchanged. This redesign is local only, without commit, push or deployment.

## Archived Page 02 supplied graphics — 2026-09-10

The user supplied `2페이지 시안/page2.png`, its guide, and `2페이지 시안/05_Digital/page2-graphic1.png` / `page2-graphic2.png`. The two transparent brush PNGs are imported with Vite content hashes. The mockup itself is a reference, not a screenshot used in place of HTML.

The initial page 02 character reused the first cell of the existing verified team atlas. On 2026-09-11, the user requested a new animated side/rear view. The local version now uses an independently generated eight-pose sprite, with a transparent preview GIF at `why-person/gesture.gif`. The website loads only the 113,374-byte WebP sprite and pauses it when hidden, outside the viewport, behind HOME, or switched off. Reduced motion shows a still pose. The original team atlas, first-screen card crop, and all other characters remain unchanged. Source, frames, exact prompts, references and the shared GIF/CSS timeline are recorded in `design/why-person/README.md` at the repository root. This change is local only pending a deployment request.

## Archived Page 03 THE CARD interface artwork — 2026-09-11

On 2026-09-11 the user explicitly deleted the former DESIGN page, including its component, CSS and temporary folded-card artwork. The replacement THE CARD section uses two newly generated, flat ON&OFF interface textures. Originals and prompts are under `design/card-showcase/`; website assets are `app/assets/card-showcase/pass.webp` (56,716 bytes, 780 × 1560) and `portfolio.webp` (206,456 bytes, 780 × 1563). Geometry supplies the actual bending, perspective and movement. The independent Montserrat-based title is generated from the locally installed licensed font, not from reference-site SVG paths. See archived `design/card-showcase/HISTORY-2026-09-11.md`. This remains local only.

The later page 03 editorial variation retains the same geometry, title and pink scene. Active images are now `app/assets/card-showcase/cover-editorial.webp` (77,008 bytes) and `feature-editorial.webp` (87,852 bytes), each 780 × 1560. The built-in image tool created original ON&OFF JOURNAL cover / feature artwork from general editorial inspiration supplied by the user. Originals and full prompts are in `design/card-showcase/editorial/`. Previous pass / portfolio assets are preserved but no longer imported or requested by the app. No reference magazine artwork is served. Local only.

## Archived: studio-atlas.png

Generated with OpenAI ImageGen, 2026-09-09. 1254 × 1254 px, flush 3-column × 2-row grid. Each cell is 418 × 627 px.

Reading order: cobalt glass loop / folded silver ribbon / chartreuse acrylic block / glossy black sphere with blue light / folded white and blue paper / coral glass disc and brushed metal cylinder.

Invented studio still-life photography for creative explorations. These are not real client projects, product endorsements, or company achievements. Image contains no logos or text; all labels and ON&OFF marks are drawn in the interface. The generated atlas is preserved; each card uses a cover crop at render time.

## Archived: artist-atlas.png

Generated for the first reference study. Six fictional adult portraits, 1254 × 1254 px. Retained in the project for history and no longer loaded by the ON&OFF page.

## Archived v1 Page 05 marketing campaigns — 2026-09-12

Three new ImageGen artworks show fictional LUMA skincare, DAYBREAK coffee and an athletic campaign. Exact prompts and full-resolution sources are in design/marketing/. Runtime feed images are720×900. The six-second540×960 WebM is an authored motion-graphics edit of the generated athletic photograph, with three kinetic-typography cuts; it is played as real video in a Three.js VideoTexture. It is not generated action footage.

The gray-shirt marketer has eight newly generated head/arm presentation poses, played in a fifteen-frame forward/return timetable. The website uses a92488-byte WebP atlas so visibility and motion settings can pause it; the matching240×320 GIF is209637 bytes. Skincare110366 bytes, coffee138024 bytes, poster62226 bytes and WebM827954 bytes all use content-hashed runtime URLs. Earlier magazine artwork and title glyphs are archived and not requested.

The Page02 crew pixels remain v3, but its visit policy now matches the galaxy: replay from HOME only, retain final back pose when returning from MARKETING. All work remains local, without commit, push or deployment.


## Archived Page 03 abstract DESIGN studies — 2026-09-12

Three original in-house fictional design concepts were generated with the built-in image_gen tool, one request each in a single parallel batch. ON / FORM identity, FORM packaging and OFF GRID editorial. Exact prompts and original1122×1402 PNGs are preserved in design/design-showcase/. Archived720×900 WebP assets: design-identity.webp34,618B, design-package.webp59,300B, design-editorial.webp42,654B. Combined136,572B. Previously shared by Three.js and static fallback, then the CSS3D layout; no longer imported by the app. No real client claims or external portfolio images. Regenerate these archived assets with node scripts/prepare-design-assets.mjs --legacy. Page03 is now DESIGN, WEB is04, and existing marketing is05.

2026-09-12: Page03 now reuses these exact DESIGN images in an independent editorial layout, one large CSS3D proof and three selectable thumbnails. Five image strips reveal like a print pass. No new assets or generated variants were requested for this layout revision. The former3-panel DESIGN engine is removed; page05 marketing assets and its Three.js scene are preserved.

## Active Page 03 target-focused DESIGN studies — 2026-09-12

현재 DESIGN 작업물은 고객 목적별 v2로 교체했다. 내장 ImageGen을 한 병렬 배치에서 세 번 호출해 모닝오븐(카페·베이커리), 온결(뷰티), 루움(침구·리빙)의 포트폴리오를 생성했다. 실제 고객 사례가 아닌 가상 콘셉트임을 화면에 표시한다. 조사 출처·원본1122×1402 PNG·전문 프롬프트·시각 검토는 design/design-showcase/v2/README.md다. 실행 자산은 design-bakery.webp106,922B, design-beauty.webp56,992B, design-living.webp103,906B이며 모두720×900, 합계267,820B다. 대표 이미지·인쇄 구획·썸네일이 동일한 해시 URL을 쓴다. node scripts/prepare-design-assets.mjs로 현재 이미지를 재생성한다. 아래 인물 자산과는 별개이며 기존 춤 원본·속도는 보존했다.

## 2026-09-12 DESIGN / WEB 인물과 웹 영상

DESIGN은 v4, WEB은 v5다. 내장 ImageGen으로 최초 팀 아틀라스의 실제 인물을 직접 참조하고 5페이지의 실제8포즈 방식으로 다시 생성했다. DESIGN은 긴 아이보리 셔츠·회색 운동화의 팔꿈치 춤, WEB은 긴 리브 니트·안경·원본 비율을 참고한12포즈의 WEB 쓰기다. 새 가로형 금속 테두리 칠판에서 쓰기·밑줄·확인·지우기를2760ms로 반복한다. 두 원통 받침대를 제거했으며 WEB도 반복한다. 마지막 자세 유지 정책은 SYSTEM 전용이다. 원본·정확한 프롬프트·검토·재생성은 design/people-motion/README.md. 런타임은 designer-rhythm-v4.webp(93,032B), web-writer-v5.webp(198,454B)다. WEB의 SVG 낙서·마스크·지시 JSON은 런타임에서 제거했고 실제 글씨가 포즈에 포함된다. GIF는 design/archive/public/images/people-motion/designer-rhythm-v4.gif와 web-writer-v5.gif(331,469B)다. MCI·광학 흐름 보간은 사용하지 않는다. 이전 버전은 보관하고 현재 앱에서 import하지 않는다. 웹 영상은 사용자 제공본으로1280×720/24fps/15.04초를 유지하면서13,304,772B에서3,093,276B로 압축했다. 원본 위치·해시·명령은 design/web-showcase/README.md와 video-source.json이다. 모든 변경은 로컬만 반영했다.


## 2026-09-12 MARKETING 채널 캠페인 v2

인스타그램 온결·블로그 루움·광고 포스터 모닝오븐의 생성 시안3장, 합계356714B를 app/assets/marketing/에서 내용 해시 URL로 제공한다. 이전 피드/쇼츠 실행 import는 제거했다. 마케터는 새 포즈 생성 없이 기존 runtime RGB와 원래4.89초 반복을 유지하며 발 아래 alpha만 제거했다. marketer-no-plinth-v2.webp(193496B), design/archive/public/images/marketing/marketer-no-plinth-v2.gif(192984B). 원본/정확한 프롬프트/확정 마스크/좌표/비교검사/재생성은 [v2 기록](../../../marketing/v2/README.md). 이전 자산은 이력으로 보존한다.
