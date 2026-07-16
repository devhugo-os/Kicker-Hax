const EMBEDDED_IMAGE_PREFIX = 'data:image/';
const MAX_INLINE_SKIN_LENGTH = 200;

export function hasEmbeddedSkin(profile) {
  const skin = String(profile?.skin || '');
  return skin.startsWith(EMBEDDED_IMAGE_PREFIX) || skin.length > MAX_INLINE_SKIN_LENGTH;
}

/** Keeps WebRTC control packets small; custom images are resolved by Firebase UID. */
export function sanitizeMultiplayerProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    skin: hasEmbeddedSkin(profile) ? 'custom' : profile.skin
  };
}
