// Keep only a couple of replaceable snapshots queued. Larger queues turned
// brief upload contention into 60-100 ms of extra input/state latency.
export const MAX_REALTIME_BUFFERED_BYTES = 2048;
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
  matchId: 'H',
  goalInfo: 'g', soundEffects: 'f', isHostPaused: 'h', id: 'i', uid: 'u', team: 't',
  vx: 'X', vy: 'Y', dir: 'D', stamina: 'n', staminaLock: 'N', stun: 'z',
  shootHalo: 'o', kickCharge: 'k', invuln: 'v', tackle_cd: 'l', dribble_cd: 'r',
  power_cd: 'w', matchStats: 'M', badge: 'B', name: 'A', skinId: 'K', staffRole: 'R',
  owner: 'O', lastTouch: 'L', lastStrikeType: 'T', strikeTimer: 'I', red: '0', blue: '1',
  shoot: 'j', sprint: 'P', dribble: 'd', tackle: 'C', power: 'W', requestPass: 'G', passRequestTimer: 'J', passRequestCooldown: 'F', mobileTackleAssist: 'U',
  sentAt: 'E', serverTime: 'V', inputAck: 'Z'
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
 * High-frequency state packets carry only simulation data. Player identity is
 * refreshed periodically and match statistics at a lower cadence; both are
 * already available in the reliable lobby/bootstrap payload.
 */
export function compactRealtimeGameState(state, options = {}) {
  if (!state?.players) return state;
  const includeIdentity = options.includeIdentity === true;
  const includeStats = options.includeStats === true;
  return {
    ...state,
    players: state.players.map(player => {
      const compact = { ...player };
      if (!includeIdentity) {
        delete compact.uid;
        delete compact.name;
        delete compact.badge;
        delete compact.skinId;
        delete compact.staffRole;
      }
      if (!includeStats) delete compact.matchStats;
      return compact;
    })
  };
}

/**
 * Realtime snapshots are replaceable: when the reliable WebRTC channel is
 * already backed up, sending another old position only increases visual lag.
 * Lobby, chat, replay and result events are never discarded here.
 */
export function shouldDropRealtimeState(event, bufferedAmount = 0) {
  // Inputs are small and must remain ordered. Only replaceable host snapshots
  // are discarded under congestion.
  return event === 'gameState'
    && Number.isFinite(Number(bufferedAmount))
    && Number(bufferedAmount) > MAX_REALTIME_BUFFERED_BYTES;
}

/**
 * PeerJS refuses JSON-channel packets at roughly 16 KB instead of chunking
 * them. The realtime channel therefore transports a raw JSON string and this
 * boundary strips profile images or accidental large strings from snapshots.
 */
export function encodeRealtimePacket(event, data) {
  if (event === 'gameInput') {
    const flags = (+!!data.shoot)
      | (+!!data.sprint << 1)
      | (+!!data.dribble << 2)
      | (+!!data.tackle << 3)
      | (+!!data.power << 4)
      | (+!!data.requestPass << 5)
      | (+!!data.mobileTackleAssist << 6);
    return JSON.stringify({
      e: event,
      d: [
        Number(data._seq || 0),
        Math.round(Number(data.x || 0) * 127),
        Math.round(Number(data.y || 0) * 127),
        flags
      ]
    });
  }
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
    if (packet.e === 'gameInput' && Array.isArray(packet.d)) {
      const [sequence, x, y, flags = 0] = packet.d;
      return {
        event: packet.e,
        data: {
          _seq: Number(sequence || 0),
          x: Number(x || 0) / 127,
          y: Number(y || 0) / 127,
          shoot: !!(flags & 1),
          sprint: !!(flags & 2),
          dribble: !!(flags & 4),
          tackle: !!(flags & 8),
          power: !!(flags & 16),
          requestPass: !!(flags & 32),
          mobileTackleAssist: !!(flags & 64)
        }
      };
    }
    return { event: packet.e, data: transformKeys(packet.d, EXPANDED_REALTIME_KEYS) };
  } catch {
    return null;
  }
}
