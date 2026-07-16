import * as C from '../../shared/constants.js';
import { drawSkinImage } from '../utils/skinRenderer.js';
import { drawPowerKickBallEffect } from '../utils/powerKickFx.js';

function drawStadium(ctx, width, height) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);
  const border = Math.max(24, Math.min(C.BORDER, width * 0.05));
  const fieldX = border;
  const fieldY = border;
  const fieldW = width - border * 2;
  const fieldH = height - border * 2;

  ctx.fillStyle = '#172033';
  ctx.fillRect(fieldX - 18, 0, fieldW + 36, border);
  ctx.fillRect(fieldX - 18, height - border, fieldW + 36, border);
  ctx.fillRect(0, fieldY, border, fieldH);
  ctx.fillRect(width - border, fieldY, border, fieldH);
  const crowdColors = ['#38bdf8', '#f43f5e', '#facc15', '#a78bfa', '#2dd4bf', '#cbd5e1'];
  for (let index = 0; index < Math.max(24, Math.floor(width / 18)); index += 1) {
    const x = (index * 37 + 11) % width;
    const color = crowdColors[index % crowdColors.length];
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, 9 + (index % 3) * 7, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(width - x, height - 9 - (index % 3) * 7, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#2d8f3c';
  ctx.fillRect(fieldX, fieldY, fieldW, fieldH);
  const stripe = fieldW / 10;
  for (let index = 0; index < 10; index += 1) {
    ctx.fillStyle = index % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.055)';
    ctx.fillRect(fieldX + index * stripe, fieldY, stripe, fieldH);
  }

  const goalTop = (height - C.GOAL_W_INIT) / 2;
  const goalBottom = goalTop + C.GOAL_W_INIT;
  ctx.fillStyle = '#2d8f3c';
  ctx.fillRect(fieldX - C.GOAL_DEPTH, goalTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
  ctx.fillRect(width - fieldX, goalTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
  ctx.strokeStyle = 'rgba(255,255,255,.9)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= C.GOAL_DEPTH; x += 6) {
    ctx.beginPath(); ctx.moveTo(fieldX - x, goalTop); ctx.lineTo(fieldX - x, goalBottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - fieldX + x, goalTop); ctx.lineTo(width - fieldX + x, goalBottom); ctx.stroke();
  }
  for (let y = goalTop; y <= goalBottom; y += 10) {
    ctx.beginPath(); ctx.moveTo(fieldX - C.GOAL_DEPTH, y); ctx.lineTo(fieldX, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - fieldX, y); ctx.lineTo(width - fieldX + C.GOAL_DEPTH, y); ctx.stroke();
  }

  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = Math.max(2, width / 500);
  ctx.strokeRect(fieldX, fieldY, fieldW, fieldH);
  ctx.beginPath(); ctx.moveTo(width / 2, fieldY); ctx.lineTo(width / 2, height - fieldY); ctx.stroke();
  ctx.beginPath(); ctx.arc(width / 2, height / 2, Math.min(58, fieldH * .13), 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(width / 2, height / 2, 3, 0, Math.PI * 2); ctx.fillStyle = '#f8fafc'; ctx.fill();
  const boxW = Math.min(145, fieldW * .18);
  const boxH = Math.min(250, fieldH * .44);
  ctx.strokeRect(fieldX, (height - boxH) / 2, boxW, boxH);
  ctx.strokeRect(width - fieldX - boxW, (height - boxH) / 2, boxW, boxH);
}

function drawBall(ctx, ball) {
  drawPowerKickBallEffect(ctx, { ...ball, r: C.BALL_RADIUS });
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(ball.x + 3, ball.y + 6, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
  const gradient = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, C.BALL_RADIUS);
  gradient.addColorStop(0, '#fff'); gradient.addColorStop(1, '#bfc8d6');
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(ball.x, ball.y, C.BALL_RADIUS, 0, Math.PI * 2); ctx.fill();
}

function drawPlayer(ctx, state, player) {
  const radius = C.PLAYER_RADIUS;
  const color = state.team === C.Team.RED ? '#ef4444' : '#3b82f6';
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(state.x + 4, state.y + 8, radius * 1.1, radius * .6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(state.x, state.y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 2; ctx.stroke();
  const skinDrawn = drawSkinImage(ctx, player.skin, state.x, state.y, radius - 1);
  if (!skinDrawn && player.badge) {
    ctx.fillStyle = '#fff'; ctx.font = '700 14px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(player.badge, state.x, state.y);
  }
  if (state.hasBall) {
    ctx.fillStyle = '#fff'; ctx.beginPath();
    ctx.moveTo(state.x, state.y - radius - 10); ctx.lineTo(state.x - 6, state.y - radius - 2); ctx.lineTo(state.x + 6, state.y - radius - 2); ctx.fill();
  }
  ctx.font = '700 12px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(4,9,24,.9)'; ctx.strokeText(player.name || 'Jogador', state.x, state.y - radius - 14);
  ctx.fillStyle = C.TEAM_NAME_COLORS[state.team] || '#fff'; ctx.fillText(player.name || 'Jogador', state.x, state.y - radius - 14);
}

function drawHud(ctx, frame, width) {
  const score = `${frame.score?.red || 0} : ${frame.score?.blue || 0}`;
  const seconds = Math.max(0, Math.floor(Number(frame.matchTime || 0)));
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 20px Outfit, system-ui';
  const center = width / 2;
  ctx.fillStyle = 'rgba(4,9,24,.94)';
  ctx.beginPath(); ctx.roundRect(center - 82, 8, 74, 38, 19); ctx.fill();
  ctx.beginPath(); ctx.roundRect(center + 8, 8, 74, 38, 19); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(score, center - 45, 27); ctx.fillText(clock, center + 45, 27);
}

export function renderMatchRecordingFrame(canvas, recording, frame, options = {}) {
  if (!canvas || !recording || !frame) return;
  const [fieldWidth, fieldHeight] = recording.field || [1024, 640];
  if (canvas.width !== fieldWidth) canvas.width = fieldWidth;
  if (canvas.height !== fieldHeight) canvas.height = fieldHeight;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.save();
  if (options.shake) ctx.translate((Math.random() - .5) * 8, (Math.random() - .5) * 8);
  drawStadium(ctx, fieldWidth, fieldHeight);
  drawBall(ctx, frame.ball);
  frame.players.forEach(state => drawPlayer(ctx, state, recording.players?.[state.index] || {}));
  ctx.restore();
  drawHud(ctx, frame, fieldWidth);
  if (frame.status === 'countdown' && Number(frame.countdown || 0) > 0) {
    ctx.fillStyle = 'rgba(2,6,23,.72)'; ctx.fillRect(0, fieldHeight * .38, fieldWidth, fieldHeight * .24);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 34px Outfit, system-ui'; ctx.fillText(`Começa em ${Math.ceil(frame.countdown)}...`, fieldWidth / 2, fieldHeight / 2);
  }
}
