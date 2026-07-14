export function getSessionLeaseLifetime({ coarsePointer = false, maxTouchPoints = 0 } = {}) {
  return coarsePointer || maxTouchPoints > 0 ? 120000 : 30000;
}
