import assert from 'node:assert/strict';
import test from 'node:test';
import { createWebFilmPlayback } from '../lib/web-film-playback.ts';
const tick = () => new Promise(resolve => setTimeout(resolve, 15));
class Film extends EventTarget {
  paused = true; calls = 0; outcomes = [];
  play() { this.calls++; const result = this.outcomes.shift(); if (result) return result(); this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
}
await test('an interrupted initial play recovers once, without scroll or user input', async () => {
  const film = new Film(); film.outcomes.push(() => Promise.reject(new DOMException('', 'AbortError')));
  const controller = createWebFilmPlayback(film, () => assert.fail('should recover'));
  controller.setEnabled(true); await tick();
  assert.equal(film.calls, 2); assert.equal(film.paused, false); controller.dispose();
});
await test('autoplay denial waits for an actual click and never retries on ready events', async () => {
  const film = new Film(), notices = [];
  film.outcomes.push(() => Promise.reject(new DOMException('', 'NotAllowedError')));
  const controller = createWebFilmPlayback(film, value => notices.push(value));
  controller.setEnabled(true); await tick(); film.dispatchEvent(new Event('canplay'));
  assert.equal(film.calls, 1); assert.deepEqual(notices, [true]);
  controller.play(); assert.equal(film.calls, 2); assert.equal(film.paused, false);
  assert.deepEqual(notices, [true, false]); controller.dispose();
});
await test('offscreen, manual pause and disposal cancel pending recovery', async () => {
  for (const action of ['stop', 'dispose']) {
    const film = new Film(); film.outcomes.push(() => Promise.reject(new DOMException('', 'AbortError')));
    const controller = createWebFilmPlayback(film, () => assert.fail('inactive promise'));
    controller.setEnabled(true); await Promise.resolve(); controller[action]();
    film.dispatchEvent(new Event('canplay')); await tick(); assert.equal(film.calls, 1); assert.equal(film.paused, true);
    controller.dispose();
  }
});
await test('a stale rejected request cannot block a later visible playback', async () => {
  const film = new Film(); let rejectOld;
  film.outcomes.push(() => new Promise((_, reject) => { rejectOld = reject; }));
  const controller = createWebFilmPlayback(film, () => assert.fail('stale failure'));
  controller.setEnabled(true); controller.setEnabled(false); controller.setEnabled(true);
  rejectOld(new DOMException('', 'AbortError')); await tick();
  assert.equal(film.calls, 2); assert.equal(film.paused, false); controller.dispose();
});
await test('repeated interruptions terminate in a manual play action', async () => {
  const film = new Film(), notices = [];
  film.outcomes.push(...Array.from({length: 4}, () => () => Promise.reject(new DOMException('', 'AbortError'))));
  const controller = createWebFilmPlayback(film, value => notices.push(value));
  controller.setEnabled(true); await tick(); await tick();
  film.dispatchEvent(new Event('loadeddata')); assert.equal(film.calls, 2); assert.deepEqual(notices, [true]); controller.dispose();
});
