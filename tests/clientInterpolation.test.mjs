import test from 'node:test';
import assert from 'node:assert/strict';
import { ClientBall } from '../client/models/clientBall.js';
import { ClientPlayer } from '../client/models/clientPlayer.js';

test('bola avanca visualmente entre snapshots sem alterar o alvo autoritativo', () => {
  const ball = new ClientBall();
  ball.x = 100;
  ball.y = 100;
  ball.lastRenderAt = 1000;
  ball.updateState({ x: 100, y: 100, vx: 4, vy: 0, owner: null }, 1000);

  ball.interpolate(0.35, 1000 + (1000 / 60));

  assert.ok(ball.x > 100);
  assert.equal(ball.targetX, 100);
  assert.ok(ball.x < 104);
});

test('jogador suaviza movimento usando velocidade do snapshot', () => {
  const player = new ClientPlayer({
    id: 'p1', name: 'Hugo', team: 0, x: 50, y: 50, dir: 0,
    vx: 3, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0
  });
  player.lastRenderAt = 2000;
  player.updateState({
    id: 'p1', name: 'Hugo', team: 0, x: 50, y: 50, dir: 0,
    vx: 3, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0
  }, 2000);

  player.interpolate(0.35, 2000 + (1000 / 60));

  assert.ok(player.x > 50);
  assert.equal(player.targetX, 50);
  assert.ok(player.x < 53);
});

test('pause desativa extrapolacao de movimento entre snapshots', () => {
  const ball = new ClientBall();
  ball.x = 100;
  ball.lastRenderAt = 3000;
  ball.updateState({ x: 100, y: 100, vx: 8, vy: 0, owner: null }, 3000, false);

  ball.interpolate(0.35, 3000 + (1000 / 60));

  assert.equal(ball.x, 100);
});

test('previsao local reduz atraso visual sem alterar o alvo autoritativo', () => {
  const player = new ClientPlayer({
    id: 'local', name: 'Hugo', team: 1, x: 100, y: 100, dir: 0,
    vx: 0, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0
  });
  player.lastRenderAt = 4000;
  player.updateState({
    id: 'local', name: 'Hugo', team: 1, x: 100, y: 100, dir: 0,
    vx: 0, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0
  }, 4000);

  player.interpolate(0.35, 4000 + (1000 / 60), { input: { x: 1, y: 0, sprint: true }, pingMs: 260 });

  assert.ok(player.x > 100, 'the local player should react before the host echo returns');
  assert.equal(player.targetX, 100, 'prediction must remain visual only');
});

test('mantem estatisticas quando o snapshot compacto nao as repete', () => {
  const player = new ClientPlayer({
    id: 'p1', name: 'Hugo', team: 1, x: 10, y: 10, dir: 0,
    vx: 0, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0, matchStats: { goals: 2 }
  });
  player.updateState({
    id: 'p1', name: 'Hugo', team: 1, x: 11, y: 10, dir: 0,
    vx: 1, vy: 0, stamina: 1, staminaLock: 0, stun: 0,
    shootHalo: 0, invuln: 0
  }, 5000);
  assert.deepEqual(player.matchStats, { goals: 2 });
});

test('snapshot compacto preserva identidade visual recebida no estado estendido', () => {
  const player = new ClientPlayer({
    id: 'p1', name: 'Hugo', badge: 'KX', staffRole: 'developer', team: 1,
    x: 10, y: 10, dir: 0, vx: 0, vy: 0, stamina: 1, staminaLock: 0,
    stun: 0, shootHalo: 0, invuln: 0
  });
  player.updateState({
    id: 'p1', team: 1, x: 12, y: 10, dir: 0, vx: 1, vy: 0,
    stamina: 1, staminaLock: 0, stun: 0, shootHalo: 0, invuln: 0
  });
  assert.equal(player.name, 'Hugo');
  assert.equal(player.badge, 'KX');
  assert.equal(player.staffRole, 'developer');
});
