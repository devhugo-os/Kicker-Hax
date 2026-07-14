export function getMissingCoins(balance, price) {
  const safeBalance = Math.max(0, Number(balance) || 0);
  const safePrice = Math.max(0, Number(price) || 0);
  return Math.max(0, safePrice - safeBalance);
}

export function getInsufficientCoinsMessage(balance, price, itemLabel) {
  const missing = getMissingCoins(balance, price);
  const label = String(itemLabel || 'este item').trim();
  return `KX Coins insuficientes para ${label}. Faltam ${missing} KX Coins.`;
}
