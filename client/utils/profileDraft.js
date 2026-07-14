export function createProfileDraft(profile = {}) {
  return {
    username: String(profile.username || '').trim().toLowerCase(),
    badge: String(profile.badge || '👤'),
    bio: String(profile.bio || '').trim(),
    equippedSkinId: String(profile.equippedSkinId || 'rookie'),
    equippedSkinImage: profile.equippedSkinImage || null
  };
}

export function profilesDiffer(baseProfile, draft) {
  const base = createProfileDraft(baseProfile);
  const candidate = createProfileDraft(draft);
  return Object.keys(base).some(key => base[key] !== candidate[key]);
}
