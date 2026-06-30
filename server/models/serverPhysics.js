// Kicker Hax - Server-side Physics Engine
import * as C from '../../shared/constants.js';

export class ServerPhysics {
  static clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  static rnd(a, b) {
    return a + Math.random() * (b - a);
  }

  static normalizedAngle(a) {
    a %= Math.PI * 2;
    return a < -Math.PI ? a + Math.PI * 2 : a > Math.PI ? a - Math.PI * 2 : a;
  }

  static lerpAngle(a, b, t) {
    a = this.normalizedAngle(a);
    b = this.normalizedAngle(b);
    let d = this.normalizedAngle(b - a);
    return a + d * t;
  }

  static circleCollision(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy);
    return d < a.r + b.r ? { dx, dy, d } : null;
  }



  static collidePlayerWithCorner(p, cx, cy, cr) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const d = Math.hypot(dx, dy) || 1e-6;
    const minDist = p.r + cr;
    if (d < minDist) {
      const nx = dx / d;
      const ny = dy / d;
      const overlap = minDist - d;
      p.x += nx * overlap;
      p.y += ny * overlap;
      const vDot = p.vx * nx + p.vy * ny;
      p.vx -= 0.8 * vDot * nx;
      p.vy -= 0.8 * vDot * ny;
    }
  }

  static collideBallWithCorner(b, cx, cy, cr, onPostHit) {
    const dx = b.x - cx;
    const dy = b.y - cy;
    const d = Math.hypot(dx, dy) || 1e-6;
    const minDist = b.r + cr;
    if (d < minDist) {
      const nx = dx / d;
      const ny = dy / d;
      const overlap = minDist - d;
      b.x += nx * overlap;
      b.y += ny * overlap;
      const vDot = b.vx * nx + b.vy * ny;
      b.vx -= 1.7 * vDot * nx;
      b.vy -= 1.7 * vDot * ny;
      if (b.strikeTimer > 0 && (b.lastStrikeType === 'kick' || b.lastStrikeType === 'power')) {
        if (onPostHit) onPostHit();
      }
    }
  }

  static resolvePlayerPlayer(players) {
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const a = players[i];
        const b = players[j];
        const c = this.circleCollision(a, b);
        if (!c) continue;

        const d = c.d || 1e-6;
        const nx = c.dx / d;
        const ny = c.dy / d;
        const overlap = (a.r + b.r - d) * 0.5;

        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const rvx = b.vx - a.vx;
        const rvy = b.vy - a.vy;
        const vn = rvx * nx + rvy * ny;

        let impulseScale = 0.7;
        if (a.stun > 0 || b.stun > 0 || a.tackleFreeze > 0 || b.tackleFreeze > 0) {
          impulseScale = 0.0;
        }

        const imp = -vn * impulseScale;
        a.vx -= imp * nx;
        a.vy -= imp * ny;
        b.vx += imp * nx;
        b.vy += imp * ny;
      }
    }
  }

  static resolvePlayerBall(players, ball, onPickup) {
    for (const p of players) {
      const c = this.circleCollision(p, ball);
      if (!c) continue;

      const d = c.d || 1e-6;
      const nx = c.dx / d;
      const ny = c.dy / d;
      const overlap = p.r + ball.r - d;

      if (!ball.owner) {
        const canPickup = ball.noPickupFrames <= 0 || ball.noPickupFrom !== p.id;
        if (canPickup) {
          ball.x += nx * overlap;
          ball.y += ny * overlap;
          ball.vx += p.vx * 0.22;
          ball.vy += p.vy * 0.22;
          ball.owner = p.id;
          ball.lastStrikeType = null;
          ball.strikeTimer = 0;
          if (onPickup) onPickup(p);
        } else {
          ball.x += nx * Math.max(0, overlap - 1);
          ball.y += ny * Math.max(0, overlap - 1);
          ball.vx += p.vx * 0.05;
          ball.vy += p.vy * 0.05;
        }
      }
      ball.lastTouch = p.id;
    }
  }

  static updatePlayerPhysics(p, input, ball, onSoundEffect) {
    // Stun logic
    if (p.stun > 0) {
      p.vx = 0;
      p.vy = 0;
      if (p.tackle_cd > 0) p.tackle_cd--;
      if (p.dribble_cd > 0) p.dribble_cd--;
      if (p.dash_time > 0) p.dash_time--;
      if (p.invuln > 0) p.invuln--;
      p.stun--;
      if (p.cool > 0) p.cool--;
      if (p.power_cd > 0) p.power_cd--;
      if (p.tackleFreeze > 0) p.tackleFreeze--;
      if (p.aiShootLock > 0) p.aiShootLock--;
      if (p.shootHalo > 0) p.shootHalo--;
      if (p.tackleEval > 0) {
        p.tackleEval--;
        if (p.tackleEval === 0 && !p.tackleSuccess) {
          p.stun = Math.max(p.stun, C.FAIL_STUN);
        }
      }
      return;
    }

    // Stamina calculation
    if (p.staminaLock > 0) {
      p.stamina = 0;
      p.staminaLock--;
    } else {
      if (input.sprint && p.stamina > 0) {
        p.stamina = Math.max(0, p.stamina - C.DRAIN_SPRINT);
        if (p.stamina === 0) p.staminaLock = C.STAMINA_LOCK_FRAMES;
      } else {
        p.stamina = Math.min(1, p.stamina + C.REGEN_IDLE);
      }
    }

    const canSprint = input.sprint && p.staminaLock <= 0 && p.stamina > 0;
    const slowMul = p.slowTimer > 0 ? 0.7 : 1;
    if (p.slowTimer > 0) p.slowTimer--;

    const effMul = canSprint ? (1 + (1.30 - 1) * p.stamina) : 1;
    const baseSpeed = C.MAX_SPEED * effMul * slowMul;
    const dashBoost = p.dash_time > 0 ? 1.7 : 1;

    let ax = input.x || 0;
    let ay = input.y || 0;
    const L = Math.hypot(ax, ay) || 1;

    p.vx = p.vx * C.FRICTION_PLAYER + (ax / L) * baseSpeed * 0.12 * dashBoost;
    p.vy = p.vy * C.FRICTION_PLAYER + (ay / L) * baseSpeed * 0.12 * dashBoost;

    if (ax || ay) {
      const targetAng = Math.atan2(ay, ax);
      p.dir = this.lerpAngle(p.dir, targetAng, 0.35);
      p.lastMoveDir = p.dir;
    }

    // Kick Charge
    if (input.shoot) {
      p.kickCharge = Math.min(1, p.kickCharge + 0.065);
    } else {
      p.kickCharge *= 0.95;
    }

    // Skill ticks
    if (p.boostCooldown > 0) p.boostCooldown--;
    if (p.tackle_cd > 0) p.tackle_cd--;
    if (p.dribble_cd > 0) p.dribble_cd--;
    if (p.dash_time > 0) p.dash_time--;
    if (p.invuln > 0) p.invuln--;
    if (p.cool > 0) p.cool--;
    if (p.power_cd > 0) p.power_cd--;
    if (p.tackleFreeze > 0) p.tackleFreeze--;
    if (p.aiShootLock > 0) p.aiShootLock--;
    if (p.shootHalo > 0) p.shootHalo--;
    if (p.tackleEval > 0) {
      p.tackleEval--;
      if (p.tackleEval === 0 && !p.tackleSuccess) {
        p.vx = 0;
        p.vy = 0;
        p.stun = Math.max(p.stun, C.FAIL_STUN);
      }
    }
  }

  static applyLimits(p, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w = 1024, h = 640) {
    let nx = p.x + p.vx;
    let ny = p.y + p.vy;

    // Vertical boundary limits
    if (!(ny > gTop && ny < gBot)) {
      if (ny - p.r < C.BORDER) { ny = C.BORDER + p.r; p.vy *= -0.5; }
      if (ny + p.r > h - C.BORDER) { ny = h - C.BORDER - p.r; p.vy *= -0.5; }
    }

    // Goals bounds and posts collisions
    if (ny > gTop && ny < gBot) {
      if (nx - p.r < leftNetBack) { nx = leftNetBack + p.r; p.vx = Math.max(p.vx, 0) * 0.5; }
      if (nx + p.r > rightNetBack) { nx = rightNetBack - p.r; p.vx = Math.min(p.vx, 0) * 0.5; }

      const inLeft = nx < C.BORDER && nx >= leftNetBack - 6;
      const inRight = nx > w - C.BORDER && nx <= rightNetBack + 6;
      if (inLeft || inRight) {
        if (ny - p.r < gTop) { ny = gTop + p.r; p.vy = Math.max(p.vy, 0) * 0.4; }
        if (ny + p.r > gBot) { ny = gBot - p.r; p.vy = Math.min(p.vy, 0) * 0.4; }
      }

      const tmp = { x: nx, y: ny, vx: p.vx, vy: p.vy, r: p.r };
      this.collidePlayerWithCorner(tmp, leftPostX, gTop, cornerR);
      this.collidePlayerWithCorner(tmp, leftPostX, gBot, cornerR);
      this.collidePlayerWithCorner(tmp, rightPostX, gTop, cornerR);
      this.collidePlayerWithCorner(tmp, rightPostX, gBot, cornerR);
      nx = tmp.x; ny = tmp.y; p.vx = tmp.vx; p.vy = tmp.vy;
    } else {
      if (nx - p.r < C.BORDER) { nx = C.BORDER + p.r; p.vx *= -0.5; }
      if (nx + p.r > w - C.BORDER) { nx = w - C.BORDER - p.r; p.vx *= -0.5; }

      const tmp = { x: nx, y: ny, vx: p.vx, vy: p.vy, r: p.r };
      this.collidePlayerWithCorner(tmp, leftPostX, gTop, cornerR);
      this.collidePlayerWithCorner(tmp, leftPostX, gBot, cornerR);
      this.collidePlayerWithCorner(tmp, rightPostX, gTop, cornerR);
      this.collidePlayerWithCorner(tmp, rightPostX, gBot, cornerR);
      nx = tmp.x; ny = tmp.y; p.vx = tmp.vx; p.vy = tmp.vy;
    }

    p.x = nx;
    p.y = ny;
  }

  static updateBallPhysics(b, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, players, onSoundEffect, onGoal, w = 1024, h = 640) {
    if (b.boostCooldown > 0) b.boostCooldown--;
    if (b.noPickupFrames > 0) {
      b.noPickupFrames--;
      if (b.noPickupFrames === 0) b.noPickupFrom = null;
    }
    if (b.strikeTimer > 0) b.strikeTimer--;

    // If ball is owned by a player
    if (b.owner) {
      const p = players.find(x => x.id === b.owner);
      if (p) {
        const off = p.r + b.r + 1;
        const px = Math.cos(p.dir || 0);
        const py = Math.sin(p.dir || 0);
        let nx = p.x + px * off;
        let ny = p.y + py * off;

        let minX = C.BORDER + b.r;
        let maxX = w - C.BORDER - b.r;
        if (ny > gTop && ny < gBot) {
          minX = leftNetBack + b.r;
          maxX = rightNetBack - b.r;
        }

        b.x = this.clamp(nx, minX, maxX);
        b.y = this.clamp(ny, C.BORDER + b.r, h - C.BORDER - b.r);
        b.vx = p.vx;
        b.vy = p.vy;

        if (ny > gTop && ny < gBot) {
          if (b.x + b.r <= leftPostX) { onGoal('blue', p.id); }
          if (b.x - b.r >= rightPostX) { onGoal('red', p.id); }
        }
        return;
      } else {
        b.owner = null;
      }
    }

    // Ball without owner
    b.vx *= C.FRICTION_FIELD;
    b.vy *= C.FRICTION_FIELD;
    b.x += b.vx;
    b.y += b.vy;

    // Field bounds collisions
    if (b.y - b.r < C.BORDER) { b.y = C.BORDER + b.r; b.vy *= -0.75; }
    if (b.y + b.r > h - C.BORDER) { b.y = h - C.BORDER - b.r; b.vy *= -0.75; }

    if (b.x - b.r < C.BORDER) {
      if (b.y > gTop && b.y < gBot) {
        this.collideBallWithCorner(b, leftPostX, gTop, cornerR, () => onSoundEffect('post'));
        this.collideBallWithCorner(b, leftPostX, gBot, cornerR, () => onSoundEffect('post'));
      } else {
        b.x = C.BORDER + b.r; b.vx *= -0.75;
      }
    }
    if (b.x + b.r > w - C.BORDER) {
      if (b.y > gTop && b.y < gBot) {
        this.collideBallWithCorner(b, rightPostX, gTop, cornerR, () => onSoundEffect('post'));
        this.collideBallWithCorner(b, rightPostX, gBot, cornerR, () => onSoundEffect('post'));
      } else {
        b.x = w - C.BORDER - b.r; b.vx *= -0.75;
      }
    }

    // Net limits
    if (b.y > gTop && b.y < gBot) {
      const inLeft = b.x < C.BORDER && b.x >= leftNetBack - 30;
      const inRight = b.x > w - C.BORDER && b.x <= rightNetBack + 30;
      if (inLeft || inRight) {
        if (inLeft && b.x - b.r < leftNetBack) { b.x = leftNetBack + b.r; b.vx *= -0.65; }
        if (inRight && b.x + b.r > rightNetBack) { b.x = rightNetBack - b.r; b.vx *= -0.65; }
        if (b.y - b.r < gTop) { b.y = gTop + b.r; b.vy *= -0.65; }
        if (b.y + b.r > gBot) { b.y = gBot - b.r; b.vy *= -0.65; }
      }
    }

    // Goal Trigger checks
    if (b.y > gTop && b.y < gBot) {
      if (b.x + b.r <= leftPostX) { onGoal('blue', b.lastTouch); }
      if (b.x - b.r >= rightPostX) { onGoal('red', b.lastTouch); }
    }
  }

  static kickBall(p, ball, angle, power) {
    ball.owner = null;
    ball.noPickupFrames = 14;
    ball.noPickupFrom = p.id;
    ball.vx += Math.cos(angle) * power;
    ball.vy += Math.sin(angle) * power;
    ball.vx += this.rnd(-0.05, 0.05);
    ball.vy += this.rnd(-0.05, 0.05);
    ball.lastTouch = p.id;
    ball.lastStrikeType = 'kick';
    ball.strikeTimer = 40;
  }

  static powerKick(p, ball, angle, power) {
    ball.owner = null;
    ball.noPickupFrames = 14;
    ball.noPickupFrom = p.id;
    ball.vx += Math.cos(angle) * power;
    ball.vy += Math.sin(angle) * power;
    ball.vx += this.rnd(-0.05, 0.05);
    ball.vy += this.rnd(-0.05, 0.05);
    ball.lastTouch = p.id;
    ball.lastStrikeType = 'power';
    ball.strikeTimer = 40;
  }
}
