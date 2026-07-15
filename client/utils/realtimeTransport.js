export const MAX_REALTIME_BUFFERED_BYTES = 12 * 1024;

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
