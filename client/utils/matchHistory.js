export function getWritableHistoryUids(playerUids, currentUid) {
  const uid = String(currentUid || '').trim();
  if (!uid) return [];
  const participants = new Set((playerUids || []).map(value => String(value || '').trim()).filter(Boolean));
  return participants.has(uid) ? [uid] : [];
}

/** Collects every human explicitly cited by current and legacy match receipts. */
export function getMatchParticipantUids(match = {}) {
  const participants = new Set([
    ...(Array.isArray(match.participantUids) ? match.participantUids : []),
    ...(Array.isArray(match.playerUids) ? match.playerUids : []),
    ...Object.keys(match.playerTeams || {}),
    ...(Array.isArray(match.playerStats)
      ? match.playerStats.map(player => player?.uid || player?.playerUid)
      : [])
  ].map(value => String(value || '').trim()).filter(Boolean));
  return [...participants];
}

export function matchIncludesPlayer(match, uid) {
  const normalizedUid = String(uid || '').trim();
  return normalizedUid !== '' && getMatchParticipantUids(match).includes(normalizedUid);
}
