import { services } from './services';

export const inquiryServiceOptions = [
  ...services.map(({ slug, name, english }) => ({ value: slug, label: name, english })),
  { value: 'discuss', label: '상담 후 결정', english: 'LET’S TALK' },
];
export const inquiryBudgets = ['상담 후 결정', '300만 원 미만', '300만~1,000만 원', '1,000만~3,000만 원', '3,000만 원 이상'] as const;
export const inquirySchedules = ['일정 협의', '1개월 이내', '1~3개월 이내', '3개월 이후'] as const;
export type InquiryDraft = {
  services: string[]; description: string; budget: string; budgetBasis: string;
  schedule: string; reference: string; company: string; name: string; email: string; phone: string;
};
export type InquiryErrors = Partial<Record<keyof InquiryDraft, string>>;
export function validateInquiry(draft: InquiryDraft): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!draft.services.length || draft.services.some(value => !inquiryServiceOptions.some(option => option.value === value))) errors.services = '필요한 서비스 또는 상담 후 결정을 선택해 주세요.';
  if (draft.description.trim().length < 10) errors.description = '필요한 작업이나 고민을 10자 이상 적어 주세요.';
  else if (draft.description.length > 3000) errors.description = '내용은 3,000자 이내로 적어 주세요.';
  if (!draft.company.trim()) errors.company = '회사명 또는 브랜드명을 적어 주세요.';
  if (!draft.name.trim()) errors.name = '담당자 성함을 적어 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = '답변받을 이메일 주소를 확인해 주세요.';
  if (draft.phone.trim() && (!/^[+\d\s().-]+$/.test(draft.phone) || draft.phone.replace(/\D/g, '').length < 7)) errors.phone = '연락처를 확인해 주세요. 국가번호와 하이픈도 입력할 수 있어요.';
  return errors;
}
