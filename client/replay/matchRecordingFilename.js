function cleanPart(value, fallback) {
  const normalized = String(value || fallback || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

function resolveRecordingDate(match, recording) {
  const value = match?.date || match?.endedAt || match?.createdAt || recording?.createdAt;
  const parsed = value ? new Date(value) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function buildMatchRecordingFilename(recording = {}, match = {}) {
  const date = resolveRecordingDate(match, recording);
  const stamp = [
    String(date.getFullYear()).slice(-2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');
  const clock = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
  const score = recording.finalScore || match.score || { red: match.scoreRed, blue: match.scoreBlue };
  const scoreLabel = `${Number(score?.red || 0)}x${Number(score?.blue || 0)}`;
  const rawId = String(match.matchId || recording.matchId || Date.now());
  const shortId = cleanPart(rawId, 'partida').slice(-6).toUpperCase();
  return `KH-${stamp}-${clock}-${scoreLabel}-${shortId}.mp4`;
}
