// Kicker Hax - Client-side Player Model
import * as C from '../../shared/constants.js';
import { segmentGraphemes, isEmojiCluster } from '../utils/graphemes.js';
import { drawSkinImage } from '../utils/skinRenderer.js';
import { drawStaffTagOnCanvas } from '../utils/staffTags.js';

export class ClientPlayer {
  constructor(serverPlayer) {
    this.id = serverPlayer.id;
    this.name = serverPlayer.name || 'Jogador';
    this.badge = serverPlayer.badge || '';
    this.skin = serverPlayer.skin || '';
    this.team = serverPlayer.team; // 0 (Red) or 1 (Blue)
    
    this.x = serverPlayer.x;
    this.y = serverPlayer.y;
    this.r = C.PLAYER_RADIUS;
    this.dir = serverPlayer.dir || 0;
    
    this.targetX = serverPlayer.x;
    this.targetY = serverPlayer.y;
    this.targetDir = serverPlayer.dir || 0;
    this.vx = Number(serverPlayer.vx || 0);
    this.vy = Number(serverPlayer.vy || 0);
    this.staffRole = serverPlayer.staffRole || '';
    this.extrapolateMotion = true;
    this.stateReceivedAt = performance.now();
    this.lastRenderAt = this.stateReceivedAt;
    
    this.stamina = serverPlayer.stamina;
    this.staminaLock = serverPlayer.staminaLock;
    this.stun = serverPlayer.stun;
    this.shootHalo = serverPlayer.shootHalo;
    this.kickCharge = serverPlayer.kickCharge || 0;
    this.invuln = serverPlayer.invuln;
    this.tackle_cd = serverPlayer.tackle_cd || 0;
    this.dribble_cd = serverPlayer.dribble_cd || 0;
    this.power_cd = serverPlayer.power_cd || 0;
    this.matchStats = serverPlayer.matchStats || null;
    this.renderTrail = true;
    
    // Aesthetic trails
    this.trail = [];
  }

  updateState(serverPlayer, receivedAt = performance.now(), extrapolateMotion = true) {
    if (Object.hasOwn(serverPlayer, 'name')) this.name = serverPlayer.name;
    if (Object.hasOwn(serverPlayer, 'badge')) this.badge = serverPlayer.badge;
    this.skin = serverPlayer.skin || this.skin || '';
    this.team = serverPlayer.team;
    
    this.vx = Number(serverPlayer.vx || 0);
    this.vy = Number(serverPlayer.vy || 0);
    this.targetX = serverPlayer.x;
    this.targetY = serverPlayer.y;
    this.targetDir = serverPlayer.dir;
    if (Object.hasOwn(serverPlayer, 'staffRole')) this.staffRole = serverPlayer.staffRole || '';
    this.extrapolateMotion = extrapolateMotion;
    this.stateReceivedAt = receivedAt;
    
    this.stamina = serverPlayer.stamina;
    this.staminaLock = serverPlayer.staminaLock;
    this.stun = serverPlayer.stun;
    this.shootHalo = serverPlayer.shootHalo;
    this.kickCharge = serverPlayer.kickCharge || 0;
    this.invuln = serverPlayer.invuln;
    this.tackle_cd = serverPlayer.tackle_cd || 0;
    this.dribble_cd = serverPlayer.dribble_cd || 0;
    this.power_cd = serverPlayer.power_cd || 0;
    if (Object.hasOwn(serverPlayer, 'matchStats')) this.matchStats = serverPlayer.matchStats || null;

    // Record trail for active sprint
    if (this.renderTrail && this.staminaLock <= 0 && this.invuln > 0) {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.5 });
      if (this.trail.length > 5) this.trail.shift();
    } else {
      if (this.trail.length > 0) {
        this.trail.shift();
      }
    }
  }

  interpolate(lerpFactor = 0.35, now = performance.now(), localPrediction = null, networkDelayFrames = 0) {
    const frameMs = 1000 / 60;
    const inferredDelayFrames = Number(networkDelayFrames) > 0
      ? Number(networkDelayFrames)
      : Math.max(0, Number(localPrediction?.pingMs || 0) / 2 / frameMs);
    const elapsedFrames = Math.max(0.25, Math.min(2, (now - this.lastRenderAt) / frameMs || 1));
    const snapshotAgeFrames = Math.max(0, Math.min(8, (now - this.stateReceivedAt) / frameMs));
    const compensatedAge = snapshotAgeFrames + Math.max(0, Math.min(10, inferredDelayFrames));
    let expectedX = this.targetX + (this.extrapolateMotion ? this.vx * compensatedAge : 0);
    let expectedY = this.targetY + (this.extrapolateMotion ? this.vy * compensatedAge : 0);
    if (this.extrapolateMotion && localPrediction) {
      const ax = Number(localPrediction.input?.x || 0);
      const ay = Number(localPrediction.input?.y || 0);
      const length = Math.hypot(ax, ay);
      if (length > 0.001) {
        const oneWayFrames = Math.max(0, Math.min(10, inferredDelayFrames));
        const sprintMultiplier = localPrediction.input?.sprint && this.staminaLock <= 0 && this.stamina > 0 ? 1.5 : 1;
        const predictedSpeed = C.MAX_SPEED * 1.2 * sprintMultiplier;
        // Predict only the velocity delta. Adding a full movement estimate on
        // top of server velocity caused mobile overshoot and rubber-banding.
        expectedX += (((ax / length) * predictedSpeed) - this.vx) * oneWayFrames;
        expectedY += (((ay / length) * predictedSpeed) - this.vy) * oneWayFrames;
      }
    }
    const correction = 1 - Math.pow(1 - lerpFactor, elapsedFrames);

    // Advance the visual target between snapshots. The six-frame cap keeps
    // remote movement continuous during a short mobile/network jitter burst;
    // authoritative targets still correct every received snapshot.
    this.x += (expectedX - this.x) * correction;
    this.y += (expectedY - this.y) * correction;
    
    // Interpolate direction angles smoothly
    let diff = this.targetDir - this.dir;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.dir += diff * correction;
    this.lastRenderAt = now;
  }

  draw(ctx, ballOwnerId) {
    // 1) Draw trail for dribbles
    ctx.save();
    for (const t of this.trail) {
      ctx.fillStyle = this.team === C.Team.RED ? `rgba(239, 68, 68, ${t.alpha})` : `rgba(96, 165, 250, ${t.alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.r - 2, 0, Math.PI * 2);
      ctx.fill();
      t.alpha -= 0.1;
    }
    ctx.restore();

    // 2) Draw Player shadow
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath();
    ctx.ellipse(this.x + 4, this.y + 8, this.r * 1.1, this.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3) Draw Outer Body
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.team === C.Team.RED ? '#ef4444' : '#3b82f6';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,.45)';
    ctx.stroke();

    // 4) Shoot Halo Ring (black glow when kicking)
    if (this.shootHalo > 0) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5) Render equipped image skin, with the badge as a loading fallback.
    // Leave only a one-pixel team-colored ring around the cosmetic.
    const skinDrawn = drawSkinImage(ctx, this.skin, this.x, this.y, this.r - 1);
    if (!skinDrawn && this.badge) {
      ctx.fillStyle = '#0b1020';
      const graphemes = segmentGraphemes(this.badge);
      const fontSize = (graphemes.length >= 2 && !isEmojiCluster(graphemes[0])) ? 14 : 16;
      ctx.font = `700 ${fontSize}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.badge, this.x, this.y);
    }

    // 6) Draw Dribble Invulnerability Rings (green)
    if (this.invuln > 0) {
      ctx.strokeStyle = '#22c55e';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 7) Draw Ball Possession indicator triangle
    if (ballOwnerId === this.id) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.r - 10);
      ctx.lineTo(this.x - 6, this.y - this.r - 2);
      ctx.lineTo(this.x + 6, this.y - this.r - 2);
      ctx.closePath();
      ctx.fill();
    }

    // 8) Draw Stunned indicator border
    if (this.stun > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 9) Draw Name label above player
    if (this.name) {
      ctx.font = '700 12px system-ui';
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(4, 9, 24, 0.9)';
      ctx.strokeText(this.name, this.x, this.y - this.r - 14);
      ctx.fillStyle = C.TEAM_NAME_COLORS[this.team] || '#e2e8f0';
      ctx.fillText(this.name, this.x, this.y - this.r - 14);
    }
    drawStaffTagOnCanvas(ctx, this.x, this.y - this.r - 31, this.staffRole);
  }
}
