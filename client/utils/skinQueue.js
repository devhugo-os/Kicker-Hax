import { SKIN_NAME_MAX_LENGTH } from '../../shared/constants.js';

export function getUsedSkinRequestIds(allFeatured) {
  return new Set(Object.values(allFeatured || {})
    .flatMap(periods => Object.values(periods || {}))
    .map(item => item?.requestId)
    .filter(Boolean));
}

export function normalizeCommunitySkinName(value) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, SKIN_NAME_MAX_LENGTH);
}

/** Returns every pending request up to today, regardless of submission day. */
export function getPendingSkinRequests(requestsByDay, allFeatured, today) {
  const used = getUsedSkinRequestIds(allFeatured);
  return Object.entries(requestsByDay || {})
    .filter(([requestDay]) => requestDay <= today)
    .flatMap(([requestDay, requests]) => Object.values(requests || {}).map(request => ({ ...request, requestDay })))
    .filter(request => request?.image && request?.uid && !used.has(request.requestId || `${request.requestDay}_${request.uid}`));
}

/** Keeps only the newest pending requests after removing entries already featured. */
export function getSkinQueueCleanup(requestsByDay, allFeatured, today, maxPending = 180) {
  const used = getUsedSkinRequestIds(allFeatured);
  const entries = Object.entries(requestsByDay || {}).flatMap(([requestDay, requests]) =>
    Object.entries(requests || {}).map(([uid, request]) => ({
      uid,
      requestDay,
      requestId: request?.requestId || `${requestDay}_${uid}`,
      createdAt: Number(request?.createdAt || 0)
    })));
  const pending = entries
    .filter(item => item.requestDay <= today && !used.has(item.requestId))
    .sort((a, b) => b.createdAt - a.createdAt);
  const retained = new Set(pending.slice(0, maxPending).map(item => item.requestId));
  return entries.filter(item => used.has(item.requestId) || !retained.has(item.requestId));
}
