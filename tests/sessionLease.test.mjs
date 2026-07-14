import test from 'node:test';
import assert from 'node:assert/strict';
import { getSessionLeaseLifetime } from '../client/utils/sessionLease.js';

test('mantem sessao mobile ativa durante throttling do navegador', () => {
  assert.equal(getSessionLeaseLifetime({ coarsePointer: true }), 120000);
  assert.equal(getSessionLeaseLifetime({ maxTouchPoints: 5 }), 120000);
});

test('preserva lease curto no desktop', () => {
  assert.equal(getSessionLeaseLifetime(), 30000);
});
