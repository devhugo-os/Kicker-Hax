// Kicker Hax - Client-side Player Model
import * as C from '../../shared/constants.js';
import { segmentGraphemes, isEmojiCluster } from '../utils/graphemes.js';
import { drawSkinImage } from '../utils/skinRenderer.js';
import { drawStaffTagOnCanvas } from '../utils/staffTags.js';

export class ClientPlayer {
  constructor(serverPlayer) {
    this.id = serverPlayer.id;
    this.name = serverPlayer.name;
    this.badge = serverPlayer.badge;
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
    
    // Aesthetic trails
    this.trail = [];
  }

  updateState(serverPlayer, predictionFrames = 0) {
    this.name = serverPlayer.name;
    this.badge = serverPlayer.badge;
    this.skin = serverPlayer.skin || this.skin || '';
    this.team = serverPlayer.team;
    
    this.vx = Number(serverPlayer.vx || 0);
    this.vy = Number(serverPlayer.vy || 0);
    this.targetX = serverPlayer.x + this.vx * predictionFrames;
    this.targetY = serverPlayer.y + this.vy * predictionFrames;
    this.targetDir = serverPlayer.dir;
    this.staffRole = serverPlayer.staffRole || '';
    
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

    // Record trail for active sprint
    if (this.staminaLock <= 0 && this.invuln > 0) {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.5 });
      if (this.trail.length > 5) this.trail.shift();
    } else {
      if (this.trail.length > 0) {
        this.trail.shift();
      }
    }
  }

  interpolate(lerpFactor = 0.35) {
    this.x += (this.targetX - this.x) * lerpFactor;
    this.y += (this.targetY - this.y) * lerpFactor;
    
    // Interpolate direction angles smoothly
    let diff = this.targetDir - this.dir;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.dir += diff * lerpFactor;
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
