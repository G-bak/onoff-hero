const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Shorten only the turn, preserving any normal reading area of a tall page.
export function getSectionScrollLength(viewportHeight: number, sheetHeight: number, scrollRatio = 1) {
  const height = Math.max(0, sheetHeight);
  const viewport = Math.max(0, viewportHeight);
  const ratio = Number.isFinite(scrollRatio) ? clamp(scrollRatio, .25, 1) : 1;
  return Math.max(0, height - viewport) + Math.min(viewport, height) * ratio;
}

// The front poster leaves upward with a planar rotation. The back stays still.
// Native scroll remains reversible, including a tall first page's reading area.
export function getSectionEntry(scroll: number, viewportHeight: number, sheetHeight: number, width: number, reducedMotion = false, scrollRatio = 1) {
  const height = Math.max(0, sheetHeight);
  const overflow = Math.max(0, height - viewportHeight);
  const scrollLength = getSectionScrollLength(viewportHeight, height, reducedMotion ? 1 : scrollRatio);
  const distance = scrollLength - overflow;
  const progress = distance > 0 ? clamp((scroll - overflow) / distance, 0, 1) : 1;
  const motion = reducedMotion ? 0 : progress;
  const travel = motion * (1.35 - .35 * motion);
  // Limit the diagonal drop relative to height on ultrawide displays.
  const maxAngle = width > 0 ? Math.min(12, Math.atan2(height * .24, width) * 180 / Math.PI) : 0;
  const angle = motion > 0 ? -maxAngle * motion * (2 - motion) : 0;
  const x = motion > 0 ? -width * .04 * motion : 0;
  const y = motion > 0 ? -height * travel : 0;
  const radians = angle * Math.PI / 180;
  // Rotate around the upper-left corner: restore the right-leaning exit.
  // Test the indicator against the actual sheet, including its slanted side.
  const indicatorX = width * .965 - x;
  const indicatorY = viewportHeight / 2 + overflow - y;
  const localX = Math.cos(radians) * indicatorX + Math.sin(radians) * indicatorY;
  const localY = -Math.sin(radians) * indicatorX + Math.cos(radians) * indicatorY;
  const frontAtIndicator = localX >= 0 && localX <= width && localY >= 0 && localY <= height;
  // A tall sticky sheet has already scrolled upward by its overflow before
  // the turn starts. Its translated/rotated bottom can leave the viewport
  // hundreds of pixels before the nominal back-page anchor. Locking the back
  // until that anchor leaves a fully visible video inert and paused.
  const stickyOffset = -clamp(scroll, 0, overflow);
  // Rotation is non-positive, so the lower-left corner is the lowest point.
  const frontBottom = stickyOffset + y + height * Math.cos(radians);
  const covered = viewportHeight <= 0 || (reducedMotion
    ? scroll >= height
    : scroll >= scrollLength || (progress > 0 && frontBottom <= 0));
  return {
    progress, x, y, angle, covered, scrollLength,
    turning: progress > 0 && progress < 1 && !covered && !reducedMotion,
    currentSection: (reducedMotion ? covered : !frontAtIndicator || covered) ? 'why' as const : 'home' as const,
  };
}
