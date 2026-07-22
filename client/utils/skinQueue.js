import { SKIN_NAME_MAX_LENGTH } from '../../shared/constants.js';

export const COMMUNITY_SKIN_QUEUE_LIMIT = 10;

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

function stableQueueHash(value) {
  return [...String(value || '')].reduce((hash, char) => ((hash * 33) ^ char.charCodeAt(0)) >>> 0, 2166136261);
}

/**
 * Builds one stable, shuffled-looking queue from pending and previously
 * featured community skins. Hourly showcases walk this queue before looping.
 */
export function getHourlySkinQueue(requestsByDay, allFeatured, today) {
  const unique = new Map();
  Object.entries(requestsByDay || {})
    .filter(([requestDay]) => requestDay <= today)
    .forEach(([requestDay, requests]) => Object.values(requests || {}).forEach(request => {
      if (!request?.image || !request?.uid) return;
      const requestId = request.requestId || `${requestDay}_${request.uid}`;
      unique.set(requestId, { ...request, requestId, requestDay });
    }));

  Object.entries(allFeatured || {}).forEach(([sourceCadence, periods]) => {
    Object.entries(periods || {}).forEach(([sourcePeriod, item]) => {
      if (!item?.image || !item?.requestId || unique.has(item.requestId)) return;
      unique.set(item.requestId, { ...item, sourceCadence, sourcePeriod });
    });
  });

  return [...unique.values()].sort((a, b) => {
    const hashDifference = stableQueueHash(a.requestId) - stableQueueHash(b.requestId);
    return hashDifference || String(a.requestId).localeCompare(String(b.requestId));
  }).slice(0, COMMUNITY_SKIN_QUEUE_LIMIT);
}

export function pickHourlySkin(queue = [], cycleIndex = 0) {
  if (!queue.length) return null;
  const index = ((Number(cycleIndex) % queue.length) + queue.length) % queue.length;
  return queue[index];
}

/** Keeps only the newest pending requests after removing entries already featured. */
export function getSkinQueueCleanup(requestsByDay, allFeatured, today, maxPending = COMMUNITY_SKIN_QUEUE_LIMIT) {
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
