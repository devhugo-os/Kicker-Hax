// Kicker Hax - Grapheme cluster utilities for Emoji rendering support

export function segmentGraphemes(text) {
  const s = (text ?? '').toString();
  if (!s) return [];
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(s), it => it.segment);
  } catch {
    return Array.from(s); // fallback
  }
}

export function isEmojiCluster(g) {
  return /\p{Extended_Pictographic}/u.test(g || '');
}

export function deriveBadgeFromName(name) {
  const G = segmentGraphemes(name || '').filter(s => s.trim().length > 0);
  if (G.length === 0) return '';
  let first = G[0];
  if (isEmojiCluster(first)) return first;
  if (/^[a-zA-Z]$/.test(first)) first = first.toUpperCase();
  return first;
}

export function sanitizeBadgeInput(raw) {
  const t = (raw || '').trim();
  if (!t) return '';
  const G = segmentGraphemes(t);
  if (G.length === 0) return '';
  if (isEmojiCluster(G[0])) return G[0];      // Only the first emoji
  return G.slice(0, 2).join('');              // Or up to 2 normal letters
}
