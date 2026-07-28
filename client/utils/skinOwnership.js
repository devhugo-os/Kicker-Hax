export function getSkinCopyCount(profile = {}, skinId = '') {
  const stored = Number(profile.skinOwnedCopies?.[skinId] || 0);
  const listed = Array.isArray(profile.ownedSkins)
    ? profile.ownedSkins.filter(id => id === skinId).length
    : 0;
  return Math.max(stored, listed, profile.ownedSkins?.includes?.(skinId) ? 1 : 0);
}

export function hasGiftedSkinCopy(profile = {}, skinId = '') {
  return !!profile.skinGiftOrigins?.[skinId]?.senderUid;
}

export function canAcquireSkinCopy(profile = {}, skinId = '') {
  const count = getSkinCopyCount(profile, skinId);
  return count === 0 || (count === 1 && hasGiftedSkinCopy(profile, skinId));
}

export function addRegularSkinCopy(profile = {}, skinId = '') {
  if (!canAcquireSkinCopy(profile, skinId)) return null;
  const ownedSkins = Array.from(new Set([...(profile.ownedSkins || ['rookie']), skinId]));
  const skinOwnedCopies = {
    ...(profile.skinOwnedCopies || {}),
    [skinId]: getSkinCopyCount(profile, skinId) + 1
  };
  return { ownedSkins, skinOwnedCopies };
}

export function removeRegularSkinCopy(profile = {}, skinId = '') {
  const count = getSkinCopyCount(profile, skinId);
  const keepGifted = count > 1 && hasGiftedSkinCopy(profile, skinId);
  const skinOwnedCopies = { ...(profile.skinOwnedCopies || {}) };
  if (keepGifted) skinOwnedCopies[skinId] = 1;
  else delete skinOwnedCopies[skinId];
  return {
    ownedSkins: keepGifted
      ? Array.from(new Set(profile.ownedSkins || ['rookie']))
      : (profile.ownedSkins || ['rookie']).filter(id => id !== skinId),
    skinOwnedCopies
  };
}

export function removeGiftedSkinCopy(profile = {}, skinId = '') {
  const count = getSkinCopyCount(profile, skinId);
  const keepRegular = count > 1;
  const skinOwnedCopies = { ...(profile.skinOwnedCopies || {}) };
  if (keepRegular) skinOwnedCopies[skinId] = 1;
  else delete skinOwnedCopies[skinId];
  return {
    ownedSkins: keepRegular
      ? Array.from(new Set(profile.ownedSkins || ['rookie']))
      : (profile.ownedSkins || ['rookie']).filter(id => id !== skinId),
    skinOwnedCopies
  };
}
