/**
 * Randomizes team roles and guarantees that a multi-player team does not
 * receive the exact same slot assignment on two consecutive kickoffs.
 */
export function assignKickoffSlots(players = [], previousSlots = new Map(), random = Math.random) {
  const ordered = [...players];
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.max(0, Math.min(0.999999, random())) * (index + 1));
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
  }

  const unchanged = ordered.length > 1 && ordered.every((player, slot) => previousSlots.get(player.id) === slot);
  if (unchanged) [ordered[0], ordered[1]] = [ordered[1], ordered[0]];
  return {
    ordered,
    slots: new Map(ordered.map((player, slot) => [player.id, slot]))
  };
}

/** Selects a visibly different formation for local one-versus-one restarts. */
export function pickNextKickoffVariant(previous = -1, count = 3, random = Math.random) {
  const total = Math.max(1, Math.floor(count));
  if (total === 1) return 0;
  const offset = 1 + Math.floor(Math.max(0, Math.min(0.999999, random())) * (total - 1));
  return (Math.max(-1, Number(previous)) + offset + total) % total;
}
