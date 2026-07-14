// Kicker Hax - Client-side Ball Model
import * as C from '../../shared/constants.js';

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
  }

  updateState(serverBall) {
    this.targetX = serverBall.x;
    this.targetY = serverBall.y;
    this.owner = serverBall.owner;
    this.lastTouch = serverBall.lastTouch || null;
    this.vx = Number(serverBall.vx || 0);
    this.vy = Number(serverBall.vy || 0);
  }

  // Smooth position interpolation
  interpolate(lerpFactor = 0.35) {
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;
  }

  draw(ctx) {
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
