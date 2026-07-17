const PATCH_FLAG = Symbol.for('kickerHax.unreliableDataChannelPatch');

/**
 * PeerJS maps `reliable: false` only to an unordered RTCDataChannel. Without a
 * retransmit limit, old game snapshots are still resent and can build hundreds
 * of milliseconds of work on lossy long-distance connections. State and input
 * packets are replaceable, while the ordered control channel stays reliable.
 */
export function installLowLatencyDataChannelPatch(runtime = globalThis) {
  const prototype = runtime.RTCPeerConnection?.prototype;
  if (!prototype?.createDataChannel || prototype[PATCH_FLAG]) return false;

  const nativeCreateDataChannel = prototype.createDataChannel;
  prototype.createDataChannel = function createLowLatencyDataChannel(label, options = {}) {
    const realtimeOptions = options?.ordered === false
      && options.maxRetransmits === undefined
      && options.maxPacketLifeTime === undefined
      ? { ...options, maxRetransmits: 0 }
      : options;
    return nativeCreateDataChannel.call(this, label, realtimeOptions);
  };
  Object.defineProperty(prototype, PATCH_FLAG, { value: true });
  return true;
}
