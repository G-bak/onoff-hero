export type SceneStatus = 'loading' | 'ready' | 'fallback' | 'error' | 'timeout';
export type SceneIssueKind = 'offline' | 'network' | 'server' | 'asset' | 'graphics' | 'timeout';
export type SceneIssue = { kind: SceneIssueKind; message: string };

export const sceneLoadingTiming = { minimumMs: 1000, delayMs: 10000, maximumMs: 300000 };

const messages: Record<SceneIssueKind, string> = {
  offline: '인터넷 연결이 끊겼습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.',
  network: '3D 콘텐츠를 불러오지 못했습니다. 인터넷 연결 상태를 확인한 뒤 다시 시도해 주세요.',
  server: '서버에서 3D 콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
  asset: '3D 콘텐츠를 표시하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
  graphics: '이 환경에서 3D 화면을 표시하지 못했습니다. 다시 시도하거나 기본 화면으로 이용해 주세요.',
  timeout: '대기 시간이 초과되었습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.',
};

export class SceneLoadError extends Error {
  readonly kind: SceneIssueKind;
  constructor(kind: SceneIssueKind) {
    super(messages[kind]);
    this.name = 'SceneLoadError';
    this.kind = kind;
  }
}

export function getSceneIssue(error: unknown, phase: 'assets' | 'graphics', online: boolean): SceneIssue {
  const kind = error instanceof SceneLoadError
    ? error.kind
    : phase === 'graphics' ? 'graphics' : 'network';
  const resolved = !online && (kind === 'network' || kind === 'server') ? 'offline' : kind;
  return { kind: resolved, message: messages[resolved] };
}

export function formatSceneWait(seconds: number) {
  const value = Math.max(0, Math.min(300, Math.floor(seconds)));
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

type LoadingClock = {
  now: () => number;
  schedule: (callback: () => void, delay: number) => number;
  cancel: (timer: number) => void;
};

const browserClock: LoadingClock = {
  now: () => performance.now(),
  schedule: (callback, delay) => window.setTimeout(callback, delay),
  cancel: timer => window.clearTimeout(timer),
};

export function startSceneLoadingClock(onElapsed: (seconds: number) => void, onTimeout: () => void, clock: LoadingClock = browserClock) {
  const startedAt = clock.now();
  let stopped = false;
  let timer: number;
  function tick() {
    if (stopped) return;
    const elapsed = Math.max(0, clock.now() - startedAt);
    onElapsed(Math.min(300, Math.floor(elapsed / 1000)));
    if (elapsed >= sceneLoadingTiming.maximumMs) {
      stopped = true;
      onTimeout();
      return;
    }
    timer = clock.schedule(tick, Math.min(1000, sceneLoadingTiming.maximumMs - elapsed));
  }
  timer = clock.schedule(tick, sceneLoadingTiming.delayMs);
  return () => { stopped = true; clock.cancel(timer); };
}
