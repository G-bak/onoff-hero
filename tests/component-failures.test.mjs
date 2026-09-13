import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import ts from 'typescript';
import { compileFunction } from 'node:vm';
import * as jsxRuntime from 'react/jsx-runtime';
import * as frameLoop from '../lib/scene-frame-loop.ts';
import * as galaxy from '../lib/galaxy.ts';
import * as crew from '../lib/galaxy-crew.ts';
import { createWebFilmPlayback } from '../lib/web-film-playback.ts';
import * as opening from '../lib/home-opening.ts';
import * as siteSections from '../lib/site-sections.ts';

// Execute the authored component callbacks with controlled hooks and media/GPU
// boundaries. These are fault-injection checks, not browser or hydration tests.
function componentHarness(file, dependencies, dynamicDependencies = {}) {
  const slots = [], pending = [];
  let cursor = 0;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useCallback(callback, deps) {
      const index = cursor++, previous = slots[index];
      if (!previous || !deps.every((dep, i) => Object.is(dep, previous.deps[i]))) slots[index] = { callback, deps };
      return slots[index].callback;
    },
    useEffect(effect, deps) {
      const index = cursor++, previous = slots[index];
      if (previous && deps?.every((dep, i) => Object.is(dep, previous.deps[i]))) return;
      pending.push(() => { previous?.cleanup?.(); slots[index] = { deps, cleanup: effect() }; });
    },
  };
  const compiled = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    // Keep the real async import boundary controllable without replacing the
    // surrounding component callback or turning a module load synchronous.
    transformers: { before: [context => sourceFile => ts.visitNode(sourceFile, function visit(node) {
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        return ts.factory.updateCallExpression(node, ts.factory.createIdentifier('loadDynamicImport'), node.typeArguments, node.arguments);
      }
      return ts.visitEachChild(node, visit, context);
    })] },
  }).outputText;
  const exports = {};
  const require = specifier => {
    if (specifier === 'react') return hooks;
    if (specifier === 'react/jsx-runtime') return jsxRuntime;
    if (specifier.endsWith('?url')) return { __esModule: true, default: '/fixture-media' };
    assert.ok(specifier in dependencies, `Unmocked dependency ${specifier}`);
    return dependencies[specifier];
  };
  const loadDynamicImport = specifier => Object.hasOwn(dynamicDependencies, specifier)
    ? dynamicDependencies[specifier]() : Promise.resolve().then(() => require(specifier));
  compileFunction(compiled, ['require', 'exports', 'loadDynamicImport'])(require, exports, loadDynamicImport);
  return {
    render(props) { cursor = 0; return exports.default(props); },
    effects() { while (pending.length) pending.shift()(); },
    dispose() { for (const slot of slots) slot?.cleanup?.(); },
  };
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children), ...nodes(tree.props?.front)];
}

for (const entry of ['initial', 'resume']) {
  await test(`HOME ${entry} card startup failure retains the correct error UI and can retry`, () => {
    const components = ['card-ribbon', 'wordmark', 'news-recruitment-link', 'site-controls', 'scene-loader', 'scene-recovery-notice', 'section-entry', 'why-section', 'card-showcase', 'design-editorial', 'web-section', 'services-section', 'brand-film'];
    const dependencies = Object.fromEntries(components.map(name => [`./components/${name}`, { __esModule: true, default: name }]));
    Object.assign(dependencies, { '@/lib/site-sections': siteSections, '@/lib/galaxy': galaxy, '@/components/ui/button': { Button: 'Button' }, '@/components/ui/switch': { Switch: 'Switch' } });
    const harness = componentHarness('../app/page.tsx', dependencies);
    const render = () => nodes(harness.render({}));
    try {
      let tree = render();
      tree.find(node => node.type === 'scene-loader').props.onOpeningHold(false);
      if (entry === 'resume') tree.find(node => node.type === 'scene-loader').props.onDismiss();
      tree = render();
      tree.find(node => node.type === 'card-ribbon').props.onError({ kind: 'graphics', message: 'GPU startup failed' });
      tree = render();
      assert.equal(tree.find(node => node.type === 'card-ribbon').props.enabled, false);
      assert.equal(tree.find(node => node.type === 'scene-loader').props.status, 'error');
      if (entry === 'initial') {
        assert.equal(tree.some(node => node.type === 'scene-recovery-notice'), false, 'Do not expose controls behind the initial loader');
        tree.find(node => node.type === 'scene-loader').props.onContinue();
        tree.find(node => node.type === 'scene-loader').props.onDismiss();
        tree = render();
      }
      const notice = tree.find(node => node.type === 'scene-recovery-notice');
      assert.equal(notice.props.status, 'fallback');
      notice.props.onRetry(); tree = render();
      const card = tree.find(node => node.type === 'card-ribbon');
      assert.equal(card.props.enabled, true); assert.equal(card.key, '1');
      card.props.onSettled(); tree = render();
      assert.equal(tree.find(node => node.type === 'scene-recovery-notice').props.status, 'ready');
    } finally { harness.dispose(); }
  });
}

await test('TOGETHER prompt waits for visible ready content, ends attention and restores focus on dismissal', () => {
  const originals = ['window', 'document'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
  let now = 0, next = 0, focus = 0;
  const timers = new Map();
  Object.assign(globalThis, { document: {}, window: {
    setTimeout: (callback, delay) => { timers.set(++next, { callback, at: now + delay }); return next; },
    clearTimeout: id => timers.delete(id),
  } });
  const activity = { visible: false, motion: false };
  const harness = componentHarness('../app/components/site-controls.tsx', {
    './page-link': { __esModule: true, default: 'PageLink' }, 'lucide-react': { ArrowUpRight: 'Arrow', X: 'X' },
    '@/components/ui/button': { Button: 'Button' }, '@/lib/site-sections': siteSections,
    './use-scene-activity': { useSceneActivity: () => activity },
  });
  const advance = ms => { now += ms; for (const [id, task] of timers) if (task.at <= now) { timers.delete(id); task.callback(); } };
  const render = (section, ready) => { const tree = harness.render({ currentSection: section, filmReady: ready, paused: !activity.motion }); harness.effects(); return tree; };
  const hasNote = tree => nodes(tree).some(node => node.props?.className === 'inquiry-nudge');
  try {
    assert.equal(hasNote(render('home', false)), false); assert.equal(timers.size, 0);
    activity.visible = true; activity.motion = true;
    render('film', false); assert.equal(timers.size, 0, 'Unready film never starts the prompt timer');
    render('film', true); advance(2100); assert.equal(hasNote(render('film', true)), false);
    activity.visible = false; render('film', true); advance(3000); assert.equal(timers.size, 0);
    assert.equal(hasNote(render('film', true)), false, 'Hidden time does not complete the viewing interval');
    activity.visible = true; render('film', true); advance(2200);
    let tree = render('film', true); assert.equal(hasNote(tree), true); assert.equal(tree.props['data-attention'], true);
    assert.equal(nodes(tree).find(node => node.type === 'PageLink').props.href, '/inquiry?from=film');
    advance(4400); tree = render('film', true); assert.equal(tree.props['data-attention'], undefined); assert.equal(hasNote(tree), true);
    activity.visible = false; assert.equal(hasNote(render('services', true)), false);
    activity.visible = true; tree = render('film', true); assert.equal(tree.props['data-attention'], undefined);
    const close = nodes(tree).find(node => node.props?.['aria-label'] === '프로젝트 문의 안내 닫기');
    close.props.onClick({ currentTarget: { closest: () => ({ querySelector: () => ({ focus: () => focus++ }) }) } });
    assert.equal(hasNote(render('film', true)), false); assert.equal(focus, 1); advance(5000);
    assert.equal(hasNote(render('film', true)), false); assert.equal(timers.size, 0);
  } finally {
    harness.dispose();
    for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
});

for (const scenario of ['complete', 'skip', 'context-lost', 'reduced', 'font-failed']) {
  await test(`HOME opening ${scenario}: actual component releases presentation and GPU, while preserving page controls`, async () => {
    const names = ['document', 'window', 'location', 'matchMedia', 'ResizeObserver'];
    const originals = names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
    const styles = () => { const values = new Map(); return { values, setProperty: (name, value) => values.set(name, value), removeProperty: name => values.delete(name) }; };
    const layer = { dataset: {}, style: styles() }, wordmark = {};
    const home = { dataset: {}, style: styles(), querySelector: () => wordmark };
    const host = { parentElement: layer }, canvas = new EventTarget();
    const media = Object.assign(new EventTarget(), { matches: false });
    const doc = Object.assign(new EventTarget(), { hidden: false, getElementById: () => home, fonts: { load: () => scenario === 'font-failed' ? Promise.reject(new Error('font unavailable')) : Promise.resolve([{}]) } });
    const win = Object.assign(new EventTarget(), { setTimeout, clearTimeout });
    Object.assign(globalThis, { document: doc, window: win, location: { hash: '' }, matchMedia: () => media, ResizeObserver: class { observe() {} disconnect() {} } });
    let now = 0, next = 0, start = 0, reveal = 0, disposed = 0;
    const frames = new Map(), draws = [], results = [];
    const clock = { now: () => now, request: cb => { frames.set(++next, cb); return next; }, cancel: id => frames.delete(id) };
    function advance(seconds) {
      for (let i = 0; i < Math.ceil(seconds * 60); i++) { now += 1000 / 60; const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(cb => cb(now)); }
    }
    const harness = componentHarness('../app/components/hero-opening.tsx', {
      'lucide-react': { ArrowUpRight: 'ArrowUpRight' }, '@/components/ui/button': { Button: 'Button' },
      '@/lib/scene-frame-loop': { createSceneFrameLoop: (draw, options) => frameLoop.createSceneFrameLoop(draw, { ...options, clock }) },
      '@/lib/home-opening': opening,
      '@/lib/opening-scene': { createOpeningScene: () => ({ canvas, resize() {}, draw: time => draws.push(time), dispose: () => disposed++ }) },
    });
    const callbacks = { onStart: () => start++, onReveal: () => reveal++, onComplete: result => results.push(result) };
    const render = ready => {
      const tree = harness.render({ ready, ...callbacks });
      nodes(tree).find(node => node.props?.className === 'opening-canvas').props.ref.current = host;
      harness.effects(); return tree;
    };
    try {
      let tree = render(false);
      for (let i = 0; i < 12; i++) await Promise.resolve();
      if (scenario === 'font-failed') {
        assert.deepEqual(results, ['unavailable']); assert.equal(disposed, 0); assert.equal(start, 0);
      } else {
        assert.equal(start, 0); assert.equal(frames.size, 0, 'Preparing the actual card must precede playback');
        tree = render(true); advance(1);
        assert.equal(start, 1); assert.ok(draws.length > 1);
        doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
        const held = draws.length; advance(2); assert.equal(draws.length, held); assert.equal(frames.size, 0);
        doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange'));
        if (scenario === 'skip') nodes(tree).find(node => node.type === 'Button').props.onClick();
        else if (scenario === 'context-lost') canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
        else if (scenario === 'reduced') { media.matches = true; media.dispatchEvent(new Event('change')); }
        else {
          advance(opening.openingTiming.canvasEnd / opening.openingPlaybackRate - 1 + .1); assert.equal(disposed, 1, 'GPU is released after title docking, before the UI finishes');
          assert.deepEqual(results, [], 'The remaining UI reveal must still be playing');
          doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange')); advance(1);
          doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); advance(2);
          assert.equal(reveal, 1, 'UI timeline resumes even after the renderer is disposed');
        }
        assert.deepEqual(results, [scenario === 'complete' ? 'complete' : scenario === 'context-lost' ? 'unavailable' : 'skipped']);
        assert.equal(disposed, 1); assert.equal(frames.size, 0);
      }
      assert.equal(home.dataset.opening, undefined); assert.equal(home.style.values.size, 0);
      harness.dispose(); assert.equal(frames.size, 0); assert.ok(disposed <= 1);
    } finally {
      harness.dispose();
      for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
    }
  });
}

for (const failure of ['error', 'blocked']) {
  await test(`WEB ${failure} action respects MOTION OFF and recovers on a user action`, async () => {
    let plays = 0, loads = 0, rejectPlay = failure === 'blocked';
    const video = Object.assign(new EventTarget(), {
      paused: true,
      play() { plays++; if (rejectPlay) return Promise.reject({ name: 'NotAllowedError' }); this.paused = false; return Promise.resolve(); },
      pause() { this.paused = true; }, load() { loads++; },
    });
    const harness = componentHarness('../app/components/web-section.tsx', {
      'lucide-react': { Pause: 'Pause', Play: 'Play', Volume2: 'Volume2', VolumeX: 'VolumeX' },
      '@/components/ui/button': { Button: 'Button' },
      './person-motion': { __esModule: true, default: 'PersonMotion' },
      './use-scene-activity': { useSceneActivity: () => ({ visible: true, motion: true, reduced: false }) },
      '@/lib/web-film-playback': { createWebFilmPlayback },
    });
    const render = paused => {
      const tree = harness.render({ active: true, paused, covered: false });
      tree.props.ref.current = { dataset: {} };
      nodes(tree).find(node => node.type === 'video').props.ref.current = video;
      harness.effects();
      return tree;
    };
    try {
      const tree = render(failure === 'error');
      if (failure === 'error') nodes(tree).find(node => node.type === 'video').props.onError();
      await Promise.resolve();
      const stopped = render(true);
      const overlay = nodes(stopped).find(node => node.props?.['data-state'] === failure);
      assert.ok(overlay, 'Exercise the actual failure overlay');
      const action = nodes(overlay).find(node => node.type === 'Button');
      assert.equal(action.props.disabled, true);
      const before = plays;
      action.props.onClick(); // Also protects stale/direct callbacks beyond disabled UI.
      assert.equal(plays, before);
      assert.equal(loads, 0);
      assert.equal(video.paused, true);
      const resumed = render(false);
      rejectPlay = false;
      const enabledAction = nodes(nodes(resumed).find(node => node.props?.['data-state'] === failure)).find(node => node.type === 'Button');
      assert.equal(enabledAction.props.disabled, false);
      const beforeClick = plays;
      enabledAction.props.onClick();
      assert.equal(plays, beforeClick + 1, 'play remains synchronous inside the user gesture');
      assert.equal(loads, failure === 'error' ? 1 : 0);
      assert.equal(video.paused, false);
    } finally { harness.dispose(); }
  });
}

for (const failure of ['resize', 'draw']) {
  await test(`SYSTEM ${failure} failure shows fallback, disposes GPU resources and stops scheduling`, async context => {
    let drawFrame, disposed = 0, suspended = 0;
    const intersections = [];
    const style = { setProperty() {}, removeProperty() {} };
    const section = { dataset: {}, style, closest: () => ({ inert: false }), querySelectorAll: () => [], querySelector: () => null };
    const host = { clientWidth: 1200, clientHeight: 800, closest: () => section };
    const engine = {
      canvas: new EventTarget(),
      resize() { if (failure === 'resize') throw Error('GPU resize failure'); },
      draw() { throw Error('GPU render failure'); },
      dispose() { disposed++; },
    };
    const globals = {
      document: Object.assign(new EventTarget(), { hidden: false }), window: Object.assign(new EventTarget(), { setTimeout, clearTimeout }), devicePixelRatio: 1,
      matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
      IntersectionObserver: class { constructor(callback) { intersections.push(callback); } observe() {} disconnect() {} },
      ResizeObserver: class { observe() {} disconnect() {} }, MutationObserver: class { observe() {} disconnect() {} },
    };
    for (const [name, value] of Object.entries(globals)) {
      const previous = Object.getOwnPropertyDescriptor(globalThis, name);
      Object.defineProperty(globalThis, name, { configurable: true, value });
      context.after(() => { if (previous) Object.defineProperty(globalThis, name, previous); else delete globalThis[name]; });
    }
    const harness = componentHarness('../app/components/why-galaxy.tsx', {
      '@/lib/scene-frame-loop': { ...frameLoop, createSceneFrameLoop(callback) { drawFrame = callback; return { invalidate() {}, suspend() { suspended++; }, dispose() {} }; } },
      '@/lib/galaxy': galaxy, '@/lib/galaxy-crew': crew, '@/lib/galaxy-scene': { createGalaxyScene: () => engine },
    });
    try {
      const tree = harness.render({ active: true, revealed: true, paused: false, covered: false });
      tree.props.ref.current = host;
      harness.effects();
      intersections[0]([{ isIntersecting: true }]);
      await new Promise(resolve => setImmediate(resolve));
      assert.doesNotThrow(() => assert.equal(drawFrame(1 / 60), false));
      assert.equal(section.dataset.galaxy, 'fallback');
      assert.equal(section.dataset.running, 'false');
      assert.equal(disposed, 1);
      assert.equal(suspended, 1);
    } finally { harness.dispose(); }
    assert.equal(disposed, 1, 'unmount must not dispose the failed engine twice');
  });
}

const settleImports = () => new Promise(resolve => setImmediate(resolve));

function sceneImportFixture(context) {
  const timers = new Map(), intersections = [];
  let nextTimer = 0;
  const styles = () => ({ setProperty() {}, removeProperty() {} });
  const pages = { inert: false };
  const section = { dataset: {}, style: styles(), closest: () => pages, querySelectorAll: () => [], querySelector: () => null };
  const host = { clientWidth: 1200, clientHeight: 800, closest: () => section };
  const document = Object.assign(new EventTarget(), { hidden: false });
  const window = Object.assign(new EventTarget(), {
    setTimeout: callback => { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout: timer => timers.delete(timer),
  });
  const globals = {
    window, document, devicePixelRatio: 1, setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    IntersectionObserver: class { constructor(callback) { intersections.push(callback); } observe() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} }, MutationObserver: class { observe() {} disconnect() {} },
  };
  for (const [name, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    context.after(() => { if (previous) Object.defineProperty(globalThis, name, previous); else delete globalThis[name]; });
  }
  return { section, host, document, timers, intersections, expire() { for (const [id, callback] of timers) { timers.delete(id); callback(); } } };
}

function marketingImportHarness(fixture, loader) {
  const harness = componentHarness('../app/components/card-showcase.tsx', {
    './marketing-fallback': { __esModule: true, default: 'MarketingFallback' },
  }, { '@/lib/marketing-scene-controller': loader });
  return {
    render(props = {}) {
      const tree = harness.render({ active: true, paused: false, covered: false, ...props });
      tree.props.ref.current = fixture.section;
      nodes(tree).find(node => node.props?.className === 'card-showcase-canvas').props.ref.current = fixture.host;
      harness.effects();
    },
    dispose: () => harness.dispose(),
  };
}

function galaxyImportHarness(fixture, loader) {
  let allocations = 0, releases = 0;
  const sceneModule = { createGalaxyScene: () => {
    allocations++;
    return { canvas: new EventTarget(), resize() {}, draw: () => ({ phase: galaxy.getGalaxyPhase(galaxy.galaxyDuration, true), labels: [] }), dispose: () => releases++ };
  } };
  const harness = componentHarness('../app/components/why-galaxy.tsx', {
    '@/lib/scene-frame-loop': { ...frameLoop, createSceneFrameLoop: () => ({ invalidate() {}, suspend() {}, dispose() {} }) },
    '@/lib/galaxy': galaxy, '@/lib/galaxy-crew': crew,
  }, { '@/lib/galaxy-scene': loader });
  return {
    sceneModule, get allocations() { return allocations; }, get releases() { return releases; },
    render(props = {}) { const tree = harness.render({ active: true, revealed: true, paused: false, covered: false, ...props }); tree.props.ref.current = fixture.host; harness.effects(); },
    intersect() { fixture.intersections[0]([{ isIntersecting: true }]); },
    dispose: () => harness.dispose(),
  };
}

await test('MARKETING imports only after activation and mounts once with the latest controls', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  let imports = 0, mounts = 0, releases = 0, observed;
  const harness = marketingImportHarness(fixture, () => { imports++; return deferred.promise; });
  try {
    harness.render({ active: false }); await settleImports(); assert.equal(imports, 0);
    harness.render(); assert.equal(imports, 1); assert.equal(mounts, 0);
    harness.render({ paused: true, covered: true });
    deferred.resolve({ mountMarketingScene: ({ controls }) => { mounts++; observed = controls.current; return () => releases++; } });
    await settleImports();
    assert.equal(mounts, 1); assert.deepEqual(observed, { active: true, paused: true, covered: true });
    harness.render(); assert.equal(imports, 1); assert.equal(fixture.timers.size, 0);
  } finally { harness.dispose(); }
  assert.equal(releases, 1);
});

await test('MARKETING import rejection restores readable static fallback typography', async context => {
  const fixture = sceneImportFixture(context);
  const harness = marketingImportHarness(fixture, () => Promise.reject(new Error('chunk unavailable')));
  try {
    harness.render(); await settleImports();
    assert.equal(fixture.section.dataset.renderer, 'fallback');
    const state = fixture.section.dataset;
    assert.ok(state.enhanced !== 'true' || state.titleEntered === 'true' || state.still === 'true', 'The fallback must not match the CSS rule that compresses the title to 16% height');
    assert.equal(fixture.timers.size, 0);
  } finally { harness.dispose(); }
});

await test('MARKETING unmount clears the pending chunk deadline and ignores late resolution', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  let mounts = 0;
  const harness = marketingImportHarness(fixture, () => deferred.promise);
  harness.render();
  harness.dispose();
  const pendingAfterUnmount = fixture.timers.size;
  deferred.resolve({ mountMarketingScene: () => { mounts++; return () => {}; } });
  await settleImports();
  assert.equal(mounts, 0);
  assert.equal(pendingAfterUnmount, 0, 'Unmount cancels the deadline even if the module promise never settles');
});

await test('MARKETING timed-out module cannot replace the chosen fallback with a fresh loader', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  let mounts = 0;
  const harness = marketingImportHarness(fixture, () => deferred.promise);
  try {
    harness.render(); fixture.expire();
    assert.equal(fixture.section.dataset.renderer, 'fallback');
    deferred.resolve({ mountMarketingScene: () => { mounts++; return () => {}; } });
    await settleImports();
    assert.equal(mounts, 0, 'Once the chunk deadline fails, a late result cannot restart the loading UI');
  } finally { harness.dispose(); }
});

await test('SYSTEM covered during module load waits until visible before allocating GPU resources', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  const harness = galaxyImportHarness(fixture, () => deferred.promise);
  try {
    harness.render(); harness.intersect();
    assert.equal(harness.allocations, 0);
    harness.render({ covered: true }); deferred.resolve(harness.sceneModule); await settleImports();
    assert.equal(harness.allocations, 0);
    harness.render(); await settleImports(); assert.equal(harness.allocations, 1);
  } finally { harness.dispose(); }
  assert.equal(harness.releases, 1);
});

await test('SYSTEM rejected module reveals fallback without creating a renderer', async context => {
  const fixture = sceneImportFixture(context);
  const harness = galaxyImportHarness(fixture, () => Promise.reject(new Error('chunk unavailable')));
  try {
    harness.render(); harness.intersect(); await settleImports();
    assert.equal(fixture.section.dataset.galaxy, 'fallback'); assert.equal(fixture.section.dataset.running, 'false');
    assert.equal(harness.allocations, 0); assert.equal(fixture.timers.size, 0);
  } finally { harness.dispose(); }
});

await test('SYSTEM unmount cancels pending chunk deadline and ignores late resolution', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  const harness = galaxyImportHarness(fixture, () => deferred.promise);
  harness.render(); harness.intersect(); harness.dispose();
  const pendingAfterUnmount = fixture.timers.size;
  deferred.resolve(harness.sceneModule); await settleImports();
  assert.equal(harness.allocations, 0); assert.equal(pendingAfterUnmount, 0);
});

await test('SYSTEM module deadline reveals fallback and prevents late GPU initialization', async context => {
  const fixture = sceneImportFixture(context), deferred = Promise.withResolvers();
  const harness = galaxyImportHarness(fixture, () => deferred.promise);
  try {
    harness.render(); harness.intersect();
    assert.ok(fixture.timers.size > 0, 'A stalled chunk needs a finite fallback deadline');
    fixture.expire(); assert.equal(fixture.section.dataset.galaxy, 'fallback');
    deferred.resolve(harness.sceneModule); await settleImports();
    assert.equal(harness.allocations, 0);
  } finally { harness.dispose(); }
});
