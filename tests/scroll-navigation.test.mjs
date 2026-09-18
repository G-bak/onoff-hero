import assert from 'node:assert/strict';
import test from 'node:test';
import { createScrollNavigation, getNavigationHash, getScrollTarget, sectionNavigationEvent } from '../lib/scroll-navigation.ts';
import { siteSections } from '../lib/site-sections.ts';

function harness(url = 'https://onoff.example/', useRouter = false) {
  let nextFrame = 0, loader = false, reduced = false, mutation;
  const frames = new Map(), targets = new Map(), replacements = [], signals = [], routes = [];
  const win = Object.assign(new EventTarget(), {
    location: new URL(url),
    history: { state: { routerKey: 'keep-me', scrollPosition: [0, 1400] }, replaceState(state, _, next) {
      replacements.push({ state, next }); this.state = state; win.location = new URL(next, win.location);
    } },
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    matchMedia() { return { matches: reduced }; },
  });
  const doc = Object.assign(new EventTarget(), {
    body: {}, getElementById: id => targets.get(id) ?? null,
    querySelector: () => loader ? {} : null,
  });
  class Observer {
    constructor(callback) { mutation = () => { if (this.active) callback(); }; }
    observe() { this.active = true; }
    disconnect() { this.active = false; }
  }
  function addTarget(id, tabindex) {
    const attributes = new Map(tabindex === undefined ? [] : [['tabindex', tabindex]]);
    const target = Object.assign(new EventTarget(), {
      id, attributes, scrolls: [], focuses: [],
      hasAttribute: name => attributes.has(name),
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      scrollIntoView(options) { this.scrolls.push(options); },
      focus(options) { this.focuses.push(options); },
    });
    targets.set(id, target);
    return target;
  }
  function click(href, options = {}) {
    const { target = '', ...eventOptions } = options;
    const link = { href, target, hasAttribute: name => name === 'download' && !!options.download,
      getAttribute: name => name === 'data-scroll-target' ? options.section ?? null : null,
      classList: { contains: name => name === options.className } };
    const event = Object.assign(new Event('click', { cancelable: true }), { button: 0, detail: 1, ...eventOptions });
    Object.defineProperty(event, 'target', { value: { closest: () => link } });
    if (options.prevented) event.preventDefault();
    doc.dispatchEvent(event);
    return event;
  }
  win.addEventListener(sectionNavigationEvent, event => signals.push(event.detail));
  const navigation = createScrollNavigation(win, doc, Observer, useRouter ? href => routes.push(href) : undefined);
  return { win, doc, Observer, navigation, targets, frames, replacements, signals, routes, addTarget, click,
    mutate() { mutation(); },
    flush() { const current = [...frames.values()]; frames.clear(); current.forEach(callback => callback()); },
    setLoader(value) { loader = value; mutation(); }, setReduced(value) { reduced = value; },
  };
}

await test('every side-menu destination scrolls without changing the URL or adding history', () => {
  const h = harness('https://onoff.example/?preview=1');
  for (const { id } of siteSections) {
    const target = h.addTarget(id, '-1');
    assert.equal(h.click('/', { section: id }).defaultPrevented, true);
    h.flush();
    assert.deepEqual(target.scrolls, [{ behavior: 'auto', block: 'start' }]);
    assert.equal(h.win.location.href, 'https://onoff.example/?preview=1');
  }
  assert.equal(h.replacements.length, 0);
  assert.deepEqual(h.signals, siteSections.map(section => section.id));
  h.navigation.dispose();
});

await test('incoming legacy and encoded fragments scroll then clear while preserving query and router state', () => {
  assert.equal(getScrollTarget('#film'), 'together');
  assert.equal(getScrollTarget('#%73ervices'), 'services');
  for (const invalid of ['', '#', '#%ZZ']) assert.equal(getScrollTarget(invalid), null);
  const h = harness('https://onoff.example/?preview=1#film');
  const state = h.win.history.state;
  const target = h.addTarget('together');
  h.flush();
  assert.deepEqual(target.scrolls, [{ behavior: 'instant', block: 'start' }]);
  assert.equal(h.win.location.href, 'https://onoff.example/?preview=1');
  assert.strictEqual(h.win.history.state, state);
  assert.equal(h.replacements.length, 1);
  h.navigation.dispose();
});

await test('direct HOME section entry waits for the loader and final anchor geometry', () => {
  const h = harness('https://onoff.example/#web');
  const target = h.addTarget('web');
  h.setLoader(true); h.flush();
  assert.equal(target.scrolls.length, 0);
  assert.equal(h.win.location.hash, '', 'The visible fragment is removed before loading finishes');
  assert.equal(getNavigationHash(h.win), '#web', 'The loader retains the intended section separately');
  h.setLoader(false); h.flush();
  assert.equal(target.scrolls.length, 1);
  assert.equal(h.win.location.hash, '');
  h.navigation.dispose();
});

await test('a new section choice during opening supersedes the incoming fragment and signals the opening', () => {
  const h = harness('https://onoff.example/#home');
  const home = h.addTarget('home'), services = h.addTarget('services');
  h.setLoader(true); h.flush();
  h.click('#services'); h.flush();
  assert.equal(h.win.location.hash, '');
  assert.deepEqual(h.signals, ['home', 'services']);
  assert.equal(services.scrolls.length, 0);
  h.setLoader(false); h.flush();
  assert.equal(home.scrolls.length, 0);
  assert.equal(services.scrolls.length, 1);
  h.navigation.dispose();
});

await test('all service logos, service-list links and inquiry returns route without ever adding a fragment', () => {
  for (const page of ['/services/planning', '/services/design', '/services/web', '/services/marketing', '/services/operations', '/inquiry?from=card']) {
    for (const section of ['home', 'services', 'card', 'together']) {
      const h = harness(`https://onoff.example${page}`, true);
      assert.equal(h.click('/', { section }).defaultPrevented, true);
      assert.deepEqual(h.routes, ['/']);
      h.flush(); // A router request may take multiple frames to resolve.
      assert.equal(h.win.location.hash, '');
      h.win.location = new URL('https://onoff.example/');
      h.navigation.syncLocation(); h.setLoader(true); h.flush();
      assert.equal(getNavigationHash(h.win), `#${section}`);
      h.setLoader(false); h.flush(); // Content can arrive after route state.
      const target = h.addTarget(section);
      h.mutate(); h.flush();
      assert.deepEqual(target.scrolls, [{ behavior: 'instant', block: 'start' }]);
      assert.equal(h.win.location.href, 'https://onoff.example/');
      assert.equal(h.replacements.length, 0);
      assert.equal(getNavigationHash(h.win), '');
      h.navigation.dispose();
    }
  }
});

await test('legacy fragment links also route to a clean destination', () => {
  const h = harness('https://onoff.example/services/design', true);
  h.click('/?preview=1#services');
  assert.deepEqual(h.routes, ['/?preview=1']);
  h.win.location = new URL('https://onoff.example/?preview=1');
  const target = h.addTarget('services');
  h.navigation.syncLocation(); h.flush();
  assert.equal(target.scrolls.length, 1);
  assert.equal(h.win.location.search, '?preview=1');
  h.navigation.dispose();
});

await test('effect reattachment retains a cleaned incoming section until it can scroll', () => {
  const h = harness('https://onoff.example/#services');
  h.setLoader(true); h.flush(); h.navigation.dispose();
  const restarted = createScrollNavigation(h.win, h.doc, h.Observer);
  const target = h.addTarget('services');
  h.setLoader(false); h.flush();
  assert.equal(target.scrolls.length, 1);
  assert.equal(h.win.location.hash, '');
  restarted.dispose();
});

await test('a canceled cross-page destination cannot override browser back/forward restoration', () => {
  const h = harness('https://onoff.example/services/design', true);
  h.click('/', { section: 'services' });
  h.win.location = new URL('https://onoff.example/');
  const target = h.addTarget('services');
  h.win.dispatchEvent(new Event('popstate')); h.flush();
  assert.equal(target.scrolls.length, 0);
  assert.equal(getNavigationHash(h.win), '');
  h.navigation.dispose();
});

await test('keyboard and skip links move focus without a second scroll; reduced motion stays instant', () => {
  const h = harness('https://onoff.example/services/design');
  const target = h.addTarget('service-main');
  h.setReduced(true); h.click('/services/design', { section: 'service-main', detail: 0 }); h.flush();
  assert.deepEqual(target.scrolls, [{ behavior: 'instant', block: 'start' }]);
  assert.deepEqual(target.focuses, [{ preventScroll: true }]);
  assert.equal(target.attributes.get('tabindex'), '-1');
  target.dispatchEvent(new Event('blur'));
  assert.equal(target.attributes.has('tabindex'), false);
  const existing = h.addTarget('pricing', '0');
  h.click('#pricing', { className: 'service-skip' }); h.flush();
  h.navigation.dispose();
  assert.equal(existing.attributes.get('tabindex'), '0');
});

await test('back and forward with clean URLs leave saved scroll restoration to the router', () => {
  const h = harness();
  const target = h.addTarget('services');
  h.click('#services'); h.flush();
  h.win.dispatchEvent(new Event('popstate')); h.flush();
  assert.equal(target.scrolls.length, 1);
  assert.equal(h.replacements.length, 0);
  h.click('#services');
  h.win.location = new URL('https://onoff.example/inquiry');
  h.flush();
  assert.equal(target.scrolls.length, 1, 'A pending click must not move a different page');
  h.navigation.dispose();
});

await test('modified clicks, downloads, other pages, external links and missing targets retain native behavior', () => {
  const h = harness(); h.addTarget('services');
  for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { target: '_blank' }, { download: true }]) {
    assert.equal(h.click('#services', options).defaultPrevented, false);
  }
  for (const href of ['https://other.example/#services', '/inquiry#services', '/?changed=1#services', '#missing', 'mailto:test@example.com']) {
    assert.equal(h.click(href).defaultPrevented, false);
  }
  h.click('#services', { prevented: true });
  assert.equal(h.frames.size, 0);
  h.navigation.dispose();
});

await test('disposal cancels pending scrolls and removes navigation and temporary focus listeners', () => {
  const h = harness(); const target = h.addTarget('services');
  h.click('#services', { detail: 0 }); h.flush();
  h.click('#services');
  h.navigation.dispose(); h.flush();
  assert.equal(target.attributes.has('tabindex'), false);
  assert.equal(target.scrolls.length, 1);
  assert.equal(h.click('#services').defaultPrevented, false);
  h.win.location.hash = '#services'; h.win.dispatchEvent(new Event('hashchange')); h.flush();
  assert.equal(h.win.location.hash, '#services');
});
