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
