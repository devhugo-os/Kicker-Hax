export function createProfileDraft(profile = {}) {
  return {
    username: String(profile.username || '').trim().toLowerCase(),
    badge: String(profile.badge || '👤'),
    bio: String(profile.bio || '').trim(),
    equippedSkinId: String(profile.equippedSkinId || 'rookie'),
    equippedSkinImage: profile.equippedSkinImage || null,
    equippedSkinName: String(profile.equippedSkinName || ''),
    equippedSkinRarity: String(profile.equippedSkinRarity || '')
  };
}

export function profilesDiffer(baseProfile, draft) {
  const base = createProfileDraft(baseProfile);
  const candidate = createProfileDraft(draft);
  // Skin image/name/rarity are catalog metadata, not independent profile
  // choices. Returning to the persisted skin ID must restore a clean draft.
  return ['username', 'badge', 'bio', 'equippedSkinId']
    .some(key => base[key] !== candidate[key]);
}
