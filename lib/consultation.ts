// Keep the existing chat implementation available until the service is ready.
export const consultationChatEnabled = false;

export const consultationGreeting = '안녕하세요. ON&OFF입니다.\n현재 실시간 상담톡 서비스를 준비하고 있습니다.\n\n지금은 메시지를 입력하거나 전송할 수 없습니다. 문의는 아래 이메일로 보내주세요.';

export const consultationHours = '09:00–18:00';

export const consultationEmail = 'onoff3739@naver.com';
export const consultationPhone = '031-647-6396';

// Confirmed company information shared by HOME and the service footers.
export const companyInfo = {
  name: '(주)온앤오프',
  representative: '조은준',
  businessNumber: '879-88-03852',
  address: '경기도 평택시 모곡동 447-3 엠에스원타워 407호 (주)온앤오프',
  phone: consultationPhone,
  email: consultationEmail,
} as const;

export const consultationAvailabilityNotice = '상담톡은 서비스 오픈 후 이용하실 수 있습니다.';
