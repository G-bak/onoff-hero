// Shared by the WebGL cards and the lightweight SVG loading orbit.
export const sceneOrbit = {
  radius: 2.62,
  tilt: { x: .22, y: -.04, z: -.17 },
  cameraDistance: 8.8,
  mobileCameraDistance: 9.2,
  angularSpeed: .11,
};

export function projectLoadingOrbit(angle: number, cameraDistance = sceneOrbit.cameraDistance) {
  const { radius, tilt } = sceneOrbit;
  const sx = Math.sin(tilt.x), cx = Math.cos(tilt.x);
  const sy = Math.sin(tilt.y), cy = Math.cos(tilt.y);
  const sz = Math.sin(tilt.z), cz = Math.cos(tilt.z);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  // Three.js Euler XYZ rotation, followed by perspective projection.
  const worldX = cy * cz * x + sy * z;
  const worldY = (cx * sz + sx * sy * cz) * x - sx * cy * z;
  const worldZ = (sx * sz - cx * sy * cz) * x + cx * cy * z;
  const scale = 54 * cameraDistance / (cameraDistance - worldZ);
  return { x: 180 + worldX * scale, y: 90 - worldY * scale };
}

export function getLoadingOrbitPoints(count: number, cameraDistance = sceneOrbit.cameraDistance) {
  // Equal angles bunch up at the narrow sides after perspective projection.
  // Space the dots by distance along the projected outline instead.
  const samples = Array.from({ length: 721 }, (_, index) => projectLoadingOrbit(index / 720 * Math.PI * 2, cameraDistance));
  const distances = [0];
  for (let index = 1; index < samples.length; index++) {
    distances.push(distances[index - 1] + Math.hypot(samples[index].x - samples[index - 1].x, samples[index].y - samples[index - 1].y));
  }
  const circumference = distances[distances.length - 1];
  let segment = 1;
  return Array.from({ length: count }, (_, index) => {
    const distance = circumference * index / count;
    while (segment < distances.length - 1 && distances[segment] < distance) segment++;
    const fraction = (distance - distances[segment - 1]) / (distances[segment] - distances[segment - 1]);
    const from = samples[segment - 1];
    const to = samples[segment];
    return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
  });
}
