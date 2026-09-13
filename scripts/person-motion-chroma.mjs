import sharp from 'sharp';

// Keep the rendered person intact; only remove the generated green screen and
// its edge spill. Shared by the two reviewed pose-sheet assembly pipelines.
export async function removeChroma(input) {
  const raw = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < raw.data.length; i += 4) {
    const [r, g, b] = raw.data.subarray(i, i + 3);
    const spill = Math.max(0, g - Math.max(r, b) - 5);
    const alpha = Math.max(0, 1 - spill / 190);
    if (alpha < .04) { raw.data.fill(0, i, i + 4); continue; }
    raw.data[i] = Math.min(255, Math.round(r / alpha));
    raw.data[i + 1] = Math.min(255, Math.max(0, Math.round((g - spill) / alpha)));
    raw.data[i + 2] = Math.min(255, Math.round(b / alpha));
    raw.data[i + 3] = Math.round(raw.data[i + 3] * alpha);
  }
  return raw;
}
