// Kicker Hax - Shared Game Constants

export const W = 1024;
export const H = 640;

export const BORDER = 36;
export const GOAL_W_INIT = 180;
export const GOAL_DEPTH = 30;
export const POST_T = 6;

export const BALL_RADIUS = 10;
export const PLAYER_RADIUS = 16;

export const FRICTION_FIELD = 0.955;
export const FRICTION_PLAYER = 0.90;
export const MAX_SPEED = 1.9;

// Kick / Skills constants
export const KICK_BASE = 3.2;
export const KICK_CHARGE = 6.0;

export const STAMINA_LOCK_FRAMES = 90;
export const REGEN_IDLE = 0.0022;
export const DRAIN_SPRINT = 0.0060;

export const TACKLE_RANGE = 82;
export const TACKLE_CD = 140;
export const TACKLE_LUNGE = 9.0;
export const TACKLE_STUN = 120;
export const TACKLE_SLOW_TIME = 80;
export const FAIL_STUN = 30;
export const TACKLE_STAM_COST = 1 / 3;

export const DRIBBLE_DASH = 3.8;
export const DRIBBLE_TIME = 12;
export const DRIBBLE_CD = 34;
export const DRIBBLE_INVULN = 12;
export const DRIBBLE_STAM_COST = 1 / 3;

export const POWER_KICK_POWER = 22.0;
export const POWER_KICK_CD = 60;

export const GOAL_FREEZE_FRAMES = 180;
export const END_FREEZE_FRAMES = 180;

export const Team = {
  RED: 0,
  BLUE: 1
};

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};
