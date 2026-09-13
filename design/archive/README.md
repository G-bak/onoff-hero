# public 자료 보관

2026-09-13 점검에서 사이트가 쓰지 않는 public 파일 37개를 `public/` 하위 구조 그대로 이 디렉터리로 옮겼다. 파일을 삭제하거나 이미지·영상 픽셀을 변환하지 않았다. 텍스트의 이동 경로와 안내는 함께 정리했다.

이동 파일은 이동 전 기준 합계 **31,239,949바이트**다. 이후 보관 문서의 경로·안내 수정으로 텍스트 용량만 달라질 수 있다. 기존 public 33,292,447바이트 중 공개 자산·팀 원본·로고 원본·라이선스 등 10개, 2,052,498바이트를 원래 위치에 남긴다. 배포 복사 대상 감소량이며 방문자의 페이지 다운로드 절감량을 뜻하지 않는다.

| 위치 | 자료 |
| --- | --- |
| `public/images/` | [자산 기록](public/images/ASSET-NOTES.md), 과거 팀·사진·시안과 프롬프트 |
| `public/images/galaxy-crew/` | SYSTEM 동작 비교 GIF |
| `public/images/people-motion/` | DESIGN·WEB 버전별 비교 GIF |
| `public/images/marketing/` | 마케터 비교 GIF |
| `public/images/why-person/`, `public/images/why-universe/` | 폐기된 인물 동작 GIF |
| `public/fonts/` | 현재 사용하지 않는 입체 글자 지오메트리 JSON |

옛 `/images/...gif` 주소는 더 이상 제공하지 않는다. 문서의 저장소 파일 링크로 확인한다. 생성 스크립트도 GIF를 이 위치에 출력한다. 실행 자산은 `app/assets/`에서 가져오며 원본·프레임·마스크·해시는 각 제작 폴더에 보존한다.

현재 기준은 [문서 색인](../../docs/README.md), 생성 명령은 [스크립트 안내](../../scripts/README.md)에 있다. 이 디렉터리를 다시 public에 복사하지 않는다.
