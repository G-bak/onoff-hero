// One owner for play promises. A page becoming inert can interrupt startup;
// that stale promise must not stop a newer, visible playback request.
export function createWebFilmPlayback(video: HTMLVideoElement, onBlocked: (blocked: boolean) => void) {
  let enabled = false, disposed = false, pending = false, blocked = false;
  let generation = 0, abortRetries = 0;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;

  function clearRetry() { clearTimeout(retryTimer); retryTimer = undefined; }
  function start() {
    if (disposed || !enabled || blocked || pending || !video.paused) return;
    const request = ++generation;
    pending = true;
    video.play().then(() => {
      if (request === generation) pending = false;
    }, (error: unknown) => {
      if (disposed || !enabled || request !== generation) return;
      pending = false;
      const name = error && typeof error === 'object' && 'name' in error ? error.name : '';
      if (name === 'AbortError' && abortRetries++ === 0) {
        // A single recovery attempt, not a perpetual autoplay retry loop.
        retryTimer = setTimeout(start, 0);
      } else {
        blocked = true;
        onBlocked(true);
      }
    });
  }
  function stop() {
    enabled = false;
    generation++;
    pending = false;
    clearRetry();
    video.pause();
  }
  video.addEventListener('canplay', start);
  video.addEventListener('loadeddata', start);
  return {
    setEnabled(value: boolean) {
      if (!value) { stop(); return; }
      if (!enabled) abortRetries = 0;
      enabled = true;
      start();
    },
    // Called directly inside the click handler, retaining browser activation.
    play() {
      blocked = false;
      abortRetries = 0;
      enabled = true;
      onBlocked(false);
      start();
    },
    stop,
    dispose() {
      disposed = true;
      stop();
      video.removeEventListener('canplay', start);
      video.removeEventListener('loadeddata', start);
    },
  };
}
