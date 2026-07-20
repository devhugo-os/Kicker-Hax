const EMBEDDED_IMAGE_PREFIX = 'data:image/';
const MAX_INLINE_SKIN_LENGTH = 200;
const MAX_INLINE_BADGE_LENGTH = 32;

export function hasEmbeddedSkin(profile) {
  const skin = String(profile?.skin || '');
  return skin.startsWith(EMBEDDED_IMAGE_PREFIX) || skin.length > MAX_INLINE_SKIN_LENGTH;
}

/** Keeps WebRTC control packets small; custom images are resolved by Firebase UID. */
export function sanitizeMultiplayerProfile(profile) {
  if (!profile) return null;
  return {
    ...profile,
    skin: hasEmbeddedSkin(profile) ? 'custom' : profile.skin,
    badge: String(profile.badge || '').slice(0, MAX_INLINE_BADGE_LENGTH),
    deviceId: String(profile.deviceId || '').replace(/[^a-f0-9]/gi, '').slice(0, 32)
  };
}

/** Returns a detached lobby payload that cannot mutate or overload ServerRoom. */
export function compactLobbyInfo(lobbyInfo) {
  if (!lobbyInfo) return null;
  return {
    code: lobbyInfo.code,
    name: lobbyInfo.name,
    maxPlayers: lobbyInfo.maxPlayers,
    duration: lobbyInfo.duration,
    goalLimit: lobbyInfo.goalLimit,
    fieldSize: lobbyInfo.fieldSize,
    showReplay: lobbyInfo.showReplay,
    competitive: lobbyInfo.competitive,
    hostId: lobbyInfo.hostId,
    hostUsername: lobbyInfo.hostUsername,
    status: lobbyInfo.status,
    players: Array.isArray(lobbyInfo.players)
      ? lobbyInfo.players.map(player => sanitizeMultiplayerProfile(player))
      : []
  };
}

/**
 * Compacts lobby-shaped objects nested in lifecycle events. This is a final
 * boundary guard against a future Base64 field reaching PeerJS JSON channels.
 */
export function compactMultiplayerPayload(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(compactMultiplayerPayload);
  if (Array.isArray(data.players) && data.code && data.hostId) {
    return compactLobbyInfo(data);
  }
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [
    key,
    key === 'lobbyInfo' ? compactLobbyInfo(value) : compactMultiplayerPayload(value)
  ]));
}
