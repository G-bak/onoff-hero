export type SceneRecoveryStatus = 'ready' | 'recovering' | 'fallback';
export type SceneRuntimeStatus = SceneRecoveryStatus | 'retrying';
export const sceneRecoveryTiming = { maximumVisibleMs: 10000 };

type RecoveryClock = {
  now(): number;
  schedule(callback: () => void, delay: number): number;
  cancel(timer: number): void;
};

const browserClock: RecoveryClock = {
  now: () => performance.now(),
  schedule: (callback, delay) => window.setTimeout(callback, delay),
  cancel: timer => window.clearTimeout(timer),
};

export function createSceneRecovery({ onChange, onResume, visible = true, clock = browserClock }: {
  onChange: (status: SceneRecoveryStatus) => void;
  onResume: () => void;
  visible?: boolean;
  clock?: RecoveryClock;
}) {
  const lost = new Set<string>();
  let status: SceneRecoveryStatus = 'ready';
  let disposed = false;
  let timer: number | null = null;
  let startedAt: number | null = null;
  let remaining = sceneRecoveryTiming.maximumVisibleMs;

  function stopTimer() {
    if (timer !== null) clock.cancel(timer);
    timer = null;
    if (startedAt !== null) remaining = Math.max(0, remaining - (clock.now() - startedAt));
    startedAt = null;
  }

  function fail() {
    if (disposed || status === 'fallback') return;
    stopTimer();
    status = 'fallback';
    onChange(status);
  }

  function startTimer() {
    if (disposed || !visible || status !== 'recovering' || timer !== null) return;
    if (remaining <= 0) { fail(); return; }
    startedAt = clock.now();
    timer = clock.schedule(fail, remaining);
  }

  return {
    canRender: () => !disposed && status !== 'fallback' && lost.size === 0,
    lose(id: string) {
      if (disposed || status === 'fallback') return;
      lost.add(id);
      if (status === 'recovering') return;
      status = 'recovering';
      remaining = sceneRecoveryTiming.maximumVisibleMs;
      startTimer();
      onChange(status);
    },
    restore(id: string) {
      if (disposed || status !== 'recovering' || !lost.delete(id)) return;
      // The restored event alone is insufficient: both renderers must paint.
      if (lost.size === 0 && visible) onResume();
    },
    painted() {
      if (disposed || status !== 'recovering' || lost.size !== 0 || !visible) return;
      stopTimer();
      status = 'ready';
      onChange(status);
    },
    setVisible(nextVisible: boolean) {
      if (disposed || nextVisible === visible) return;
      visible = nextVisible;
      if (!visible) stopTimer();
      else {
        startTimer();
        if (status === 'recovering' && lost.size === 0) onResume();
      }
    },
    fail,
    dispose() { disposed = true; stopTimer(); lost.clear(); },
  };
}

export function observeSceneContext(target: EventTarget, id: string, recovery: ReturnType<typeof createSceneRecovery>) {
  const onLost = (event: Event) => { event.preventDefault(); recovery.lose(id); };
  const onRestored = () => recovery.restore(id);
  target.addEventListener('webglcontextlost', onLost);
  target.addEventListener('webglcontextrestored', onRestored);
  return () => {
    target.removeEventListener('webglcontextlost', onLost);
    target.removeEventListener('webglcontextrestored', onRestored);
  };
}
