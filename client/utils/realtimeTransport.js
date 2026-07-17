export const MAX_REALTIME_BUFFERED_BYTES = 12 * 1024;
export const MAX_REALTIME_TEXT_LENGTH = 255;

const OMITTED_REALTIME_FIELDS = new Set([
  'skin',
  'equippedSkinImage',
  'imageBase64',
  'inventory'
]);

export function isRealtimeEvent(event) {
  return event === 'gameState' || event === 'gameInput';
}

/**
 * Realtime snapshots are replaceable: when the reliable WebRTC channel is
 * already backed up, sending another old position only increases visual lag.
 * Lobby, chat, replay and result events are never discarded here.
 */
export function shouldDropRealtimeState(event, bufferedAmount = 0) {
  return isRealtimeEvent(event)
    && Number.isFinite(Number(bufferedAmount))
    && Number(bufferedAmount) > MAX_REALTIME_BUFFERED_BYTES;
}

/**
 * PeerJS refuses JSON-channel packets at roughly 16 KB instead of chunking
 * them. The realtime channel therefore transports a raw JSON string and this
 * boundary strips profile images or accidental large strings from snapshots.
 */
export function encodeRealtimePacket(event, data) {
  return JSON.stringify({ event, data }, (key, value) => {
    if (OMITTED_REALTIME_FIELDS.has(key)) return undefined;
    if (typeof value === 'number' && Number.isFinite(value) && !Number.isInteger(value)) {
      return Math.round(value * 1000) / 1000;
    }
    if (typeof value !== 'string') return value;
    if (value.startsWith('data:image/')) return 'custom';
    return value.slice(0, MAX_REALTIME_TEXT_LENGTH);
  });
}

export function decodeRealtimePacket(payload) {
  if (typeof payload !== 'string') return payload;
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
