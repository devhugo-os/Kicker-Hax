import { normalizeStaffRole } from './staffTags.js';

/** Finds legacy staff assignments using the same normalization as UI tags. */
export function findStaffProfileByRole(profiles, role) {
  const normalizedRole = normalizeStaffRole(role);
  if (!normalizedRole) return null;
  return (profiles || []).find(profile => normalizeStaffRole(profile?.staffRole) === normalizedRole) || null;
}
