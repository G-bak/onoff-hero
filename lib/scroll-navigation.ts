export const sectionNavigationEvent = 'onoff:section-navigation';
const destinations = new WeakMap<Window, { id: string; page: string }>();

// The loader needs the intended section even though it is absent from the URL.
export function getNavigationHash(win: Window) {
  const destination = destinations.get(win);
  return destination?.page === `${win.location.pathname}${win.location.search}`
    ? `#${destination.id}` : win.location.hash;
}

export function getScrollTarget(hash: string) {
  if (!hash.startsWith('#') || hash.length < 2) return null;
  try {
    const id = decodeURIComponent(hash.slice(1));
    return id === 'film' ? 'together' : id;
  } catch { return null; }
}

// Links expose clean URLs. Section destinations travel separately through the
// persistent controller, including router transitions between different pages.
export function createScrollNavigation(win: Window, doc: Document, Observer = MutationObserver, navigate?: (href: string) => void) {
  const resumed = destinations.get(win);
  let pending: { id: string | null; page: string; from?: string; behavior: ScrollBehavior; focus: boolean } | null = resumed
    ? { ...resumed, behavior: 'instant', focus: false } : null;
  let frame: number | null = null;
  let disposed = false;
  const observer = new Observer(schedule);
  const focused = new Map<HTMLElement, () => void>();
  const pageURL = () => `${win.location.pathname}${win.location.search}`;

  function clearHash() {
    if (win.location.hash) win.history.replaceState(win.history.state, '', pageURL());
  }

  function cancel() {
    pending = null;
    destinations.delete(win);
    observer.disconnect();
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
    if (pending.page !== pageURL()) {
      if (pending.from !== pageURL()) cancel();
      return;
    }
    const target = pending.id ? doc.getElementById(pending.id) : null;
    // Route completion and streamed content need not arrive in the same frame.
    if (doc.querySelector('.scene-loader') || (pending.id && !target)) {
      observer.observe(doc.body, { childList: true, subtree: true });
      return;
    }
    const destination = pending;
    cancel();
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
    if (win.location.hash) {
      const id = getScrollTarget(win.location.hash);
      pending = { id, page: pageURL(), behavior: 'instant', focus: false };
      if (id) destinations.set(win, { id, page: pageURL() });
      else destinations.delete(win);
      clearHash();
      if (id) win.dispatchEvent(new CustomEvent(sectionNavigationEvent, { detail: id }));
    } else if (pending?.page !== pageURL() && pending?.from !== pageURL()) cancel();
    schedule();
  }

  function restoreHistory() { cancel(); syncLocation(); }

  function click(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, win.location.href);
    if (destination.origin !== win.location.origin) return;
    const section = link.getAttribute('data-scroll-target');
    const id = section ? getScrollTarget(`#${section}`) : getScrollTarget(destination.hash);
    if (!id) return;
    const samePage = destination.pathname === win.location.pathname &&
      (destination.search === win.location.search || (!!section && !destination.search));
    if (samePage ? !doc.getElementById(id) : !navigate) return;
    event.preventDefault();
    const page = samePage ? pageURL() : `${destination.pathname}${destination.search}`;
    pending = { id, page, from: samePage ? undefined : pageURL(), behavior: !samePage || win.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'auto', focus: event.detail === 0 || link.classList.contains('service-skip') || link.classList.contains('inquiry-skip') };
    destinations.set(win, { id, page });
    clearHash();
    win.dispatchEvent(new CustomEvent(sectionNavigationEvent, { detail: id }));
    observer.observe(doc.body, { childList: true, subtree: true });
    if (!samePage) navigate?.(page);
    schedule();
  }

  doc.addEventListener('click', click, { capture: true });
  win.addEventListener('hashchange', syncLocation);
  win.addEventListener('popstate', restoreHistory);
  syncLocation();
  return {
    syncLocation,
    dispose() {
      // Preserve an unconsumed destination across React's effect reattachment.
      disposed = true; pending = null;
      if (frame !== null) win.cancelAnimationFrame(frame);
      observer.disconnect();
      doc.removeEventListener('click', click, { capture: true });
      win.removeEventListener('hashchange', syncLocation);
      win.removeEventListener('popstate', restoreHistory);
      for (const restore of focused.values()) restore();
    },
  };
}
