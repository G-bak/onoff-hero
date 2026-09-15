# Cloudflare DNS 이전 장애 조사 요청 — 미전송

이후 사용자 승인으로 요청 초안을 GitHub에 보관한다. GitHub 보관은 Cloudflare 지원 접수나 외부 메시지 전송이 아니다.

작성: 2026-09-15 17:28 KST. 공급자에 전달할 검토용 자료이며, 지원 사례 생성·게시·메시지 전송은 수행하지 않았다. 현재 사이트는 Free plan이며 기술 지원 사례 이용 범위는 [Cloudflare 공식 지원 안내](https://developers.cloudflare.com/support/contacting-cloudflare-support/)를 먼저 확인한다. 유료 업그레이드는 수행하지 않는다.

## 요청 제목

Deleted zone's former authoritative nameservers still return negative answers after account migration; current zone and parent delegation are healthy

## 요청 본문

Domain: on-onf.com, www.on-onf.com

Current production account: f446e31d575c7e7135b7486ada7c35c4
Current zone: 76e8a080d3391f997a0106e5f4d3c8e5
Current assigned nameservers: aida.ns.cloudflare.com, keanu.ns.cloudflare.com

Former account: 4c692f878ebb293ad79ef0d8c9c7cfcc
Deleted former zone: 0674bbf17783acacb5ee2220a00e260a
Former assigned nameservers: ashley.ns.cloudflare.com, trevor.ns.cloudflare.com

On 2026-09-15 at approximately 06:37 UTC, the former root/www Workers Custom Domains were removed, followed by deletion of the former zone. The current zone was activated at 06:57 UTC after registrar delegation was changed. The current production Worker is onoff-hero-preview; both current Custom Domains are enabled and certificates are active.

At 08:21–08:25 UTC:

- Both .com parent servers tested and the registry RDAP return only the current aida/keanu delegation. No parent DS is present, and current-zone DNSSEC is disabled.
- The current authoritative nameservers return normal A/AAAA answers for the root and www hostnames.
- The former authoritative nameservers still answer with the former NS/SOA, root A/AAAA NODATA, and www NXDOMAIN.
- System-default website requests fail before HTTP with ENOTFOUND. Raw UDP/TCP queries independently reproduce the negative responses via affected recursive resolver paths.
- With an explicitly selected healthy recursive resolver, the same hostnames retain normal SNI/certificate validation and return the production website. Seven public pages, referenced assets and root/www redirect chains pass. These controlled requests do not establish universal visitor recovery.
- Current-zone custom firewall rules and Worker routes are empty; Access is not enabled. Bot Fight Mode and crawler protection are disabled. The queried sampled firewall event window 06:50–08:25 UTC returned no events; this is not proof that all possible requests reached the edge.
- Flushing the public 1.1.1.1 DNS cache was accepted and current answers were verified, but that does not change other recursive resolver caches.

We understand that deleted zones can remain archived and authoritative for a retention period. Please investigate whether the former deleted zone is causing these authoritative negative answers, and whether an internal early retirement/purge of that former zone's DNS service is supported and appropriate while leaving the current active zone and delegation intact. We are asking for investigation, not assuming such an operation is available or guarantees immediate resolver recovery.

Please do not delete, re-create, pause or change the nameservers of the current active production zone. Please also advise the expected authoritative behavior and any supported remediation for recursive resolvers still using the former delegation.

## 첨부 가능한 근거

로컬 `outputs/qa/2026-09-15/dns-recovery/`에 원본을 보관한다. 전달 시 해당 도메인 진단 자료만 선택한다.

- `cloudflare-company-before.json`
- `dns-recovery-independent-2026-09-15T08-21-39-950Z.json`
- `dns-recovery-rawtcp-2026-09-15T08-21-47-861Z.json`
- `cloudflare-other-causes-1723.json`
- `cloudflare-routing-security-1725.json`
- `crawler-delivery-2026-09-15T08-24-44.927Z.json`

인증 토큰·secret·회사 다른 프로젝트 정보는 요청문에 포함하지 않는다.
