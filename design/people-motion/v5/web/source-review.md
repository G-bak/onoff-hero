# WEB writer v5 — generation and corrective-background review

Date: 2026-09-12. Scope: asset-only work outside the repository. Built-in ImageGen used for one new sheet and one explicitly requested background-only correction. No app source, Sites checkout, integration, commit, push or deployment performed by this asset agent.

## Files

- Identity reference: `C:/Users/usewr/Documents/ChatGPT/onoff-people-v4-review/approved-web-original.png`, inspected with view_image before generation.
- Original generated sheet: [web-writer-v5-source.png](initial-checkerboard.png).
- Exact full generation prompt: [web-writer-v5-prompt.txt](prompt.txt).
- **Corrected sheet for chroma-key assembly:** [web-writer-v5-chroma-source.png](source.png).
- Exact full correction prompt: [web-writer-v5-chroma-edit-prompt.txt](background-edit-prompt.txt).
- Dimensions, alpha, SHA-256, green-background frequencies and per-cell mask bounds: [web-writer-v5-metadata.json](generation-metadata.json).

Original tool output remains preserved at:
`C:/Users/usewr/.codex/generated_images/01a0956b-6a45-7680-8b27-2b84060e9a42/exec-536430a8-1a97-4f46-8e57-19d6485ea870.png`.

Corrective tool output remains preserved at:
`C:/Users/usewr/.codex/generated_images/01a0956b-6a45-7680-8b27-2b84060e9a42/exec-068fde53-4844-4878-98d3-e863b3191d10.png`.

## Actual output, not prompt promises

Both PNGs are **1448×1086, RGB, no alpha channel**, with all pixels effectively alpha255. The requested 2048×1536 size was not returned. The twelve scenes are arranged 4 columns ×3 rows; nominal cells are **362×362**.

The first source has a **baked gray/white checkerboard and pale streaks**, not actual transparency. Do not use that source directly as a transparent sprite.

The authorized corrective edit replaced those empty areas with green and retained the scene arrangement, poses and lettering. It did **not** return mathematically exact #00FF00: there are zero exact RGB(0,255,0) pixels. Dominant background colors are RGB(3,249,7), RGB(4,249,8), RGB(4,250,8), and near neighbors. The inspection predicate `g > 180 && g > r + 90 && g > b + 90` identifies 948,222 green pixels, about60.3% of the image. This predicate was used only for inspection; this agent did not key, crop or modify image pixels.

No visible checkerboard remnants or conspicuous green spill appear in the corrected display. Fine hair, fabric and chalk details appear slightly softer than the first generation. This is an ImageGen edit, so it should not be claimed to preserve foreground pixels bit-for-bit.

## Identity, board and general action

- The reference adult woman is recognizable: dark layered bob, black round glasses in profile, long loose ribbed navy cardigan with large buttons, white tee, wide charcoal trousers and off-white sneakers. No laptop or circular pedestal.
- Head size appears around one-sixth-and-a-half to one-seventh of the body, rather than a chibi head. This is a visual estimate, not an anatomical measurement.
- The board is broad landscape dark graphite slate, thin silver rim and slender twin silver legs/feet. No wooden easel, neon or large base.
- Faces look toward the board in side/profile views; frames9–11 show more back/three-quarter views. The early torso still exposes the cardigan front and white tee, but she does not turn toward or look at the camera.
- The image contains actual new body poses, especially the forward bend at5/8, broader shoulder/torso turn at9, upright inspection at10, and lean/erasing at11. Frames0–4 retain nearly the same stance, so the action is not equally lively throughout.
- Two arms/two legs remain anatomically plausible. The working hand visually contacts or sits very close to each active chalk endpoint. At this small scale, the exact anatomical left/right arm is not reliably verifiable in every pose; do not certify handedness solely from this sheet.
- The full board and shoes are present in the overall image, but requested20px safe cell margins were **not** satisfied.

## Per-frame review

Numbering below is zero-based row-major; there are no visible frame labels in the image.

| Frame | Actual writing/body content | Candid limitation |
| --- | --- | --- |
| 0 | Blank board; raised chalk hand, slight lean; right/free hand near hip. | Ready hand is around upper-middle of slate, not at the final W's leftmost starting location. Stance is close to1/2. |
| 1 | A large V-shaped first portion of W; raised writing hand at its upper-right endpoint. | This partial V is too wide/too far right relative to the final W's first half, so1→2 is a perceptible letter-shape/position cut. |
| 2 | Complete W only, no E/B; chalk near upper-right finish. | W's registration does not precisely preserve frame1 V. Body remains similar to0/1. |
| 3 | W plus E's vertical spine; writing hand lowered near bottom of the new stroke. | Appropriate progressive phase; small W/board-relative shift is visible compared with2. |
| 4 | W plus E with top and middle strokes and no bottom bar; reads temporarily like WF. | Correct intermediate letter construction, but stance remains close to the early frames. |
| 5 | Complete WE; chalk near bottom-right of E. Torso and knees lean/lower more clearly. | A stronger useful body pose. Letter widths/registration change slightly from4. |
| 6 | WE plus B's vertical stem; chalk at lower stem. | Appropriate phase; small hand-to-stroke gap may be visible on close inspection. |
| 7 | WE plus upper B loop, temporarily reads WEP; chalk near center of incomplete B. | This is an intended partial B, not an erroneous final P. |
| 8 | Complete readable WEB; chalk at lower B; woman leans toward writing. | Right shoe extends slightly across the nominal362px cell boundary into the next cell's area. Do not use a strict crop that clips it. |
| 9 | Complete WEB with an underline being drawn; noticeably turned torso/back and broad arm reach. | Underline is shorter than the complete line shown in10; this can be interpreted as finishing in progress. Right shoe also extends several pixels across the next nominal cell boundary. A rigid cell crop picks up a previous-frame shoe sliver at the left. |
| 10 | Complete WEB with full underline; writing arm lowered, upright side/back inspection pose. | Clear body change. A rigid362px crop can include a small neighboring shoe sliver at its left edge. Use the actual scene bounds. |
| 11 | Eraser against the left of W, W partly wiped/smudged; E/B and underline remain. Back/three-quarter lean. | Wiping is a broad chalky patch, not a perfectly clean wipe.11→0 is an explicit discrete reset to blank, not a continuous fully erased transition. |

**Readable full WEB:** frames8,9,10. Frame11 intentionally partly erases W. Frame5 is full WE; frame7 is the expected WE + upper B loop.

## Registration and assembly implications

The sheet is a nominal grid, not perfectly registered sprite frames. Approximate per-column leftmost board positions in each362px cell are x54,45,38,30. Board tops/feet shift a few pixels vertically between rows. The board's landscape shape is fairly consistent, but its per-cell position and slight size/perspective changes are visible. Chalk strokes also shift slightly independently of the board.

The metadata's bounds were computed from pixels that do not satisfy the green inspection predicate. They are **not** final segmentation/cropping specifications. In frames8–10, neighboring foot spill makes nominal-cell bounds reach the edge; do not treat those edge bounds as the complete independent scene.

Practical handoff: key the actual green range using the existing approved pipeline, extract each complete scene with enough horizontal room for feet, remove neighboring slivers by per-scene selection, align using board/ground anchors, preserve intentional lean/knee height changes, and package genuine raster frames. No numeric hand path, synthetic SVG lettering, image morphing, body rotation or CSS pose substitute was produced here.

This agent has not verified an assembled GIF, runtime104px/160px display, browser animation or final key-edge quality; those remain integration checks. The source is usable for the requested next assembly step with the disclosed registration limitations.
