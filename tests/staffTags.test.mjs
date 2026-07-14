import test from 'node:test';
import assert from 'node:assert/strict';
import { getStaffRoleMeta } from '../client/utils/staffTags.js';

test('tags oficiais possuem versoes curta e completa', () => {
  assert.equal(getStaffRoleMeta('developer').label, 'DEV');
  assert.equal(getStaffRoleMeta('developer').fullLabel, 'DESENVOLVEDOR');
  assert.equal(getStaffRoleMeta('influencer').label, 'INF');
  assert.equal(getStaffRoleMeta('influencer').fullLabel, 'INFLUENCIADOR');
});
