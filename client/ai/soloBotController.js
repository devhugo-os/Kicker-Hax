import * as C from '../../shared/constants.js';

const DIFFICULTY_PROFILES = Object.freeze({
  easy: Object.freeze({
    speed: 0.72,
    predictionFrames: 6,
    reactionFrames: 10,
    shotDistance: 185,
    shotChargeFrames: 13,
    aimSpread: 34,
    tackleChance: 0.32,
    pressureRadius: 78,
    sprintStamina: 0.52
  }),
  medium: Object.freeze({
    speed: 0.9,
    predictionFrames: 12,
    reactionFrames: 5,
    shotDistance: 235,
    shotChargeFrames: 20,
    aimSpread: 15,
    tackleChance: 0.74,
    pressureRadius: 112,
    sprintStamina: 0.36
  }),
  hard: Object.freeze({
    speed: 1,
    predictionFrames: 18,
    reactionFrames: 2,
    shotDistance: 275,
    shotChargeFrames: 27,
    aimSpread: 5,
    tackleChance: 0.96,
    pressureRadius: 138,
    sprintStamina: 0.24
  })
});

const EMPTY_INPUT = Object.freeze({
  x: 0,
  y: 0,
  shoot: false,
  sprint: false,
  dribble: false,
  tackle: false,
  power: false,
  requestPass: false
});

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function normalize(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function angleDelta(first, second) {
  let value = (second - first) % (Math.PI * 2);
  if (value > Math.PI) value -= Math.PI * 2;
  if (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function predictLooseBall(ball, frames) {
  let x = Number(ball.x || 0);
  let y = Number(ball.y || 0);
  let vx = Number(ball.vx || 0);
  let vy = Number(ball.vy || 0);
  for (let frame = 0; frame < frames; frame += 1) {
    vx *= C.FRICTION_FIELD;
    vy *= C.FRICTION_FIELD;
    x += vx;
    y += vy;
  }
  return { x, y };
}

function isNearWall(player, width, height, margin = C.BORDER + 76) {
  return player.x < margin
    || player.x > width - margin
    || player.y < margin
    || player.y > height - margin;
}

export function getSoloBotDifficultyProfile(difficulty) {
  return DIFFICULTY_PROFILES[difficulty] || DIFFICULTY_PROFILES.medium;
}

/**
 * Stateful solo opponent. Decisions are deterministic for a supplied random
 * source, which makes wall, finishing and defending behaviour testable.
 */
export class SoloBotController {
  constructor({ difficulty = C.Difficulty.MEDIUM, random = Math.random } = {}) {
    this.random = random;
    this.configure(difficulty);
    this.reset();
  }

  configure(difficulty) {
    this.difficulty = DIFFICULTY_PROFILES[difficulty] ? difficulty : C.Difficulty.MEDIUM;
    this.profile = getSoloBotDifficultyProfile(this.difficulty);
  }

  reset() {
    this.frame = 0;
    this.lastX = null;
    this.lastY = null;
    this.stuckFrames = 0;
    this.escapeFrames = 0;
    this.escapeSide = this.random() < 0.5 ? -1 : 1;
    this.attackLane = this.random() < 0.5 ? -1 : 1;
    this.laneLockFrames = 0;
    this.shotHoldFrames = 0;
    this.shotReleasePending = false;
    this.shotLockFrames = 50;
    this.tackleRollLock = 0;
    this.aimOffset = 0;
    this.steerX = 0;
    this.steerY = 0;
    this.lastInput = { ...EMPTY_INPUT };
  }

  updateStuckState(bot, opponent, height) {
    const movement = this.lastX === null ? 1 : Math.hypot(bot.x - this.lastX, bot.y - this.lastY);
    const tryingToMove = Math.hypot(this.lastInput.x, this.lastInput.y) > 0.45;
    this.lastX = bot.x;
    this.lastY = bot.y;

    // One escape attempt must keep a single direction. Re-evaluating the
    // collision every few frames used to invert escapeSide while the bot was
    // still pushing through the same block, making it stare left and right.
    if (this.escapeFrames > 0) {
      this.stuckFrames = 0;
      return;
    }
    this.stuckFrames = tryingToMove && movement < 0.11
      ? this.stuckFrames + 1
      : Math.max(0, this.stuckFrames - 3);
    if (this.stuckFrames >= 20) {
      this.stuckFrames = 0;
      this.escapeFrames = 72;
      const opponentDeltaY = Number(opponent?.y || height / 2) - bot.y;
      const upperRoom = bot.y - (C.BORDER + 95);
      const lowerRoom = height - C.BORDER - 95 - bot.y;
      if (Math.abs(opponentDeltaY) > 18) {
        this.escapeSide = opponentDeltaY > 0 ? -1 : 1;
      } else if (Math.abs(lowerRoom - upperRoom) > 20) {
        this.escapeSide = lowerRoom > upperRoom ? 1 : -1;
      }
      this.attackLane = this.escapeSide;
      this.laneLockFrames = 120;
    }
  }

  stabilizeDirection(direction, urgency = 0.34) {
    if (!this.steerX && !this.steerY) {
      this.steerX = direction.x;
      this.steerY = direction.y;
      return direction;
    }
    const blended = normalize(
      this.steerX * (1 - urgency) + direction.x * urgency,
      this.steerY * (1 - urgency) + direction.y * urgency
    );
    this.steerX = blended.x;
    this.steerY = blended.y;
    return blended;
  }

  chooseAttackLane(bot, opponent, height) {
    if (this.laneLockFrames > 0) return;
    const opponentAbove = opponent.y < bot.y;
    this.attackLane = opponentAbove ? 1 : -1;
    if (Math.abs(opponent.y - bot.y) < 12) this.attackLane = this.random() < 0.5 ? -1 : 1;
    this.laneLockFrames = Math.max(32, this.profile.reactionFrames * 8);
    const spread = (this.random() * 2 - 1) * this.profile.aimSpread;
    this.aimOffset = clamp(spread, -height * 0.08, height * 0.08);
  }

  decide({ bot, opponent, ball, width = C.W, height = C.H }) {
    if (!bot || !opponent || !ball || bot.stun > 0) return { ...EMPTY_INPUT };
    this.frame += 1;
    this.shotLockFrames = Math.max(0, this.shotLockFrames - 1);
    this.tackleRollLock = Math.max(0, this.tackleRollLock - 1);
    this.laneLockFrames = Math.max(0, this.laneLockFrames - 1);
    this.escapeFrames = Math.max(0, this.escapeFrames - 1);
    this.updateStuckState(bot, opponent, height);

    const profile = this.profile;
    const goalX = width - C.BORDER + C.POST_T;
    const ownGoalX = C.BORDER - C.POST_T;
    const goalTop = (height - C.GOAL_W_INIT) / 2;
    const goalBottom = (height + C.GOAL_W_INIT) / 2;
    const looseTarget = predictLooseBall(ball, profile.predictionFrames);
    const ownsBall = ball.owner === bot.id;
    const opponentOwnsBall = ball.owner === opponent.id;
    const opponentDistance = Math.hypot(opponent.x - bot.x, opponent.y - bot.y);
    let targetX = looseTarget.x;
    let targetY = looseTarget.y;
    let dribble = false;
    let tackle = false;

    if (ownsBall) {
      this.chooseAttackLane(bot, opponent, height);
      const laneY = height / 2 + this.attackLane * C.GOAL_W_INIT * 0.22;
      targetX = goalX;
      targetY = clamp(laneY, goalTop + 24, goalBottom - 24);

      const opponentAhead = opponent.x > bot.x - 12;
      const blocksLane = opponentAhead
        && opponentDistance < profile.pressureRadius
        && Math.abs(opponent.y - bot.y) < 88;
      if (blocksLane) {
        targetX = Math.min(goalX - 70, bot.x + 155);
        targetY = clamp(
          bot.y + this.attackLane * (105 + (profile.pressureRadius - opponentDistance) * 0.45),
          C.BORDER + 58,
          height - C.BORDER - 58
        );
        dribble = bot.dribble_cd <= 0
          && bot.stamina >= C.DRIBBLE_STAM_COST
          && this.difficulty !== C.Difficulty.EASY;
      }
    } else if (opponentOwnsBall) {
      const opponentGoalDistance = Math.abs(opponent.x - ownGoalX);
      const projectedX = opponent.x + Number(opponent.vx || 0) * profile.predictionFrames * 0.65;
      const projectedY = opponent.y + Number(opponent.vy || 0) * profile.predictionFrames * 0.65;
      if (opponentDistance > 165 && opponentGoalDistance > 210) {
        // Intercept the route to goal instead of following the carrier's tail.
        targetX = ownGoalX + (projectedX - ownGoalX) * 0.66;
        targetY = height / 2 + (projectedY - height / 2) * 0.72;
      } else {
        targetX = projectedX;
        targetY = projectedY;
      }
      if (opponentDistance < C.TACKLE_RANGE * 1.12
        && bot.tackle_cd <= 0
        && bot.stamina >= C.TACKLE_STAM_COST
        && this.tackleRollLock <= 0) {
        tackle = this.random() <= profile.tackleChance;
        this.tackleRollLock = Math.max(12, profile.reactionFrames * 3);
      }
    } else if (ball.x < width * 0.42 && Math.hypot(looseTarget.x - bot.x, looseTarget.y - bot.y) > 245) {
      targetX = C.BORDER + 74;
      targetY = clamp(looseTarget.y, goalTop + 15, goalBottom - 15);
    }

    const nearWall = isNearWall(bot, width, height);
    if (nearWall || this.escapeFrames > 0) {
      const inwardX = bot.x < width / 2 ? C.BORDER + 205 : width - C.BORDER - 205;
      targetX = ownsBall ? Math.max(bot.x + 130, inwardX) : inwardX;
      targetY = clamp(
        bot.y + this.escapeSide * 175,
        C.BORDER + 95,
        height - C.BORDER - 95
      );
      dribble = ownsBall && bot.dribble_cd <= 0 && bot.stamina >= C.DRIBBLE_STAM_COST;
    }

    let direction = normalize(targetX - bot.x, targetY - bot.y);
    if (ownsBall && opponentDistance < profile.pressureRadius && !nearWall) {
      const away = normalize(bot.x - opponent.x, bot.y - opponent.y);
      direction = normalize(direction.x + away.x * 0.35, direction.y + away.y * 0.35);
    }
    direction = this.stabilizeDirection(
      direction,
      this.escapeFrames > 0 || opponentOwnsBall ? 0.46 : ownsBall ? 0.28 : 0.36
    );

    const distanceToGoal = Math.abs(goalX - bot.x);
    const insideMouth = bot.y > goalTop + 5 && bot.y < goalBottom - 5;
    const goalAngle = Math.atan2(height / 2 + this.aimOffset - bot.y, goalX - bot.x);
    const facingGoal = Math.abs(angleDelta(Number(bot.dir || 0), goalAngle)) < 0.72;
    let shoot = false;
    if (this.shotReleasePending) {
      this.shotReleasePending = false;
      this.shotLockFrames = Math.max(46, profile.reactionFrames * 7);
    } else if (this.shotHoldFrames > 0) {
      shoot = true;
      this.shotHoldFrames -= 1;
      if (this.shotHoldFrames === 0) this.shotReleasePending = true;
      direction = normalize(goalX - bot.x, height / 2 + this.aimOffset - bot.y);
      this.steerX = direction.x;
      this.steerY = direction.y;
      dribble = false;
    } else if (ownsBall
      && this.frame > 55
      && this.shotLockFrames <= 0
      && distanceToGoal <= profile.shotDistance
      && insideMouth
      && facingGoal) {
      this.shotHoldFrames = profile.shotChargeFrames;
      shoot = true;
      direction = normalize(goalX - bot.x, height / 2 + this.aimOffset - bot.y);
      this.steerX = direction.x;
      this.steerY = direction.y;
      dribble = false;
    }

    const distanceToTarget = Math.hypot(targetX - bot.x, targetY - bot.y);
    const sprint = bot.staminaLock <= 0
      && bot.stamina > profile.sprintStamina
      && !shoot
      && (distanceToTarget > 115 || ownsBall && distanceToGoal > 230 || opponentOwnsBall && opponentDistance > 95);
    const input = {
      x: direction.x * profile.speed,
      y: direction.y * profile.speed,
      shoot,
      sprint,
      dribble: dribble && !shoot,
      tackle: tackle && !ownsBall,
      power: false,
      requestPass: false
    };
    this.lastInput = input;
    return { ...input };
  }
}

export function createSoloBotController(options) {
  return new SoloBotController(options);
}
