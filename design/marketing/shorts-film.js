// Generated athletic photograph + authored six-second kinetic-type edit.
// Original photo stays intact; this function defines the motion-graphics cut.
window.drawMarketingFilm = (ctx, photo, t) => {
  const w = 540,
    h = 960;
  const ease = (x) => {
    x = Math.max(0, Math.min(1, x));
    return 1 - (1 - x) ** 3;
  };
  ctx.fillStyle = '#143bde';
  ctx.fillRect(0, 0, w, h);
  const shot = t < 2 ? 0 : t < 4 ? 1 : 2,
    local = t - shot * 2;
  const zoom =
    shot === 0
      ? 1.22 - 0.12 * ease(local / 2)
      : shot === 1
        ? 1.08 + 0.05 * ease(local / 2)
        : 1.04 - 0.04 * ease(local / 2);
  ctx.save();
  ctx.translate(w / 2 + (shot === 1 ? -14 : 0), h / 2);
  ctx.scale(zoom, zoom);
  ctx.drawImage(photo, -w / 2, -h / 2, w, h);
  ctx.restore();
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, '#090a0f50');
  gradient.addColorStop(1, '#090a0f00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 13px Montserrat';
  ctx.fillText('ON&OFF / MOTION CAMPAIGN', 30, 39);
  const headline =
    shot === 0
      ? ['MAKE', 'YOUR MOVE.']
      : shot === 1
        ? ['YOUR', 'PACE.']
        : ['MOVE', 'YOUR WAY.'];
  const reveal = ease(local / 0.42);
  ctx.save();
  ctx.beginPath();
  ctx.rect(24, 65, 500, 225);
  ctx.clip();
  ctx.translate(0, (1 - reveal) * 125);
  ctx.fillStyle = shot === 1 ? '#d8ff3e' : '#ffffff';
  ctx.font = '700 103px Montserrat';
  ctx.fillText(headline[0], 25, 172);
  ctx.font = `700 ${shot === 1 ? 94 : 57}px Montserrat`;
  ctx.fillText(headline[1], 28, 246);
  ctx.restore();
  ctx.fillStyle = '#d8ff3e';
  ctx.fillRect(30, 875, 480 * ease(Math.min(1, t / 5.8)), 3);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 18px Montserrat';
  ctx.fillText('MOVE BEYOND.', 30, 922);
  ctx.font = '700 12px Montserrat';
  ctx.textAlign = 'right';
  ctx.fillText('ON&OFF', 510, 922);
  ctx.textAlign = 'left';
};
