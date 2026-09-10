'use client';

import { Button } from '@/components/ui/button';
import type { SceneRuntimeStatus } from '@/lib/scene-recovery';

export default function SceneRecoveryNotice({ status, onRetry, onContinue }: {
  status: SceneRuntimeStatus;
  onRetry: () => void;
  onContinue: () => void;
}) {
  if (status === 'ready') return null;
  const fallback = status === 'fallback';
  return (
    <aside className="scene-recovery-notice" aria-label="3D 화면 상태" data-state={status}>
      <output className="scene-recovery-message" aria-live="polite">
        {fallback ? '기본 카드로 표시하고 있습니다' : status === 'retrying' ? '3D 화면을 다시 준비하고 있습니다' : '3D 화면을 복구하고 있습니다'}
      </output>
      <p className="scene-recovery-description">{fallback ? '3D 화면을 다시 시도하거나 다른 메뉴를 계속 이용하실 수 있습니다.' : '기본 카드를 보면서 다른 메뉴를 계속 이용하실 수 있습니다.'}</p>
      <div className="scene-recovery-actions">
        {fallback
          ? <Button className="scene-recovery-retry" onClick={onRetry}>3D 다시 시도</Button>
          : <Button className="scene-recovery-continue" variant="outline" onClick={onContinue}>기본 화면으로 보기</Button>}
      </div>
    </aside>
  );
}
