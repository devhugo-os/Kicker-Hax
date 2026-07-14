export function buildChestReel(pool, won, { length = 42, winnerIndex = 37, random = Math.random } = {}) {
  if (!Array.isArray(pool) || !pool.length) throw new Error('A roleta precisa de skins.');
  if (!won || winnerIndex < 0 || winnerIndex >= length) throw new Error('Premio invalido para a roleta.');
  return Array.from({ length }, (_, index) => index === winnerIndex
    ? won
    : pool[Math.floor(random() * pool.length)]);
}

export function getReelTargetOffset(viewportWidth, itemLeft, itemWidth) {
  return (Number(viewportWidth) / 2) - (Number(itemLeft) + (Number(itemWidth) / 2));
}
