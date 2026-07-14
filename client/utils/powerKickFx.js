export function isPowerKickActive(ball) {
  return ball?.lastStrikeType === 'power' && Number(ball?.strikeTimer || 0) > 0;
}

export function getPowerKickShakeOffset(ball, timestamp = Date.now()) {
  if (!isPowerKickActive(ball)) return { x: 0, y: 0 };
  const intensity = Math.min(6, 1.5 + Number(ball.strikeTimer || 0) * 0.11);
  const phase = Number(timestamp || 0) * 0.075;
  return {
    x: Math.sin(phase * 1.7) * intensity,
    y: Math.cos(phase * 2.3) * intensity * 0.7
  };
}

/** Draws a short luminous trail without allocating persistent particles. */
export function drawPowerKickBallEffect(ctx, ball) {
  if (!isPowerKickActive(ball)) return;
  const speed = Math.hypot(Number(ball.vx || 0), Number(ball.vy || 0)) || 1;
  const nx = Number(ball.vx || 0) / speed;
  const ny = Number(ball.vy || 0) / speed;
  const radius = Number(ball.r || 10);
  const progress = Math.min(1, Number(ball.strikeTimer || 0) / 40);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let index = 4; index >= 1; index--) {
    const distance = radius + index * 7;
    ctx.globalAlpha = progress * (0.08 + (5 - index) * 0.045);
    ctx.fillStyle = index % 2 ? '#38bdf8' : '#f8fafc';
    ctx.beginPath();
    ctx.arc(ball.x - nx * distance, ball.y - ny * distance, Math.max(2, radius * (1 - index * 0.14)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.32 + progress * 0.28;
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius + 5 + Math.sin(Date.now() * 0.025) * 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
