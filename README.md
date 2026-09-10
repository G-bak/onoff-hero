# ON&OFF — Creative in continuum

ON&OFF의 첫 화면 디자인. 선명한 2D 워드마크와 회전하는 3D 미니어처 팀 카드를 중심으로 구성했습니다.

## 실행

```powershell
cd C:\Users\usewr\Documents\ChatGPT\follow-art-hero
npm install
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

http://localhost:5187 에 접속합니다. `start-local.cmd`를 실행해도 됩니다. 5187 포트를 다른 프로세스가 쓰고 있으면 덮어쓰거나 종료하지 않고 시작을 중단합니다.

이전 단계의 프로젝트 경로를 유지합니다. 별도 `onoff-website-redesign` 등 다른 프로젝트 파일은 수정하지 않았습니다. 회사 업종과 문의 이메일은 해당 기존 프로젝트의 사용자 자료를 참고했습니다.

## 디자인

- 쿨 그레이 #e9edef, 검정 #333333, 파랑 #343CFF, 연두 네온 #D8FF3E 포인트
- Montserrat Bold(700) 기반의 고정된 2D ON&OFF 워드마크, 코발트 앰퍼샌드. 동일한 3D 카드 장면을 월드 좌표 z=0에서 앞·뒤로 잘라 글자 양쪽 레이어에 렌더링하므로 뒤쪽 카드는 글자 뒤로, 앞쪽 카드는 글자 앞으로 통과
- 큰 워드마크 외 영문은 Inter, 한글은 프로젝트에 설치한 Pretendard Variable 1.3.9 사용. 카드의 한글은 글꼴 로딩이 끝난 뒤 그려지며 폰트 파일도 사이트에서 직접 제공. Montserrat는 워드마크에 필요한 Latin 700만 불러오며, 라이선스는 `public/fonts/MONTSERRAT-LICENSE.txt`에 보관
- 헤더 왼쪽에는 사용자가 제공한 손글씨 로고만 배치, 너비 데스크톱 96px / 모바일 82px
- 헤더 중앙은 데스크톱에서 두 줄로 구성: 첫 줄은 `© 2026 ON&OFF ALL RIGHTS RESERVED.` 저작권만, 둘째 줄은 대표자·전화·주소·`이메일 onoff3739@naver.com`. 저작권은 항상 한 줄로 표시하고, 좁은 화면에서는 회사 정보만 자연스럽게 줄바꿈. 이메일 아이콘은 사용하지 않음
- 대표자 `홍길동`, 주소 `서울특별시 ○○구 ○○로 123, 3층`, 전화 `02-0000-0000`은 교체용 임시 값. 화면의 임시 정보 안내 문구는 사용자 요청으로 삭제
- 헤더 오른쪽은 기존 대각선 화살표를 유지한 `News & Recruitment`. 현재는 페이지 준비 안내 모달을 열고, 확인·닫기·Escape·배경 클릭으로 닫을 수 있음. `lib/navigation.ts`에서 페이지 구현 후 `ready`를 `true`로 변경하면 `/news-recruitment`로 이동
- 원본 로고의 투명도를 유지한 32px / 64px PNG 파비콘
- 카드와 궤도 가이드는 최초 위치보다 데스크톱 34~46px, 모바일 34px 위로 이동(이번 조정에서 14px 추가)
- 여유 있는 여백, 가는 기준선, 원형 문의 버튼
- 오른쪽 중앙의 고정 섹션 메뉴: 현재는 `01 HOME` 한 항목만 표시. 클릭하면 첫 화면으로 부드럽게 이동하며 좁은 화면에서는 번호와 현재 위치 표시만 노출
- Strategist / Art Director / Designer / Filmmaker / Developer / Media Planner 팀 캐릭터 카드
- 사용자가 제공한 Photoroom 투명 배경 실사 피규어 6명, 소품으로 직무 구분. 3D 카드와 대체 화면에 같은 이미지 사용
- 사용자 카드 예시에 맞춰 영문 분야 → 큰 직무명 → 소개 → `CHARACTER EDITION`을 위쪽에 모으고, 아래쪽 회색 배경판에 누끼 인물을 겹쳐 배치. 상단 로고·TEAM 번호·구분선 영역 98px을 제거해 카드를 640×782로 축소하고, 모든 내용을 98px 위로 이동. 3D 카드도 같은 비율로 낮추되 위쪽 가장자리는 고정하여 내용과 하단이 위로 올라옴. 회색 판은 (214, 256), 366×416, 인물 패널은 (340, 364), 높이 386으로 오른쪽 아래에 배치하며 판 아래로 내려옴. 얼굴·소품·발·받침대가 잘리지 않도록 투명 원본 셀 전체를 사용. 대체 화면도 같은 비율 사용
- 원통형 곡면의 자동 회전, 마우스/터치 드래그, 키보드 방향키
- 원본 영상에 맞추기 전의 ON&OFF 방향으로 복원: 오른쪽이 낮아지는 약 10° 기울기, 앞쪽 카드는 왼쪽에서 오른쪽으로 회전. 속도는 초당 .11 라디안이며 궤도선과 대체 카드 화면도 같은 사선 사용
- ON/OFF 모션 스위치, 스페이스 키 재생/정지, 움직임 감소 설정 지원
- 처음에는 MOTION ON으로 시작. OFF에서도 드래그·방향키·마우스 기울기 반응은 유지하며, 움직임이 완전히 끝나면 렌더링을 쉬고 다음 조작이나 화면 크기 변경 때 재개. 숨겨진 탭에서는 프레임 예약을 멈추고 돌아왔을 때 다시 시작
- 모션 스위치 옆 화살표 버튼으로 자동 회전 방향 전환. 정지 상태에서도 다음 재생 방향을 선택할 수 있으며 장면을 다시 생성하지 않음
- 하단 오른쪽은 기존 짙은 캡슐 버튼과 라임색 원 안의 대각선 화살표를 사용하고, `실시간 상담톡` 문구만 표시. 첫 메시지에 서비스 준비 중임을 알리고 이메일 문의 링크 제공. 날짜는 한국 시간으로 표시. 실제 상담 기능 연결 전까지 입력창·전송 버튼을 비활성화하고 메시지 추가·전송 처리도 제거
- 상담톡 헤더에 `서비스 준비 중`, 하단에 운영 예정 시간 `09:00–18:00` 표시. 호출부에서 공통 Dialog의 중앙 정렬 클래스를 제거하고 화면 가장자리 여백으로 배치. 모바일 안전 영역과 화면 높이를 반영하며 본문만 스크롤. 빌드 검사에서 중앙 정렬 제거와 배포 CSS를 확인
- 스위치 손잡이는 `--motion-thumb-x` 변수와 단일 `translate` 속성으로 위치를 제어해 ON/OFF 모두 트랙 안쪽 3px 여백 유지. 배포 CSS에서 `translate: none`이 최적화로 사라져 기본 이동과 추가 이동이 겹치는 문제를 방지
- WebGL 미지원 시 읽을 수 있는 텍스트 워드마크와 캐릭터 카드 대체 화면
- 첫 접속 시 로고 아래에 작은 점선 타원을 표시하고, 엔진·이미지·글꼴·카드 텍스처·첫 화면 출력의 완료 단계에 따라 회색 점이 파란색으로 채워짐. 점의 위치는 고정되며 회전하지 않음. `lib/scene-orbit.ts`의 카드 기울기·카메라·반지름을 사용하므로 WebGL 로딩 전에도 같은 형태로 표시. 준비 완료 후 부드럽게 해제하며 로딩 중 배경 조작을 방지. 움직임 감소 설정에서는 전환 애니메이션 생략
- 로딩 타원의 점은 24개이며, 투영된 윤곽선의 길이를 기준으로 균등 배치해 좁은 양옆에서도 서로 겹치지 않도록 구성
- 로딩 화면은 최소 1초 동안 표시한 뒤 0.5초에 걸쳐 사라짐. 안내 문구는 `3D 공간을 구성하는 중입니다`, 완료 후 `3D 공간이 준비되었습니다` 사용
- 10초 이상 지연되면 빨간 안내와 전체 경과 시간 `00:10 / 최대 05:00`을 표시. 오프라인·네트워크 오류·서버의 실패 응답·이미지 해석 오류·3D 초기화 오류를 구분해 빨간 안내와 복구 버튼을 표시. 로딩 시작 후 5분까지 완료되지 않으면 요청을 중단하고 안내 팝업 표시. `다시 시도`는 페이지를 새로고침하고, `기본 화면 보기`는 진행 중인 3D 초기화를 중단한 뒤 사이트 이용을 허용

현재 미니어처는 실제 직원의 외모를 재현한 것이 아닌 직무별 캐릭터입니다. 이름을 임의로 만들지 않았습니다. 직원 정보가 준비되면 `lib/team.ts`의 `displayName`, `role`, `category`, `line`을 수정할 수 있습니다. 카드에는 `CHARACTER EDITION`을 표시합니다. 문의 링크는 기존 ON&OFF 자료의 `onoff3739@naver.com`을 사용합니다.

첫 화면만 작업했습니다. 동영상과 후속 섹션은 추가하지 않았고 `public/videos`는 비어 있습니다.

## GitHub와 Cloudflare 배포

- 소스 저장소: https://github.com/G-bak/onoff-hero (비공개)
- Cloudflare Worker: `onoff-hero-preview`
- 임시 주소: https://onoff-hero-preview.ajdhfbx1836203.workers.dev
- 최신 배포: 2026-09-10 13:38 KST, 메인 ON/OFF 문구의 마침표 제거까지 반영. 카드 상단 영역 삭제 및 높이 축소, 중앙·하단 문구 위치 교대, 검정 #333333·연두 네온 #D8FF3E·파랑 #343CFF 적용. [배포·복원 기록](DEPLOYMENT-NOTES.md)
- 배포 명령: `npm run deploy` (빌드 후 Cloudflare에 배포)
- 자동 배포 연결 완료: `main` push → `npm run ci:build` → 기존 Worker 배포. 타입 검사·테스트·빌드·배포 CSS 검사가 성공한 버전만 반영합니다. 다른 브랜치의 미리보기 빌드는 비활성화했습니다. [연결 및 설정값](AUTO-DEPLOY.md)
- 인증 정보, 의존성 폴더, 빌드 결과, 작업 출력물은 Git에 포함하지 않습니다.

## 주요 파일

- `app/page.tsx`: ON&OFF 워드마크, 첫 화면 구성, 문의 링크, 모션 스위치
- `app/components/wordmark.tsx`: 2D 회사 이름
- `app/components/card-ribbon.tsx`: 카드 3D 곡면, 캐릭터 텍스처, 인터랙션
- `lib/scene-frame-loop.ts`: 필요할 때만 실행하는 렌더링 예약과 움직임 마무리
- `lib/team.ts`: 직원 이름/직무/소개와 캐릭터 매핑
- `app/globals.css`: 색상, 타이포그래피, 반응형, 모션
- `public/images/team-realistic-figurines-v3-photoroom.png`: 현재 카드에 적용한 사용자 제공 최신 누끼 이미지
- `public/images/team-realistic-figurines-photoroom.png`: 이전 누끼 이미지 보관
- `public/images/team-realistic-figurines-v4.png`: 배경 제거 전 실사 피규어 원본 보관
- `public/images/team-miniatures.png`: 이전 캐릭터 미니어처 원본 보관
- `public/images/onoff-logo-new.png`: 사용자 제공 로고 원본
- `public/images/onoff-logo.png`: 투명 여백만 정리한 헤더용 로고
- `public/favicon-onoff-32.png`, `public/favicon-onoff-64.png`: 같은 로고의 파비콘
- `scripts/prepare-brand-assets.mjs`: 원본 디자인을 유지하며 로고 크기와 여백 정리
- `public/images/ASSET-NOTES.md`: 생성 이미지 기록

## 검증

```powershell
npx tsc --noEmit
npm run test:loading
npm run test:render
npm run build
```

빌드 마지막 단계에서 `scripts/check-production-css.mjs`가 상담창의 실제 클래스 병합 결과와 최적화된 CSS, 모션 스위치 이동, 9개 화면 크기의 팝업 경계를 검사합니다. 위치 관련 검사가 실패하면 배포용 빌드도 실패합니다.

초기 단계에서 참고한 사이트는 https://follow.art/ 입니다. 현재 버전은 그 사이트의 로고, 문구, 인물 카드, 서체, 색상, 붓 자국을 사용하지 않습니다. 이전에 생성한 실사 인물, 소재 사진, 입체 글자용 폰트 자료는 보관만 하며 현재 화면에서 불러오지 않습니다. Inter의 SIL Open Font License는 `public/fonts/INTER-LICENSE.txt`에 포함되어 있습니다.
