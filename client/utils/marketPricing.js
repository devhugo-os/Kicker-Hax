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

const FEATURED_SKIN_VALUES = Object.freeze({ daily: 90, weekly: 180, monthly: 360 });

/**
 * Returns the collection value actually paid for a community skin.
 * Older profiles did not persist this value, so their current showcase is
 * used as a migration hint before falling back to the cheapest showcase.
 */
export function getCommunitySkinInventoryValue(profile, skin, featured = {}) {
  const storedValue = Number(profile?.skinPurchaseValues?.[skin?.id]);
  if (Number.isFinite(storedValue) && storedValue > 0) return storedValue;

  const featuredCadence = Object.entries(featured)
    .find(([, featuredSkin]) => featuredSkin?.id === skin?.id)?.[0];
  if (featuredCadence && FEATURED_SKIN_VALUES[featuredCadence]) {
    return FEATURED_SKIN_VALUES[featuredCadence];
  }

  const assetValue = Number(skin?.value);
  if (Number.isFinite(assetValue) && assetValue > 0) return assetValue;
  return FEATURED_SKIN_VALUES.daily;
}
