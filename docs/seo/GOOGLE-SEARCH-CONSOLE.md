# Google Search Console 등록 방법

기준일: **2026-09-15**. 운영 주소는 **https://on-onf.com/** 이다. 이 문서는 등록 절차이며 실제 계정의 소유 확인·사이트맵 제출을 완료했다는 기록은 아니다.

## 준비할 것

- 회사에서 계속 관리할 Google 계정
- `on-onf.com`이 있는 Cloudflare 계정의 DNS 수정 권한
- Google이 해당 계정에 발급하는 소유 확인값

도메인은 가비아에서 샀지만 현재 네임서버는 `aida.ns.cloudflare.com`, `keanu.ns.cloudflare.com`이다. **인증 TXT는 새 Cloudflare 계정의 on-onf.com에 추가한다.** 현재 연결된 웹사이트 DNS나 네임서버를 바꿀 필요는 없다.

## 1. 도메인 속성 만들기

1. [Google Search Console](https://search.google.com/search-console)에 로그인한다.
2. 처음이라면 시작 화면, 사용 중이라면 왼쪽 위 속성 선택에서 **속성 추가**를 연다.
3. **도메인**을 선택하고 `on-onf.com`을 입력한다. 이 칸에는 `https://`, `www`, 끝의 `/`를 넣지 않는다.
4. 계속을 누르고 DNS 인증 안내에서 **TXT 레코드 값 전체**를 복사한다. 일반적으로 `google-site-verification=`으로 시작한다.

도메인 속성은 HTTP·HTTPS와 하위 도메인을 함께 다루며 DNS 소유 확인이 필요하다. [Google 속성 추가 안내](https://support.google.com/webmasters/answer/34592?hl=ko).

## 2. Cloudflare에 TXT 추가

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에 로그인한다.
2. `on-onf.com` 도메인 → **DNS → Records**를 연다.
3. **Add record**에서 아래처럼 입력하고 저장한다.

| 항목 | 입력값 |
| --- | --- |
| Type | `TXT` |
| Name | `@` 또는 루트 도메인 `on-onf.com` |
| Content | Google 화면에서 복사한 값 전체 |
| TTL | `Auto` |

TXT는 웹사이트 트래픽 프록시 설정 대상이 아니다. 기존 A·AAAA·CNAME·MX·다른 TXT 레코드는 그대로 두고 새 인증 레코드를 추가한다. [Cloudflare DNS 레코드 공식 절차](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/).

4. Search Console로 돌아가 **확인**을 누른다.
5. 소유권이 확인되면 속성을 연다. 반영 대기라면 잠시 뒤 다시 확인한다. 인증용 TXT는 완료 후에도 유지한다.

DNS 전파 지연이 있을 수 있다. Google은 소유 확인을 다시 확인할 수 있으므로 인증값을 삭제하면 권한을 잃을 수 있다. [Google 소유 확인 안내](https://support.google.com/webmasters/answer/9008080?hl=ko).

기술 담당자는 다음 읽기 전용 명령으로 공개 DNS에서 TXT가 보이는지 확인할 수 있다.

```powershell
Resolve-DnsName -Name on-onf.com -Type TXT -Server 8.8.8.8
```

## 3. 사이트맵 제출

1. 등록한 `on-onf.com` 속성을 선택한다.
2. 왼쪽 **Sitemaps / 사이트맵** 메뉴를 연다.
3. 새 사이트맵 주소에 `https://on-onf.com/sitemap.xml`을 입력하고 제출한다.
4. 상태가 처리 대기라면 나중에 다시 확인한다. **성공**은 사이트맵을 처리했다는 뜻이며 모든 URL의 색인 완료를 뜻하지 않는다.

URL 접두어 속성에서 입력칸 앞에 `https://on-onf.com/`이 고정 표시되면 나머지 `sitemap.xml`만 입력한다. 도메인 속성에서는 전체 주소를 사용한다. [Google 사이트맵 보고서](https://support.google.com/webmasters/answer/7451001?hl=ko).

이 사이트의 사이트맵에는 홈·서비스 상세5개·문의 페이지, 총7개의 정식 URL이 들어 있다. `robots.txt`와 www 주소를 사이트맵 URL로 제출하지 않는다.

## 4. 주요 URL 검사와 색인 요청

상단 **URL 검사**에 다음 정식 주소를 하나씩 입력한다.

| 순서 | 주소 |
| --- | --- |
| 1 | `https://on-onf.com/` |
| 2 | `https://on-onf.com/services/web` |
| 3 | `https://on-onf.com/services/design` |
| 4 | `https://on-onf.com/services/planning` |
| 5 | `https://on-onf.com/services/marketing` |
| 6 | `https://on-onf.com/services/operations` |
| 7 | `https://on-onf.com/inquiry` |

아직 색인되지 않았으면 **실제 URL 테스트**로 접근·색인 허용 상태를 확인한 뒤 **색인 생성 요청**을 사용한다. 제출량 제한에 걸리면 반복 요청하지 않고 사이트맵을 통한 발견을 기다린다. 업데이트를 배포할 때마다 모든 URL을 다시 요청할 필요는 없다. [Google URL 검사](https://support.google.com/webmasters/answer/9012289?hl=ko).

확인할 내용은 HTTP200, 크롤링 허용, 색인 허용, 사용자가 선언한 표준 URL이 해당 정식 주소인지다. Google이 선택한 표준 URL과 수집 시각은 실제 수집 후 표시될 수 있다. `/#home` 같은 섹션 주소나 문의 선택 쿼리는 별도 제출하지 않는다.

## 5. HTML 태그 방식이 필요한 경우

DNS 권한을 사용할 수 없다면 **URL 접두어** 속성에 `https://on-onf.com/`을 등록하고 **HTML 태그**를 선택할 수 있다. 이 방식은 도메인 속성 인증을 대신하지 않으며 입력한 접두어 범위만 관리한다.

1. Google이 보여주는 `<meta name="google-site-verification" content="…">`에서 **content 안의 값만** 복사한다.
2. Cloudflare → **Workers & Pages → onoff-hero-preview → Settings → Variables and Secrets → Add**를 연다.
3. Type은 **Secret**, 이름은 `GOOGLE_SITE_VERIFICATION`, 값은 복사한 content 값으로 저장·Deploy한다.
4. 홈페이지의 페이지 소스 `<head>`에서 `google-site-verification`을 찾아 실제 값과 일치하는지 확인한다.
5. Search Console에서 소유 확인을 완료한다.

이 프로젝트는 실행 시 환경값을 읽어 태그를 출력한다. 별도 코드 수정·GitHub 커밋 없이 적용할 수 있다. 인증 토큰은 HTML에 공개되는 값이지만 기존 코드 자동 배포에서 환경값을 유지하기 위해 Secret 저장 방식을 사용한다. **비밀번호나 Google API 키를 넣는 칸이 아니다.** [Cloudflare 환경값 추가](https://developers.cloudflare.com/workers/configuration/secrets/).

## 자주 생기는 문제

| 상황 | 확인할 내용 |
| --- | --- |
| DNS 인증값을 못 찾음 | 가비아가 아니라 Cloudflare에 추가했는지, Name이 루트인지, 값 전체를 복사했는지, 전파 중인지 확인 |
| 태그 인증 실패 | URL 접두어 속성인지, 변수 이름과 content 값이 맞는지, 저장 후 Deploy했는지, 처음 받는 HTML head에 있는지 확인 |
| 사이트맵을 가져올 수 없음 | 제출한 정확한 주소의 실제 URL 테스트에서 크롤링 허용·페이지 가져오기 성공 여부를 확인한다. 사이트맵 HTTP200 XML·robots 허용·DNS·HTTPS를 확인하고 접근 문제가 해결되면 같은 주소를 다시 제출한다. 마지막 읽은 날짜와 실제 재검사 결과를 구분한다. |
| `noindex`로 제외됨 | 마지막 수집 시각이 SEO 배포 전인지 확인하고 실제 URL 테스트 후 재수집 요청 |
| 중복·대체 페이지 | www·쿼리 URL이 정식 주소로 통합된 결과라면 정상일 수 있음. 정식 URL 자체의 색인을 따로 확인 |
| URL이 Google에 없음 | 신규 사이트는 수집·판단 시간이 필요함. 사이트맵 처리와 페이지 접근을 먼저 확인 |
| 구조화 데이터가 있어도 특수 결과가 없음 | 지원되는 검색 유형·품질·검색 상황에 따라 표시 여부가 달라짐 |

## 등록 후 관리

2026-09-15 16:28~16:30 KST 접속 장애 조사에서는 기본 DNS가 이전 네임서버 정보를 반환하고 HOME·사이트맵 요청이 ENOTFOUND로 실패했다. Google·Cloudflare·Quad9 공개 DNS를 각각 사용한 HTTPS 요청은 모두200이었고, 실제 브라우저에서도 HOME 화면과7개 URL의 사이트맵 XML이 열렸다. 새 계정의 zone·Custom Domain·HTTPS는 활성이다. 계정 이전 후 일부 DNS에 남은 실패 응답을 확인했으며 전체 회선 복구나 Google의 실제 수집 성공을 확인한 것은 아니다. 로컬 DNS 캐시 초기화만으로 상위 DNS 캐시는 지워지지 않는다. [Cloudflare DNS 캐시 설명](https://developers.cloudflare.com/dns/troubleshooting/dns-issues/), [Google 사이트맵 오류 진단](https://support.google.com/webmasters/answer/7451001?hl=ko). 검사 근거는 [배포 기록](../operations/DEPLOYMENT-NOTES.md)을 따른다.

등록 직후에는 **페이지 색인 생성**, **사이트맵**, **보안 문제·직접 조치**를 확인한다. 데이터가 쌓이면 **검색 실적**에서 브랜드명과 서비스 검색어의 노출·클릭·CTR을 페이지별로 살핀다. **Core Web Vitals**에 데이터가 없다는 표시는 성능 합격이 아니라 표본 부족일 수 있다.

첫 달에는 주1회, 이후 월1회와 주요 배포 후 확인하는 것을 이 프로젝트의 운영 주기로 권장한다. 이는 검색엔진이 요구하는 고정 주기가 아니다. 실제 콘텐츠 변경 후에도 검색 결과 반영 시점을 보장하지 않는다. [운영·검증 기준](IMPLEMENTATION.md).
