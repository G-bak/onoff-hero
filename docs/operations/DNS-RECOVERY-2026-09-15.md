# 홈페이지 DNS 복구 — 2026-09-15

이후 사용자 승인으로 이 보고서를 GitHub에 반영한다. 아래 로컬 보관 표기는 작성 당시의 범위이며, 원본 진단 출력과 PC 복구 스크립트는 계속 Git에서 제외한다. 문서 반영은 접속 복구 완료를 의미하지 않는다.

## 17:28 KST 후속 — 일반 접속 및 이전 자체의 복구에 집중

사용자가 모바일 데이터에서도 실패한다고 알렸고, PC DNS 우회 접근을 지적했다. 모바일의 실패 원인을 이 PC의 측정만으로 특정하지 않는다. Search Console/색인 점검은 사용자 요청으로 보류한다. PC·공유기 DNS 변경은 재시도하지 않는다.

17:24:45~54 KST 일반 시스템 DNS에서는 루트/www가 ENOTFOUND로 HTTP 전에 실패했다. 명시적으로 정상 DNS를 지정한 비교에서는 7페이지×4종 User-Agent×2 resolver=56건 HTTP200, 리다이렉트30경로 정상이다. 이 결과는 **서버가 조건부 비교 경로에서 정상이라는 증거이며 일반 방문자 접속 복구를 의미하지 않는다.** 정상이라는 표현을 이 범위를 넘어 사용하지 않는다.

17:23~17:25 실제 Cloudflare 조회에서 중복 Worker route·사용자 firewall rule 없음, Access 미사용, Bot Fight Mode·crawler protection 비활성, 현재 zone/계정에 사용자 정의 차단 ruleset 없음이다. 06:50~08:25 UTC 조회한 `firewallEventsAdaptive` 결과0개는 해당 표본·조회 범위에서 차단 기록을 찾지 못했다는 뜻이며 전 방문자 차단 부재 보장은 아니다.

현재 확실한 직접 실패 지점은 일반 접속 경로의 주소 해석이다. 구 ashley/trevor가 여전히 권한 NS/SOA와 주소 없음 응답을 반환하고 새 aida/keanu 및 등록 위임은 정상이다. 15:37 KST 구 Custom Domain/DNS 제거→구 zone 삭제 이력과 결합하면, 이전 완료 전에 사라진 웹 레코드를 구 NS 경로에서 계속 찾는 상황이라는 설명과 일치한다. 개별 recursive resolver 내부 동작과 모바일 실패 원인은 별도 미확인이다.

**새 DNS의 해제·재등록은 복구책으로 선택하지 않는다.** 재등록은 새 NS 쌍을 다시 배정하지만 구 ashley/trevor와 외부 캐시를 지우지 않는다. 현재 활성 zone을 보존하면서 구 권한 응답의 조기 정리가 가능한지 Cloudflare에 조사 요청하고, 실패 recursive resolver의 NS·부정 캐시 갱신이 실제 이루어져야 한다. 공개 API에는 삭제한 구 zone을 즉시 purge하거나 DNS를 복원하는 지원 경로를 찾지 못했다. Cloudflare 내부 조치 가능 여부도 지원 확인 전 보장하지 않는다. [재등록 동작](https://developers.cloudflare.com/dns/zone-setups/removal/), [삭제 상태](https://developers.cloudflare.com/dns/zone-setups/reference/domain-status/#deleted).

[Cloudflare 조사 요청문](CLOUDFLARE-DNS-INCIDENT-2026-09-15.md)을 준비했으며 미전송이다. 기존 KT 요청문도 미전송이다. 이번 후속에서 새 zone·가비아 위임·앱 소스·배포·PC DNS 설정은 변경하지 않았다. 전체 복구 완료도 아니다.

진단·후속 확인: 17:11~17:19 KST. 복구 조치 상태는 아래 진행표를 기준으로 하며, PC 우회 적용과 전체 방문자 복구를 구분한다. 이 문서와 증거는 로컬 보관용이다.

## 17:11~17:19 KST 당시 결론

**회사 Cloudflare 계정의 홈페이지·인증서·새 DNS 위임은 정상이다. 접속 실패는 공유기와 KT DNS 조회 경로에 남은 이전 네임서버·주소 없음 응답에서 재현됐다.** 기존 진단에서 미확정이던 통신사 DNS 직접 조회에서도 장애를 확인했다. 다만 KT 전체 고객의 결과나 캐시를 보관하는 개별 장비까지 확인한 것은 아니다.

정상 확인한 `1.1.1.1`·`8.8.8.8`을 사용하는 PC 우회 스크립트를 준비했다. **17:18 KST 관리자 권한 실행 요청은 Windows에서 사용자 취소로 종료됐다. 관리자 실행은 시작되지 않았고, PC DNS 설정도 변경되지 않았다.** 일반 권한 변경도 실패했으므로 PC 복구는 미완료다. 새로운 사용자 지시 없이 관리자 실행을 반복하지 않는다.

17:19:43 KST 최종 재조회에서도 `Applied=false`, 이더넷 IPv4 DNS `192.168.0.1` 유지를 확인했다.

## 1. 회사 계정과 운영 서비스 확인

- 17:11:28 KST 실제 MCP 계정: `onoff3738@naver.com`, 계정 ID `f446e31d575c7e7135b7486ada7c35c4`. 저장된 로그인 성공만으로 판단하지 않았으며 재로그인을 반복하지 않았다.
- 새 zone `76e8a080d3391f997a0106e5f4d3c8e5`: active, paused=false, aida·keanu 네임서버. 루트/www Custom Domain은 `onoff-hero-preview` production에 enabled=true다. 인증서 묶음 3개가 active이며 DNSSEC는 disabled다.
- 현재 Worker 버전 `5e815bce-2ffe-4456-b60f-c91752d9e678`가 100% 배포된 상태다. 이번 진단은 추가 앱 배포 없이 현재 서비스를 검사했다.
- 17:14:22~28 KST 공개 DNS 2곳으로 공개 7개 경로를 각각 확인해 **14/14 HTTP200**, 참조 자산 **23/23 HTTP200**, 루트/www TLS 검증 **4/4 성공**이다. HTTP→HTTPS 301·www→대표 주소 308은 경로와 쿼리를 보존한다.
- 문의 GET은 두 경로 모두 HTTP200·enabled=true다. 실제 문의·Slack 전송과 브라우저 시각 검수는 수행하지 않았다.

## 2. DNS 실패 범위

| 조회 경로 | 실제 관측 |
| --- | --- |
| PC 기본 DNS `192.168.0.1` | 일반 DNS/HTTPS ENOTFOUND. 8회 UDP 반복에서 루트·www 모두 8회 실패. 이전 NS와 새 NS가 간헐적으로 혼재 |
| KT 기본 `168.126.63.1` | 8회 UDP: 루트 7회 NODATA·1회 SERVFAIL, www 7회 NXDOMAIN·1회 SERVFAIL, NS는 8회 모두 ashley·trevor. 별도 TCP 4회도 루트/www 모두 실패 |
| KT 보조 `168.126.63.2` | 8회 UDP는 정상이나, 별도 TCP 4회 중 www 1회 NXDOMAIN·3회 정상. Windows TCP 조회에서는 이전 NS도 1회 관측. 일관되게 복구된 경로가 아님 |
| Google `8.8.8.8`·Cloudflare `1.1.1.1`·Quad9 `9.9.9.9` | 루트/www A·AAAA와 새 NS 정상. HOME200·sitemap200·www308 |
| SKB `210.220.163.82`·`219.250.36.130`, LG `164.124.101.2`·`203.248.252.2` | 17:11 KST DNS 비교 정상. 각 첫 주소를 사용한 HOME200·sitemap200·www308 |
| 새 aida·keanu 권한 NS | 루트/www 정상 A·AAAA |
| 이전 ashley·trevor 권한 NS | 루트 주소 없음, www NXDOMAIN, 이전 SOA |

UDP와 별도 Node TCP 소켓 조회는 Windows DNS 캐시를 거치지 않는다. KT 보조의 일시 성공만으로 통신사 복구를 설명하지 않는다. 통신사 주소 식별은 [LG전자 안내](https://www.lge.co.kr/support/solutions-20154419463695?category=CT50019563&mktModelCd=24V50N-G&page=1&productCode=MUDSK&seq=101&sort=update&subCategory=CT50019585), [Kollus 공식 문서](https://docs.kollus.com/en/dev-guide/troubleshooting/end-users/environments/dns-setting/)를 참고했으며 표의 결과는 실제 조회다.

`.com` parent 2곳과 registry RDAP는 aida·keanu만 반환하고 parent DS 레코드는 없다. 현재 증거는 잘못된 가비아 위임이나 DNSSEC DS 불일치를 가리키지 않는다. 일부 이전 NS TTL은 다시 86400초, 부정 SOA TTL은 다시 1800초에 가까워졌다. 서로 다른 캐시 응답이 혼재하므로 이를 전체 장애의 남은 시간으로 계산하지 않는다.

## 3. 17:11~17:19 KST 복구 조치와 남은 확인

| 항목 | 상태·적용 범위 |
| --- | --- |
| 현재 운영 zone·도메인·인증서 점검 | 완료. 새 회사 계정과 정상 위임 유지 |
| PC 기존 설정 보관 | 완료. 이더넷 IPv4, InterfaceIndex=16, DHCP DNS `192.168.0.1`, 수동 NameServer 없음 |
| PC DNS 우회 | **미적용·관리자 실행 취소.** `repair-pc-dns.ps1` 준비 완료. 일반 권한 변경 실패 뒤 관리자 실행 요청에서 `The operation was canceled by the user.` 반환. 해당 어댑터 DNS는 기존 `192.168.0.1` 유지. 스크립트는 추후 승인 실행 시 `1.1.1.1`·`8.8.8.8` 적용·캐시 갱신·HTTPS 검증, 실패 시 원래 DHCP DNS 자동 복원하도록 구성 |
| Cloudflare 공개 DNS 갱신 | 최초 PowerShell 요청 4건은 HTTP503. 이후 curl로 루트 NS·A·AAAA 및 www A·AAAA **5개 요청 모두 HTTP200·갱신 큐 접수** 확인. 인증서 검증을 유지했으며 큐 접수를 모든 캐시의 갱신 완료로 표시하지 않음 |
| KT 캐시 갱신 | 운영자 확인 필요. 아래 요청문 준비, **미전송** |
| 전체 방문자 복구 | 미확인. 문제가 발생한 KT·공유기 경로의 반복 조회로 별도 확인 필요 |

Cloudflare 공개 DNS의 갱신 도구는 **1.1.1.1의 캐시**를 대상으로 한다. 성공 응답도 KT 캐시가 삭제됐다는 의미가 아니다. Cloudflare 사이트 콘텐츠 캐시 삭제와 DNS 캐시 갱신도 구분한다. [Cloudflare 공식 FAQ](https://developers.cloudflare.com/1.1.1.1/faq/)

갱신 요청 뒤 `1.1.1.1`은 새 NS·TTL86400을 반환했다. **17:17:35 KST raw TCP 4회 후속 확인에서도 Cloudflare는 정상 4/4, 공유기와 KT 기본은 루트/www 실패 4/4였다.** KT 보조는 A/www가 정상인 가운데 이전 NS가 한 번 반환됐다. 공개 DNS 갱신 요청 후에도 KT 경로의 전체 복구는 확인되지 않았다.

PC 조치 파일은 Git 제외 `outputs/qa/2026-09-15/dns-recovery/repair-pc-dns.ps1`이며, `-Rollback`은 보관한 기존 DHCP/수동 설정으로 복원한다. 스크립트는 보관한 어댑터 GUID를 확인하고, 백업 이후 예상치 못한 DNS 변경이 있으면 덮어쓰지 않는다. PC 우회 성공은 공유기 아래 다른 기기나 외부 방문자의 복구를 의미하지 않는다.

## 4. KT 기술지원 요청문 — 미전송

> 회사 홈페이지 on-onf.com의 DNS 이전 후 접속 장애를 확인했습니다. 2026-09-15 17:11~17:14 KST, KT DNS 168.126.63.1에 직접 UDP/TCP 조회하면 루트 A가 NODATA/SERVFAIL, www.on-onf.com A가 NXDOMAIN/SERVFAIL이며, 이전 ashley.ns.cloudflare.com / trevor.ns.cloudflare.com NS와 ashley SOA가 반복 반환됩니다. 168.126.63.2도 TCP www A 4회 중 1회 NXDOMAIN이 확인됐습니다. 현재 .com parent와 registry RDAP의 정상 위임은 aida.ns.cloudflare.com / keanu.ns.cloudflare.com입니다. 새 권한 NS와 Google·Cloudflare·Quad9 DNS에서는 정상 주소와 HTTPS200이 확인됩니다. on-onf.com의 NS·위임 캐시를 먼저 점검·갱신하고, 루트 및 www.on-onf.com의 A/AAAA 부정 캐시(NODATA·NXDOMAIN)도 관련 resolver 노드 전체에서 갱신해 주십시오. 갱신 후 두 KT DNS의 UDP/TCP 반복 확인 결과를 부탁드립니다.

접수 창구: 일반전화는 **국번 없이 100**, 휴대폰은 **지역번호+100** 또는 **080-000-1618**. KT는 고장신고 상담을 24시간 제공한다고 안내한다. DNS 운영 담당으로 전달을 요청한다. [KT 공식 문의·연락처](https://corp.kt.com/html/etc/contact.html)

요청 대상은 확인된 KT resolver 운영자다. 연락·제출은 아직 수행하지 않았으며 회선 계약정보나 고객번호를 임의로 제공하지 않는다.

## 5. 현재 설정을 재삭제·재등록하지 않는 이유

Cloudflare의 Deleted zone은 보관 상태에서 삭제되지 않은 DNS 레코드에 계속 응답할 수 있다. 이전 NS 응답이 남는 사실만으로 계정 삭제 실패를 단정할 수 없다. 재등록 시에는 새 네임서버 쌍이 배정되므로 이전 ashley·trevor를 복원하는 조치로 보장되지 않는다. 현재 정상인 위임을 유지한다. [Zone status](https://developers.cloudflare.com/dns/zone-setups/reference/domain-status/#deleted), [Zone removal](https://developers.cloudflare.com/dns/zone-setups/removal/)

부정 응답은 DNS 캐시에 저장되며, 이전 NS를 계속 따르는 resolver는 부정 TTL 종료 후에도 실패 응답을 다시 얻을 수 있다. 몇 분 또는 특정 날짜까지의 복구를 보장하지 않는다. [RFC2308](https://www.rfc-editor.org/info/rfc2308/)

## 6. 증거 위치

Git 제외 `outputs/qa/2026-09-15/dns-recovery/`:

- `cloudflare-company-before.json`: 실제 회사 계정·zone·Custom Domain·인증서·배포 상태.
- `production-http-now.json`: 공개 7개 경로·23개 자산·TLS·이동·문의 GET.
- `dns-recovery-independent-2026-09-15T08-11-41-921Z.json`: DNS 10곳·권한 NS·parent·RDAP·HTTPS 비교.
- `dns-recovery-repeat-2026-09-15T08-12-46-167Z.json`: UDP 8회 반복.
- `dns-recovery-tcp-20260915-1713.json`, `dns-recovery-rawtcp-2026-09-15T08-13-53-869Z.json`: Windows TCP와 별도 raw TCP 검증.
- `dns-recovery-rawtcp-2026-09-15T08-17-35-236Z.json`: 공개 DNS 갱신 요청 후 TCP 4회 재검증.
- `windows-dns-before.json`, `repair-pc-dns.ps1`: PC 설정 백업·적용/복원 스크립트.
- `windows-dns-final.json`: 17:19:43 KST 관리자 실행 미시작·Applied=false·기존 DNS 유지 최종 확인.
- `cloudflare-public-cache-purge.json`: 최초 공개 DNS 갱신 요청의 HTTP503 기록.
- `cloudflare-public-cache-purge-curl.json`: 17:16:24~26 KST 루트 AAAA·www A·AAAA의 HTTP200 큐 접수. 루트 NS·A의 선행 HTTP200 응답은 이번 대화 도구 실행 기록에 있다.

이전 경과는 [DNS 재발 진단](DNS-RECURRENCE-2026-09-15.md)을 참고한다. 이 보고서 작성을 위한 commit·push·배포는 수행하지 않는다.
