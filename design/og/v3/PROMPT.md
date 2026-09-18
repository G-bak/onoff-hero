# OG 문구 수정 프롬프트

방식: 내장 `image_gen` 이미지 편집 도구. 입력은 사용자 제공 v2 원본이며, 새 문구를 포함한 결과를 1200×630 PNG로 크기 정규화했다.

```text
Use case: text-localization.
Asset type: ON&OFF website Open Graph image, exact 1200 x 630 canvas.
Input image 1 is the edit target.
Primary request: A surgical Korean text correction only. Replace the headline text "당신은 사업만" with exactly "고객님은 사업만". Keep its existing font style, black color, baseline and left alignment. The replacement is one Korean character longer; fit it within the existing left text area before the beige ON block without collision. Do not change "ON," or any other words.
Keep every other element of the original unchanged: cream background, ON&OFF top left, 온앤오프 top right, thin horizontal rule, "시작부터 운영까지, 온앤오프", beige ON highlight, "복잡한 마케팅은", large OFF, decorative thin corner line, dark bottom panel, "기획·디자인·홈페이지·마케팅·운영", and "흩어진 업무를 한 팀이 연결합니다.".
Maintain the exact existing composition, margins, colors, dimensions, and typographic design. Flat crisp graphic design, no texture, no new imagery, no additional elements. The only intended visual change is 당신은 → 고객님은. Render the new Korean phrase precisely "고객님은 사업만". Output PNG 1200x630.
```
