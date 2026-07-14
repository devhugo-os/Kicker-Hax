import test from 'node:test';
import assert from 'node:assert/strict';
import { createProfileDraft, profilesDiffer } from '../client/utils/profileDraft.js';

test('normaliza os campos editaveis do perfil', () => {
  const draft = createProfileDraft({ username: ' Hugo ', bio: ' Oi ', badge: '⚽' });
  assert.equal(draft.username, 'hugo');
  assert.equal(draft.bio, 'Oi');
  assert.equal(draft.equippedSkinId, 'rookie');
});

test('detecta alteracoes de skin, nome, emblema ou biografia', () => {
  const base = createProfileDraft({ username: 'hugo', badge: '⚽', bio: '', equippedSkinId: 'rookie' });
  assert.equal(profilesDiffer(base, base), false);
  assert.equal(profilesDiffer(base, { ...base, equippedSkinId: 'storm' }), true);
  assert.equal(profilesDiffer(base, { ...base, badge: '🏆' }), true);
});
