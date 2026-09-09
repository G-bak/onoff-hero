'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { newsRecruitmentPage } from '@/lib/navigation';

export default function NewsRecruitmentLink({ children }: { children: ReactNode }) {
  if (newsRecruitmentPage.ready) {
    return <a className="header-contact" href={newsRecruitmentPage.href}>{children}</a>;
  }

  return (
    <Dialog>
      <DialogTrigger className="header-contact header-news-trigger">{children}</DialogTrigger>
      <DialogContent className="news-dialog" showCloseButton={false}>
        <DialogClose render={<Button variant="ghost" size="icon" className="news-dialog-close" aria-label="안내 닫기"/>}>
          <X aria-hidden="true" strokeWidth={1.5}/>
        </DialogClose>
        <span className="news-dialog-kicker"><span className="status-dot" aria-hidden="true"/> NEWS & RECRUITMENT</span>
        <div className="news-dialog-copy">
          <DialogTitle className="news-dialog-title">새로운 소식을<br/>준비하고 있어요.</DialogTitle>
          <DialogDescription className="news-dialog-description">ON&OFF의 새 소식과 채용 정보를<br/>곧 이곳에서 만나보실 수 있어요.</DialogDescription>
        </div>
        <div className="news-dialog-footer">
          <span className="news-dialog-status">COMING SOON</span>
          <DialogClose render={<Button className="news-dialog-confirm"/>}>확인</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
