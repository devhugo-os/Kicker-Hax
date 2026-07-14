import test from 'node:test';
import assert from 'node:assert/strict';
import { ServerPhysics } from '../server/models/serverPhysics.js';
import { getPowerKickShakeOffset, isPowerKickActive } from '../client/utils/powerKickFx.js';

function createBall(owner) {
  return { owner, x: 10, y: 10, vx: 0, vy: 0, lastTouch: null, strikeTimer: 0, lastStrikeType: null };
}

test('chutes exigem posse autoritativa da bola', () => {
  const player = { id: 'p1' };
  const looseBall = createBall(null);
  assert.equal(ServerPhysics.kickBall(player, looseBall, 0, 8), false);
  assert.equal(ServerPhysics.powerKick(player, looseBall, 0, 22), false);
  assert.equal(looseBall.vx, 0);

  const ownedBall = createBall('p1');
  assert.equal(ServerPhysics.powerKick(player, ownedBall, 0, 22), true);
  assert.equal(ownedBall.owner, null);
  assert.equal(ownedBall.lastStrikeType, 'power');
  assert.ok(ownedBall.vx > 20);
});

test('tremor visual existe apenas durante o super chute', () => {
  assert.equal(isPowerKickActive({ lastStrikeType: 'kick', strikeTimer: 40 }), false);
  assert.deepEqual(getPowerKickShakeOffset({ lastStrikeType: 'power', strikeTimer: 0 }, 100), { x: 0, y: 0 });
  const offset = getPowerKickShakeOffset({ lastStrikeType: 'power', strikeTimer: 40 }, 100);
  assert.ok(Math.abs(offset.x) + Math.abs(offset.y) > 0);
});
