import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChestReel, getReelTargetOffset } from '../client/utils/chestReel.js';

test('fixa o premio exatamente sob o marcador da roleta', () => {
  const won = { id: 'winner' };
  const reel = buildChestReel([{ id: 'other' }], won, { length: 42, winnerIndex: 37, random: () => 0 });
  assert.equal(reel.length, 42);
  assert.equal(reel[37], won);
});

test('centraliza o item vencedor usando sua medida real no DOM', () => {
  assert.equal(getReelTargetOffset(760, 4888, 124), -4570);
  assert.equal(4888 + 62 - 4570, 380);
});
