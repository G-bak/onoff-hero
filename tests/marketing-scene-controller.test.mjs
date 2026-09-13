import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { compileFunction } from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import * as frameLoop from '../lib/scene-frame-loop.ts';
import * as showcase from '../lib/card-showcase.ts';
import * as titleMotion from '../lib/marketing-title.ts';
import * as surfaceMotion from '../lib/marketing-surface.ts';

const settle = () => new Promise(resolve => setImmediate(resolve));

// Exercise the authored controller with real Three.js scene/geometry/texture
// objects and a real frame loop. Only browser GPU, image/font IO and 2D canvas
// boundaries are replaced. These checks do not claim browser rendering coverage.
function fixture(context, { failure, delayedAssets = false } = {}) {
  const resources = [], renderers = [], requests = [], frames = new Map(), timers = new Map(), intersections = [];
  let nextFrame = 0, nextTimer = 0, now = 0, fallbacks = 0, disconnects = 0;
  const track = (resource, kind) => {
    const record = { resource, kind, disposals: 0 };
    resource.addEventListener('dispose', () => record.disposals++);
    resources.push(record);
    return resource;
  };
  const canvas = () => Object.assign(new EventTarget(), { dataset: {}, width: 720, height: 1420, setAttribute() {}, remove() {} });
  const style = () => ({ setProperty() {}, removeProperty() {} });
  const cards = Array.from({ length: 3 }, () => ({ dataset: {}, querySelector: () => null, appendChild() {} }));
  const pages = { inert: false };
  const section = {
    dataset: new Proxy({}, { set(target, key, value) { if (key === 'renderer' && value === 'fallback') fallbacks++; target[key] = value; return true; } }),
    clientWidth: 1200, offsetHeight: 900, firstElementChild: { offsetHeight: 800 },
    closest: selector => selector === '.site-pages' ? pages : null,
    querySelectorAll: selector => selector === '.marketing-fallback-card' ? cards : [],
  };
  const host = { clientWidth: 1200, clientHeight: 650, children: [], appendChild(node) { this.children.push(node); node.remove = () => { this.children = this.children.filter(child => child !== node); }; } };
  const title = { dataset: {}, querySelectorAll: () => [], getBoundingClientRect: () => ({ bottom: 250 }), setAttribute(name, value) { if (name === 'data-motion-time') this.dataset.motionTime = value; } };
  const controls = { current: { active: true, paused: false, covered: false } }, refresh = { current: null };
  const doc = Object.assign(new EventTarget(), { hidden: false, fonts: { load: async () => [{}] }, getElementById: () => ({ getBoundingClientRect: () => ({ top: 0 }) }) });
  const win = Object.assign(new EventTarget(), {
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout: timer => timers.delete(timer),
    Image: class { decode() { return Promise.resolve(); } },
  });
  const globals = {
    document: doc, window: win, devicePixelRatio: 2, innerWidth: 1200, innerHeight: 800,
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    IntersectionObserver: class { constructor(callback) { intersections.push(callback); } observe() {} disconnect() { disconnects++; } },
    ResizeObserver: class { observe() {} disconnect() { disconnects++; } },
    MutationObserver: class { observe() {} disconnect() { disconnects++; } },
  };
  const originals = [];
  for (const [name, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    originals.push([name, previous]);
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  class Renderer {
    constructor() { this.domElement = canvas(); this.capabilities = { getMaxAnisotropy: () => 8 }; this.disposals = 0; this.renders = 0; renderers.push(this); }
    setClearColor() {}
    setPixelRatio() {}
    setSize() { if (failure === 'resize') throw new Error('GPU resize failed'); }
    render(scene, camera) { this.renders++; if (failure === 'render') throw new Error('GPU draw failed'); scene.updateMatrixWorld(); camera.updateMatrixWorld(); }
    dispose() { this.disposals++; }
  }
  class Loader {
    loadAsync() {
      const texture = track(new THREE.Texture({ width: 720, height: 900 }), 'asset');
      const request = { ...Promise.withResolvers(), texture };
      requests.push(request);
      if (!delayedAssets) request.resolve(texture);
      return request.promise;
    }
  }
  class CanvasTexture extends THREE.CanvasTexture { constructor(image) { super(image); track(this, 'canvas-texture'); } }
  class BoxGeometry extends THREE.BoxGeometry { constructor(...args) { super(...args); track(this, 'geometry'); } }
  class PlaneGeometry extends THREE.PlaneGeometry { constructor(...args) { super(...args); track(this, 'geometry'); } }
  class Material extends THREE.MeshStandardMaterial { constructor(...args) { super(...args); track(this, 'material'); } }
  const clock = { now: () => now, request(callback) { frames.set(++nextFrame, callback); return nextFrame; }, cancel: id => frames.delete(id) };
  const dependencies = {
    three: { ...THREE, WebGLRenderer: Renderer, TextureLoader: Loader, CanvasTexture, BoxGeometry, PlaneGeometry, MeshStandardMaterial: Material },
    '@/lib/scene-frame-loop': { ...frameLoop, createSceneFrameLoop: (draw, options) => frameLoop.createSceneFrameLoop(draw, { ...options, clock }) },
    '@/lib/card-showcase': showcase, '@/lib/marketing-title': titleMotion,
    '@/lib/marketing-surface': { createMarketingSurface(...args) {
      if (failure === 'surface-create') throw new Error('Surface initialization failed');
      const surface = surfaceMotion.createMarketingSurface(...args);
      return { ...surface, update(...values) { if (failure === 'surface-update') throw new Error('Surface buffer update failed'); surface.update(...values); } };
    } },
    '@/lib/marketing-textures': { drawCampaignCanvas() { if (failure === 'canvas') throw new Error('2D context unavailable'); return canvas(); } },
    '@/lib/marketing-content': { marketingCanvasText: '테스트' },
  };
  const source = fs.readFileSync(new URL('../lib/marketing-scene-controller.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  const require = specifier => {
    if (specifier.endsWith('?url')) return { default: '/fixture-artwork' };
    assert.ok(specifier in dependencies, `Unmocked dependency ${specifier}`);
    return dependencies[specifier];
  };
  compileFunction(compiled, ['require', 'exports'])(require, exports);
  const cleanup = exports.mountMarketingScene({ section, host, title, formats: { style: style() }, marketer: { style: {}, dataset: {} }, controls, refresh });
  let stopped = false;
  const stop = () => { if (!stopped) { stopped = true; cleanup(); } };
  context.after(() => {
    stop();
    for (const [name, previous] of originals) { if (previous) Object.defineProperty(globalThis, name, previous); else delete globalThis[name]; }
  });
  return {
    section, host, controls, refresh, frames, timers, resources, renderers, requests,
    get fallbacks() { return fallbacks; }, get disconnects() { return disconnects; },
    intersect() { intersections[0]([{ isIntersecting: true }]); },
    resolve(index) { requests[index].resolve(requests[index].texture); },
    reject(index) { requests[index].reject(new Error('Image unavailable')); },
    advance(count = 1) { for (let index = 0; index < count; index++) { now += 1000 / 60; const pending = Array.from(frames.values()); frames.clear(); pending.forEach(callback => callback(now)); } },
    expire() { for (const [id, callback] of timers) { timers.delete(id); callback(); } },
    stop,
  };
}

for (const failure of ['resize', 'surface-update', 'render']) {
  await test(`MARKETING ${failure} failure catches the RAF exception and releases GPU resources once`, async context => {
    const scene = fixture(context, { failure });
    scene.intersect(); await settle();
    assert.equal(scene.renderers.length, 1); assert.equal(scene.frames.size, 1);
    assert.doesNotThrow(() => scene.advance(2));
    assert.equal(scene.section.dataset.renderer, 'fallback'); assert.equal(scene.fallbacks, 1);
    assert.equal(scene.renderers[0].disposals, 1); assert.equal(scene.host.children.length, 0);
    assert.ok(scene.resources.length > 0); assert.ok(scene.resources.every(resource => resource.disposals === 1));
    const gpuCalls = scene.renderers[0].renders;
    scene.controls.current.paused = true; scene.refresh.current(); scene.advance(2);
    assert.equal(scene.frames.size, 0, 'MOTION OFF must also idle the HTML fallback');
    assert.equal(scene.renderers[0].renders, gpuCalls, 'No draw returns to the failed renderer');
    scene.stop(); assert.equal(scene.renderers[0].disposals, 1); assert.equal(scene.disconnects, 3);
  });
}

await test('MARKETING unmount cancels asset deadline and disposes resolved images before a stalled image finishes', async context => {
  const scene = fixture(context, { delayedAssets: true });
  scene.intersect(); scene.resolve(0); scene.resolve(1); await settle();
  scene.stop();
  assert.equal(scene.renderers[0].disposals, 1); assert.equal(scene.host.children.length, 0);
  assert.equal(scene.timers.size, 0, 'The asset deadline is removed even when an image never settles');
  assert.ok(scene.resources.slice(0, 2).every(resource => resource.disposals === 1), 'Already loaded image textures are not retained by a pending Promise.all');
  scene.resolve(2); await settle();
  assert.ok(scene.resources.every(resource => resource.disposals === 1));
  assert.equal(scene.frames.size, 0); assert.equal(scene.fallbacks, 0);
});

await test('MARKETING timeout releases completed images immediately and ignores images arriving afterwards', async context => {
  const scene = fixture(context, { delayedAssets: true });
  scene.intersect(); scene.resolve(0); scene.resolve(1); await settle();
  scene.expire();
  assert.equal(scene.section.dataset.renderer, 'fallback'); assert.equal(scene.fallbacks, 1);
  assert.ok(scene.resources.slice(0, 2).every(resource => resource.disposals === 1), 'The fallback releases successful loads even if the last image stalls indefinitely');
  scene.resolve(2); await settle(); scene.advance(2);
  assert.ok(scene.resources.every(resource => resource.disposals === 1));
  assert.equal(scene.renderers.length, 1); assert.equal(scene.renderers[0].disposals, 1);
});

for (const failure of ['canvas', 'surface-create']) {
  await test(`MARKETING ${failure} failure releases all loaded textures and partially constructed resources`, async context => {
    const scene = fixture(context, { failure });
    scene.intersect(); await settle();
    assert.equal(scene.section.dataset.renderer, 'fallback'); assert.equal(scene.fallbacks, 1);
    assert.equal(scene.renderers[0].disposals, 1); assert.equal(scene.host.children.length, 0);
    assert.ok(scene.resources.every(resource => resource.disposals === 1), 'A construction failure must not leave unregistered loaded textures or an unfinished panel alive');
  });
}

await test('MARKETING old image generation cannot attach to a restored renderer', async context => {
  const scene = fixture(context, { delayedAssets: true });
  scene.intersect(); scene.resolve(0); await settle();
  const previousCanvas = scene.renderers[0].domElement;
  previousCanvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  assert.equal(scene.renderers[0].disposals, 1);
  previousCanvas.dispatchEvent(new Event('webglcontextrestored'));
  assert.equal(scene.renderers.length, 2);
  scene.resolve(1); scene.resolve(2); await settle();
  assert.ok(scene.resources.slice(0, 3).every(resource => resource.disposals === 1));
  assert.equal(scene.section.dataset.renderer, 'loading', 'Old results must not mark the new scene ready');
  assert.equal(scene.timers.size, 1, 'An old generation must not cancel the restored scene deadline');
  scene.resolve(3); scene.resolve(4); scene.resolve(5); await settle();
  assert.doesNotThrow(() => scene.advance());
  assert.equal(scene.section.dataset.renderer, 'ready'); assert.equal(scene.renderers[1].disposals, 0);
  scene.stop(); assert.equal(scene.renderers[1].disposals, 1);
  assert.ok(scene.resources.every(resource => resource.disposals === 1));
  assert.equal(scene.timers.size, 0); assert.equal(scene.frames.size, 0);
});
