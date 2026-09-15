# 프로젝트 문서 색인

2026-09-13 현재 구현·운영 문서의 색인이다. [AGENTS.md](../AGENTS.md)는 작업 규칙, [README.md](../README.md)는 실행·구조 요약이다. 최초 로컬 검토 이후 사용자 승인으로 GitHub 반영과 운영 배포를 진행했다. 날짜별 문서의 과거 현재/최신 표현과 검증 수치는 그 기록 시점에 한정하며, 같은 주제는 최신 수정 항목이 우선한다. 본문의 코드 경로와 명령은 별도 언급이 없으면 프로젝트 루트 기준이다.

## 페이지와 데이터 기준

| 순서·메뉴 | 주소 ID | 현재 기록 |
| --- | --- | --- |
| 01 HOME | `home` | [3D 오프닝·메인 등장](pages/HOME-OPENING-NOTES.md), [첫 화면 기준](../AGENTS.md), [3D 복구](operations/RECOVERY-NOTES.md) |
| 02 SYSTEM | `why` | [은하 페이지](pages/PAGE2-NOTES.md), [인물 16포즈](../design/galaxy-crew/README.md) |
| 03 DESIGN | `design` | [편집 지면](pages/PAGE3-NOTES.md), [브랜드 v2](../design/design-showcase/v2/README.md), [춤 v4](../design/people-motion/v4/README.md) |
| 04 WEB | `web` | [영상·재생](pages/PAGE4-NOTES.md), [인물 v5](../design/people-motion/v5/README.md) |
| 05 MARKETING | `card` | [마케팅 페이지](pages/PAGE5-NOTES.md), [채널 캠페인 v3](../design/marketing/v3/README.md) |
| 06 SERVICES | `services` | [목록·진입·모션](pages/PAGE6-NOTES.md) |
| 07 TOGETHER | `together` | [마무리 영상·주소 정리](pages/PAGE7-NOTES.md), [프로젝트 문의 안내·검증](reviews/OPENING-AND-INQUIRY-2026-09-13.md), [원본 출처](../design/brand-film/README.md) |

메뉴·진행률은 `lib/site-sections.ts`의 7개 항목을 기준으로 하며 전환은 6개다. TOGETHER의 현재 주소·내부 ID는 `together`다. 이전 `#film`·`from=film`은 호환 입력으로만 받아 새 위치·복귀 링크로 연결한다.

서비스 요약·메타데이터는 `lib/services.ts`, 기획·디자인·마케팅·운영 상세는 `lib/service-details.ts`, 웹 상세는 `lib/web-service.ts`가 담당한다. [네 서비스 상세](pages/SERVICE-DETAILS-NOTES.md)와 [웹 상세](pages/WEB-SERVICE-NOTES.md)가 초기 PAGE6 상세 시안보다 우선한다. 견적·계약 조건은 상담 후 확인한다.

상세5개의 [공통 푸터](pages/SERVICE-FOOTER-NOTES.md)는 회사 정보·문의·서비스 메뉴·기존 개인정보 안내를 제공하며, 회사 정보는 HOME 상단과 같은 원본을 사용한다.

[프로젝트 문의](pages/PROJECT-INQUIRY-NOTES.md)는 [Slack 메시지 접수](operations/SLACK-INQUIRY.md)를 구현하고 실제 운영 전송까지 확인했다. 최신 알림은 한국시간·문의자·의뢰 조건·본문·동의 기록을 구분한다. 입력·참고 링크를 전달하며 파일 업로드는 없다. [개인정보 운영 기준](operations/INQUIRY-PRIVACY-DRAFT.md)은 최대 90일·담당 업무명과 이메일이며, 두 동의와 서버 정책 버전을 검증한다. 상담톡 숨김과 기존 이메일을 유지한다.

## 운영과 검토

- [SEO 문서 모음](seo/README.md): Google·네이버 공식 조사, 구현·검증, Search Console·서치어드바이저 등록 방법.
- [2026-09-15 주소 해시 없는 섹션 이동](reviews/SCROLL-NAVIGATION-2026-09-15.md): 메뉴·목차 스크롤, 기존 주소와 홈 복귀, 방문 기록 보존.
- [2026-09-15 장식 대각선 화살표 제거](reviews/DECORATIVE-ARROWS-2026-09-15.md): 홈·상세의 비동작 장식 제거와 실제 링크·버튼 유지 기준.
- [2026-09-13 최종 전체 검사](reviews/FINAL-AUDIT-2026-09-13.md): 마지막 코드·문서·자산·운영 브라우저 점검, 문의 전송 호환성 수정과 남은 운영 기준.
- [자동 배포](operations/AUTO-DEPLOY.md): 사용자 배포 요청 때의 절차. `main` push는 실제 배포다.
- [outputs 정리 기준](operations/OUTPUTS.md): 검증·조사·자산·배포·도구·현재 서버 로그의 폴더 구분과 이동 검증.
- [배포 이력·캐릭터 복원](operations/DEPLOYMENT-NOTES.md): 날짜별 기록, 현재 운영 상태의 실시간 근거는 아님.
- [3D 복구 정책](operations/RECOVERY-NOTES.md), [린트 예외](operations/LINT-NOTES.md).
- [2026-09-13 전체 감사](reviews/PROJECT-AUDIT-2026-09-13.md): 이번 파일·문서·구조 점검과 수정 결과.
- [감사 후속 개선](reviews/MAINTENANCE-2026-09-13.md): 코드 크기·로딩 최적화, 중복 경고 제거, 문서 링크 검사, 추가 엔진 QA, Slack 접수.
- [전체 반응형 QA](reviews/RESPONSIVE-QA-2026-09-13.md): 홈·상세·문의 117조건, 겹침 수정, 오프닝·DPR·폼·접근성 표본과 최종 빌드 검증.
- [HOME 오프닝 브라우저 QA](reviews/HOME-OPENING-QA-2026-09-13.md): PC·모바일 재생, 도킹·복귀·오류 검증과 후속 수정.
- [탄성 오프닝·TOGETHER 문의 QA](reviews/OPENING-AND-INQUIRY-2026-09-13.md): 탄성 연출·Ease Out·문의 말풍선과 최신 1.5배 속도(약 5.8초) 재검증.
- [2026-09-09~10 검토 이력](reviews/REVIEW-NOTES.md), [FOLLOW.ART 참고 분석](references/FOLLOW-ART-ANALYSIS.md).
- [자산 생성 명령](../scripts/README.md), [옛 public 자료](../design/archive/README.md).

디자인 원본과 프롬프트·해시 문서는 연결된 자산 옆에 남긴다. 검토 GIF는 저장소 파일로 열며 public URL로 제공하지 않는다. `outputs/`의 검증 자료는 로컬 전용이며 새 체크아웃에서 존재한다고 가정하지 않는다. 링크 검사는 `npm run check:repository`로 실행한다.
