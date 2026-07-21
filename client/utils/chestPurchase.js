export const MAX_CHEST_PURCHASE_RECEIPTS = 20;

export function normalizeChestPurchaseId(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
}

export function findChestPurchaseReceipt(receipts, purchaseId) {
  const safeId = normalizeChestPurchaseId(purchaseId);
  return (Array.isArray(receipts) ? receipts : []).find(receipt => receipt?.id === safeId) || null;
}

export function appendChestPurchaseReceipt(receipts, receipt, maxCount = MAX_CHEST_PURCHASE_RECEIPTS) {
  const safe = (Array.isArray(receipts) ? receipts : []).filter(item => item?.id && item.id !== receipt?.id);
  return [...safe, receipt].slice(-Math.max(1, maxCount));
}

export function createChestPurchaseId() {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return normalizeChestPurchaseId(`chest_${random}`);
}

export function getDuplicateChestRefund(chestPrice) {
  return Math.floor(Math.max(0, Number(chestPrice) || 0) * 0.25);
}

/** Resolves ownership changes without ever adding the empty-roll marker. */
export function resolveChestReward(ownedSkins, skin, chestPrice) {
  const owned = Array.isArray(ownedSkins) ? [...ownedSkins] : ['rookie'];
  const noPrize = skin?.id === 'no_prize' || skin?.noPrize === true;
  const duplicate = !noPrize && owned.includes(skin?.id);
  const refund = duplicate ? getDuplicateChestRefund(chestPrice) : 0;
  if (!noPrize && !duplicate && skin?.id) owned.push(skin.id);
  return { owned, noPrize, duplicate, refund };
}

export function markChestPurchaseCommitted(pending, result) {
  if (!pending?.purchaseId) return null;
  return {
    ...pending,
    committed: true,
    duplicate: !!result?.duplicate,
    refund: Math.max(0, Number(result?.refund) || 0)
  };
}
