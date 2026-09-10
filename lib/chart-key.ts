export function getChartConfigKey(...candidates: unknown[]): string {
  // Recharts also accepts callback data keys. A function is not a config key;
  // use the next explicit name instead of stringifying its implementation.
  const key = candidates.find(candidate => typeof candidate === 'string' || typeof candidate === 'number');
  return key === undefined ? 'value' : String(key);
}
