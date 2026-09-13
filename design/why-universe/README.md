# WHY 우주 연결 장면과 인물

> 폐기된 매듭·지휘자 연출의 보관 이력이다. 현재 SYSTEM 은하·인물은 [은하 기획](../galaxy/ART-DIRECTION.md)과 [인물 기준](../galaxy-crew/README.md)을 따른다. 과거 생성 명령으로 현재 구현을 대체하지 않는다.

2026-09-11 사용자 요청으로 새로 만든 로컬 시안. built-in 이미지 생성 도구로 가상의 성인 인물을 생성했으며 이전 인물은 `../why-person/`에 보존한다. 커밋·push·배포하지 않았다.

## 원본과 결과

- [정확한 프롬프트](generation.prompt.md)
- [생성 원본](pose-sheet.png): 1536×1024, 4열×2행의 8포즈. 은색 재킷·검은 바지의 인물이 옆뒤 모습에서 우측 위의 별을 지휘한다.
- `frames/pose-1.png`부터 `pose-8.png`: 240×320 투명 PNG. 발 위치를 맞추고 전체 인물이 셀 안에 남는지 검사한다.
- `../../app/assets/why-universe/conductor-sprite.webp`: 1920×320, 100,376 bytes. 사이트에서 사용하는 유일한 인물 모션 이미지다.
- [투명 GIF](../archive/public/images/why-universe/conductor.gif): 240×320, 240,264 bytes. 14 재생 프레임, 2,620ms 무한 반복.
- [시간표와 정렬 값](animation.json)

원본 요청에는 녹색 배경이 명시됐지만 생성 도구는 실제 투명 알파를 가진 PNG를 반환했다. 원본의 알파를 검사하여 그대로 사용하며 녹색 제거를 추가로 수행하지 않는다. 얼굴·양손·신발이 모두 각 셀 안에 있다. 영상 생성이 아니라 서로 다른 여덟 장의 포즈를 왕복 재생하는 스톱모션이다.

## 재생성

```powershell
npm run prepare:why-person
```

`scripts/prepare-why-universe-person.mjs`가 투명 원본 검사 → 셀 분할 → 발 기준 정렬 → PNG → WebP → GIF → CSS를 생성한다. 실제 배경을 제거하거나 새로운 포즈를 합성하는 스크립트가 아니다. 입력 알파·셀 분할·인물 잘림·GIF 프레임 수와 지연 시간·투명도를 검사한다.

재생 순서는 1→2→3→4→5→6→7→8→7→6→5→4→3→2다. 첫 포즈 800ms, 펼친 8번째 포즈 500ms, 나머지 각 110ms. GIF와 사이트 CSS가 같은 시간표를 공유한다. 사이트에는 더 작은 WebP만 요청되며 인물 모션은 화면·탭 가시성 및 MOTION OFF를 따른다.

별·궤도·연결선은 코드로 만든 실제 Three.js 형상이므로 별도 생성 이미지는 없다. UI 설명과 반응형 기준은 [PAGE2-NOTES.md](../../docs/pages/PAGE2-NOTES.md)를 따른다.
