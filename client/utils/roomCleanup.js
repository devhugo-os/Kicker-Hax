export function normalizeRoomCode(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

/**
 * Builds one RTDB root update so the room and both chat trees disappear in
 * the same permission check. This prevents the room deletion from making its
 * own chat cleanup unauthorized.
 */
export function buildRoomCleanupPatch(roomCode) {
  const code = normalizeRoomCode(roomCode);
  if (!code) return {};
  return {
    [`multiplayerRooms/${code}`]: null,
    [`roomChats/${code}`]: null,
    [`matchChats/${code}`]: null
  };
}

export function getOrphanRoomCodes(rooms, roomChats, matchChats) {
  const activeCodes = new Set(Object.keys(rooms || {}).map(normalizeRoomCode).filter(Boolean));
  return [...new Set([
    ...Object.keys(roomChats || {}),
    ...Object.keys(matchChats || {})
  ].map(normalizeRoomCode).filter(code => code && !activeCodes.has(code)))];
}
