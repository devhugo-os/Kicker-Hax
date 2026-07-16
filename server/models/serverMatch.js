// Kicker Hax - Server-side Match Model
import * as C from '../../shared/constants.js';
import { createRealtimeTicker } from '../../shared/realtimeTicker.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { ServerPhysics } from './serverPhysics.js';

export class ServerMatch {
  constructor(roomCode, duration, goalLimit, players, io, onMatchEnd, fieldSize = 'medium', options = {}) {
    this.roomCode = roomCode;
    this.duration = duration;
    this.goalLimit = goalLimit;
    this.io = io;
    this.onMatchEnd = onMatchEnd;
    this.fieldSize = fieldSize;
    this.competitive = !!options.competitive;
    this.matchId = options.matchId || `${roomCode}-${Date.now()}-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2, 10)}`;
    this.startedAt = null;
    this.allowCasualForfeit = !!options.allowCasualForfeit;
    this.onlineGoalFreezeFrames = Math.min(C.GOAL_FREEZE_FRAMES, options.goalFreezeFrames || C.GOAL_FREEZE_FRAMES);
    this.onlineReplaySlowmoFactor = options.replaySlowmoFactor || C.REPLAY_SLOWMO_FACTOR;
    this.onlineReplayCaptureStride = 3;

    if (this.fieldSize === 'small') {
      this.w = 896; this.h = 560;
    } else if (this.fieldSize === 'large') {
      this.w = 1280; this.h = 768;
    } else {
      this.w = 1024; this.h = 640;
    }

    this.score = { red: 0, blue: 0 };
    this.matchTime = duration * 60;
    this.status = 'loading'; // 'loading' | 'countdown' | 'playing' | 'freeze' | 'replay' | 'end-freeze' | 'ended'
    this.countdownTimer = 0;
    this.phaseEndsAt = 0;
    this.readyPlayerIds = new Set();
    this.goalFreezeTimer = 0;
    this.endFreezeTimer = 0;
    this.isHostPaused = false;
    this.pauseTicks = 0;
    this.forfeitWinnerTeam = null;
    this.disconnectPauseUntil = 0;
    this.disconnectTeam = null;
    this.disconnectUid = null;
    this.disconnectedUids = new Set();
    this.disconnectedNames = new Map();
    this.disconnectVoting = false;
    this.onGuestConnectionLost = options.onGuestConnectionLost || null;
    this.hostPlayerId = options.hostPlayerId || null;

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
    this.hasBots = this.players.some(p => p.cpu);

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
    this.replayBuffer = new Array(C.REPLAY_CAPTURE_FRAMES);
    this.replayBufferIndex = 0;
    this.lastGoal = null;
    this.replayVotes = new Set();
    this.playerStats = new Map();
    this.lastTrackedTouchId = null;
    this.assistCandidateId = null;
    this.assistRecipientId = null;
    this.assistShotCount = 0;
    this.resetPlayerStats();

    // The P2P host remains authoritative even while its tab is hidden. The
    // worker-backed clock avoids Chrome's severe background timer clamp.
    this.lastScheduledTickAt = Date.now();
    this.lastBroadcastAt = 0;
    this.snapshotSequence = 0;
    this.tickScheduler = createRealtimeTicker(timestamp => this.runScheduledTick(timestamp));

    // Initial kickoff setup
    this.kickoff();
  }

  resetPlayerStats() {
    this.playerStats.clear();
    this.players.forEach(p => {
      if (!p.cpu && p.uid) {
        this.playerStats.set(p.id, {
          uid: p.uid,
          username: p.name,
          team: p.team,
          goals: 0,
          assists: 0,
          ownGoals: 0,
          shots: 0,
          dribbles: 0,
          tackles: 0,
          possessionFrames: 0
        });
      }
    });
  }

  syncPlayersFromLobby(lobbyPlayers, options = {}) {
    if (options.allowCasualForfeit !== undefined) {
      this.allowCasualForfeit = !!options.allowCasualForfeit;
    }
    const activePlayers = lobbyPlayers.filter(p => p.team !== 'spectator');
    const activeIds = new Set(activePlayers.map(p => p.id));
    this.players = this.players.filter(p => activeIds.has(p.id));

    activePlayers.forEach(lobbyPlayer => {
      const team = lobbyPlayer.team === 'red' ? C.Team.RED : C.Team.BLUE;
      const existing = this.players.find(p => p.id === lobbyPlayer.id);
      if (existing) {
        existing.team = team;
        existing.name = lobbyPlayer.username;
        existing.badge = lobbyPlayer.badge;
        existing.skin = lobbyPlayer.skin || '';
        existing.staffRole = lobbyPlayer.staffRole || '';
        existing.cpu = !!lobbyPlayer.cpu;
        existing.difficulty = lobbyPlayer.difficulty || C.Difficulty.MEDIUM;
      } else {
        this.players.push(this.createPhysicalPlayer(lobbyPlayer));
      }
    });

    this.inputs.clear();
    this.players.forEach(p => {
      if (!p.cpu) {
        this.inputs.set(p.id, { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false });
      }
    });
    this.hasBots = this.players.some(p => p.cpu);
    const previousStats = this.playerStats;
    this.resetPlayerStats();
    this.playerStats.forEach((stats, id) => {
      const previous = previousStats.get(id);
      if (previous) {
        stats.goals = previous.goals || 0;
        stats.assists = previous.assists || 0;
        stats.ownGoals = previous.ownGoals || 0;
        stats.shots = previous.shots || 0;
        stats.dribbles = previous.dribbles || 0;
        stats.tackles = previous.tackles || 0;
        stats.possessionFrames = previous.possessionFrames || 0;
      }
    });
    // Keep the report entry of anyone who actually participated even if that
    // player disconnected and the remaining team voted to continue.
    previousStats.forEach((stats, id) => {
      if (!this.playerStats.has(id)) this.playerStats.set(id, { ...stats });
    });
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
      skin: lobbyPlayer.skin || '',
      staffRole: lobbyPlayer.staffRole || '',
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
      tackleImpactReady: false,
      shootHalo: 0,
      aiShootLock: 0,
      aiFeintLock: 0,
      aiStyle: lobbyPlayer.cpu ? {
        lane: Math.random() < 0.5 ? -1 : 1,
        aggression: 0.82 + Math.random() * 0.28,
        escapeBias: 0.65 + Math.random() * 0.22
      } : null,
      // Inputs arrive continuously from guests. This timestamp is a fallback
      // for WebViews that close without delivering the PeerJS close event.
      lastSeenAt: Date.now(),
      home: { x: startX, y: startY }
    };
  }

  updateInput(socketId, inputData) {
    if (this.inputs.has(socketId)) {
      this.touchPlayer(socketId);
      this.inputs.set(socketId, {
        x: ServerPhysics.clamp(inputData.x || 0, -1, 1),
        y: ServerPhysics.clamp(inputData.y || 0, -1, 1),
        shoot: !!inputData.shoot,
        sprint: !!inputData.sprint,
        dribble: !!inputData.dribble,
        tackle: !!inputData.tackle,
        power: !!inputData.power,
        mobileTackleAssist: !!inputData.mobileTackleAssist
      });
    }
  }

  setTimedPhase(status, frames) {
    const safeFrames = Math.max(0, Math.ceil(Number(frames) || 0));
    this.status = status;
    this.countdownTimer = safeFrames;
    this.phaseEndsAt = Date.now() + Math.ceil((safeFrames / 60) * 1000);
  }

  /** Starts the shared countdown only after every active player opened the match view. */
  markClientReady(socketId) {
    if (!this.inputs.has(socketId) || this.status !== 'loading') return false;
    this.readyPlayerIds.add(socketId);
    const everyoneReady = [...this.inputs.keys()].every(id => this.readyPlayerIds.has(id));
    if (!everyoneReady) return false;
    this.startedAt = new Date().toISOString();
    this.setTimedPhase('countdown', 180);
    this.soundEffects.push('whistle');
    return true;
  }

  kickoff() {
    const redPlayers = this.players.filter(p => p.team === C.Team.RED);
    const bluePlayers = this.players.filter(p => p.team === C.Team.BLUE);

    const assignPositions = (teamPlayers, isRed) => {
      const positions = [
        { dx: 120, dy: 0.5 },  // Player 1: Goalkeeper/Defender
        { dx: 250, dy: 0.5 },  // Player 2: Striker
        { dx: 180, dy: 0.3 },  // Player 3: Midfielder 1
        { dx: 180, dy: 0.7 }   // Player 4: Midfielder 2
      ];

      teamPlayers.forEach((p, index) => {
        const layout = positions[index % positions.length];
        const jitterX = (Math.random() - 0.5) * 20;
        const jitterY = (Math.random() - 0.5) * 20;

        p.x = isRed ? (C.BORDER + layout.dx + jitterX) : (this.w - C.BORDER - layout.dx + jitterX);
        p.y = this.h * layout.dy + jitterY;
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
        p.tackleImpactReady = false;
        p.shootHalo = 0;
        p.aiShootLock = p.cpu ? 45 : 0;
        p.aiFeintLock = 0;
      });
    };

    assignPositions(redPlayers, true);
    assignPositions(bluePlayers, false);

    // Reset ball kickoff
    this.ball.x = this.w * 0.5;
    this.ball.y = this.h * 0.5;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.owner = null;
    this.ball.lastTouch = null;
    this.ball.strikeTimer = 0;
    this.ball.lastStrikeType = null;
    this.ball.noPickupFrames = 0;
    this.ball.noPickupFrom = null;
    this.lastTrackedTouchId = null;
    this.assistCandidateId = null;
    this.assistRecipientId = null;
    this.assistShotCount = 0;

    this.soundEffects.push('whistle');
  }

  recordFrame() {
    const snap = this.players.map(p => ({
      id: p.id,
      x: p.x,
      y: p.y,
      dir: p.dir,
      team: p.team,
      has: (this.ball.owner === p.id),
      name: p.name || '',
      badge: p.badge || '',
      staffRole: p.staffRole || '',
      inv: p.invuln || 0,
      stun: p.stun || 0,
      halo: p.shootHalo || 0
    }));

    const frame = {
      ball: {
        x: this.ball.x,
        y: this.ball.y,
        vx: this.ball.vx,
        vy: this.ball.vy,
        lastStrikeType: this.ball.lastStrikeType,
        strikeTimer: this.ball.strikeTimer
      },
      players: snap,
      score: { ...this.score },
      sfx: [...this.soundEffects]
    };

    this.replayBuffer[this.replayBufferIndex] = frame;
    this.replayBufferIndex = (this.replayBufferIndex + 1) % this.replayBuffer.length;
  }

  getReplayQueue(stride = 1) {
    const list = [];
    for (let i = 0; i < this.replayBuffer.length; i++) {
      const idx = (this.replayBufferIndex + i) % this.replayBuffer.length;
      if (this.replayBuffer[idx]) list.push(this.replayBuffer[idx]);
    }
    const safeStride = Math.max(1, Math.floor(stride));
    if (safeStride === 1) return list;
    // Keep the final goal frame while reducing the reliable WebRTC payload.
    const offset = Math.max(0, (list.length - 1) % safeStride);
    return list.filter((_, index) => index % safeStride === offset);
  }

  triggerGoal(side, scorerId) {
    if (this.status !== 'playing') return;

    this.status = 'freeze';
    this.goalFreezeTimer = this.onlineGoalFreezeFrames;
    this.phaseEndsAt = Date.now() + Math.ceil((this.goalFreezeTimer / 60) * 1000);

    const scorer = this.players.find(p => p.id === scorerId);
    const scorerName = scorer ? scorer.name : 'Desconhecido';
    const ownGoal = scorer ? (side === 'blue' && scorer.team === C.Team.RED) || (side === 'red' && scorer.team === C.Team.BLUE) : false;

    if (side === 'blue') this.score.blue++; else this.score.red++;

    const scorerStats = this.playerStats.get(scorerId);
    const assistant = !ownGoal && this.assistCandidateId && this.assistCandidateId !== scorerId
      && this.assistRecipientId === scorerId && this.assistShotCount === 1
      ? this.players.find(player => player.id === this.assistCandidateId && player.team === scorer?.team)
      : null;
    if (scorerStats) {
      if (ownGoal) scorerStats.ownGoals++;
      else scorerStats.goals++;
    }
    if (assistant) {
      const assistantStats = this.playerStats.get(assistant.id);
      if (assistantStats) assistantStats.assists = (assistantStats.assists || 0) + 1;
    }

    this.lastGoal = {
      side,
      scorerName,
      scorerId,
      ownGoal,
      assistId: assistant?.id || null,
      assistName: assistant?.name || null
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
                   (!this.ball.owner && (isClosest || distBall > 80));
    }

    const canSprint = wantSprint && p.staminaLock <= 0 && p.stamina > 0.35;

    // AI steer directions
    let targetX = ballFuture.x;
    let targetY = ballFuture.y;

    if (this.ball.owner === p.id) {
      targetX = goalX;
      targetY = ServerPhysics.clamp(p.y, gTop + 20, gBot - 20);
      const nearestOpp = their.reduce((best, curr) => {
        const d = Math.hypot(curr.x - p.x, curr.y - p.y);
        return d < best.d ? { p: curr, d } : best;
      }, { p: null, d: 1e9 });
      const trappedNearWall = p.x < C.BORDER + 65 || p.x > this.w - C.BORDER - 65 || p.y < C.BORDER + 65 || p.y > this.h - C.BORDER - 65;
      if (trappedNearWall || nearestOpp.d < 86) {
        const awayY = nearestOpp.p ? p.y + Math.sign(p.y - nearestOpp.p.y || (this.h / 2 - p.y)) * 150 : this.h / 2;
        targetY = ServerPhysics.clamp(awayY, C.BORDER + 55, this.h - C.BORDER - 55);
        targetX = p.team === C.Team.RED
          ? Math.max(p.x + 120, C.BORDER + 110)
          : Math.min(p.x - 120, this.w - C.BORDER - 110);
      }
    } else if (this.ball.owner && this.players.find(x => x.id === this.ball.owner).team !== p.team) {
      const owner = this.players.find(x => x.id === this.ball.owner);
      const d = Math.hypot(owner.x - p.x, owner.y - p.y);
      if (d > 200) {
        // Defensive positional marking: stay between the ball owner and our goal
        const defGoalX = p.team === C.Team.RED ? C.BORDER : this.w - C.BORDER;
        targetX = defGoalX + (owner.x - defGoalX) * 0.7;
        targetY = (this.h * 0.5) + (owner.y - this.h * 0.5) * 0.7;
      } else {
        // Close combat: go straight for the ball owner to tackle
        targetX = owner.x;
        targetY = owner.y;
      }
    }

    // Corner escape takes priority over chasing the ball. Without a dedicated
    // inward target the normal attraction and wall repulsion can cancel out
    // while a human stands between the bot and the field.
    const escapeMargin = C.BORDER + 96;
    const trappedAtWall = p.x < escapeMargin || p.x > this.w - escapeMargin || p.y < escapeMargin || p.y > this.h - escapeMargin;
    if (trappedAtWall) {
      targetX = p.x < escapeMargin ? C.BORDER + 190 : (p.x > this.w - escapeMargin ? this.w - C.BORDER - 190 : p.x);
      targetY = p.y < escapeMargin
        ? this.h * (p.aiStyle?.escapeBias || 0.72)
        : (p.y > this.h - escapeMargin ? this.h * (1 - (p.aiStyle?.escapeBias || 0.72)) : p.y);
      // A bot holding the ball also uses dribble later in this frame to break
      // a body block instead of repeatedly walking into the same wall.
    }

    // Calculate vectors
    let dx = targetX - p.x;
    let dy = targetY - p.y;
    let L = Math.hypot(dx, dy) || 1;
    let ax = dx / L;
    let ay = dy / L;

    // Avoid opponents pressure
    let rx = 0, ry = 0;
    for (const e of their) {
      const ex = p.x - e.x;
      const ey = p.y - e.y;
      const d = Math.hypot(ex, ey);
      const radius = p.difficulty === C.Difficulty.HARD ? 120 : 72;
      if (d < radius) {
        const w = (radius - d) / radius;
        const strength = p.difficulty === C.Difficulty.HARD ? 0.75 : 0.45;
        rx += (ex / (d || 1)) * w * strength;
        ry += (ey / (d || 1)) * w * strength;
      }
    }

    // Steer the bot back to open grass before a corner can trap it.
    const wallPad = C.BORDER + 64;
    if (p.x < wallPad) rx += (wallPad - p.x) / wallPad * 1.8;
    if (p.x > this.w - wallPad) rx -= (p.x - (this.w - wallPad)) / wallPad * 1.8;
    if (p.y < wallPad) ry += (wallPad - p.y) / wallPad * 1.8;
    if (p.y > this.h - wallPad) ry -= (p.y - (this.h - wallPad)) / wallPad * 1.8;

    let inputX = ax + rx;
    let inputY = ay + ry;
    const inputL = Math.hypot(inputX, inputY) || 1;
    inputX /= inputL;
    inputY /= inputL;

    // Human mistakes (difficulty factor)
    let errFactor = 0;
    if (p.difficulty === C.Difficulty.EASY) errFactor = 0.16;
    else if (p.difficulty === C.Difficulty.MEDIUM) errFactor = 0.035;

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

      const facingGoal = Math.abs(ServerPhysics.normalizedAngle((p.team === C.Team.RED ? 0 : Math.PI) - (p.dir || 0))) < 1.35;
      if (p.aiShootLock <= 0 && mouth && facingGoal && distToGoal < 230) {
        shoot = true;
      }

      const nearestOpp = their.reduce((best, curr) => {
        const d = Math.hypot(curr.x - p.x, curr.y - p.y);
        return d < best.d ? { p: curr, d } : best;
      }, { p: null, d: 1e9 });
      const trappedNearWall = p.x < C.BORDER + 65 || p.x > this.w - C.BORDER - 65 || p.y < C.BORDER + 65 || p.y > this.h - C.BORDER - 65;

      if ((p.difficulty !== C.Difficulty.EASY || trappedNearWall) && nearestOpp.d < 118 && p.dribble_cd <= 0 && p.stamina >= C.DRIBBLE_STAM_COST) {
        dribble = true;
      }
      if (p.aiShootLock <= 0 && p.power_cd <= 0 && p.stamina > 0.65 && trappedNearWall && nearestOpp.d < 110) {
        power = true;
      }
    } else if (this.ball.owner && this.players.find(x => x.id === this.ball.owner).team !== p.team) {
      // Tackle logic
      const owner = this.players.find(x => x.id === this.ball.owner);
      const d = Math.hypot(owner.x - p.x, owner.y - p.y);
      // Give medium bots enough room to complete the tackle dash instead of
      // waiting until they are already behind the ball carrier.
      if (d < C.TACKLE_RANGE * 1.15 && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST && p.difficulty !== C.Difficulty.EASY) {
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
    if (this.disconnectPauseUntil) {
      const remaining = Math.max(0, this.disconnectPauseUntil - Date.now());
      if (remaining <= 0) {
        if (this.disconnectVoting) {
          // The team declined (or did not reach a majority in) the final
          // vote, so the opposite side receives the W.O.
          const disconnectedTeam = this.disconnectTeam;
          this.clearDisconnectPause();
          this.forfeitAgainstTeam(disconnectedTeam);
        } else {
          // The reconnection window ended. A remaining teammate gets one
          // short vote instead of an endless reconnect loop.
          this.startContinueVoteOrForfeit();
        }
        return;
      } else {
        this.emitDisconnectPauseState(remaining);
        return;
      }
    }

    if (this.resolveForfeitIfNeeded()) {
      return;
    }

    // PeerJS close is not reliable when Android terminates a WebView. Detect
    // a silent guest by the missing input heartbeat before simulating a frame.
    const staleGuest = this.players.find(player => !player.cpu
      && player.id !== this.hostPlayerId
      && Date.now() - (player.lastSeenAt || 0) > 8000);
    if (staleGuest && this.status !== 'ended') {
      this.onGuestConnectionLost?.(staleGuest);
      this.pauseForDisconnectedTeam(staleGuest.team, staleGuest.uid, staleGuest.name);
      this.emitDisconnectPauseState(Math.max(0, this.disconnectPauseUntil - Date.now()));
      return;
    }

    if (this.isHostPaused) {
      this.pauseTicks = (this.pauseTicks || 0) + 1;
      if (this.pauseTicks >= 1800) { // 30s at 60Hz
        this.isHostPaused = false;
        this.pauseTicks = 0;
      }
      // Just broadcast state with isHostPaused=true, do not simulate physics
      const snap = {
        ball: {
          x: this.ball.x,
          y: this.ball.y,
          vx: this.ball.vx,
          vy: this.ball.vy,
          owner: this.ball.owner,
          lastTouch: this.ball.lastTouch
        },
        players: this.players.map(p => ({
          id: p.id,
          team: p.team,
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          dir: p.dir,
          stamina: p.stamina,
          staminaLock: p.staminaLock,
          stun: p.stun,
          shootHalo: p.shootHalo,
          kickCharge: p.kickCharge || 0,
          invuln: p.invuln,
          tackle_cd: p.tackle_cd,
          dribble_cd: p.dribble_cd,
          power_cd: p.power_cd
        })),
        score: this.score,
        matchTime: this.matchTime,
        status: this.status,
        countdown: Math.max(0, Math.ceil(this.countdownTimer / 60)),
        phaseEndsAt: this.phaseEndsAt,
        goalInfo: this.lastGoal,
        soundEffects: [],
        isHostPaused: true
      };
      this.io.to(this.roomCode).emit('gameState', snap);
      return;
    }

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
        this.phaseEndsAt = 0;
      }
    } else if (this.status === 'freeze') {
      this.goalFreezeTimer--;
      if (this.goalFreezeTimer <= 0) {
        const replayFrames = this.getReplayQueue(this.onlineReplayCaptureStride);
        const replayStartAt = Date.now() + C.REPLAY_SYNC_LEAD_MS;
        this.replayVotes = new Set();
        // Send replay buffer to all clients
        this.io.to(this.roomCode).emit('playReplay', {
          replayFrames,
          goalInfo: this.lastGoal,
          replayStartAt,
          replayDelayMs: C.REPLAY_SYNC_LEAD_MS,
          replayFrameMs: (1000 / 60) * this.onlineReplayCaptureStride * this.onlineReplaySlowmoFactor
        });
        this.status = 'replay';
        // Keep the authoritative match paused while clients play the slow-motion replay.
        this.countdownTimer = Math.ceil(
          (C.REPLAY_SYNC_LEAD_MS / (1000 / 60))
          + (replayFrames.length * this.onlineReplayCaptureStride * this.onlineReplaySlowmoFactor)
        );
        this.phaseEndsAt = replayStartAt + Math.ceil(replayFrames.length * (1000 / 60)
          * this.onlineReplayCaptureStride * this.onlineReplaySlowmoFactor);
      }
    } else if (this.status === 'replay') {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        const goalTotal = this.score.red >= this.goalLimit || this.score.blue >= this.goalLimit;
        if (goalTotal && this.goalLimit > 0) {
          this.status = 'end-freeze';
          this.endFreezeTimer = C.END_FREEZE_FRAMES;
        } else {
          this.setTimedPhase('countdown', C.RESTART_COUNTDOWN_FRAMES);
          this.kickoff();
        }
      }
    } else if (this.status === 'end-freeze') {
      this.endFreezeTimer--;
      if (this.endFreezeTimer <= 0) {
        this.status = 'ended';
        this.onMatchEnd(this.buildMatchResult());
        this.stopTicker();
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
          if (input.tackle && this.ball.owner !== p.id && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST) {
            const stats = this.playerStats.get(p.id);
            if (stats) stats.tackles++;
            p.stamina = Math.max(0, p.stamina - C.TACKLE_STAM_COST);
            p.tackle_cd = C.TACKLE_CD;
            p.tackleSuccess = false;
            p.tackleEval = C.TACKLE_DASH_FRAMES;
            p.tackleImpactReady = false;
            p.slowTimer = C.TACKLE_SLOW_TIME;
            p.tackleFreeze = 8;
            this.soundEffects.push('tackle');

            // Apply lunge impulse
            const ballOwnerPlayer = this.players.find(x => x.id === this.ball.owner);
            const ang = ballOwnerPlayer ? Math.atan2(ballOwnerPlayer.y - p.y, ballOwnerPlayer.x - p.x) : p.dir;
            p.vx += Math.cos(ang) * C.TACKLE_LUNGE;
            p.vy += Math.sin(ang) * C.TACKLE_LUNGE;
          }

          // Dribble
          if (input.dribble && p.dribble_cd <= 0 && this.ball.owner === p.id && p.stamina >= C.DRIBBLE_STAM_COST) {
            const stats = this.playerStats.get(p.id);
            if (stats) stats.dribbles++;
            p.stamina = Math.max(0, p.stamina - C.DRIBBLE_STAM_COST);
            p.dash_time = C.DRIBBLE_TIME;
            p.invuln = C.DRIBBLE_INVULN;
            p.dribble_cd = C.DRIBBLE_CD;
            p.vx += Math.cos(p.dir) * C.DRIBBLE_DASH;
            p.vy += Math.sin(p.dir) * C.DRIBBLE_DASH;
            this.soundEffects.push('dribble');
          }

          // Power Kick
          if (input.power && p.power_cd <= 0 && p.stamina >= 0.50 && this.ball.owner === p.id) {
            const stats = this.playerStats.get(p.id);
            if (stats) stats.shots++;
            p.stamina = Math.max(0, p.stamina - 0.50);
            if (p.stamina === 0) {
              p.staminaLock = C.STAMINA_LOCK_FRAMES;
            }
            p.power_cd = C.POWER_KICK_CD;
            p.cool = 12;
            p.shootHalo = 22;

            const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
            this.registerAssistShot(p.id);
            ServerPhysics.powerKick(p, this.ball, ang, C.POWER_KICK_POWER);
            this.soundEffects.push('power');
          }

          // Regular Shoot Release
          if (p.kickCharge > 0 && !input.shoot) {
            if (this.ball.owner === p.id) {
              const charge = ServerPhysics.clamp(p.kickCharge, 0, 1);
              p.cool = 14;
              p.shootHalo = 18;
              const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
              const pow = Math.max(C.KICK_BASE, C.KICK_BASE + C.KICK_CHARGE * charge);
              const stats = this.playerStats.get(p.id);
              if (stats) stats.shots++;
              this.registerAssistShot(p.id);
              ServerPhysics.kickBall(p, this.ball, ang, pow);
              this.soundEffects.push('kick');
            }
            p.kickCharge = 0;
          }
        }

        // Run movements and boundaries
        ServerPhysics.updatePlayerPhysics(p, input, this.ball, (sfx) => this.soundEffects.push(sfx));
        ServerPhysics.applyLimits(p, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, this.w, this.h);
      }

      // Resolve a completed tackle before normal player separation. This is the
      // only point where a dash may affect the ball holder.
      this.resolveActiveTackleImpacts();

      // Collisions and ball movement
      ServerPhysics.resolvePlayerPlayer(this.players);
      ServerPhysics.resolvePlayerBall(this.players, this.ball, () => this.soundEffects.push('pickup'));
      this.trackAssistCandidate();

      // Update ball physics

      ServerPhysics.updateBallPhysics(
        this.ball, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, this.players,
        (sfx) => this.soundEffects.push(sfx),
        (side, scorerId) => this.triggerGoal(side, scorerId),
        this.w, this.h
      );

      const possessionId = this.ball.owner || this.ball.lastTouch;
      if (possessionId) {
        const stats = this.playerStats.get(possessionId);
        if (stats) stats.possessionFrames = (stats.possessionFrames || 0) + 1;
      }

      this.recordFrame();
    }

    if (this.skipBroadcast) return;

    // Broadcast current snapshot to all users in room
    const sequence = ++this.snapshotSequence;
    const includeExtendedState = sequence === 1 || sequence % 10 === 0;
    const snap = {
      sequence,
      serverSentAt: Date.now(),
      ball: {
        x: this.ball.x,
        y: this.ball.y,
        vx: this.ball.vx,
        vy: this.ball.vy,
        owner: this.ball.owner,
        lastTouch: this.ball.lastTouch,
        lastStrikeType: this.ball.lastStrikeType,
        strikeTimer: this.ball.strikeTimer
      },
      players: this.players.map(p => {
        const state = {
          id: p.id,
          team: p.team,
          x: p.x,
          y: p.y,
          vx: p.vx,
          vy: p.vy,
          dir: p.dir,
          stamina: p.stamina,
          staminaLock: p.staminaLock,
          stun: p.stun,
          shootHalo: p.shootHalo,
          kickCharge: p.kickCharge || 0,
          invuln: p.invuln,
          tackle_cd: p.tackle_cd,
          dribble_cd: p.dribble_cd,
          power_cd: p.power_cd
        };
        // Live statistics and identity do not change at rendering frequency.
        // Sending them near 3 Hz keeps the HUD current and normal states small.
        if (includeExtendedState) {
          state.matchStats = this.playerStats.get(p.id) ? { ...this.playerStats.get(p.id) } : null;
          state.badge = p.badge;
          state.name = p.name;
          state.staffRole = p.staffRole || '';
        }
        return state;
      }),
      score: this.score,
      matchTime: this.matchTime,
      status: this.status,
      countdown: Math.max(0, Math.ceil(this.countdownTimer / 60)),
      phaseEndsAt: this.phaseEndsAt,
      goalInfo: this.lastGoal,
      soundEffects: this.soundEffects,
      isHostPaused: this.isHostPaused
    };

    this.io.to(this.roomCode).emit('gameState', snap);
    // Effects remain queued across catch-up frames and are consumed only
    // after an actual network snapshot, preventing lost goal/tackle sounds.
    this.soundEffects = [];
  }

  trackAssistCandidate() {
    const currentTouchId = this.ball.owner || this.ball.lastTouch;
    if (!currentTouchId || currentTouchId === this.lastTrackedTouchId) return;
    const previous = this.players.find(player => player.id === this.lastTrackedTouchId);
    const current = this.players.find(player => player.id === currentTouchId);
    const isTeamPass = previous && current && previous.id !== current.id && previous.team === current.team;
    this.assistCandidateId = isTeamPass ? previous.id : null;
    this.assistRecipientId = isTeamPass ? current.id : null;
    this.assistShotCount = 0;
    this.lastTrackedTouchId = currentTouchId;
  }

  registerAssistShot(playerId) {
    if (!this.assistCandidateId) return;
    if (playerId !== this.assistRecipientId || this.assistShotCount >= 1) {
      this.assistCandidateId = null;
      this.assistRecipientId = null;
      this.assistShotCount = 0;
      return;
    }
    this.assistShotCount = 1;
  }

  runScheduledTick(timestamp = Date.now()) {
    const now = Number(timestamp) || Date.now();
    const elapsed = Math.max(0, now - this.lastScheduledTickAt);
    // A suspended host tab can report a large elapsed interval at once. Never
    // replay that backlog in a burst: it causes remote players to teleport and
    // floods the WebRTC state channel. The worker normally keeps this at 1.
    const frames = Math.min(6, Math.max(1, Math.round(elapsed / (1000 / 60))));
    this.lastScheduledTickAt = now;
    for (let frame = 0; frame < frames; frame++) {
      // Physics remains at 60 Hz. Velocity-aware rendering fills the gap
      // between 30 Hz snapshots while the lower cadence leaves headroom for
      // remote/mobile WebRTC links and rooms with several spectators.
      const finalFrame = frame === frames - 1;
      this.skipBroadcast = !finalFrame || now - this.lastBroadcastAt < 33;
      this.tick();
      if (!this.skipBroadcast) this.lastBroadcastAt = now;
      if (this.status === 'ended') break;
    }
    this.skipBroadcast = false;
  }

  touchPlayer(socketId) {
    const player = this.players.find(item => item.id === socketId);
    if (player) player.lastSeenAt = Date.now();
  }

  pauseForDisconnectedTeam(team, uid = null, username = 'Jogador', options = {}) {
    if (this.status === 'ended' || team === undefined || team === null) return false;
    // Several players from the same side may disappear together. Keep one
    // shared pause and aggregate their names instead of restarting its timer.
    if (this.disconnectPauseUntil) {
      if (team !== this.disconnectTeam || !uid || this.disconnectVoting) return false;
      this.disconnectedUids.add(uid);
      this.disconnectedNames.set(uid, username || 'Jogador');
      return true;
    }
    this.disconnectTeam = team;
    this.disconnectUid = uid;
    if (uid) this.disconnectedUids.add(uid);
    if (uid) this.disconnectedNames.set(uid, username || 'Jogador');
    this.disconnectUsername = username || 'Jogador';
    this.disconnectVotes = new Set();
    // A manual host pause must never survive or mask a reconnection pause.
    this.isHostPaused = false;
    this.pauseTicks = 0;
    this.disconnectAllowsRejoin = options.allowRejoin !== false;
    this.disconnectPauseUntil = Date.now() + (options.timeoutMs || 90000);
    return true;
  }

  stopTicker() {
    this.tickScheduler?.stop();
    this.tickScheduler = null;
  }

  /** Moves an expired reconnection pause to the team's final 30 second vote. */
  startContinueVoteOrForfeit() {
    const missing = this.disconnectedUids.size ? this.disconnectedUids : new Set([this.disconnectUid].filter(Boolean));
    const eligible = this.players.filter(player => !player.cpu && player.team === this.disconnectTeam && !missing.has(player.uid));
    if (eligible.length === 0) {
      const team = this.disconnectTeam;
      this.clearDisconnectPause();
      return this.forfeitAgainstTeam(team);
    }
    this.disconnectVoting = true;
    this.disconnectAllowsRejoin = false;
    this.disconnectVotes = new Set();
    this.disconnectPauseUntil = Date.now() + 30000;
    return true;
  }

  /** Converts an active reconnect reservation directly into the final vote. */
  forceContinueVote(uid, username = 'Jogador') {
    if (!this.disconnectPauseUntil || this.disconnectVoting || !uid) return false;
    this.disconnectedUids.add(uid);
    this.disconnectedNames.set(uid, username);
    return this.startContinueVoteOrForfeit();
  }

  clearDisconnectPause() {
    this.disconnectPauseUntil = 0;
    this.disconnectTeam = null;
    this.disconnectUid = null;
    this.disconnectUsername = null;
    this.disconnectedUids.clear();
    this.disconnectedNames.clear();
    this.disconnectVotes = new Set();
    this.disconnectAllowsRejoin = true;
    this.disconnectVoting = false;
  }

  /** Rebinds physics and input ownership after a guest reconnects. */
  reconnectPlayer(previousId, nextId, lobbyPlayer) {
    const player = this.players.find(item => item.id === previousId);
    if (!player) return false;
    player.id = nextId;
    player.uid = lobbyPlayer.uid || player.uid;
    player.name = lobbyPlayer.username || player.name;
    player.badge = lobbyPlayer.badge || player.badge;
    player.lastSeenAt = Date.now();
    if (this.ball.owner === previousId) this.ball.owner = nextId;
    if (this.ball.lastTouch === previousId) this.ball.lastTouch = nextId;
    if (this.ball.noPickupFrom === previousId) this.ball.noPickupFrom = nextId;
    const input = this.inputs.get(previousId);
    this.inputs.delete(previousId);
    this.inputs.set(nextId, input || { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false });
    const stats = this.playerStats.get(previousId);
    this.playerStats.delete(previousId);
    if (stats) this.playerStats.set(nextId, stats);
    return true;
  }

  resumeAfterReconnect(uid) {
    if (!this.disconnectPauseUntil || !this.disconnectAllowsRejoin || !uid || !this.disconnectedUids.has(uid)) return false;
    this.disconnectedUids.delete(uid);
    this.disconnectedNames.delete(uid);
    if (this.disconnectedUids.size > 0) return true;
    this.clearDisconnectPause();
    return true;
  }

  /** Lets the disconnected player's own team resume with a majority vote. */
  voteContinueWithoutDisconnected(voterId) {
    if (!this.disconnectPauseUntil || !this.disconnectVoting || !this.disconnectUid) return { accepted: false };
    const voter = this.players.find(player => player.id === voterId);
    if (!voter || voter.team !== this.disconnectTeam || voter.uid === this.disconnectUid) return { accepted: false };
    const eligible = this.players.filter(player => !player.cpu && player.team === this.disconnectTeam && !this.disconnectedUids.has(player.uid));
    if (!eligible.some(player => player.id === voterId)) return { accepted: false };
    this.disconnectVotes.add(voterId);
    const required = Math.floor(eligible.length / 2) + 1;
    return { accepted: true, passed: this.disconnectVotes.size >= required, votes: this.disconnectVotes.size, required };
  }

  continueWithoutDisconnected() {
    if (!this.disconnectUid) return false;
    const missing = new Set(this.disconnectedUids);
    const team = this.disconnectTeam;
    const removed = this.players.filter(item => missing.has(item.uid));
    if (!removed.length) return false;
    this.players = this.players.filter(item => !missing.has(item.uid));
    removed.forEach(player => {
      this.inputs.delete(player.id);
      if (this.ball.owner === player.id) this.ball.owner = null;
      if (this.ball.lastTouch === player.id) this.ball.lastTouch = null;
    });
    this.clearDisconnectPause();
    if (!this.players.some(item => item.team === team)) return this.forfeitAgainstTeam(team);
    return true;
  }

  emitDisconnectPauseState(remaining) {
    this.io.to(this.roomCode).emit('gameState', {
      ball: { ...this.ball },
      players: this.players.map(p => ({
        id: p.id, team: p.team, x: p.x, y: p.y, vx: 0, vy: 0, dir: p.dir,
        stamina: p.stamina, staminaLock: p.staminaLock, stun: p.stun,
        shootHalo: p.shootHalo, kickCharge: p.kickCharge || 0, invuln: p.invuln,
        tackle_cd: p.tackle_cd, dribble_cd: p.dribble_cd, power_cd: p.power_cd,
        badge: p.badge, name: p.name, staffRole: p.staffRole || ''
      })),
      score: this.score,
      matchTime: this.matchTime,
      status: this.status,
      countdown: Math.max(0, Math.ceil(this.countdownTimer / 60)),
      phaseEndsAt: this.phaseEndsAt,
      goalInfo: this.lastGoal,
      soundEffects: [],
      isHostPaused: false,
      isDisconnectPaused: true,
      disconnectPauseRemaining: Math.ceil(remaining / 1000),
      disconnectedPlayerName: [...this.disconnectedNames.values()].join(' e ') || this.disconnectUsername || 'Jogador',
      disconnectTeam: this.disconnectTeam,
      continueVotes: this.disconnectVotes?.size || 0,
      continueVotesRequired: Math.floor(this.players.filter(player => !player.cpu && player.team === this.disconnectTeam && !this.disconnectedUids.has(player.uid)).length / 2) + 1,
      disconnectAllowsRejoin: this.disconnectAllowsRejoin !== false,
      isDisconnectVoting: this.disconnectVoting
    });
  }

  resolveActiveTackleImpacts() {
    for (const tackler of this.players) {
      if (!tackler.tackleImpactReady || tackler.tackleSuccess) continue;
      tackler.tackleImpactReady = false;

      const owner = this.players.find(x => x.id === this.ball.owner);
      const canHitOwner = owner
        && owner.id !== tackler.id
        && owner.team !== tackler.team
        && owner.invuln <= 0;
      const impactDist = canHitOwner ? Math.hypot(owner.x - tackler.x, owner.y - tackler.y) : Infinity;
      const contactDistance = canHitOwner ? owner.r + tackler.r + C.TACKLE_CONTACT_TOLERANCE : 0;

      // A missed lunge only stuns the tackler. The opponent and ball remain
      // untouched, which prevents the remote double-stun seen at a distance.
      if (!canHitOwner || impactDist > contactDistance) {
        tackler.vx = 0;
        tackler.vy = 0;
        tackler.stun = Math.max(tackler.stun, C.FAIL_STUN);
        continue;
      }

      const ownerForwardX = Math.cos(owner.dir || 0);
      const ownerForwardY = Math.sin(owner.dir || 0);
      const tacklerFromOwnerX = tackler.x - owner.x;
      const tacklerFromOwnerY = tackler.y - owner.y;
      const approachDot = (ownerForwardX * tacklerFromOwnerX) + (ownerForwardY * tacklerFromOwnerY);

      if (approachDot > -owner.r * 0.35) {
        this.ball.owner = tackler.id;
        this.ball.lastTouch = tackler.id;
        this.ball.noPickupFrames = 10;
        this.ball.noPickupFrom = null;
        this.ball.vx = 0;
        this.ball.vy = 0;
        owner.stun = Math.max(owner.stun, C.TACKLE_STUN);
        owner.vx = 0;
        owner.vy = 0;
      } else {
        const pushAng = Math.atan2(owner.y - tackler.y, owner.x - tackler.x);
        this.ball.owner = null;
        this.ball.lastTouch = owner.id;
        this.ball.noPickupFrames = 18;
        this.ball.noPickupFrom = tackler.id;
        this.ball.vx = Math.cos(pushAng) * 8;
        this.ball.vy = Math.sin(pushAng) * 8;
        owner.stun = Math.max(owner.stun, C.TACKLE_STUN);
        tackler.stun = Math.max(tackler.stun, C.TACKLE_STUN);
        owner.vx = 0;
        owner.vy = 0;
        tackler.vx = 0;
        tackler.vy = 0;
      }
      tackler.tackleSuccess = true;
    }
  }

  buildMatchResult() {
    const totalPossessionFrames = Array.from(this.playerStats.values())
      .reduce((sum, data) => sum + (data.possessionFrames || 0), 0);
    const playerStats = Array.from(this.playerStats.entries()).map(([playerId, data]) => ({
      playerId,
      ...data,
      possessionPct: totalPossessionFrames > 0 ? Math.round(((data.possessionFrames || 0) / totalPossessionFrames) * 100) : 0
    }));
    const hasForfeitWinner = this.forfeitWinnerTeam === C.Team.RED || this.forfeitWinnerTeam === C.Team.BLUE;
    const winnerTeam = hasForfeitWinner ? this.forfeitWinnerTeam : (
      this.score.red === this.score.blue
        ? 'draw'
        : (this.score.blue > this.score.red ? C.Team.BLUE : C.Team.RED)
    );

    const report = buildMatchReport({ score: this.score, winnerTeam, playerStats });
    const mvp = report.playerStats
      .filter(stats => winnerTeam !== 'draw' ? stats.team === winnerTeam : true)
      .sort((a, b) => {
        const ratingA = Number(a.rating || 0);
        const ratingB = Number(b.rating || 0);
        // A stable UID tie-breaker guarantees every client receives the same
        // MVP when players finish with identical match ratings.
        return (ratingB - ratingA) || String(a.uid || a.playerId).localeCompare(String(b.uid || b.playerId));
      })[0] || null;

    return {
      matchId: this.matchId,
      startedAt: this.startedAt,
      endedAt: new Date().toISOString(),
      score: { ...this.score },
      winnerTeam,
      mvp,
      playerStats: report.playerStats,
      teamStats: report.teamStats,
      hasBots: this.hasBots,
      competitive: this.competitive,
      forfeit: hasForfeitWinner
    };
  }

  resolveForfeitIfNeeded() {
    if (this.status === 'ended') return true;
    if (!this.competitive && !this.allowCasualForfeit) return false;
    const redCount = this.players.filter(p => p.team === C.Team.RED).length;
    const blueCount = this.players.filter(p => p.team === C.Team.BLUE).length;
    if (redCount > 0 && blueCount > 0) return false;
    if (redCount === 0 && blueCount === 0) return false;

    return this.finishForfeit(redCount > 0 ? C.Team.RED : C.Team.BLUE);
  }

  /**
   * Ends an online match immediately with a winner. This is deliberately
   * separate from the periodic player-count check because a host disconnect
   * tears down the room before another simulation tick can be guaranteed.
   */
  finishForfeit(winnerTeam) {
    if (this.status === 'ended' || (winnerTeam !== C.Team.RED && winnerTeam !== C.Team.BLUE)) return false;

    this.forfeitWinnerTeam = winnerTeam;
    if (winnerTeam === C.Team.RED && this.score.red <= this.score.blue) {
      this.score.red = this.score.blue + 1;
    }
    if (winnerTeam === C.Team.BLUE && this.score.blue <= this.score.red) {
      this.score.blue = this.score.red + 1;
    }

    this.isHostPaused = false;
    this.pauseTicks = 0;
    this.status = 'ended';
    this.stopTicker();
    this.onMatchEnd(this.buildMatchResult());
    return true;
  }

  /** Gives the opposite side a forfeit victory when a known player leaves. */
  forfeitAgainstTeam(leavingTeam) {
    if (leavingTeam !== C.Team.RED && leavingTeam !== C.Team.BLUE) return false;
    return this.finishForfeit(leavingTeam === C.Team.RED ? C.Team.BLUE : C.Team.RED);
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
    if (this.resetting) return;
    this.resetting = true;
    this.score = { red: 0, blue: 0 };
    this.forfeitWinnerTeam = null;
    this.matchTime = this.duration * 60;
    this.setTimedPhase('countdown', 300);
    this.goalFreezeTimer = 0;
    this.endFreezeTimer = 0;
    this.isHostPaused = false;
    this.clearDisconnectPause();
    this.lastGoal = null;
    this.replayBuffer = new Array(C.REPLAY_CAPTURE_FRAMES);
    this.replayBufferIndex = 0;
    this.resetPlayerStats();
    this.kickoff();
    this.resetting = false;
  }

  addTime(seconds) {
    this.matchTime = Math.max(0, this.matchTime + seconds);
  }

  stop() {
    this.stopTicker();
  }

  skipReplay() {
    if (this.status === 'freeze' || this.status === 'replay') {
      this.goalFreezeTimer = 0;
      this.countdownTimer = 0;
      this.phaseEndsAt = Date.now();
    }
  }

  voteSkipReplay(playerId) {
    if (this.status !== 'replay' || !this.inputs.has(playerId)) return { accepted: false };
    this.replayVotes.add(playerId);
    const totalPlayers = [...this.inputs.keys()].length;
    const votes = this.replayVotes.size;
    const passed = votes > (totalPlayers - votes);
    if (passed) this.skipReplay();
    return { accepted: true, passed, votes, totalPlayers };
  }
}
