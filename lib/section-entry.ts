const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// The front poster leaves upward with a planar rotation. The back stays still.
// Native scroll remains reversible, including a tall first page's reading area.
export function getSectionEntry(scroll: number, viewportHeight: number, sheetHeight: number, width: number, reducedMotion = false) {
  const height = Math.max(0, sheetHeight);
  const overflow = Math.max(0, height - viewportHeight);
  const distance = Math.min(viewportHeight, height);
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
  const covered = scroll >= height || viewportHeight <= 0;
  return {
    progress, x, y, angle, covered,
    turning: progress > 0 && progress < 1 && !reducedMotion,
    currentSection: (reducedMotion ? covered : !frontAtIndicator || covered) ? 'why' as const : 'home' as const,
  };
}
