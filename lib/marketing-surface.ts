import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three';

// A broad cylindrical bow around a tilted in-plane axis, with a small diagonal lag.
// Original UVs are preserved; each update starts from the undeformed geometry.
export function getMarketingSurfacePoint(x: number, y: number, z: number, width: number, height: number, bend: number, twist: number, bendAxis = 0) {
  const u = x / (width / 2), v = y / (height / 2);
  if (Math.abs(bend) < 1e-6) return { x, y, z: z + u * v * twist };
  const cosine = Math.cos(bendAxis), sine = Math.sin(bendAxis),
    along = x * cosine + y * sine, across = -x * sine + y * cosine,
    span = width * Math.abs(cosine) + height * Math.abs(sine),
    radius = span / (2 * bend), angle = 2 * along / span * bend,
    curved = Math.sin(angle) * (radius + z);
  return {
    x: curved * cosine - across * sine,
    y: curved * sine + across * cosine,
    z: Math.cos(angle) * (radius + z) - radius + u * v * twist,
  };
}

export function createMarketingSurface(geometry: BufferGeometry, width: number, height: number) {
  const positions = geometry.getAttribute('position');
  if (!(positions instanceof BufferAttribute)) throw new Error('Campaign surface requires a non-interleaved position buffer');
  const source = Float32Array.from(positions.array);
  positions.setUsage(DynamicDrawUsage);
  let previousBend = NaN, previousTwist = NaN, previousAxis = NaN;
  return {
    geometry,
    update(bend: number, twist: number, bendAxis = 0) {
      if (bend === previousBend && twist === previousTwist && bendAxis === previousAxis) return;
      for (let i = 0; i < positions.count; i++) {
        const p = getMarketingSurfacePoint(source[i * 3], source[i * 3 + 1], source[i * 3 + 2], width, height, bend, twist, bendAxis);
        positions.setXYZ(i, p.x, p.y, p.z);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      previousBend = bend; previousTwist = twist; previousAxis = bendAxis;
    },
  };
}
