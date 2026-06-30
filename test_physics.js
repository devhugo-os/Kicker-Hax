import * as C from './shared/constants.js';
import { ServerPhysics } from './server/models/serverPhysics.js';

const bluePlayer = {
  id: 'p1', team: C.Team.BLUE, cpu: false,
  x: 100, y: 100, vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
  stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
  tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
  tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, shootHalo: 0
};

const redPlayer = {
  id: 'cpu', team: C.Team.RED, cpu: true,
  x: 200, y: 100, vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
  stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
  tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
  tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, shootHalo: 0, aiShootLock: 0, aiFeintLock: 0
};

const localPlayers = [redPlayer, bluePlayer];
const localBallSim = {
  x: 100, y: 100, vx: 0, vy: 0, r: C.BALL_RADIUS, owner: null, lastTouch: null,
  strikeTimer: 0, lastStrikeType: null, noPickupFrames: 0, noPickupFrom: null
};

// Simulate human pickup
const inputP1 = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
const inputCPU = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };

try {
  ServerPhysics.updatePlayerPhysics(bluePlayer, inputP1, localBallSim, () => {});
  ServerPhysics.updatePlayerPhysics(redPlayer, inputCPU, localBallSim, () => {});
  
  ServerPhysics.applyLimits(bluePlayer, 200, 400, 50, 950, 100, 900, 10, 1024, 640);
  ServerPhysics.applyLimits(redPlayer, 200, 400, 50, 950, 100, 900, 10, 1024, 640);

  ServerPhysics.resolvePlayerPlayer(localPlayers);
  ServerPhysics.resolvePlayerBall(localPlayers, localBallSim, () => {
    for (const pl of localPlayers) {
      if (pl.tackleEval > 0 && localBallSim.owner === pl.id) pl.tackleSuccess = true;
    }
  });

  ServerPhysics.updateBallPhysics(
    localBallSim, 200, 400, 50, 950, 100, 900, 10, localPlayers,
    () => {}, () => {}, 1024, 640
  );

  console.log("No crash! Ball owner:", localBallSim.owner);
  console.log("Ball Pos:", localBallSim.x, localBallSim.y);
  console.log("Player Pos:", bluePlayer.x, bluePlayer.y);
  console.log("Player NaN check:", isNaN(bluePlayer.x), isNaN(bluePlayer.y));
} catch (e) {
  console.error("Crash:", e);
}
