// Kicker Hax - Server-side Match Model
import * as C from '../../shared/constants.js';
import { ServerPhysics } from './serverPhysics.js';

export class ServerMatch {
  constructor(roomCode, duration, goalLimit, players, io, onMatchEnd, fieldSize = 'medium') {
    this.roomCode = roomCode;
    this.duration = duration;
    this.goalLimit = goalLimit;
    this.io = io;
    this.onMatchEnd = onMatchEnd;
    this.fieldSize = fieldSize;

    if (this.fieldSize === 'small') {
      this.w = 896; this.h = 560;
    } else if (this.fieldSize === 'large') {
      this.w = 1280; this.h = 768;
    } else {
      this.w = 1024; this.h = 640;
    }

    this.score = { red: 0, blue: 0 };
    this.matchTime = duration * 60;
    this.status = 'countdown'; // 'countdown' | 'playing' | 'freeze' | 'end-freeze' | 'ended'
    this.countdownTimer = 150; // ~2.5s at 60Hz
    this.goalFreezeTimer = 0;
    this.endFreezeTimer = 0;

    // Initialize physical objects
    this.ball = {
      x: this.w / 2,
      y: this.h / 2,
      vx: 0,
      vy: 0,
      r: C.BALL_RADIUS,
      owner: null,
      lastTouch: null,
      strikeTimer: 0,
      lastStrikeType: null,
      noPickupFrames: 0,
      noPickupFrom: null
    };

    // Load players into physical instances
    this.players = players.map(p => this.createPhysicalPlayer(p));

    // Queued client inputs: socketId -> inputObject
    this.inputs = new Map();
    this.players.forEach(p => {
      if (!p.cpu) {
        this.inputs.set(p.id, { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false });
      }
    });

    // Sound effects occurred in current tick (whistle, kick, tackle, post, dribble, power, goal, cheer)
    this.soundEffects = [];

    // Replay buffer
    this.replayBuffer = new Array(C.GOAL_FREEZE_FRAMES * 2);
    this.replayBufferIndex = 0;
    this.lastGoal = null;

    // Start physical tick loop (60Hz)
    this.tickInterval = setInterval(() => this.tick(), 1000 / 60);

    // Initial kickoff setup
    this.kickoff();
  }

  createPhysicalPlayer(lobbyPlayer) {
    const isRed = lobbyPlayer.team === 'red';
    const startX = isRed ? C.BORDER + 120 : this.w - C.BORDER - 120;
    const startY = this.h * 0.5;

    return {
      id: lobbyPlayer.id,
      uid: lobbyPlayer.uid || '',
      name: lobbyPlayer.username,
      badge: lobbyPlayer.badge,
      team: lobbyPlayer.team === 'red' ? C.Team.RED : C.Team.BLUE,
      cpu: !!lobbyPlayer.cpu,
      difficulty: lobbyPlayer.difficulty || C.Difficulty.MEDIUM,
      role: 'mf',
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      r: C.PLAYER_RADIUS,
      dir: 0,
      lastMoveDir: 0,
      stamina: 1.0,
      staminaLock: 0,
      stun: 0,
      slowTimer: 0,
      tackle_cd: 0,
      dribble_cd: 0,
      dash_time: 0,
      invuln: 0,
      power_cd: 0,
      tackleFreeze: 0,
      tackleSuccess: false,
      tackleEval: 0,
      shootHalo: 0,
      aiShootLock: 0,
      aiFeintLock: 0,
      home: { x: startX, y: startY }
    };
  }

  updateInput(socketId, inputData) {
    if (this.inputs.has(socketId)) {
      this.inputs.set(socketId, {
        x: ServerPhysics.clamp(inputData.x || 0, -1, 1),
        y: ServerPhysics.clamp(inputData.y || 0, -1, 1),
        shoot: !!inputData.shoot,
        sprint: !!inputData.sprint,
        dribble: !!inputData.dribble,
        tackle: !!inputData.tackle,
        power: !!inputData.power
      });
    }
  }

  kickoff() {
    for (const p of this.players) {
      const isRed = p.team === C.Team.RED;
      p.x = isRed ? C.BORDER + 120 : this.w - C.BORDER - 120;
      p.y = this.h * 0.5;
      p.vx = 0;
      p.vy = 0;
      p.kickCharge = 0;
      p.stamina = 1.0;
      p.staminaLock = 0;
      p.stun = 0;
      p.tackle_cd = 0;
      p.dribble_cd = 0;
      p.dash_time = 0;
      p.invuln = 0;
      p.power_cd = 0;
      p.tackleFreeze = 0;
      p.tackleSuccess = false;
      p.tackleEval = 0;
      p.shootHalo = 0;
      p.aiShootLock = 0;
      p.aiFeintLock = 0;
    }
    this.ball.x = this.w / 2;
    this.ball.y = this.h / 2;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.owner = null;
    this.ball.lastTouch = null;
    this.ball.strikeTimer = 0;
    this.ball.lastStrikeType = null;
    this.ball.noPickupFrames = 0;
    this.ball.noPickupFrom = null;

    this.soundEffects.push('whistle');
  }

  recordFrame() {
    const snap = this.players.map(p => ({
      x: p.x,
      y: p.y,
      dir: p.dir,
      team: p.team,
      has: (this.ball.owner === p.id),
      name: p.name || '',
      badge: p.badge || '',
      inv: p.invuln || 0,
      stun: p.stun || 0,
      halo: p.shootHalo || 0
    }));

    const frame = {
      ball: { x: this.ball.x, y: this.ball.y },
      players: snap,
      score: { ...this.score },
      sfx: [...this.soundEffects]
    };

    this.replayBuffer[this.replayBufferIndex] = frame;
    this.replayBufferIndex = (this.replayBufferIndex + 1) % this.replayBuffer.length;
  }

  getReplayQueue() {
    const list = [];
    for (let i = 0; i < this.replayBuffer.length; i++) {
      const idx = (this.replayBufferIndex + i) % this.replayBuffer.length;
      if (this.replayBuffer[idx]) list.push(this.replayBuffer[idx]);
    }
    return list;
  }

  triggerGoal(side, scorerId) {
    if (this.status !== 'playing') return;

    this.status = 'freeze';
    this.goalFreezeTimer = C.GOAL_FREEZE_FRAMES;

    const scorer = this.players.find(p => p.id === scorerId);
    const scorerName = scorer ? scorer.name : 'Desconhecido';
    const ownGoal = scorer ? (side === 'blue' && scorer.team === C.Team.RED) || (side === 'red' && scorer.team === C.Team.BLUE) : false;

    if (side === 'blue') this.score.blue++; else this.score.red++;

    this.lastGoal = {
      side,
      scorerName,
      scorerId,
      ownGoal
    };

    this.soundEffects.push('whistle');
    this.soundEffects.push('goal');
    this.soundEffects.push('cheer');
  }

  processBotAI(p) {
    if (p.stun > 0) return;

    const ours = this.players.filter(x => x.team === p.team);
    const their = this.players.filter(x => x.team !== p.team);
    const goalX = p.team === C.Team.RED ? this.w - C.BORDER - C.POST_T - 2 : C.BORDER + C.POST_T + 2;
    const gTop = (this.h - C.GOAL_W_INIT) / 2;
    const gBot = (this.h + C.GOAL_W_INIT) / 2;

    // Ball prediction math
    const ballFuture = { x: this.ball.x, y: this.ball.y };
    if (!this.ball.owner) {
      let vx = this.ball.vx;
      let vy = this.ball.vy;
      for (let i = 0; i < 10; i++) {
        vx *= C.FRICTION_FIELD;
        vy *= C.FRICTION_FIELD;
        ballFuture.x += vx;
        ballFuture.y += vy;
      }
    }

    const distBall = Math.hypot(ballFuture.x - p.x, ballFuture.y - p.y);
    const closest = ours.reduce((best, curr) => {
      const d = Math.hypot(ballFuture.x - curr.x, ballFuture.y - curr.y);
      return d < best.d ? { p: curr, d } : best;
    }, { p: null, d: 1e9 }).p;
    const isClosest = closest === p;

    // Sprint decision based on difficulty
    let wantSprint = false;
    if (p.difficulty !== C.Difficulty.EASY) {
      wantSprint = (this.ball.owner === p.id && Math.abs(goalX - p.x) > 220) ||
                   (!this.ball.owner && (isClosest || distBall > 140));
    }

    const canSprint = wantSprint && p.staminaLock <= 0 && p.stamina > 0.35;

    // AI steer directions
    let targetX = ballFuture.x;
    let targetY = ballFuture.y;

    if (this.ball.owner === p.id) {
      targetX = goalX;
      targetY = ServerPhysics.clamp(p.y, gTop + 20, gBot - 20);
    } else if (this.ball.owner && this.players.find(x => x.id === this.ball.owner).team !== p.team) {
      const owner = this.players.find(x => x.id === this.ball.owner);
      targetX = owner.x;
      targetY = owner.y;
    }

    // Calculate vectors
    let dx = targetX - p.x;
    let dy = targetY - p.y;
    let L = Math.hypot(dx, dy) || 1;
    let ax = dx / L;
    let ay = dy / L;

    // Avoid opponents pressure
    let rx = 0, ry = 0;
    if (p.difficulty === C.Difficulty.HARD) {
      for (const e of their) {
        const ex = p.x - e.x;
        const ey = p.y - e.y;
        const d = Math.hypot(ex, ey);
        if (d < 110) {
          const w = (110 - d) / 110;
          rx += (ex / (d || 1)) * w * 0.7;
          ry += (ey / (d || 1)) * w * 0.7;
        }
      }
    }

    let inputX = ax + rx;
    let inputY = ay + ry;
    const inputL = Math.hypot(inputX, inputY) || 1;
    inputX /= inputL;
    inputY /= inputL;

    // Human mistakes (difficulty factor)
    let errFactor = 0;
    if (p.difficulty === C.Difficulty.EASY) errFactor = 0.25;
    else if (p.difficulty === C.Difficulty.MEDIUM) errFactor = 0.12;

    if (errFactor > 0 && Math.random() < 0.05) {
      inputX += ServerPhysics.rnd(-errFactor, errFactor);
      inputY += ServerPhysics.rnd(-errFactor, errFactor);
    }

    // Set Bot skills trigger
    let shoot = false;
    let dribble = false;
    let tackle = false;
    let power = false;

    // Shoot controls
    if (this.ball.owner === p.id) {
      const distToGoal = Math.abs(goalX - p.x);
      const mouth = p.y > gTop && p.y < gBot;

      if (distToGoal < 100 || (distToGoal < 160 && mouth)) {
        shoot = true;
      }

      // Hard bots use dribble & power kicks
      if (p.difficulty === C.Difficulty.HARD) {
        const nearestOpp = their.reduce((best, curr) => {
          const d = Math.hypot(curr.x - p.x, curr.y - p.y);
          return d < best.d ? { p: curr, d } : best;
        }, { p: null, d: 1e9 });

        if (nearestOpp.d < 90 && p.dribble_cd <= 0 && p.stamina >= C.DRIBBLE_STAM_COST) {
          dribble = true;
        }
        if (p.power_cd <= 0 && p.stamina > 0.98 && distToGoal > 250 && distToGoal < 500) {
          power = true;
        }
      }
    } else if (this.ball.owner && this.players.find(x => x.id === this.ball.owner).team !== p.team) {
      // Tackle logic
      const owner = this.players.find(x => x.id === this.ball.owner);
      const d = Math.hypot(owner.x - p.x, owner.y - p.y);
      if (d < C.TACKLE_RANGE && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST && p.difficulty !== C.Difficulty.EASY) {
        tackle = true;
      }
    }

    this.inputs.set(p.id, {
      x: inputX,
      y: inputY,
      shoot,
      sprint: canSprint,
      dribble,
      tackle,
      power
    });
  }

  tick() {
    this.soundEffects = [];

    // Dimensions setup based on dynamic sizes
    const gTop = (this.h - C.GOAL_W_INIT) / 2;
    const gBot = (this.h + C.GOAL_W_INIT) / 2;
    const leftPostX = C.BORDER - C.POST_T;
    const rightPostX = this.w - C.BORDER + C.POST_T;
    const leftNetBack = leftPostX - C.GOAL_DEPTH;
    const rightNetBack = rightPostX + C.GOAL_DEPTH;
    const cornerR = 10;

    // Tick based on Match Status
    if (this.status === 'countdown') {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.status = 'playing';
      }
      this.recordFrame();
    } else if (this.status === 'freeze') {
      this.goalFreezeTimer--;
      this.recordFrame();
      if (this.goalFreezeTimer <= 0) {
        // Send replay buffer to all clients
        this.io.to(this.roomCode).emit('playReplay', {
          replayFrames: this.getReplayQueue(),
          goalInfo: this.lastGoal
        });
        this.status = 'replay';
        // Give 240 frames length + padding to clear replay
        this.countdownTimer = (C.GOAL_FREEZE_FRAMES * 2) + 60;
      }
    } else if (this.status === 'replay') {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        const goalTotal = this.score.red >= this.goalLimit || this.score.blue >= this.goalLimit;
        if (goalTotal && this.goalLimit > 0) {
          this.status = 'end-freeze';
          this.endFreezeTimer = C.END_FREEZE_FRAMES;
        } else {
          this.status = 'countdown';
          this.countdownTimer = 150;
          this.kickoff();
        }
      }
    } else if (this.status === 'end-freeze') {
      this.endFreezeTimer--;
      this.recordFrame();
      if (this.endFreezeTimer <= 0) {
        this.status = 'ended';
        this.onMatchEnd(this.score);
        clearInterval(this.tickInterval);
      }
    } else if (this.status === 'playing') {
      // Clock decrement
      this.matchTime -= 1 / 60;
      if (this.matchTime <= 0) {
        this.matchTime = 0;
        this.status = 'end-freeze';
        this.endFreezeTimer = C.END_FREEZE_FRAMES;
      }

      // Pre-compute bot inputs
      for (const p of this.players) {
        if (p.cpu) {
          this.processBotAI(p);
        }
      }

      // Update players physics
      for (const p of this.players) {
        const input = this.inputs.get(p.id) || { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };

        // Handle skill activations
        if (p.stun <= 0) {
          // Tackle
          if (input.tackle && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST) {
            p.stamina = Math.max(0, p.stamina - C.TACKLE_STAM_COST);
            p.tackle_cd = C.TACKLE_CD;
            p.tackleSuccess = false;
            p.tackleEval = 12;
            p.slowTimer = C.TACKLE_SLOW_TIME;
            p.tackleFreeze = 8;
            this.soundEffects.push('tackle');

            // Apply lunge impulse
            const ballOwnerPlayer = this.players.find(x => x.id === this.ball.owner);
            const ang = ballOwnerPlayer ? Math.atan2(ballOwnerPlayer.y - p.y, ballOwnerPlayer.x - p.x) : p.dir;
            p.vx += Math.cos(ang) * C.TACKLE_LUNGE;
            p.vy += Math.sin(ang) * C.TACKLE_LUNGE;

            // Compute tackle collision
            if (ballOwnerPlayer && ballOwnerPlayer.team !== p.team && ballOwnerPlayer.invuln <= 0) {
              const dist = Math.hypot(ballOwnerPlayer.x - p.x, ballOwnerPlayer.y - p.y);
              if (dist <= C.TACKLE_RANGE) {
                this.ball.owner = p.id;
                this.ball.lastTouch = p.id;
                this.ball.noPickupFrames = 10;
                this.ball.noPickupFrom = null;
                this.ball.vx = 0;
                this.ball.vy = 0;

                ballOwnerPlayer.stun = Math.max(ballOwnerPlayer.stun, C.TACKLE_STUN);
                ballOwnerPlayer.vx = 0;
                ballOwnerPlayer.vy = 0;
                p.tackleSuccess = true;
              }
            }
          }

          // Dribble
          if (input.dribble && p.dribble_cd <= 0 && this.ball.owner === p.id && p.stamina >= C.DRIBBLE_STAM_COST) {
            p.stamina = Math.max(0, p.stamina - C.DRIBBLE_STAM_COST);
            p.dash_time = C.DRIBBLE_TIME;
            p.invuln = C.DRIBBLE_INVULN;
            p.dribble_cd = C.DRIBBLE_CD;
            p.vx += Math.cos(p.dir) * C.DRIBBLE_DASH;
            p.vy += Math.sin(p.dir) * C.DRIBBLE_DASH;
            this.soundEffects.push('dribble');
          }

          // Power Kick
          if (input.power && p.power_cd <= 0 && p.stamina >= 0.98 && (this.ball.owner === p.id || Math.hypot(p.x - this.ball.x, p.y - this.ball.y) < p.r + this.ball.r + 8)) {
            p.stamina = 0;
            p.staminaLock = C.STAMINA_LOCK_FRAMES;
            p.power_cd = C.POWER_KICK_CD;
            p.cool = 12;
            p.shootHalo = 22;

            const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
            ServerPhysics.powerKick(p, this.ball, ang, C.POWER_KICK_POWER);
            this.soundEffects.push('power');
          }

          // Regular Shoot Release
          if (p.kickCharge > 0 && !input.shoot) {
            const charge = ServerPhysics.clamp(p.kickCharge, 0, 1);
            const cost = Math.max(0.08, 0.40 * charge);
            if (p.staminaLock <= 0 && p.stamina >= cost) {
              p.stamina = Math.max(0, p.stamina - cost);
              p.cool = 14;
              p.shootHalo = 18;
              const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
              const pow = Math.max(C.KICK_BASE, C.KICK_BASE + C.KICK_CHARGE * charge);
              ServerPhysics.kickBall(p, this.ball, ang, pow);
              this.soundEffects.push('kick');
            }
            p.kickCharge = 0;
          }
        }

        // Run movements and boundaries
        ServerPhysics.updatePlayerPhysics(p, input, this.ball, (sfx) => this.soundEffects.push(sfx));
        ServerPhysics.applyBoostPads(p, this.w, this.h, () => this.soundEffects.push('dribble'));
        ServerPhysics.applyLimits(p, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, this.w, this.h);
      }

      // Collisions and ball movement
      ServerPhysics.resolvePlayerPlayer(this.players);
      ServerPhysics.resolvePlayerBall(this.players, this.ball, (p) => {
        // Success criteria check for tackles
        for (const pl of this.players) {
          if (pl.tackleEval > 0 && this.ball.owner === pl.id) pl.tackleSuccess = true;
        }
      });

      // Apply Boost Pads to ball
      ServerPhysics.applyBoostPads(this.ball, this.w, this.h, () => this.soundEffects.push('power'));

      ServerPhysics.updateBallPhysics(
        this.ball, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, this.players,
        (sfx) => this.soundEffects.push(sfx),
        (side, scorerId) => this.triggerGoal(side, scorerId),
        this.w, this.h
      );

      this.recordFrame();
    }

    // Broadcast current snapshot to all users in room
    const snap = {
      ball: {
        x: this.ball.x,
        y: this.ball.y,
        vx: this.ball.vx,
        vy: this.ball.vy,
        owner: this.ball.owner
      },
      players: this.players.map(p => ({
        id: p.id,
        team: p.team,
        x: p.x,
        y: p.y,
        dir: p.dir,
        stamina: p.stamina,
        staminaLock: p.staminaLock,
        stun: p.stun,
        shootHalo: p.shootHalo,
        invuln: p.invuln,
        badge: p.badge,
        name: p.name
      })),
      score: this.score,
      matchTime: this.matchTime,
      status: this.status,
      countdown: Math.max(0, Math.ceil(this.countdownTimer / 60)),
      soundEffects: this.soundEffects
    };

    this.io.to(this.roomCode).emit('gameState', snap);
  }

  changeFieldSize(size) {
    this.fieldSize = size;
    if (this.fieldSize === 'small') {
      this.w = 896; this.h = 560;
    } else if (this.fieldSize === 'large') {
      this.w = 1280; this.h = 768;
    } else {
      this.w = 1024; this.h = 640;
    }
    // Re-create physics boundaries
    this.physics = new ServerPhysics(this.w, this.h);
    // Center the ball
    this.ball.x = this.w / 2;
    this.ball.y = this.h / 2;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  resetMatch() {
    this.score = { red: 0, blue: 0 };
    this.matchTime = this.duration * 60;
    this.status = 'countdown';
    this.countdownTimer = 150;
    // Center the ball
    this.ball.x = this.w / 2;
    this.ball.y = this.h / 2;
    this.ball.vx = 0;
    this.ball.vy = 0;
  }

  stop() {
    clearInterval(this.tickInterval);
  }
}
