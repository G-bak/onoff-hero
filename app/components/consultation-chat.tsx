'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, MessageCircleMore, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { consultationDelayNotice, consultationGreeting, consultationHours } from '@/lib/consultation';

type Message = { id: number; role: 'assistant' | 'user'; text: string };

export default function ConsultationChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'assistant', text: consultationGreeting }]);
  const [conversationDate, setConversationDate] = useState<Date | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  function changeOpen(nextOpen: boolean) {
    if (nextOpen && !conversationDate) setConversationDate(new Date());
    setOpen(nextOpen);
  }

  useEffect(() => {
    if (!open || messages.length === 1) return;
    const frame = requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' }));
    return () => cancelAnimationFrame(frame);
  }, [open, messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) return;
    setMessages(current => [
      ...current,
      { id: current.length, role: 'user', text: trimmed },
    ]);
    setDraft('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger className="chat-launcher">
        <span>실시간 상담톡</span>
        <span className="chat-launcher-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18L18 6M6 6H18V18" stroke="currentColor" strokeWidth="1.5"/></svg></span>
      </DialogTrigger>
      <DialogContent className="consultation-dialog" showCloseButton={false}>
        <div className="chat-header">
          <span className="chat-brand-icon"><MessageCircleMore aria-hidden="true" strokeWidth={1.6}/></span>
          <div className="chat-heading">
            <DialogTitle className="chat-title">ON&OFF 상담톡</DialogTitle>
            <DialogDescription className="chat-subtitle">운영시간 {consultationHours}</DialogDescription>
          </div>
          <DialogClose render={<Button variant="ghost" size="icon" className="chat-close" aria-label="상담톡 닫기"/>}><X aria-hidden="true" strokeWidth={1.5}/></DialogClose>
        </div>
        <ScrollArea className="chat-scroll">
          <div className="chat-transcript" role="log" aria-label="상담 대화" aria-live="polite" aria-relevant="additions">
            {conversationDate && <time className="chat-date" dateTime={conversationDate.toISOString()}>{new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(conversationDate)}</time>}
            {messages.map(message => (
              <div className={`chat-message chat-message-${message.role}`} key={message.id}>
                {message.role === 'assistant' && <span className="chat-author">ON&OFF {message.id === 0 && <span>자동 안내</span>}</span>}
                <p className="chat-bubble"><span className="sr-only">{message.role === 'user' ? '나: ' : '상담 도우미: '}</span>{message.text}</p>
              </div>
            ))}
            <div ref={endRef}/>
          </div>
        </ScrollArea>
        <div className="chat-composer-area">
          <form className="chat-composer" onSubmit={submit}>
            <Input className="chat-input" aria-label="상담 메시지" placeholder="메시지를 입력하세요" value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} autoComplete="off" onKeyDown={event => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault(); }}/>
            <Button type="submit" className="chat-send" size="icon" aria-label="메시지 보내기" disabled={!draft.trim()}><ArrowUp aria-hidden="true" strokeWidth={1.8}/></Button>
          </form>
          <p className="chat-service-note">{consultationDelayNotice}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
