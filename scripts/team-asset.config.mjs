// Change the source here when replacing the team's 3-column, 2-row atlas.
// Both WebGL and the CSS fallback import the generated file through Vite.
export const teamAsset = {
  source: 'public/images/team-realistic-figurines-v3-photoroom.png',
  output: 'app/assets/generated/team-atlas.webp',
  // 256 × 384 per figure matches the card's 386px portrait texture area.
  maxWidth: 768,
};
