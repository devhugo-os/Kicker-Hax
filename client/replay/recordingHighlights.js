const HIGHLIGHT_TYPES = new Set(['goal', 'power', 'danger']);

/** Finds the next meaningful event and wraps to the first one at the end. */
export function findNextRecordingHighlight(markers = [], currentMs = 0) {
  const highlights = markers
    .filter(marker => HIGHLIGHT_TYPES.has(marker.type))
    .sort((a, b) => Number(a.t || 0) - Number(b.t || 0));
  if (!highlights.length) return null;
  return highlights.find(marker => Number(marker.t || 0) > Number(currentMs || 0) + 100) || highlights[0];
}

export function hasRecordingHighlights(markers = []) {
  return markers.some(marker => HIGHLIGHT_TYPES.has(marker.type));
}
