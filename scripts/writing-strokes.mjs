// A functional web wireframe, traced from the chalk tip in the actual sprite
// frames. These are drawing instructions, not a replacement character image.
export function traceWriting(frames, guides, { width, height }) {
  const pointAt = frame => {
    const key = Math.min(10, Math.floor(frame / 12)), mix = Math.min(1, (frame - key * 12) / 12);
    const a = guides[key], b = guides[key + 1];
    const expected = [a[0] + (b[0] - a[0]) * mix, a[1] + (b[1] - a[1]) * mix];
    let point = expected, best = -Infinity;
    // White chalk is distinct from warm skin and the dark blank board. Follow
    // its observed position through the interpolated wrist movement.
    for (let y = Math.max(0, Math.round(expected[1]) - 2); y <= Math.min(height - 1, Math.round(expected[1]) + 2); y++) {
      for (let x = Math.max(0, Math.round(expected[0]) - 2); x <= Math.min(width - 1, Math.round(expected[0]) + 2); x++) {
        const i = (y * width + x) * 4, [r, g, b, alpha] = frames[frame].subarray(i, i + 4);
        const colorSpread = Math.max(r, g, b) - Math.min(r, g, b);
        if (alpha < 160 || Math.min(r, g, b) < 185 || colorSpread > 35) continue;
        const score = r + g + b - colorSpread * 4 - Math.hypot(x - expected[0], y - expected[1]) * 90;
        if (score > best) { best = score; point = [x, y]; }
      }
    }
    return point.map(value => Math.round(value * 10) / 10);
  };
  const paths = [[12, 60], [72, 84], [108, 120]].map(([start, end]) => {
    const points = Array.from({ length: end - start + 1 }, (_, index) => pointAt(start + index));
    const lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths.at(-1) + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    return {
      d: points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' '),
      length: lengths.at(-1),
      progress: frames.map((_, frame) => frame < start ? 0 : lengths[Math.min(frame - start, lengths.length - 1)]),
      start, end, points,
    };
  });
  return { width, height, paths };
}
