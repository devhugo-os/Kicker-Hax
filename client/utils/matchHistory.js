export function getWritableHistoryUids(playerUids, currentUid) {
  const uid = String(currentUid || '').trim();
  if (!uid) return [];
  const participants = new Set((playerUids || []).map(value => String(value || '').trim()).filter(Boolean));
  return participants.has(uid) ? [uid] : [];
}
