# 접속 재발 진단 — 초기 계정 재연결 후 확인

이후 사용자 승인으로 이 보고서를 GitHub에 반영한다. 원본 진단 출력은 Git에서 제외하며 최신 상태는 [후속 복구 기록](DNS-RECOVERY-2026-09-15.md)을 따른다.

확인 시각: 2026-09-15 16:54~16:57 KST. 이번 작업은 읽기 조회와 로컬 기록이다.

## 결론

이 PC의 기본 DNS 경로 `192.168.0.1`이 계정 이전 전의 네임서버 정보와 주소 없음 응답을 반복해서 반환한다. 같은 시각 새 권한 네임서버와 Google·Cloudflare·Quad9 DNS를 사용하면 홈페이지와 사이트맵에 정상 접속한다. 실패 지점은 웹 요청 전의 DNS 해석이며, 현재 관측은 공유기 또는 상위 DNS의 이전 캐시가 혼재한 상태와 일치한다. 공유기 내부와 통신사 상위 resolver 중 어느 장비가 응답을 보관하는지는 아직 구분하지 못했다.

초기 계정 잔존 자원 조회는 완료했다. 정식 도메인과 연결된 초기 자원은 확인되지 않았고, 초기 운영 Worker와 자동 배포 연결도 현재는 없다. **전체 방문자 복구 완료는 아니다.** 이번 조회로 PC·공유기 DNS 설정이나 외부 캐시를 바꾸지는 않았다.

## 1. 초기 계정 실제 조회

- 16:54:10 KST `/user`·`/accounts`: HTTP200·success=true, 이메일 `ajdhfbx1836203@naver.com`, 계정 `4c692f878ebb293ad79ef0d8c9c7cfcc`. 재로그인 없이 재연결을 확인했다.
- `on-onf.com` zone 목록: 0개. 기존 zone ID `0674bbf17783acacb5ee2220a00e260a`의 직접 조회: 오류1001 `Invalid zone identifier`.
- 계정 전체 Worker Custom Domain 목록 중 루트·www·해당 zone 연결: 0개. Worker 목록의 route에도 해당 도메인 연결 없음. 삭제된 zone의 DNS·route 목록은 정상 조회 대상이 없어 생략했다.
- `onoff-hero-preview`: Worker 목록에 없음. 설정 직접 조회도 오류10007 `This Worker does not exist on your account`.
- 감사 로그: 초기 `onoff-hero-preview`는 **16:48:23.854 KST**, `onoff-web-preview`는 **16:48:33.402 KST**에 삭제 성공이 기록돼 있다. 이번 세션이 수행한 삭제가 아니며 실행 주체는 이 보고서에서 단정하지 않는다. 이전 메모의 “보존”은 당시 이력이다.
- 감사 로그에서 확인한 초기 hero tag `903753cb943e4052a960df07c707f459`: Builds 설정 조회 오류12040(설정 없음), 트리거 목록 HTTP200·0개.
- 남은 `onoff-redesign-temp-20260909`: route·Custom Domain 없음, binding 0개, Builds 설정 없음·트리거0개. 자체 workers.dev는 enabled=true, preview는 false다. 정식 도메인의 DNS 실패와 연결된 근거는 없다.
- 다른 프로젝트 자원은 유지했다. secret 값은 읽어 출력하지 않았다. 새 운영 계정의 Wrangler 인증·소스 설정·배포는 변경하지 않았다.

## 2. 같은 시각 DNS·HTTPS 비교

| 조회 경로 | DNS 결과 | HTTPS 결과 |
| --- | --- | --- |
| 기본 DNS `192.168.0.1` | 루트 주소 없음, www NXDOMAIN 등 이전 응답 혼재 | 루트·사이트맵 EAI_AGAIN, www ENOTFOUND |
| Google `8.8.8.8` | 루트/www 정상 A·AAAA, 새 NS·SOA | HOME200·sitemap200·www308 |
| Cloudflare `1.1.1.1` | 루트/www 정상 A·AAAA, 새 NS·SOA | HOME200·sitemap200·www308 |
| Quad9 `9.9.9.9` | 루트/www 정상 A·AAAA, 새 NS·SOA | HOME200·sitemap200·www308 |
| 새 aida·keanu 직접 | 루트/www 정상 A·AAAA, 새 권한 응답 | 직접 DNS 증거 |
| 이전 ashley·trevor 직접 | 루트 A·AAAA 없음, www NXDOMAIN, 이전 권한 SOA·NS | 직접 DNS 증거 |

HTTPS 확인은 원래 호스트·SNI·인증서 검증을 유지한 GET이다. 공개 DNS별 루트·사이트맵·www의 총9요청이 정상이며 실제 Google 검색 수집 성공을 의미하지 않는다.

- registry RDAP와 `.com` parent `a.gtld-servers.net`·`m.gtld-servers.net` 모두 새 `aida.ns.cloudflare.com`·`keanu.ns.cloudflare.com`만 반환했다. parent NS TTL은172800초, DS 레코드는 없다.
- 16:55:47 KST 공유기 NS 조회는 한 번 새 NS를 반환했지만 A/AAAA와 www는 이전 SOA를 동반한 실패였다. 16:56:40 KST Windows 조회 및 16:57:23 KST raw DNS 6회 조회에서는 다시 이전 NS를 반환했다.
- 6회 연속 www A 조회는 `NXDOMAIN → 정상 A → NXDOMAIN → NXDOMAIN → NXDOMAIN → NXDOMAIN`이었다. 루트 A는6회 모두 주소 없음이었다. 같은 호스트가 열렸다 다시 끊기는 현상과 정합적이다.
- 루트 부정 응답 TTL이 `1179 → 1411 → 224 → 1179 → 1179 → 693`초로 달라 단일 캐시의 남은 시간으로 계산할 수 없다. parent TTL172800초도 현재 모든 방문자의 남은 장애 시간이나 복구 보장 시간이 아니다.

## 3. 삭제한 초기 네임서버가 응답하는 이유

Cloudflare는 Deleted zone을 보관하고 삭제되지 않은 DNS 레코드는 기존 네임서버에서 계속 응답한다고 설명한다. 일반적으로7일 뒤 Purged 상태에서 응답을 중단한다. 그러므로 API zone 목록0개와 구 NS의 SOA·NS 응답은 양립할 수 있다. [Cloudflare Zone status](https://developers.cloudflare.com/dns/zone-setups/reference/domain-status/#deleted)

이번 이력은 15:37 KST Custom Domain의 웹 DNS 레코드 삭제 후 zone 삭제다. 구 NS의 웹 주소만 사라진 응답은 이 순서와 일치한다. 이것은 관측·삭제 이력·공식 문서를 합친 추론이며 Cloudflare 내부 보관 상태를 별도 API로 확인한 것은 아니다. 7일 보관 기간이 사이트 복구에7일이 필요하다는 뜻도 아니다.

## 4. 복구 방법과 적용 범위

1. **현재 PC의 즉시 접속:** 이더넷의 DNS를 정상 확인한 공개 resolver로 바꾸면 실패 중인 공유기 DNS 경로를 우회할 수 있다. 예를 들어 기본 `1.1.1.1`, 보조 `8.8.8.8`이며 둘 다 이번 회선에서 직접 검증했다. 적용한다면 현재 자동/수동 설정을 먼저 보관하고, 변경 후 PC 캐시 갱신·일반 HTTPS·반복 DNS로 확인한다. 이번에는 설정하지 않았다.
2. **같은 공유기를 쓰는 기기:** 공유기 WAN/상위 DNS를 정상 resolver로 변경하고 필요한 DHCP 갱신을 수행하는 방법이 있다. 공유기 모델·상위 DNS 설정은 아직 확인하지 않았다. 공유기 재시작만으로 통신사 DNS 캐시까지 지워지는 것은 아니다.
3. **다른 방문자:** 새 가비아 위임 aida·keanu와 새 운영 zone을 유지한다. 문제가 남은 회선의 DNS 운영자에게 `on-onf.com`·`www.on-onf.com`의 구 NS 및 부정 캐시 갱신을 요청해야 한다. 사이트 운영자가 모든 ISP 캐시를 한 번에 지우는 조치는 이번 API에서 확인되지 않았다. 시간 경과 후 정상화 여부도 문제가 발생한 resolver에서 반복 확인한다.
4. **피해야 할 복구 시도:** 초기 임시 Worker 삭제는 DNS 캐시를 갱신하지 않는다. 초기 zone 재추가도 보안상 새 네임서버 쌍을 배정하므로 ashley·trevor 복구를 보장하지 않는다. 현재 정상인 위임을 다시 변경하지 않는다. [Cloudflare zone 재추가](https://developers.cloudflare.com/dns/zone-setups/removal/)

PC 캐시와 resolver 캐시는 별개다. 부정 응답 TTL이 끝나도 구 NS를 다시 따르면 실패 응답을 재획득할 수 있다. 따라서 “몇 분 뒤” 또는 “48시간 이내 반드시 완료”로 안내하지 않는다. [Cloudflare DNS 진단](https://developers.cloudflare.com/dns/troubleshooting/dns-issues/), [RFC2308](https://www.rfc-editor.org/info/rfc2308/)

### 통신사 문의 초안 — 미전송

> 2026-09-15 16:55~16:57 KST, 현재 회선의 DNS 경로192.168.0.1에서 on-onf.com의 A/AAAA 주소 없음 및 www.on-onf.com의 NXDOMAIN이 반복됩니다. 응답 SOA는 이전 ashley.ns.cloudflare.com이며 NS도 이전 ashley/trevor와 새 값이 혼재합니다. .com parent와 등록 정보는 aida.ns.cloudflare.com / keanu.ns.cloudflare.com이고, 두 권한 NS 및 Google8.8.8.8·Cloudflare1.1.1.1·Quad9 9.9.9.9에서는 정상 해석·HTTPS가 확인됩니다. 해당 도메인의 이전 NS 위임 캐시와 루트/www 부정 캐시를 점검·갱신해 주십시오.

## 5. 로컬 증거

모두 Git 제외 `outputs/qa/2026-09-15/sitemap-fetch/` 아래다. 기존 자료를 덮어쓰지 않았다.

- `cloudflare-initial-account-reconnected-20260915.json`: 계정·대상 자원·감사 로그·Builds. 다른 프로젝트 목록과 비밀값은 제외.
- `dns-recurrence-reconnected-2026-09-15T07-55-47-320Z.json`: 첫 DNS·parent·RDAP·HTTPS 비교.
- `dns-recurrence-reconnected-2026-09-15T07-57-21-807Z.json`: 후속 비교·공유기6회 샘플.
- `dns-recurrence-reconnected-windows-20260915-1657.json`: 실제 조회16:56:40 KST의 Windows DNS·회선·캐시 상태.
- `dns-recurrence-reconnected.mjs`: 읽기 전용 재현 도구.

후속 실행은 이 보고서를 기준으로 한다. 이번 세션은 Cloudflare GET·DNS 조회·HTTP GET·로컬 기록만 수행했고, 운영 변경·삭제·문의/Slack 전송·commit·push·배포는 수행하지 않았다.
