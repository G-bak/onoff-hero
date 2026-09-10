type FrameClock = {
  now: () => number;
  request: (callback: (time: number) => void) => number;
  cancel: (frame: number) => void;
};

const browserClock: FrameClock = {
  now: () => performance.now(),
  request: callback => requestAnimationFrame(callback),
  cancel: frame => cancelAnimationFrame(frame),
};

// Exponential easing otherwise approaches its target forever and never idles.
export function settleSceneValue(current: number, target: number, factor: number) {
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < .0001 ? target : next;
}

export function createSceneFrameLoop(draw: (deltaSeconds: number) => boolean, {
  clock = browserClock,
  canRun = () => true,
}: { clock?: FrameClock; canRun?: () => boolean } = {}) {
  let frame: number | null = null;
  let lastTime: number | null = null;
  let disposed = false;

  function invalidate() {
    if (disposed || frame !== null || !canRun()) return;
    lastTime ??= clock.now();
    frame = clock.request(tick);
  }

  function tick(time: number) {
    frame = null;
    if (disposed || !canRun()) { lastTime = null; return; }
    const delta = Math.max(0, Math.min((time - (lastTime ?? time)) / 1000, .05));
    lastTime = time;
    if (draw(delta)) invalidate();
    else lastTime = null;
  }

  function suspend() {
    if (frame !== null) clock.cancel(frame);
    frame = null;
    lastTime = null;
  }

  return {
    invalidate,
    suspend,
    dispose() { disposed = true; suspend(); },
  };
}
