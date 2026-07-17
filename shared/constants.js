// Kicker Hax - Shared Game Constants

export const W = 1024;
export const H = 640;

export const BORDER = 36;
export const GOAL_W_INIT = 180;
export const GOAL_DEPTH = 30;
export const POST_T = 6;

export const BALL_RADIUS = 10;
export const PLAYER_RADIUS = 16;

// User-generated content limits shared by the SPA and Node/Socket.IO server.
export const USERNAME_MAX_LENGTH = 20;
export const PROFILE_BIO_MAX_LENGTH = 60;
export const SKIN_NAME_MAX_LENGTH = 15;
export const ROOM_NAME_MAX_LENGTH = 20;
export const ROOM_PASSWORD_MAX_LENGTH = 8;
export const CHAT_MESSAGE_MAX_LENGTH = 255;
export const SKIN_IMAGE_MAX_BYTES = 500 * 1024;

export const FRICTION_FIELD = 0.955;
export const FRICTION_PLAYER = 0.90;
export const MAX_SPEED = 2.3;

// Kick / Skills constants
export const KICK_BASE = 3.2;
export const KICK_CHARGE = 6.0;

export const STAMINA_LOCK_FRAMES = 90;
export const REGEN_IDLE = 0.0035;
export const DRAIN_SPRINT = 0.0035;

export const TACKLE_RANGE = 82;
export const TACKLE_CD = 80;
export const TACKLE_LUNGE = 9.0;
// A tackle only resolves after this full lunge has completed.
export const TACKLE_DASH_FRAMES = 12;
// Network snapshots can be a few frames apart. Keep this small enough to
// require actual contact, while allowing a completed dash to register online.
export const TACKLE_CONTACT_TOLERANCE = 10;
export const TACKLE_STUN = 54;
export const TACKLE_SLOW_TIME = 42;
export const FAIL_STUN = 18;
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
// Six complete seconds before the goal are retained in every game mode.
export const REPLAY_CAPTURE_FRAMES = 360;
// Playback runs at half speed. Clients interpolate captured snapshots at the
// display refresh rate instead of visibly repeating each frame.
export const REPLAY_SLOWMO_FACTOR = 2;
// Gives chunked control packets enough time to reach slower mobile peers while
// every client still starts from the same authoritative wall-clock instant.
export const REPLAY_SYNC_LEAD_MS = 1200;
// Hold the scored frame after playback. This is part of the synchronized
// replay phase, but power-kick camera shake is disabled during the hold.
export const REPLAY_POST_GOAL_FREEZE_MS = 2000;
export const RESTART_COUNTDOWN_FRAMES = 180;

export const Team = {
  RED: 0,
  BLUE: 1
};

export const TEAM_NAME_COLORS = Object.freeze({
  [Team.RED]: '#ff6b6b',
  [Team.BLUE]: '#60a5fa'
});

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};
