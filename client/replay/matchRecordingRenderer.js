import * as C from '../../shared/constants.js';
import { drawSkinImage } from '../utils/skinRenderer.js';
import { drawPowerKickBallEffect } from '../utils/powerKickFx.js';

const stadiumFrameCache = new Map();
const recordingFrameSurfaceCache = new Map();

function drawStadium(ctx, width, height) {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);
  // Recording coordinates use the authoritative physics constants. Scaling
  // the border independently made goals and balls appear outside the net.
  const border = C.BORDER;
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
  const stripe = fieldW / 14;
  for (let index = 0; index < 14; index += 1) {
    ctx.fillStyle = index % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.055)';
    ctx.fillRect(fieldX + index * stripe, fieldY, stripe, fieldH);
  }

  const goalTop = (height - C.GOAL_W_INIT) / 2;
  ctx.fillStyle = '#2d8f3c';
  ctx.fillRect(fieldX - C.POST_T - C.GOAL_DEPTH, goalTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
  ctx.fillRect(width - fieldX + C.POST_T, goalTop, C.GOAL_DEPTH, C.GOAL_W_INIT);

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

/**
 * Builds the immutable stadium once at the actual canvas resolution. Android
 * WebViews no longer repaint hundreds of crowd primitives on every frame,
 * while the cached bitmap preserves the exact same visual quality.
 */
function getStadiumFrame(fieldWidth, fieldHeight, outputWidth, outputHeight) {
  const key = `${fieldWidth}x${fieldHeight}:${outputWidth}x${outputHeight}`;
  const cached = stadiumFrameCache.get(key);
  if (cached) return cached;
  const surface = document.createElement('canvas');
  surface.width = outputWidth;
  surface.height = outputHeight;
  const context = surface.getContext('2d', { alpha: false, desynchronized: false });
  context.setTransform(outputWidth / fieldWidth, 0, 0, outputHeight / fieldHeight, 0, 0);
  drawStadium(context, fieldWidth, fieldHeight);
  stadiumFrameCache.set(key, surface);
  if (stadiumFrameCache.size > 2) {
    stadiumFrameCache.delete(stadiumFrameCache.keys().next().value);
  }
  return surface;
}

/** A complete frame is painted offscreen and presented in one canvas copy. */
function getRecordingFrameSurface(width, height) {
  const key = `${width}x${height}`;
  let surface = recordingFrameSurfaceCache.get(key);
  if (surface) return surface;
  surface = document.createElement('canvas');
  surface.width = width;
  surface.height = height;
  recordingFrameSurfaceCache.set(key, surface);
  if (recordingFrameSurfaceCache.size > 2) {
    recordingFrameSurfaceCache.delete(recordingFrameSurfaceCache.keys().next().value);
  }
  return surface;
}

function drawNetOverlay(ctx, width, height) {
  const goalTop = (height - C.GOAL_W_INIT) / 2;
  const goalBottom = goalTop + C.GOAL_W_INIT;
  const leftFront = C.BORDER - C.POST_T;
  const leftBack = leftFront - C.GOAL_DEPTH;
  const rightFront = width - C.BORDER + C.POST_T;
  const rightBack = rightFront + C.GOAL_DEPTH;
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(leftFront, goalTop, C.POST_T, C.GOAL_W_INIT);
  ctx.fillRect(width - C.BORDER, goalTop, C.POST_T, C.GOAL_W_INIT);
  ctx.strokeStyle = 'rgba(255,255,255,.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = leftBack; x <= leftFront; x += 10) { ctx.moveTo(x, goalTop); ctx.lineTo(x, goalBottom); }
  for (let y = goalTop; y <= goalBottom; y += 10) { ctx.moveTo(leftBack, y); ctx.lineTo(leftFront, y); }
  for (let x = rightFront; x <= rightBack; x += 10) { ctx.moveTo(x, goalTop); ctx.lineTo(x, goalBottom); }
  for (let y = goalTop; y <= goalBottom; y += 10) { ctx.moveTo(rightFront, y); ctx.lineTo(rightBack, y); }
  ctx.stroke();
  ctx.restore();
}

function drawBall(ctx, ball, lowEffects = false) {
  if (!lowEffects) {
    drawPowerKickBallEffect(ctx, { ...ball, r: C.BALL_RADIUS });
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.ellipse(ball.x + 3, ball.y + 6, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (lowEffects) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, C.BALL_RADIUS, 0, Math.PI * 2); ctx.fill();
    return;
  }
  const gradient = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 2, ball.x, ball.y, C.BALL_RADIUS);
  gradient.addColorStop(0, '#fff'); gradient.addColorStop(1, '#bfc8d6');
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(ball.x, ball.y, C.BALL_RADIUS, 0, Math.PI * 2); ctx.fill();
}

function drawPlayer(ctx, state, player, showActionEffects = true, lowEffects = false) {
  const radius = C.PLAYER_RADIUS;
  const color = state.team === C.Team.RED ? '#ef4444' : '#3b82f6';
  if (!lowEffects) {
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.ellipse(state.x + 4, state.y + 8, radius * 1.1, radius * .6, 0, 0, Math.PI * 2); ctx.fill();
  }
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
  if (Number(state.passRequestTimer || 0) > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(14,165,233,.92)';
    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(state.x - 34, state.y - radius - 58, 68, 24, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '900 11px Outfit, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PASSE!', state.x, state.y - radius - 46);
    ctx.restore();
  }
  if (showActionEffects && (state.tackling || state.dribbling || state.shootHalo > 0)) {
    ctx.strokeStyle = state.tackling ? '#f97316' : (state.dribbling ? '#a78bfa' : '#facc15');
    ctx.globalAlpha = .72;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(state.x, state.y, radius + 7, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const moveSpeed = Math.hypot(Number(state.vx || 0), Number(state.vy || 0));
  if (!state.hasBall && moveSpeed > 0.25) {
    const angle = Math.atan2(Number(state.vy || 0), Number(state.vx || 0));
    const distance = radius + 11;
    ctx.save();
    ctx.translate(
      state.x + Math.cos(angle) * distance,
      state.y + Math.sin(angle) * distance
    );
    ctx.rotate(angle);
    ctx.fillStyle = state.team === C.Team.RED ? '#fecaca' : '#bfdbfe';
    ctx.strokeStyle = 'rgba(2,6,23,.92)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -6);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
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

function wrapCenteredText(ctx, text, centerX, startY, maxWidth, lineHeight) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  lines.forEach((value, index) => ctx.fillText(value, centerX, startY + index * lineHeight));
  return lines.length;
}

function drawStatusNotice(ctx, width, height, title, subtitle = '') {
  const cardWidth = Math.min(width * 0.78, 680);
  const titleSize = Math.max(20, Math.min(32, width / 30));
  const subtitleSize = Math.max(13, Math.min(19, width / 48));
  ctx.save();
  ctx.font = `900 ${titleSize}px Outfit, system-ui`;
  const titleMaxWidth = cardWidth - 36;
  const estimatedTitleLines = Math.max(1, Math.ceil(ctx.measureText(title).width / titleMaxWidth));
  const cardHeight = Math.min(
    height * .38,
    Math.max(subtitle ? 108 : 76, 44 + estimatedTitleLines * (titleSize + 5) + (subtitle ? subtitleSize + 20 : 0))
  );
  const x = (width - cardWidth) / 2;
  const y = (height - cardHeight) / 2;
  ctx.fillStyle = 'rgba(2, 6, 23, .64)';
  ctx.strokeStyle = 'rgba(148, 163, 184, .28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, cardWidth, cardHeight, Math.min(18, cardHeight * .2));
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${titleSize}px Outfit, system-ui`;
  const lineHeight = titleSize + 5;
  const titleStartY = y + (subtitle ? 34 : (cardHeight - estimatedTitleLines * lineHeight) / 2 + lineHeight / 2);
  const titleLines = wrapCenteredText(ctx, title, width / 2, titleStartY, titleMaxWidth, lineHeight);
  if (subtitle) {
    ctx.fillStyle = '#60a5fa';
    ctx.font = `800 ${subtitleSize}px Outfit, system-ui`;
    wrapCenteredText(ctx, subtitle, width / 2, titleStartY + titleLines * lineHeight + 8, titleMaxWidth, subtitleSize + 4);
  }
  ctx.restore();
}

export function renderMatchRecordingFrame(canvas, recording, frame, options = {}) {
  if (!canvas || !recording || !frame) return;
  const [fieldWidth, fieldHeight] = recording.field || [1024, 640];
  const cssWidth = Math.max(1, Math.round(canvas.clientWidth || fieldWidth));
  const cssHeight = Math.max(1, Math.round(canvas.clientHeight || fieldHeight));
  const pixelRatio = Math.max(1, Math.min(2, Number(options.pixelRatio || 1)));
  const outputWidth = Math.max(1, Math.round(cssWidth * pixelRatio));
  const outputHeight = Math.max(1, Math.round(cssHeight * pixelRatio));
  if (canvas.width !== outputWidth) canvas.width = outputWidth;
  if (canvas.height !== outputHeight) canvas.height = outputHeight;

  // App/mobile recordings use the same uniform field mapping as the live
  // match. Desktop retains its existing full-card composition.
  const fitScale = options.preserveAspect
    ? Math.min(outputWidth / fieldWidth, outputHeight / fieldHeight)
    : 0;
  const contentWidth = options.preserveAspect
    ? Math.max(1, Math.round(fieldWidth * fitScale))
    : outputWidth;
  const contentHeight = options.preserveAspect
    ? Math.max(1, Math.round(fieldHeight * fitScale))
    : outputHeight;
  const frameSurface = getRecordingFrameSurface(contentWidth, contentHeight);
  const ctx = frameSurface.getContext('2d', { alpha: false, desynchronized: false });
  const scaleX = contentWidth / fieldWidth;
  const scaleY = contentHeight / fieldHeight;
  const shakeX = options.shake ? (Math.random() - .5) * 8 : 0;
  const shakeY = options.shake ? (Math.random() - .5) * 8 : 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, contentWidth, contentHeight);
  ctx.drawImage(
    getStadiumFrame(fieldWidth, fieldHeight, contentWidth, contentHeight),
    shakeX * scaleX,
    shakeY * scaleY
  );
  ctx.save();
  ctx.setTransform(scaleX, 0, 0, scaleY, shakeX * scaleX, shakeY * scaleY);
  const actionEffectsActive = frame.status === 'playing';
  const ball = actionEffectsActive
    ? frame.ball
    : { ...frame.ball, lastStrikeType: null, strikeTimer: 0 };
  drawBall(ctx, ball, !!options.lowEffects);
  frame.players.forEach(state => drawPlayer(
    ctx, state, recording.players?.[state.index] || {}, actionEffectsActive, !!options.lowEffects
  ));
  // Nets are drawn last, exactly like the live match, so a scored ball is
  // visibly inside the mesh instead of floating over it.
  drawNetOverlay(ctx, fieldWidth, fieldHeight);
  ctx.restore();
  ctx.save();
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  drawHud(ctx, frame, fieldWidth);
  if (frame.status === 'loading') {
    drawStatusNotice(ctx, fieldWidth, fieldHeight, 'Aguardando jogadores...', 'A partida inicia quando todos abrirem o campo');
  } else if (frame.status === 'countdown' && Number(frame.countdown || 0) > 0) {
    drawStatusNotice(ctx, fieldWidth, fieldHeight, `Começa em ${Math.ceil(frame.countdown)}...`);
  } else if (frame.status === 'freeze') {
    const goal = frame.goalInfo || { scorerName: 'Jogador', ownGoal: false };
    const title = goal.ownGoal ? `GOL CONTRA de ${goal.scorerName}` : `GOL DE ${goal.scorerName}!`;
    const subtitle = goal.assistName ? `Assistência de ${goal.assistName}` : 'Gol confirmado';
    drawStatusNotice(ctx, fieldWidth, fieldHeight, title, subtitle);
  } else if (frame.status === 'paused') {
    const remaining = Number(frame.disconnectPauseRemaining || 0);
    const title = frame.isDisconnectVoting ? 'Votação em andamento' : (frame.pauseMessage || 'Partida pausada');
    const votes = frame.isDisconnectVoting && Number(frame.continueVotesRequired || 0) > 0
      ? `Votos: ${frame.continueVotes || 0}/${frame.continueVotesRequired}`
      : '';
    const subtitle = [remaining > 0 ? `${remaining}s restantes` : '', votes].filter(Boolean).join(' · ');
    drawStatusNotice(ctx, fieldWidth, fieldHeight, title, subtitle);
  }
  if (options.ended) {
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    ctx.fillRect(0, fieldHeight * .36, fieldWidth, fieldHeight * .28);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 38px Outfit, system-ui';
    ctx.fillText('Fim da partida', fieldWidth / 2, fieldHeight * .46);
    ctx.fillStyle = '#60a5fa';
    ctx.font = '800 22px Outfit, system-ui';
    ctx.fillText(`Placar final: ${frame.score?.red || 0} : ${frame.score?.blue || 0}`, fieldWidth / 2, fieldHeight * .56);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 17px Outfit, system-ui';
    const winnerLabel = options.winnerTeam === C.Team.RED || options.winnerTeam === 'red'
      ? 'Time Vermelho'
      : options.winnerTeam === C.Team.BLUE || options.winnerTeam === 'blue' ? 'Time Azul' : 'Empate';
    ctx.fillText(
      options.endReason === 'wo' ? `${winnerLabel} venceu por W.O.` : `${winnerLabel}${winnerLabel === 'Empate' ? '' : ' venceu'}`,
      fieldWidth / 2,
      fieldHeight * .61
    );
  }
  ctx.restore();

  // Present the completed frame atomically. Painting individual primitives on
  // the visible Android canvas exposed partially composed GPU tiles as black
  // blinking dots on some WebViews.
  const visible = canvas.getContext('2d', { alpha: false, desynchronized: false });
  visible.setTransform(1, 0, 0, 1, 0, 0);
  visible.fillStyle = '#000';
  visible.fillRect(0, 0, outputWidth, outputHeight);
  visible.imageSmoothingEnabled = true;
  visible.imageSmoothingQuality = 'high';
  visible.drawImage(
    frameSurface,
    Math.floor((outputWidth - contentWidth) / 2),
    Math.floor((outputHeight - contentHeight) / 2)
  );
}
