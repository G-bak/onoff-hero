# 온앤오프 검색 최적화 문서

조사·적용 기준일: **2026-09-15**. 대표 사이트는 **https://on-onf.com/** 이다. Google Search Central·Search Console 도움말과 네이버 서치어드바이저 공식 자료를 확인해 현재 사이트에 필요한 항목을 적용했다.

## 문서 안내

| 문서 | 읽을 내용 |
| --- | --- |
| [공식 자료 조사와 적용 기준](RESEARCH.md) | Google·네이버 요구사항, 출처, 검색 의도별 페이지 구성, 유지 기준 |
| [구현·검증 기록](IMPLEMENTATION.md) | 기존 검색 차단 문제, 코드 변경, 자동 검사, 측정 범위와 운영 점검 |
| [Google Search Console 등록](GOOGLE-SEARCH-CONSOLE.md) | Cloudflare DNS 인증, 사이트맵 제출, URL 검사 |
| [네이버 서치어드바이저 등록](NAVER-SEARCH-ADVISOR.md) | 사이트 소유 확인, 인증 태그 적용, 사이트맵·수집 요청 |

## 등록할 주소

| 용도 | 값 |
| --- | --- |
| Google 도메인 속성 | `on-onf.com` |
| 네이버 사이트 등록 | `https://on-onf.com` |
| 사이트맵 | `https://on-onf.com/sitemap.xml` |
| 검색로봇 규칙 | `https://on-onf.com/robots.txt` |

사이트 코드는 인증값을 받을 준비가 되어 있다. **각 계정의 실제 소유 확인·사이트맵 제출·검색 색인 완료는 별도 단계**다. 이번 작업에서 계정 등록을 완료했다고 간주하지 않는다. Google은 DNS 인증, 네이버는 준비된 HTML 태그 방식을 권장한다.

검색엔진이 페이지를 찾고 이해할 수 있게 하는 기술 설정과 검색 순위는 구분한다. 노출 여부·시점·검색 결과 문구는 검색엔진이 결정하며 특정 순위나 모든 검사 도구의 만점을 보장하지 않는다. [Google 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko), [네이버 최적화 목적](https://searchadvisor.naver.com/guide/seo-basic-intro).

도메인은 가비아에서 구매했지만 현재 DNS는 Cloudflare에서 관리한다. 인증용 DNS 레코드를 추가할 위치도 Cloudflare다. 홈페이지 화면·모션과 기존 GitHub 자동 배포는 유지한다. [자동 배포 운영](../operations/AUTO-DEPLOY.md).
