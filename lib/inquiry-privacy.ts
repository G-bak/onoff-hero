import { consultationEmail, consultationPhone } from './consultation';

// Public inquiry policy. Keep this version aligned with the server setting and
// require fresh consent when the policy changes. No credentials belong here.
export const inquiryPrivacyVersion = '2026-09-13';
export const inquiryPrivacyNotice = `개인정보 처리자: (주)온앤오프
이용 목적: 프로젝트 문의 확인, 상담·견적 안내, 중복 접수 방지 및 동의 내역 확인
필수 항목: 필요한 서비스, 문의 내용, 회사·브랜드명, 담당자 성함, 이메일, 접수 시각·요청 번호·동의 내역
자동 처리 항목: 과다 접수 방지를 위한 접속 IP 주소. 사이트에서는 원문을 저장하지 않고 해시로 바꿔 1분 동안 제한 판단에 사용하며 Slack으로 보내지 않습니다.
선택 항목: 연락처, 희망 예산·예산 기준·일정, 참고 링크. 선택 항목은 입력하지 않아도 문의할 수 있습니다.
보유 기간: 접수일로부터 최대 90일. 상담·견적 안내가 끝나 개인정보가 더 필요하지 않으면 기간 전이라도 지체 없이 삭제합니다. 계약이 체결되면 계약 이행에 필요한 정보는 별도 계약과 관련 법령에 따라 관리합니다.
파기 방법: 보유 기간이 끝나거나 삭제 요청이 확인되면 담당자가 문의 메시지와 업무용 사본을 삭제합니다.
처리위탁: Slack Technologies Limited는 문의 메시지 전달·보관을, Cloudflare, Inc.는 운영 웹사이트와 문의 요청의 서버 처리·전달을 담당합니다. 국외 처리에 관한 내용은 아래 별도 안내에서 확인할 수 있습니다.
권리 및 문의: 열람·정정·삭제·처리 정지·동의 철회를 요청할 수 있습니다. 온앤오프 프로젝트 문의 담당 / ${consultationEmail} / ${consultationPhone}
동의를 거부할 수 있으며, 거부하면 온라인 문의 접수가 제한됩니다. 이메일로 별도 문의하실 수 있습니다. 주민등록번호 등 민감하거나 불필요한 개인정보는 적지 마세요.`;

export const inquiryOverseasNotice = `이전 목적: 온라인 문의의 서버 처리와 담당자에게 메시지 전달·보관
Slack 이전 항목: 위 수집·이용 안내의 입력 항목 및 접수 시각·요청 번호·동의 내역. 접속 IP 주소는 Slack에 보내지 않습니다.
Cloudflare 처리 항목: 문의 입력 항목, 요청·동의 내역, 접속 IP 주소
이전 시점·방법: 문의 접수 버튼을 누를 때 암호화된 네트워크를 통해 전송
Slack 수탁자: Slack Technologies Limited(아일랜드 법인) / privacy@slack.com
Slack 보관 국가: 미국(무료 워크스페이스의 기본 메시지 저장 위치)
Slack 이용·보유 기간: 접수일로부터 최대 90일. 문의 목적이 달성되거나 삭제 요청이 확인되면 지체 없이 삭제
웹사이트 수탁자: Cloudflare, Inc.(미국 법인) / privacyquestions@cloudflare.com
Cloudflare 처리 위치: 미국 및 이용자 접속 지역에 따른 글로벌 데이터센터. 문의 요청을 처리해 Slack으로 전달하며, 사이트의 별도 문의 데이터베이스에는 저장하지 않습니다. 중복·과다 접수 방지용 임시 기록은 최대 10분 이내 만료됩니다.
국외 처리위탁에 동의하지 않을 수 있습니다. 이 경우 온라인 문의 접수는 제한되며, ${consultationEmail}로 별도 문의하실 수 있습니다. 동의 철회·삭제 요청도 같은 연락처로 보내주세요.`;

export type InquiryDeliveryStatus = {
  enabled: boolean;
  privacyVersion: string | null;
  privacyNotice: string | null;
  overseasNotice: string | null;
};
