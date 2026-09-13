> 현재 실행 버전은 [채널 캠페인 v3](v3/README.md)다. 마케터 받침대 제거용 입력·검사는 [v2](v2/README.md)에 보존한다. 아래 피드/쇼츠 자료는 이전 버전 보관 기록이며 앱에서 요청하지 않는다.

﻿# Marketing asset provenance

Generated on 2026-09-12 with OpenAI ImageGen, one original request per image. All assets are fictional campaign concepts created for ON&OFF, not client results.

| Source | Dimensions | Exact prompt |
| --- | --- | --- |
| luma-feed-ad.png | 1122×1402 | luma-prompt.txt |
| daybreak-feed-ad.png | 1122×1402 | daybreak-prompt.txt |
| shorts-athletic-master.png | 941×1672 | shorts-prompt.txt |
| marketer-poses.png | 1536×1024, 4×2 | marketer-prompt.txt |

All originals were visually inspected. The marketer is based on the existing gray-shirt figurine, with actual generated arm/head poses. The sheet has no clear lifted-foot step, and none is claimed. Controlled chroma green was removed; connected silhouettes retain fingers and feet. The base is aligned without individual intermediate height normalization. Extracted transparent frames are 240×320.

shorts-film.js is the authored six-second, three-cut motion-graphics edit. It uses the generated still master with continuous crop/scale movement and local Montserrat typography. It is not footage of an athlete performing a newly synthesized action. render-marketing-video.mjs records the canvas at24fps into muted VP9 WebM and exports a static final-message poster. The production page uses a real HTML video and VideoTexture, not a play icon over an unmoving image.

Runtime artwork is resized to720×900; video/master/poster are540×960. The GIF and website share lib/card-showcase.ts's15-frame sequence and timing from8 original poses. Source files and exact prompts are retained; previous magazine assets remain archived and are not imported by the new page.
