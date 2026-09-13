# MARKETING 채널 이미지 검토

> 외부 자산 담당의 당시 생성·검토 기록이다. 일부 임시 파일과 검사 스크립트는 저장소에 포함되지 않는다. 현재 영구 입력과 재생성은 [README.md](README.md) 및 `npm run prepare:marketing`을 따른다.

2026-09-12. ON&OFF의 가상 브랜드 콘셉트 작업이다. 실제 고객 실적·성과·할인·후기·인증 주장을 포함하지 않는다.

## 제작 범위

- built-in `image_gen`으로 새 artwork 3종을 각1회, 단일 병렬 batch로 생성했다. 변형안이나 재시도는 없다.
- 각 artwork는 플랫폼·브라우저·기기 UI 없이 완성된 이미지다. 사이트의 Instagram/Blog/광고판 외형은 별도 코드에서 처리한다.
- 생성 원본을 그대로 아래 파일로 복사했다. 모두1122×1402 PNG이며720×900 실행 이미지로 변환하는 일은 이 자산 작업에 포함하지 않았다.
- 저장소 밖의 현재 검토 폴더에만 저장했다. 기존 사이트 소스·원본 프레임·타임라인을 변경하지 않았고, 커밋·GitHub push·배포를 실행하지 않았다.
- 정확한 전체 프롬프트, 원본 출력 경로, 크기, 바이트 수, SHA-256, 개별 검토는 [PROMPTS.json](PROMPTS.json)에 있다.

## Artwork 검토

| 파일 | 구성과 실제 출력 확인 | 크기 / 바이트 |
| --- | --- | --- |
| [instagram.png](sources/instagram.png) | 파랑/흰색 크림 제품·상자·크림 질감. `오늘의 보습 루틴`, `온결`, `ONGYEOL`, `데일리 크림`이 올바르게 보인다. | 1122×1402 / 1,675,012B |
| [blog.png](sources/blog.png) | 편안한 침실 사진과 하단3개 직물 근접컷. `이불 고를 때 / 꼭 확인할 3가지`, `소재 · 계절 · 세탁`, `루움`, `RUUM`이 올바르게 보인다. | 1122×1402 / 2,391,121B |
| [poster.png](sources/poster.png) | 노랑/빨강의 큰 광고 문구와 샌드위치·아이스 아메리카노. `점심 고민 끝`, `샌드위치 + 아메리카노`, `모닝오븐`, `MORNING OVEN`이 올바르게 보인다. | 1122×1402 / 2,194,302B |

세 이미지는 실제 픽셀을 열어 육안으로 확인했다. 문구 오탈자는 발견하지 못했다. 생성 artwork에 가격·기간·할인 조건·성과 수치·후기·QR·플랫폼 조작 UI가 보이지 않는다. 약4:5이며 요청한1122×1402 해상도로 생성됐다. 브라우저/사이트에서 축소된 결과까지 확인한 것은 아니다.

### 원본 SHA-256

```text
instagram.png  f0cc7cc7ab3d32ffe186916f71fc6ed7392cd277596d7194ce45da6da79a7eb7
blog.png       c5e67a2f5acc3bbcfdc13f76d08daac8cf7c0bcc9a9c773fc93de60677ba7078
poster.png     40816d2880388fdc9e02fc0ac9891d47d6281e1a3129d0fad1e8d99b1e71df1a
```

## 마케터 받침대 제거용 생성 마스크 — 초기 정합 미달 기록

추가 요청으로 기존8포즈의 RGBA 픽셀을4열×2행960×640 시트로 무손실 배치했다. 셀은240×320이고 row-major 순서0~7이다. 원본 프레임은 읽기만 했다. `MATTE-INPUT.json` (당시 임시 파일, 저장소 미포함)은 원본 경로·해시·셀 좌표와 픽셀 보존 검사를 기록한다.

[marketer-source-sheet.png](marketer/marketer-source-sheet.png)를 실제 열어 확인한 후, 해당 시트만 참조해 `image_gen` 편집을1회 요청했다. 흰색=신발 포함 인물, 검정=배경과 원형 받침대로 요청했으며 인물을 다시 생성하거나 원본 RGB를 대체하는 용도가 아니다. 정확한 전체 프롬프트와 생성 원본 경로·해시·정합 수치는 [MATTE-PROMPT.json](marketer/MATTE-PROMPT.json)에 있다.

- 생성 출력: [marketer-foreground-matte.png](marketer/marketer-foreground-matte.png), 1536×1024, 654,755B.
- SHA-256: `6c9bf93f9569fc5aa98abde87c9cc9397f7725f102225286dbc25c53dd5a6858`.
- 입력과 출력의 해상도가 다르다. 검토에서만960×640으로 축소·흑백 변환 후127을 기준으로 실루엣을 비교했다. 생성 원본 마스크 파일은 수정하지 않았다.
- 몸 영역(local y<272)의 IoU는0.714~0.939이며 프레임별 중심이 오른쪽0.69~6.99px, 위1.01~1.60px 이동했다. 이 수치는 몸 정합 진단이며 신발 분할 정확도 측정은 아니다.
- `matte-registration-overlay.png` (당시 임시 파일, 저장소 미포함)는 원본 위 마스크 경계를 자홍색으로 표시한다. `matte-shoes-review.png` (당시 임시 파일, 저장소 미포함)는 발·받침대 영역을3배 확대해 같은 경계를 비교한다. 둘 다 검토용 파생 이미지다.
- 실제 발 확대를 확인하면 특히3·7번에서 마스크가 신발 옆으로 벗어난다. 넓은 원통 형상은 제외됐지만 엄밀한 픽셀 정합 마스크로는 부적합하다. 그대로 적용하면 신발을 깎거나 받침대 일부를 남길 수 있다.
- 위 생성 마스크 자체는 원본 인물 RGB·자세·타임라인 보존을 검증한 최종 편집물이 아니다. 그대로 원본 프레임에 적용하지 않고 아래의 후속 정합·신발 경계 보정을 거쳤다. 생성 재시도나 변형안은 만들지 않았다.

검토 시트 생성과 해시 기록은 `prepare-review.cjs` (당시 임시 파일, 저장소 미포함), 정합 지표와 오버레이는 `inspect-matte.cjs` (당시 임시 파일, 저장소 미포함)에 있다. 두 스크립트는 기존 프로젝트에 설치된 `sharp`를 읽어 사용하며 새 의존성을 설치하지 않는다.

## 최종 마케터8프레임 — 받침대 alpha 제거 완료

추가 생성 없이 정합을 보정한 뒤 원본 신발 경계를 기준으로 마스크를 수정했다. 최종 실행 자산 패킹에 사용할 파일은 [cleaned-frames/0.png](marketer/cleaned-frames/0.png)부터 [cleaned-frames/7.png](marketer/cleaned-frames/7.png)까지8개다. 모두 원본과 동일한240×320 RGBA PNG이며 위치·자세·프레임 순서는0~7 그대로다. 애니메이션 시간표나 앱의 스프라이트/GIF는 이 폴더에서 수정하지 않는다.

1. `refine-matte.cjs` (당시 임시 파일, 저장소 미포함)로 각 마스크 셀만 원본 몸 영역에 정합했다. 몸 IoU가0.954~0.966으로 개선됐다. 원본 이미지는 리샘플링하지 않았다. 변환값은 [MATTE-REGISTRATION.json](marketer/MATTE-REGISTRATION.json)에 있다.
2. 단순 정합 후 마스크가 어두운 밑창을 일부 덜 남기는 것을 확인했다. 원본8프레임의 신발을10배 확대해 앞코·뒤꿈치·밑창 경계를 확인하고 [SHOE-BOUNDARIES.json](marketer/SHOE-BOUNDARIES.json)에 원본 좌표의 유지 다각형을 기록했다.
3. 생성 마스크의 하단 판정을 해당 원본 경계로 보정했다. 재검토에서 남은 작은 받침대 윗면 조각을 안쪽 뒤꿈치에서 제거했다. 최종 `clean-frames.cjs` (당시 임시 파일, 저장소 미포함)는 **y≥278에만 alpha 감소**를 적용하며 RGB는 모든 픽셀에서 그대로 복사한다. 다각형 경계의8배 supersampling은 alpha에만 적용한다. 원본 이미지 확대·이동·워핑·새 인물 RGB 생성은 없다.
4. 최종8개 각각의 발 전후 확대와 회색/분홍 전체 contact를 실제 열어 확인했다. 원형 받침대·발 사이 윗면이 보이지 않고 앞코·뒤꿈치·어두운 밑창이 남는다. 원본240×320의 혼합된 가장자리 픽셀과 분홍 반사색은 RGB 보존 때문에 그대로 남으므로, 숨겨진 신발 표면을 복원한 것으로 설명하지 않는다.

최종 확인 결과는 [CLEANED-FINAL-REVIEW.json](marketer/CLEANED-FINAL-REVIEW.json), 생성 직후 파일별 기본 검사는 [CLEANED-CHECKS.json](marketer/CLEANED-CHECKS.json)이다. `verify-cleaned.cjs` (당시 임시 파일, 저장소 미포함)가 실제 저장 PNG를 다시 디코딩해서8개 모두 아래를 검사했다.

- 크기240×320 유지, 원본 파일 SHA-256 유지.
- 전체 RGB 변경 픽셀0, y<278 RGBA 변경 픽셀0.
- alpha 증가 픽셀0. 변경은 하단 alpha 감소뿐이다.
- y≥291에 남은 불투명 픽셀0.
- 각 프레임 신발 내부6개 지점의 원본 RGBA 유지.
- 출력·마스크 SHA-256을 기록.

제거 마스크는 [removal-masks/0.png](marketer/removal-masks/0.png)부터 [removal-masks/7.png](marketer/removal-masks/7.png)까지다. 검정은 유지, 흰색은 제거, 회색은 가장자리 alpha 감소다. `newAlpha = round(oldAlpha × (255 - removal) / 255)`이며 y<278은 항상 검정이다.

육안 확인용 전체 이미지는 `marketer-cleaned-contact-gray.png` (당시 임시 파일, 저장소 미포함), [MARKETING 분홍 배경](marketer/marketer-cleaned-contact-pink.png)이다. `shoes-before-after-0.png` (당시 임시 파일, 저장소 미포함)부터 `shoes-before-after-7.png` (당시 임시 파일, 저장소 미포함)까지 각 이미지의 위는 원본, 아래는 최종이다. 투명 `marketer-cleaned-contact.png` (당시 임시 파일, 저장소 미포함)와 최종 프레임은 alpha0 아래의 원본 RGB도 보존하므로, alpha를 무시하는 뷰어에서 받침대 RGB가 드러나는 것은 파일 손상이 아니다. 육안 검토는 alpha를 정상 합성한 회색/분홍 이미지를 사용했다.

당시 외부 검토 폴더에서의 재생성은 최종 좌표 파일을 유지한 채 `node clean-frames.cjs`, `node verify-cleaned.cjs` 순서로 실행한다. 생성 마스크를 재호출할 필요가 없다. 저장소 수정·커밋·push·배포는 수행하지 않았다.
