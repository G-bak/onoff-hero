# 프로젝트 문의 개인정보 운영 기준

2026-09-13. 사용자는 사업자명 **온앤오프**, Slack **무료 요금제**를 확인하고 보관 기간 선정 및 실명 대신 담당 업무명 안내를 위임했다. 이전 확인용 초안을 이 운영 기준으로 갱신했다. 실제 공개 문구의 원본은 [inquiry-privacy.ts](../../lib/inquiry-privacy.ts)이며 안내 버전은 `2026-09-13`이다.

## 선택한 기준

- 연락 창구: 온앤오프 프로젝트 문의 담당 / jej4628@naver.com / 010-5838-6781. 사용자 확정 연락처를 실제 개인정보·고충 처리 창구로 안내한다. 책임자 실명 대신 담당 부서 명칭과 연락처를 공개할 수 있다. [개인정보 보호법 제30조](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1033215151).
- 목적: 프로젝트 문의 확인·상담·견적, 중복 접수 방지 및 동의 내역 확인. 필수·선택 입력과 접수 기록, 자동 처리 IP를 구분한다. IP 원문은 앱에 저장하지 않고 1분 주소 해시 제한에만 사용하며 Slack으로 보내지 않는다.
- 보관: 접수일부터 **최대 90일**. 문의 목적이 달성되거나 본인의 삭제 요청이 확인되면 더 일찍 지체 없이 삭제한다. 계약이 체결된 뒤 필요한 계약 기록은 별도 계약·법령에 따라 관리한다. 90일을 법정 의무나 모든 업체의 표준이라고 설명하지 않는다.
- 기간 선택 참고: [JUNI WORKS 프로젝트 문의 90일 사례](https://www.merci-news.com/privacy/), [BTS ENG 견적 문의 3개월 사례](https://www.btseng.com/sub5/5_3.php). 3개월과 90일은 날짜 계산이 같지 않으며 타사의 자동 삭제 기능을 우리 기능으로 주장하지 않는다.

## 무료 Slack에서의 삭제 운영

**기존 워크스페이스의 전체 보존 설정은 변경하지 않았다.** 무료 Slack도 워크스페이스 전체를 90일 자동 삭제로 설정할 수 있지만, 문의 채널 하나만의 보존 설정은 유료 기능이다. 다른 업무 기록까지 삭제될 수 있는 전체 설정을 문의 기능 때문에 바꾸지 않는다. [전체 보존 설정](https://slack.com/help/articles/203457187-Customize-data-retention-in-Slack), [채널별 설정의 요금제 제한](https://slack.com/help/articles/115005393586-Edit-message-retention-settings-for-specific-conversations).

운영 담당자는 매주 한 번 `프로젝트-문의` 채널에서 **80일 이상 지난 문의 메시지와 업무용 사본을 삭제**한다. 이렇게 90일 전에 정리하며, 종료된 문의·삭제 요청은 정기 점검일까지 기다리지 않는다. Slack에서 최근 90일만 보이는 것은 삭제가 아니므로 숨겨진 뒤 지우려는 방식으로 운영하지 않는다. [무료 요금제 사용 제한](https://slack.com/help/articles/115002422943-Usage-limits-for-free-workspaces).

웹훅은 메시지 전달만 수행한다. 자동 삭제 봇·정기 실행 작업·캘린더 알림은 만들지 않았다. 실제 보존 설정 변경이나 자동 삭제 구현이 완료됐다고 보고하지 않는다. 문의 확인에 필요한 담당자만 채널에 접근하도록 운영한다.

## 위탁과 국외 처리 안내

Slack 메시지는 한국 등 미국·캐나다 외 고객의 수탁자인 **Slack Technologies Limited(아일랜드 법인)**가 처리하며 연락처는 `privacy@slack.com`이다. 무료 워크스페이스의 기본 메시지 보관 위치는 **미국**이다. 이는 보관 위치 설명이며 모든 지원·하위 처리까지 미국에서만 수행한다는 뜻이 아니다. [Slack 개인정보 정책](https://slack.com/trust/privacy/privacy-policy), [회사 정보](https://slack.com/intl/en-ie/company-information), [데이터 레지던시](https://slack.com/help/articles/360035633934-Data-residency-for-Slack).

운영 웹사이트는 **Cloudflare, Inc.**가 요청을 처리해 Slack으로 전달한다. 본문을 별도 앱 DB에 저장하지 않더라도 이 처리 경로를 공개한다. Cloudflare는 미국 법인이며 글로벌 네트워크를 사용하므로 Slack의 미국 보관 위치를 Cloudflare의 유일한 처리국으로 설명하지 않는다. 문의 입력 외에도 서버에서 처리하는 접속 IP가 있으며 Slack 전달 항목과 구분한다. [Cloudflare 개인정보 정책](https://www.cloudflare.com/privacypolicy/), [글로벌 네트워크](https://www.cloudflare.com/network/).

수집·이용 안내와 국외 처리위탁 안내를 별도로 읽고 각각 체크하게 한다. 서버도 두 동의와 안내 버전을 검증한다. 안내에는 목적·항목·시점/방법·수탁자/연락처·보관 기간·거부 방법/효과·권리 요청 연락처를 포함한다. [수집·이용 제15조](https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1006183947), [파기 제21조](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?ancYnChk=&chrClsCd=010202&lsJoLnkSeq=1020398651), [위탁 제26조](https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1020399009), [국외 이전 제28조의8](https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1020398611).

이 문서는 구현·운영 기준과 조사 근거다. 사업 전반의 개인정보 처리방침이나 모든 법률 요건 충족을 보증하는 문서는 아니다. 수탁자·업무·기간이 바뀌면 공개 안내와 버전을 함께 갱신한다.
