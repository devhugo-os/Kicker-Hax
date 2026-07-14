export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function safeImageSource(value) {
  const source = String(value || '').trim();
  if (/^data:image\/(?:png|jpeg|webp|gif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(source)) return source;
  if (/^\.\/assets\/[a-z0-9_.-]+$/i.test(source)) return source;
  return '';
}
