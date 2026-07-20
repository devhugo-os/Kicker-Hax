// Keep at most roughly one compact snapshot queued. Old positions have no
// value and are the main source of apparent high ping on distant peers.
export const MAX_REALTIME_BUFFERED_BYTES = 2 * 1024;
export const MAX_REALTIME_TEXT_LENGTH = 255;

const OMITTED_REALTIME_FIELDS = new Set([
  'skin',
  'equippedSkinImage',
  'imageBase64',
  'inventory'
]);

// High-frequency snapshots repeat these names for every player. They are
// shortened only on the raw DataChannel and expanded before controllers see
// the packet, keeping the game model readable while cutting uplink traffic.
const REALTIME_KEYS = Object.freeze({
  sequence: 'q', transportSequence: 'Q', serverSentAt: 'a', ball: 'b', players: 'p',
  score: 's', matchTime: 'm', status: 'S', countdown: 'c', phaseEndsAt: 'e',
  goalInfo: 'g', soundEffects: 'f', isHostPaused: 'h', id: 'i', uid: 'u', team: 't',
  vx: 'X', vy: 'Y', dir: 'D', stamina: 'n', staminaLock: 'N', stun: 'z',
  shootHalo: 'o', kickCharge: 'k', invuln: 'v', tackle_cd: 'l', dribble_cd: 'r',
  power_cd: 'w', matchStats: 'M', badge: 'B', name: 'A', skinId: 'K', staffRole: 'R',
  owner: 'O', lastTouch: 'L', lastStrikeType: 'T', strikeTimer: 'I', red: '0', blue: '1',
  shoot: 'j', sprint: 'P', dribble: 'd', tackle: 'C', power: 'W', mobileTackleAssist: 'U',
  sentAt: 'E', serverTime: 'V'
});
const EXPANDED_REALTIME_KEYS = Object.freeze(Object.fromEntries(
  Object.entries(REALTIME_KEYS).map(([key, value]) => [value, key])
));

function transformKeys(value, dictionary) {
  if (Array.isArray(value)) return value.map(item => transformKeys(item, dictionary));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    dictionary[key] || key,
    transformKeys(item, dictionary)
  ]));
}

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
  const compactData = transformKeys(data, REALTIME_KEYS);
  return JSON.stringify({ e: event, d: compactData }, (key, value) => {
    if (OMITTED_REALTIME_FIELDS.has(key)) return undefined;
    if (typeof value === 'number' && Number.isFinite(value) && !Number.isInteger(value)) {
      return Math.round(value * 100) / 100;
    }
    if (typeof value !== 'string') return value;
    if (value.startsWith('data:image/')) return 'custom';
    return value.slice(0, MAX_REALTIME_TEXT_LENGTH);
  });
}

export function decodeRealtimePacket(payload) {
  if (typeof payload !== 'string') return payload;
  try {
    const packet = JSON.parse(payload);
    if (!packet?.e) return packet;
    return { event: packet.e, data: transformKeys(packet.d, EXPANDED_REALTIME_KEYS) };
  } catch {
    return null;
  }
}
