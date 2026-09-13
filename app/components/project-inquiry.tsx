'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import ConsultationChat from './consultation-chat';
import { consultationChatEnabled, consultationEmail } from '@/lib/consultation';
import { inquiryBudgets, inquirySchedules, inquiryServiceOptions, validateInquiry, type InquiryDraft, type InquiryErrors } from '@/lib/project-inquiry';
import { inquiryPrivacyVersion, inquiryPrivacyNotice, inquiryOverseasNotice, type InquiryDeliveryStatus } from '@/lib/inquiry-privacy';

const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function ProjectInquiry({ initialService, returnTo }: { initialService?: string; returnTo: string }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [draft, setDraft] = useState<InquiryDraft>({ services: initialService ? [initialService] : [], description: '', budget: inquiryBudgets[0], budgetBasis: '프로젝트 전체', schedule: inquirySchedules[0], reference: '', company: '', name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [review, setReview] = useState(false);
  const [delivery, setDelivery] = useState<InquiryDeliveryStatus>({ enabled: false, privacyVersion: null, privacyNotice: null, overseasNotice: null });
  const [consent, setConsent] = useState(false);
  const [overseasConsent, setOverseasConsent] = useState(false);
  const [submission, setSubmission] = useState<'idle' | 'sending' | 'sent' | 'unknown'>('idle');
  const [deliveryError, setDeliveryError] = useState('');
  const sending = useRef(false);
  const requestId = useRef<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const selectedNames = inquiryServiceOptions.filter(option => draft.services.includes(option.value)).map(option => option.label);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/inquiry', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const status = await response.json();
        if (!controller.signal.aborted && status && typeof status === 'object' && 'enabled' in status && status.enabled === true && 'privacyVersion' in status && status.privacyVersion === inquiryPrivacyVersion && 'privacyNotice' in status && status.privacyNotice === inquiryPrivacyNotice && 'overseasNotice' in status && status.overseasNotice === inquiryOverseasNotice) {
          setDelivery({ enabled: true, privacyVersion: status.privacyVersion, privacyNotice: status.privacyNotice, overseasNotice: status.overseasNotice });
        }
      }).catch(() => { /* Keep the email and preview available when status is unavailable. */ });
    return () => controller.abort();
  }, []);

  function update<K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
    requestId.current = null;
    setSubmission('idle'); setDeliveryError(''); setConsent(false); setOverseasConsent(false);
  }
  function selectService(value: string) {
    const next = draft.services.includes(value) ? draft.services.filter(item => item !== value) : value === 'discuss' ? ['discuss'] : [...draft.services.filter(item => item !== 'discuss'), value];
    update('services', next);
  }
  function showReview(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiry(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setReview(true);
  }
  async function submitInquiry() {
    if (!delivery.enabled || !consent || !overseasConsent || sending.current || submission === 'sent' || submission === 'unknown') return;
    sending.current = true;
    setSubmission('sending'); setDeliveryError('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ ...draft, consent: true, overseasConsent: true, privacyVersion: delivery.privacyVersion, requestId: requestId.current }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!result || typeof result !== 'object' || !('ok' in result)) throw new Error('Invalid delivery response');
      if (response.ok && result.ok === true) setSubmission('sent');
      else {
        const uncertain = 'code' in result && typeof result.code === 'string' && ['delivery_unknown', 'duplicate_pending'].includes(result.code);
        setSubmission(uncertain ? 'unknown' : 'idle');
        setDeliveryError('message' in result && typeof result.message === 'string' ? result.message : '문의를 전달하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch {
      setSubmission('unknown');
      setDeliveryError('접수 여부를 확인하지 못했습니다. 중복 문의를 피하려면 이메일로 확인해 주세요.');
    } finally { sending.current = false; }
  }
  const error = (key: keyof InquiryDraft) => errors[key] ? <p className="inquiry-error" id={`inquiry-${key}-error`}>{errors[key]}</p> : null;

  return <div className="inquiry-page">
    <a className="inquiry-skip" href="#inquiry-form">문의 작성으로 이동</a>
    <header className="inquiry-header"><Link href={`/#${returnTo}`} prefetch={false} className="inquiry-brand" aria-label="ON&OFF 홈페이지">ON&OFF<span>ALL-IN-ONE AGENCY</span></Link><Link href={`/#${returnTo}`} prefetch={false} className="inquiry-back"><ArrowLeft aria-hidden="true"/> 둘러보던 페이지로</Link></header>
    <div className="inquiry-columns">
      <aside className="inquiry-intro">
        <div className="inquiry-intro-inner">
          <p className="inquiry-eyebrow">NEW PROJECT / ON&OFF</p>
          <p className="inquiry-display" aria-hidden="true"><span>LET’S</span><span>START<span className="inquiry-lime">.</span></span></p>
          <h1>어떤 일이<br/><span>필요하신가요?</span></h1>
          <p className="inquiry-intro-copy">한 가지 작업부터 통합 운영까지.<br/> 지금 필요한 일부터 알려주세요.</p>
          <nav className="inquiry-index" aria-label="문의 작성 항목"><a href="#inquiry-services"><span>01</span> 필요한 서비스 <ArrowUpRight aria-hidden="true"/></a><a href="#inquiry-project"><span>02</span> 프로젝트 소개 <ArrowUpRight aria-hidden="true"/></a><a href="#inquiry-contact"><span>03</span> 담당자 정보 <ArrowUpRight aria-hidden="true"/></a></nav>
          <div className="inquiry-intro-contact"><span>EMAIL US</span><a href={`mailto:${consultationEmail}`}>{consultationEmail} <ArrowUpRight aria-hidden="true"/></a>{consultationChatEnabled && <div className="inquiry-chat-entry"><ConsultationChat/></div>}</div>
        </div>
      </aside>
      <main className="inquiry-main">
        <div className="inquiry-page-label"><span>PROJECT INQUIRY</span><span>LET’S WORK TOGETHER</span></div>
        <div className="inquiry-preview-notice"><span>{delivery.enabled ? '프로젝트 문의' : '미리보기'}</span><p>{delivery.enabled ? <>작성 내용을 확인한 뒤 문의를 접수해 주세요.<br/>담당자가 남겨주신 연락처로 답변드립니다.</> : <>작성 내용은 전송되지 않습니다.<br/>현재는 입력과 내용 확인만 가능합니다.</>}</p></div>
        <noscript><p className="inquiry-no-script">입력 화면을 사용하려면 JavaScript를 켜 주세요. 이메일 문의는 계속 이용할 수 있습니다.</p><style>{'.inquiry-form,.inquiry-index,.inquiry-chat-entry,.inquiry-skip,.inquiry-preview-notice{display:none}'}</style></noscript>
        <form id="inquiry-form" ref={form} className="inquiry-form" onSubmit={showReview} noValidate aria-busy={!hydrated}>
          <fieldset className="inquiry-ready-fields" disabled={!hydrated}>
          <fieldset id="inquiry-services" className="inquiry-block">
            <legend><span className="inquiry-step">01 / SERVICE</span><span className="inquiry-section-title">어떤 도움이 필요하세요?<i>필수</i></span></legend>
            <p className="inquiry-help" id="inquiry-service-help">여러 개를 선택해도 좋아요. 아직 정하지 못했다면 상담 후 결정하세요.</p>
            <div className="inquiry-service-options">
              {inquiryServiceOptions.map((option, index) => <Button key={option.value} type="button" variant="ghost" className="inquiry-service-choice" aria-pressed={draft.services.includes(option.value)} aria-invalid={index === 0 && !!errors.services} aria-describedby={index === 0 && errors.services ? 'inquiry-services-error' : undefined} onClick={() => selectService(option.value)}><span><small>{option.english}</small>{option.label}</span>{draft.services.includes(option.value) ? <Check aria-hidden="true"/> : <Plus aria-hidden="true"/>}</Button>)}
            </div>
            {error('services')}
          </fieldset>
          <fieldset id="inquiry-project" className="inquiry-block">
            <legend><span className="inquiry-step">02 / PROJECT</span><span className="inquiry-section-title">프로젝트를 소개해 주세요.</span></legend>
            <div className="inquiry-field"><label htmlFor="inquiry-description">필요한 작업과 현재 고민<i>필수</i></label><Textarea className="inquiry-input inquiry-description" id="inquiry-description" name="description" value={draft.description} onChange={e => update('description', e.target.value)} maxLength={3000} required aria-invalid={!!errors.description} aria-describedby={`inquiry-description-help${errors.description ? ' inquiry-description-error' : ''}`} placeholder={'어떤 사업을 하고 계신가요?\n누구에게 무엇을 알리고 싶은지, 필요한 작업을 편하게 적어 주세요.\n예: 신제품 출시를 앞두고 상세페이지와 인스타그램 광고가 필요해요.'}/><div className="inquiry-field-meta"><p id="inquiry-description-help">목표 · 주요 고객 · 작업 범위를 함께 적어주시면 좋아요.</p><span>{draft.description.length.toLocaleString()} / 3,000</span></div>{error('description')}</div>
            <div className="inquiry-field-grid">
              <div className="inquiry-field"><label htmlFor="inquiry-budget">생각하고 계신 예산<em>선택</em></label><select id="inquiry-budget" name="budget" className="inquiry-input" value={draft.budget} onChange={e => update('budget', e.target.value)}>{inquiryBudgets.map(value => <option key={value}>{value}</option>)}</select><fieldset className="inquiry-budget-basis" aria-label="예산 기준">{['프로젝트 전체', '월 운영 기준'].map(value => <Button key={value} variant="ghost" type="button" aria-pressed={draft.budgetBasis === value} onClick={() => update('budgetBasis', value)}>{value}</Button>)}</fieldset><p className="inquiry-field-note">희망 예산을 확인하는 항목이며 확정 견적이 아닙니다.</p></div>
              <div className="inquiry-field"><label htmlFor="inquiry-schedule">희망 완료 시점<em>선택</em></label><select id="inquiry-schedule" name="schedule" className="inquiry-input" value={draft.schedule} onChange={e => update('schedule', e.target.value)}>{inquirySchedules.map(value => <option key={value}>{value}</option>)}</select><p className="inquiry-field-note">꼭 맞춰야 할 날짜는 프로젝트 소개에 적어 주세요.</p></div>
            </div>
            <div className="inquiry-field"><label htmlFor="inquiry-reference">홈페이지·SNS·참고 링크<em>선택</em></label><Input id="inquiry-reference" className="inquiry-input" name="reference" value={draft.reference} onChange={e => update('reference', e.target.value)} maxLength={500} placeholder="현재 운영 중인 채널이나 원하는 스타일의 링크"/></div>
            <p className="inquiry-field-note">소개서·기획안·참고 이미지는 공유 링크로 남겨 주세요. 담당자가 열어볼 수 있도록 접근 권한을 확인해 주세요.</p>
          </fieldset>
          <fieldset id="inquiry-contact" className="inquiry-block">
            <legend><span className="inquiry-step">03 / CONTACT</span><span className="inquiry-section-title">연락받을 정보를 알려주세요.</span></legend>
            <div className="inquiry-field-grid">{([
              { key: 'company', label: '회사·브랜드명', placeholder: '창업 준비 중이라면 브랜드명 또는 준비 중', autoComplete: 'organization', type: 'text', required: true },
              { key: 'name', label: '담당자 성함', placeholder: '성함을 입력해 주세요', autoComplete: 'name', type: 'text', required: true },
              { key: 'email', label: '이메일', placeholder: 'name@company.com', autoComplete: 'email', type: 'email', required: true },
              { key: 'phone', label: '연락처', placeholder: '010-0000-0000', autoComplete: 'tel', type: 'tel', required: false },
            ] as const).map(field => <div className="inquiry-field" key={field.key}><label htmlFor={`inquiry-${field.key}`}>{field.label}{field.required ? <i>필수</i> : <em>선택</em>}</label><Input className="inquiry-input" id={`inquiry-${field.key}`} name={field.key} type={field.type} autoComplete={field.autoComplete} maxLength={field.key === 'email' ? 254 : 100} value={draft[field.key]} onChange={e => update(field.key, e.target.value)} required={field.required} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `inquiry-${field.key}-error` : undefined} placeholder={field.placeholder}/>{error(field.key)}</div>)}</div>
          </fieldset>
          <div className="inquiry-review-action"><div><span>YOUR NEXT, WITH ON&OFF.</span><p>작성하신 내용을 한 번 더 확인해 주세요.</p></div><Button type="submit" className="inquiry-review-button">작성 내용 확인 <ArrowUpRight aria-hidden="true"/></Button></div>
          <p className="inquiry-local-note">{delivery.enabled ? '이메일로도 문의하실 수 있어요. ' : '아직 문의가 접수되지 않습니다. 실제 문의는 이메일을 이용해 주세요. '}<a href={`mailto:${consultationEmail}`}>{consultationEmail}</a></p>
          </fieldset>
        </form>
        <details className="inquiry-consent-preview inquiry-public-privacy" id="inquiry-privacy"><summary>프로젝트 문의 개인정보 처리 안내</summary><p>{inquiryPrivacyNotice}</p><p>{inquiryOverseasNotice}</p></details>
        <footer className="inquiry-footer"><span>© 2026 ON&OFF</span><Link href="/#services" prefetch={false}>서비스 다시 보기 <ArrowUpRight aria-hidden="true"/></Link></footer>
      </main>
    </div>
    <Dialog open={review} onOpenChange={open => { if (!sending.current) setReview(open); }}>
      <DialogContent className="inquiry-review-dialog" showCloseButton={false}>
        <header className="inquiry-review-header"><span>PROJECT BRIEF{!delivery.enabled && ' / PREVIEW'}</span><DialogClose render={<Button variant="ghost" className="inquiry-review-close" aria-label="작성 내용 확인 닫기" disabled={submission === 'sending'}/>}><X aria-hidden="true"/></DialogClose></header>
        <DialogTitle className="inquiry-review-title">{submission === 'sent' ? <>문의가<br/>전달됐어요.</> : <>함께할 일을<br/>정리했어요.</>}</DialogTitle>
        <DialogDescription className="inquiry-review-description">{submission === 'sent' ? '담당자가 내용을 확인한 뒤 남겨주신 연락처로 답변드립니다.' : delivery.enabled ? '내용과 연락처를 확인하고 개인정보 안내에 동의한 뒤 접수해 주세요.' : '입력 내용 확인용 화면입니다. 문의가 전송되거나 접수되지 않았습니다.'}</DialogDescription>
        <dl className="inquiry-review-list"><div><dt>필요한 서비스</dt><dd>{selectedNames.join(' · ')}</dd></div><div><dt>프로젝트 소개</dt><dd className="inquiry-review-text">{draft.description}</dd></div><div><dt>예산 · 일정</dt><dd>{draft.budget} {draft.budget !== inquiryBudgets[0] ? `(${draft.budgetBasis})` : ''}<br/>{draft.schedule}</dd></div><div><dt>담당자</dt><dd>{draft.company} · {draft.name}<br/>{draft.email}{draft.phone && <><br/>{draft.phone}</>}</dd></div>{draft.reference && <div><dt>참고 링크</dt><dd>{draft.reference}</dd></div>}</dl>
        <details className="inquiry-consent-preview" open={delivery.enabled}><summary>개인정보 수집·이용 안내</summary><p>{delivery.privacyNotice ?? '실제 접수 기능이 열리면 수집 항목, 이용 목적, 보유 기간 등을 안내하고 동의를 받습니다. 현재 입력 내용은 서버로 전송·저장되지 않습니다.'}</p></details>
        {delivery.enabled && submission !== 'sent' && <label className="inquiry-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={submission === 'sending' || submission === 'unknown'}/><span>위 개인정보 수집·이용 안내를 확인했고 동의합니다. (필수)</span></label>}
        {delivery.enabled && <details className="inquiry-consent-preview" open><summary>개인정보 국외 처리위탁 안내</summary><p>{delivery.overseasNotice}</p></details>}
        {delivery.enabled && submission !== 'sent' && <label className="inquiry-consent"><input type="checkbox" checked={overseasConsent} onChange={e => setOverseasConsent(e.target.checked)} disabled={submission === 'sending' || submission === 'unknown'}/><span>위 개인정보 국외 처리위탁 안내를 확인했고 동의합니다. (필수)</span></label>}
        <p className="inquiry-delivery-status" role={deliveryError ? 'alert' : 'status'}>{deliveryError || (submission === 'sending' ? '문의 내용을 전달하고 있어요. 잠시만 기다려 주세요.' : submission === 'sent' ? '접수가 완료되었습니다.' : '')}{submission === 'unknown' && <> <a href={`mailto:${consultationEmail}`}>이메일로 확인하기</a></>}</p>
        <div className="inquiry-review-bottom"><DialogClose render={<Button variant="outline" disabled={submission === 'sending'}/>}>{submission === 'sent' || submission === 'unknown' ? '닫기' : '내용 수정'}</DialogClose><Button onClick={submitInquiry} disabled={!delivery.enabled || !consent || !overseasConsent || submission !== 'idle'}>{submission === 'sent' ? '접수 완료' : submission === 'sending' ? '전달 중' : submission === 'unknown' ? '접수 확인 필요' : delivery.enabled ? '문의 접수하기' : '문의 전송 준비 중'} <ArrowUpRight aria-hidden="true"/></Button></div>
      </DialogContent>
    </Dialog>
  </div>;
}
