import test from 'node:test';
import assert from 'node:assert/strict';
import { findStaffProfileByRole } from '../client/utils/staffProfiles.js';

test('creditos encontram influenciador com cargo legado normalizado', () => {
  const profiles = [
    { uid: 'dev', username: 'Hugo', staffRole: 'developer' },
    { uid: 'creator', username: 'Criador', staffRole: ' Influencer ' }
  ];

  assert.equal(findStaffProfileByRole(profiles, 'influencer')?.uid, 'creator');
  assert.equal(findStaffProfileByRole(profiles, 'developer')?.uid, 'dev');
});
