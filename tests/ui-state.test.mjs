import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { useIsMobile } from '../hooks/use-mobile.ts';
import { getCarouselScrollState, subscribeCarouselScroll } from '../lib/carousel-state.ts';
import { getChartConfigKey } from '../lib/chart-key.ts';

await test('mobile hook renders on the server without accessing window', () => {
  function MobileProbe() {
    return createElement('span', null, String(useIsMobile()));
  }
  assert.equal(renderToString(createElement(MobileProbe)), '<span>false</span>');
});

await test('carousel snapshots cover initial, first, middle, last and loop states', () => {
  assert.equal(getCarouselScrollState(), 0);
  for (const [previous, next, expected] of [[false, false, 0], [false, true, 2], [true, true, 3], [true, false, 1]]) {
    const api = { canScrollPrev: () => previous, canScrollNext: () => next };
    assert.equal(getCarouselScrollState(api), expected);
    assert.equal(getCarouselScrollState(api), expected, 'Unchanged snapshots must remain stable.');
  }
});

await test('carousel reinitialization and selection notify, and both listeners are removed', () => {
  const listeners = new Map([['select', new Set()], ['reInit', new Set()]]);
  const api = {
    on: (event, listener) => listeners.get(event).add(listener),
    off: (event, listener) => listeners.get(event).delete(listener),
  };
  let notifications = 0;
  const emit = event => listeners.get(event).forEach(listener => listener());
  const unsubscribe = subscribeCarouselScroll(api, () => { notifications++; });
  emit('select');
  emit('reInit');
  assert.equal(notifications, 2);
  unsubscribe();
  emit('select');
  emit('reInit');
  assert.equal(notifications, 2);
  assert.equal(listeners.get('select').size, 0);
  assert.equal(listeners.get('reInit').size, 0);
  assert.doesNotThrow(subscribeCarouselScroll(undefined, () => {}));
});

await test('chart keys preserve explicit names, numeric zero and empty strings', () => {
  assert.equal(getChartConfigKey('custom', 'data', 'name'), 'custom');
  assert.equal(getChartConfigKey(undefined, null, 0), '0');
  assert.equal(getChartConfigKey('', 'fallback'), '');
});

await test('chart callback and object keys fall back to a usable name', () => {
  assert.equal(getChartConfigKey(undefined, row => row.value, 'revenue'), 'revenue');
  assert.equal(getChartConfigKey(null, {}, 'visitors'), 'visitors');
  assert.equal(getChartConfigKey(undefined, () => 3, {}), 'value');
});
