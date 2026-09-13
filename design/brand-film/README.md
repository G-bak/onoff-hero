# ON&OFF 브랜드 영상 출처와 적용

사용자가 `onoff-website-redesign`의 `onf-cinematic-intro.mp4` 배경 섹션을 현재 사이트에 맞춰 추가하도록 지정했다. 이웃 프로젝트의 `app/page.tsx` 약 334–380행과 대응 `app/globals.css`를 확인했다. 영상·포스터·기존 문구를 유지하고 새 사이트의 공통 전환·준비 UI·재생 정책에 맞게 별도 컴포넌트로 구현했다. 원본 프로젝트는 변경하지 않았다.

| 파일 | 원본 경로 | 적용 |
| --- | --- | --- |
| `onf-cinematic-intro.mp4` | `onoff-website-redesign/public/assets/` | 원본 바이트 그대로 복사 |
| `onf-cinematic-poster.png` | 같은 폴더 | 정지·차단·JS 미사용 대체 화면 |
| `brand-film-ko.vtt` | 이번 작업에서 작성 | 영상 화면 문구 설명 |

영상은 5.00초, 1920×1080, 30fps, H.264 High/yuv420p, AAC 스테레오다. 용량 1,996,184바이트이며 이미 faststart이므로 재인코딩·재먹싱하지 않았다. 포스터는 685,023바이트 PNG다. [source.json](source.json)에 원본과 출력의 SHA-256, 크기, 처리를 기록했다. 프로덕션에서는 Vite의 해시 자산 URL을 사용한다.

다시 준비하려면 프로젝트 루트에서 실행한다. FFmpeg는 faststart가 아닌 새 입력에 한해 스트림 복사에 사용한다.

```powershell
node scripts/prepare-brand-film.mjs 'C:/Users/usewr/Documents/ChatGPT/onoff-website-redesign/public/assets' 'outputs/research/2026-09-09/follow-art/tool/package/ffmpeg.exe'
```

실행 자산은 `app/assets/brand-film/`에 있다. 새 원본을 쓰면 영상 메타데이터·길이 표시·VTT도 함께 검토한다. 원본 확인용 프레임 모음은 `outputs/qa/2026-09-13/film/brand-film-source-contact.jpg`, 적용 화면·동작 검증은 [PAGE7-NOTES.md](../../docs/pages/PAGE7-NOTES.md)다.
