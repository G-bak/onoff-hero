type CarouselScrollApi = {
  canScrollPrev(): boolean;
  canScrollNext(): boolean;
  on(event: 'select' | 'reInit', listener: () => void): unknown;
  off(event: 'select' | 'reInit', listener: () => void): unknown;
};

export function getCarouselScrollState(api?: CarouselScrollApi) {
  // A primitive snapshot stays stable until the external scroll state changes.
  return (api?.canScrollPrev() ? 1 : 0) | (api?.canScrollNext() ? 2 : 0);
}

export function subscribeCarouselScroll(api: CarouselScrollApi | undefined, notify: () => void) {
  if (!api) return () => {};
  api.on('select', notify);
  api.on('reInit', notify);
  return () => {
    api.off('select', notify);
    api.off('reInit', notify);
  };
}
