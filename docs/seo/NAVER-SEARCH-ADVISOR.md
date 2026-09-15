# 네이버 서치어드바이저 등록 방법

기준일: **2026-09-15**. 등록할 사이트는 **https://on-onf.com** 이다. 아래는 등록 절차이며 실제 네이버 계정의 소유 확인·수집 요청을 완료한 기록은 아니다.

## 1. 사이트 등록

1. [네이버 서치어드바이저](https://searchadvisor.naver.com)에 회사에서 계속 관리할 네이버 계정으로 로그인한다.
2. **웹마스터 도구**를 연다.
3. 사이트 등록 칸에 `https://on-onf.com`을 입력한다.
4. 사이트 소유 확인에서 **HTML 태그** 방식을 선택한다.
5. 제공된 태그 중 **content 안의 값만** 복사한다. 태그 전체나 따옴표를 환경값에 넣지 않는다.

네이버 등록은 호스트 단위다. `/services/web` 같은 상세 경로를 별도 사이트로 등록하지 않는다. www는 정식 주소로 이동하므로 처음부터 www 없는 HTTPS 주소를 사용한다. [네이버 사이트 등록·소유 확인 안내](https://searchadvisor.naver.com/guide/seo-basic-intro).

## 2. 준비된 인증 태그 연결

이 프로젝트에는 네이버 인증값을 HTML에 출력하는 기능을 미리 넣었다. 다음 설정만 추가하면 된다.

1. [Cloudflare 대시보드](https://dash.cloudflare.com) → **Workers & Pages**를 연다.
2. **onoff-hero-preview → Settings → Variables and Secrets → Add**로 이동한다.
3. 아래 값을 입력한다.

| 항목 | 값 |
| --- | --- |
| Type | `Secret` |
| Variable name | `NAVER_SITE_VERIFICATION` |
| Value | 네이버 태그의 content 안에서 복사한 실제 값 |

4. **Deploy**를 눌러 현재 사이트에 적용한다.
5. `https://on-onf.com/`을 열어 **페이지 소스 보기**에서 `naver-site-verification`을 검색한다. `<head>` 안에 있으며 값이 네이버 화면과 같아야 한다.
6. 네이버 소유 확인 화면으로 돌아가 **소유 확인**을 누른다. 화면의 추가 인증 안내가 있으면 완료한다.

빌드 설정의 환경변수 입력란과 Worker 실행 환경의 **Variables and Secrets**는 다르다. 위 변수는 Worker 설정에 넣는다. 값은 `app/layout.tsx`가 요청 시 읽어 서버 HTML에 출력하므로 인증값을 추가하려고 사이트 코드를 편집할 필요는 없다. [Cloudflare Secret 추가 공식 절차](https://developers.cloudflare.com/workers/configuration/secrets/).

소유 확인 토큰은 최종 HTML에서 공개되는 값이다. 여기서 Secret을 쓰는 이유는 Git에 넣지 않고 기존 자동 배포에서도 환경값을 유지하기 위해서다. 네이버 비밀번호·API 키·클라이언트 시크릿은 사용하지 않는다. 실제 계정 값이 없으면 태그를 출력하지 않으며 임의 인증값을 넣어두지 않았다.

## 3. 사이트맵 제출

1. 사이트 목록에서 **https://on-onf.com**을 연다.
2. **요청 → 사이트맵 제출**로 이동한다.
3. 사이트맵 URL에 `https://on-onf.com/sitemap.xml`을 입력하고 제출한다.
4. 입력칸 앞에 사이트 주소가 이미 고정되어 있다면 나머지 `sitemap.xml`만 입력한다.
5. 제출 목록과 처리 상태를 확인한다.

사이트맵은 소유 확인한 사이트와 같은 도메인의 URL을 사용해야 한다. 현재 XML은 홈·서비스 상세5개·문의 페이지, 총7개를 담는다. 이 사이트에는 정기 게시물 RSS가 없으므로 RSS를 임의로 제출하지 않는다. [네이버 RSS·사이트맵 공식 안내](https://searchadvisor.naver.com/guide/request-feed).

## 4. robots.txt 확인

**검증 → robots.txt**에서 현재 규칙을 수집·검증한다. 사이트의 실제 원본 주소는 `https://on-onf.com/robots.txt`다. 핵심 규칙은 아래와 같다. Cloudflare의 관리 주석이 앞에 붙을 수 있다.

```text
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://on-onf.com/sitemap.xml
```

홈·서비스 상세·이미지·CSS·JS는 수집 가능해야 한다. `/api/`는 검색용 문서가 아니라 문의 처리 경로다. 검증 도구가 만든 규칙을 이유 없이 기존 robots 파일 위에 덮어쓰지 않는다. [네이버 robots.txt 공식 안내](https://searchadvisor.naver.com/guide/seo-basic-robots).

## 5. 주요 페이지 수집 요청

**요청 → 웹 페이지 수집**에서 홈페이지와 핵심 서비스부터 요청한다.

| 주소 | 대상 |
| --- | --- |
| `https://on-onf.com/` | 회사·전체 서비스 |
| `https://on-onf.com/services/web` | 홈페이지 제작 |
| `https://on-onf.com/services/design` | 브랜드·상세페이지 디자인 |
| `https://on-onf.com/services/planning` | 기획·전략 |
| `https://on-onf.com/services/marketing` | 콘텐츠·마케팅 |
| `https://on-onf.com/services/operations` | 운영·유지보수 |
| `https://on-onf.com/inquiry` | 프로젝트 문의 |

입력칸이 도메인 뒤 경로만 받는 형태면 홈페이지는 `/`, 상세는 `/services/web`처럼 입력한다. `#home` 같은 섹션 주소, 문의 선택값·광고 추적 쿼리, www 주소는 별도 수집 요청하지 않는다.

요청이 접수되거나 수집이 성공해도 검색 노출이 보장되지는 않는다. 동일 URL을 반복 제출하기보다 오류와 처리 결과를 확인한다. [네이버 수집 요청 안내](https://searchadvisor.naver.com/guide/request-crawl).

## 6. 진단과 운영

등록 후 **검증 → 웹 페이지 최적화**에서 홈페이지와 서비스 상세를 확인한다. 이후 **리포트 → 사이트 최적화 / 수집 현황 / 색인 현황** 등 제공되는 보고서를 살핀다. 메뉴 이름·배치는 개편될 수 있으므로 같은 기능을 선택한다. [네이버 SEO 보고서 안내](https://searchadvisor.naver.com/guide/report-seo).

| 상황 | 확인할 내용 |
| --- | --- |
| 인증 태그를 찾을 수 없음 | 변수 이름·content 값·Deploy 완료, 정식 홈페이지 소스 head 확인 |
| 사이트에 접근할 수 없음 | HTTPS 인증서, robots 접근, Cloudflare가 실제 네이버 로봇에 차단·챌린지를 보내는지 확인 |
| 사이트맵 제출 실패 | 전체 주소의 중복 입력 여부, 해당 사이트 소유 확인, XML200 응답 확인 |
| 제목·설명 경고 | 수집 시각이 이전 배포인지 확인; 최신 URL을 다시 진단 |
| 아직 색인된 페이지가 없음 | 사이트맵·수집 처리 상태와 오류를 확인하고 다음 수집을 기다림 |
| 소유 확인 갱신 안내 | 기존 인증값을 유지하고 계정의 갱신 절차 진행 |

첫 달에는 주1회, 이후 월1회와 주요 배포 후 점검하는 것을 운영 기준으로 권장한다. 검색 누락을 이유로 실제로 제공하지 않는 서비스명·지역명·반복 키워드를 채우지 않는다.

## 대안: HTML 파일 인증

네이버는 원본 HTML 파일 업로드도 지원한다. 이 방식을 선택했다면 발급 파일의 이름·내용을 그대로 공개 루트에 제공해야 한다. 이 프로젝트에서는 파일을 `public/`에 추가하고 `scripts/public-assets.config.json`의 공개 자산 목록을 갱신한 뒤 검사·배포해야 한다. 실제 파일이 없으므로 이번 작업에서는 추가하지 않았다. 현재는 코드 배포 없이 연결할 수 있는 HTML 태그 방식이 간단하다. [네이버 소유 확인 방법](https://searchadvisor.naver.com/guide/seo-basic-intro).

서치어드바이저는 웹사이트 검색 관리 도구다. 네이버 스마트플레이스의 업체·지도 등록은 별도 절차이며 이번 문서의 사이트 등록만으로 자동 완료되지 않는다.
