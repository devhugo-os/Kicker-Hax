// Kicker Hax - Client-side Ball Model
import * as C from '../../shared/constants.js';
import { drawPowerKickBallEffect } from '../utils/powerKickFx.js';

export class ClientBall {
  constructor() {
    this.x = C.W / 2;
    this.y = C.H / 2;
    this.r = C.BALL_RADIUS;
    
    this.targetX = C.W / 2;
    this.targetY = C.H / 2;
    this.owner = null;
    this.lastTouch = null;
    this.vx = 0;
    this.vy = 0;
    this.lastStrikeType = null;
    this.strikeTimer = 0;
    this.extrapolateMotion = true;
    this.stateReceivedAt = performance.now();
    this.lastRenderAt = this.stateReceivedAt;
  }

  updateState(serverBall, receivedAt = performance.now(), extrapolateMotion = true) {
    this.vx = Number(serverBall.vx || 0);
    this.vy = Number(serverBall.vy || 0);
    this.targetX = serverBall.x;
    this.targetY = serverBall.y;
    this.owner = serverBall.owner;
    this.lastTouch = serverBall.lastTouch || null;
    this.lastStrikeType = serverBall.lastStrikeType || null;
    this.strikeTimer = Number(serverBall.strikeTimer || 0);
    this.extrapolateMotion = extrapolateMotion;
    this.stateReceivedAt = receivedAt;
  }

  // Render motion at display refresh rate without increasing network traffic.
  interpolate(lerpFactor = 0.35, now = performance.now()) {
    const frameMs = 1000 / 60;
    const elapsedFrames = Math.max(0.25, Math.min(2, (now - this.lastRenderAt) / frameMs || 1));
    const snapshotAgeFrames = Math.max(0, Math.min(6, (now - this.stateReceivedAt) / frameMs));
    const expectedX = this.targetX + (this.extrapolateMotion ? this.vx * snapshotAgeFrames : 0);
    const expectedY = this.targetY + (this.extrapolateMotion ? this.vy * snapshotAgeFrames : 0);
    const correction = 1 - Math.pow(1 - lerpFactor, elapsedFrames);
    this.x += (expectedX - this.x) * correction;
    this.y += (expectedY - this.y) * correction;
    this.lastRenderAt = now;
  }

  draw(ctx) {
    drawPowerKickBallEffect(ctx, this);
    // Draw ball shadow
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath();
    ctx.ellipse(this.x + 3, this.y + 6, this.r * 1.1, this.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Radial gradient for 3D look
    const g = ctx.createRadialGradient(this.x - 5, this.y - 5, 4, this.x, this.y, this.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#bfc8d6');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
