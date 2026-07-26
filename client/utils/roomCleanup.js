export function normalizeRoomCode(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

/** Lists every RTDB branch owned by one multiplayer room for ordered cleanup. */
export function buildRoomCleanupPatch(roomCode) {
  const code = normalizeRoomCode(roomCode);
  if (!code) return {};
  return {
    [`multiplayerRooms/${code}`]: null,
    [`roomChats/${code}`]: null,
    [`matchChats/${code}`]: null,
    [`chatRateLimits/rooms/${code}`]: null
  };
}

/** The newest host-owned write keeps a room alive even if timers were throttled. */
export function getRoomActivityTimestamp(room) {
  return Math.max(
    Number(room?.hostHeartbeatAt || 0),
    Number(room?.updatedAt || 0),
    Number(room?.createdAt || 0)
  );
}

export function getOrphanRoomCodes(rooms, roomChats, matchChats) {
  const activeCodes = new Set(Object.keys(rooms || {}).map(normalizeRoomCode).filter(Boolean));
  return [...new Set([
    ...Object.keys(roomChats || {}),
    ...Object.keys(matchChats || {})
  ].map(normalizeRoomCode).filter(code => code && !activeCodes.has(code)))];
}
