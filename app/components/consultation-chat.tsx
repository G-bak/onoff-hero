'use client';

import { useState } from 'react';
import { ArrowUp, MessageCircleMore, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { consultationAvailabilityNotice, consultationEmail, consultationGreeting, consultationHours } from '@/lib/consultation';

export default function ConsultationChat() {
  const [open, setOpen] = useState(false);
  const [conversationDate, setConversationDate] = useState<Date | null>(null);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen && !conversationDate) setConversationDate(new Date());
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger className="chat-launcher">
        <span>실시간 상담톡</span>
        <span className="chat-launcher-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18L18 6M6 6H18V18" stroke="currentColor" strokeWidth="1.5"/></svg></span>
      </DialogTrigger>
      <DialogContent className="consultation-dialog top-auto left-auto translate-x-0 translate-y-0 origin-bottom-right" showCloseButton={false}>
        <div className="chat-header">
          <span className="chat-brand-icon"><MessageCircleMore aria-hidden="true" strokeWidth={1.6}/></span>
          <div className="chat-heading">
            <DialogTitle className="chat-title">ON&OFF 상담톡</DialogTitle>
            <DialogDescription className="chat-subtitle">서비스 준비 중</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" className="chat-close" aria-label="상담톡 닫기"/>}><X aria-hidden="true" strokeWidth={1.5}/></DialogClose>
        </div>
        <ScrollArea className="chat-scroll">
          <div className="chat-transcript" role="log" aria-label="상담 대화" aria-live="polite" aria-relevant="additions">
            {conversationDate && <time className="chat-date" dateTime={conversationDate.toISOString()}>{new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(conversationDate)}</time>}
            <div className="chat-message chat-message-assistant">
              <span className="chat-author">ON&OFF <span>자동 안내</span></span>
              <p className="chat-bubble">{consultationGreeting}<a className="chat-email" href={`mailto:${consultationEmail}`}>{consultationEmail}</a></p>
            </div>
          </div>
        </ScrollArea>
        <div className="chat-composer-area">
          <div className="chat-composer" aria-disabled="true">
            <Input className="chat-input" aria-label="상담 메시지 입력 — 서비스 준비 중" aria-describedby="chat-availability-note" placeholder="상담톡 준비 중" disabled autoComplete="off"/>
            <Button type="button" className="chat-send" size="icon" aria-label="메시지 보내기" disabled><ArrowUp aria-hidden="true" strokeWidth={1.8}/></Button>
          </div>
          <p className="chat-service-note" id="chat-availability-note">{consultationAvailabilityNotice}<span className="chat-planned-hours">운영 예정 시간 {consultationHours}</span></p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
