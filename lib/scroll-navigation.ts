export const sectionNavigationEvent = 'onoff:section-navigation';

export function getScrollTarget(hash: string) {
  if (!hash.startsWith('#') || hash.length < 2) return null;
  try {
    const id = decodeURIComponent(hash.slice(1));
    return id === 'film' ? 'together' : id;
  } catch { return null; }
}

// Native anchors remain available without JS and when opening a new tab.
// Enhanced same-page clicks scroll without adding fragment history entries.
export function createScrollNavigation(win: Window, doc: Document, Observer = MutationObserver) {
  let pending: { id: string | null; page: string; behavior: ScrollBehavior; focus: boolean } | null = null;
  let frame: number | null = null;
  let disposed = false;
  const observer = new Observer(schedule);
  const focused = new Map<HTMLElement, () => void>();
  const pageURL = () => `${win.location.pathname}${win.location.search}`;

  function clearHash() {
    if (win.location.hash) win.history.replaceState(win.history.state, '', pageURL());
  }

  function focusTarget(target: HTMLElement) {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      const restore = () => {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', restore);
        focused.delete(target);
      };
      focused.set(target, restore);
      target.addEventListener('blur', restore, { once: true });
    }
    target.focus({ preventScroll: true });
  }

  function apply() {
    frame = null;
    if (!pending || disposed) return;
    if (pending.page !== pageURL()) { pending = null; observer.disconnect(); return; }
    // Keep incoming fragments until HOME's loader releases scrolling, so its
    // opening decision and recovery still recognize a direct section entry.
    if (doc.querySelector('.scene-loader')) {
      observer.observe(doc.body, { childList: true, subtree: true });
      return;
    }
    const destination = pending;
    pending = null;
    observer.disconnect();
    const target = destination.id ? doc.getElementById(destination.id) : null;
    if (target) {
      target.scrollIntoView({ behavior: destination.behavior, block: 'start' });
      if (destination.focus) focusTarget(target);
    }
    clearHash();
  }

  function schedule() {
    if (!disposed && pending && frame === null) frame = win.requestAnimationFrame(apply);
  }

  function syncLocation() {
    observer.disconnect();
    pending = win.location.hash
      ? { id: getScrollTarget(win.location.hash), page: pageURL(), behavior: 'instant', focus: false }
      : null;
    schedule();
  }

  function click(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, win.location.href);
    if (destination.origin !== win.location.origin || `${destination.pathname}${destination.search}` !== pageURL()) return;
    const id = getScrollTarget(destination.hash);
    if (!id || !doc.getElementById(id)) return;
    event.preventDefault();
    pending = { id, page: pageURL(), behavior: win.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'auto', focus: event.detail === 0 || link.classList.contains('service-skip') || link.classList.contains('inquiry-skip') };
    clearHash();
    win.dispatchEvent(new CustomEvent(sectionNavigationEvent, { detail: id }));
    schedule();
  }

  doc.addEventListener('click', click, { capture: true });
  win.addEventListener('hashchange', syncLocation);
  win.addEventListener('popstate', syncLocation);
  syncLocation();
  return {
    syncLocation,
    dispose() {
      disposed = true; pending = null;
      if (frame !== null) win.cancelAnimationFrame(frame);
      observer.disconnect();
      doc.removeEventListener('click', click, { capture: true });
      win.removeEventListener('hashchange', syncLocation);
      win.removeEventListener('popstate', syncLocation);
      for (const restore of focused.values()) restore();
    },
  };
}
