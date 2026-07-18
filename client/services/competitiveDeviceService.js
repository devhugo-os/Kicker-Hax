import { auth, rtdb } from './firebaseService.js';
import { onDisconnect, onValue, ref, remove, runTransaction } from 'firebase/database';

const LEASE_TTL_MS = 30_000;
const HEARTBEAT_MS = 8_000;

function runtimeSessionId() {
  const nativeFrame = new URLSearchParams(window.location.search).get('native') === '1' && window.parent !== window;
  const store = nativeFrame ? localStorage : sessionStorage;
  const key = 'kicker_hax_competitive_session';
  const value = store.getItem(key) || `competitive_${crypto.randomUUID()}`;
  store.setItem(key, value);
  return value;
}

async function deviceFingerprint() {
  const screenLong = Math.max(screen.width || 0, screen.height || 0);
  const screenShort = Math.min(screen.width || 0, screen.height || 0);
  const platform = /android/i.test(navigator.userAgent) ? 'android'
    : /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios'
      : /win/i.test(navigator.platform) ? 'windows'
        : /mac/i.test(navigator.platform) ? 'mac' : 'other';
  const source = [
    platform,
    screenLong,
    screenShort,
    screen.colorDepth || 0,
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0,
    navigator.maxTouchPoints || 0,
    Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  ].join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

class CompetitiveDeviceService {
  constructor() {
    this.sessionId = runtimeSessionId();
    this.deviceId = null;
    this.leaseRef = null;
    this.heartbeat = null;
    this.unsubscribe = null;
    this.disconnectLease = null;
    this.revoked = false;
  }

  async getRef() {
    this.deviceId ||= await deviceFingerprint();
    return ref(rtdb, `competitiveDevices/${this.deviceId}`);
  }

  async claim(username, force = false) {
    const user = auth.currentUser;
    if (!user) throw new Error('Entre na conta para acessar partidas competitivas.');
    const leaseRef = await this.getRef();
    const now = Date.now();
    let conflict = null;
    const result = await runTransaction(leaseRef, current => {
      const expired = !current || Number(current.expiresAt || 0) <= now;
      const owned = current?.uid === user.uid && current?.sessionId === this.sessionId;
      if (!expired && !owned && !force) {
        conflict = current;
        return;
      }
      return {
        uid: user.uid,
        username: String(username || 'Jogador').slice(0, 20),
        sessionId: this.sessionId,
        claimedAt: owned ? Number(current.claimedAt || now) : now,
        updatedAt: now,
        expiresAt: now + LEASE_TTL_MS
      };
    }, { applyLocally: false });
    if (!result.committed) return { accepted: false, conflict };
    await this.startLease(leaseRef, username);
    return { accepted: true };
  }

  async startLease(leaseRef, username) {
    this.stopLeaseWatch();
    this.leaseRef = leaseRef;
    this.revoked = false;
    this.disconnectLease = onDisconnect(leaseRef);
    await this.disconnectLease.remove().catch(() => {});
    this.unsubscribe = onValue(leaseRef, snapshot => {
      const lease = snapshot.val();
      if (!lease || lease.sessionId === this.sessionId || this.revoked) return;
      this.revoked = true;
      this.stopHeartbeat();
      window.dispatchEvent(new CustomEvent('kickerhax:competitive-device-revoked', {
        detail: { username: lease.username || 'outra sessão' }
      }));
    });
    this.heartbeat = window.setInterval(async () => {
      const current = await runTransaction(leaseRef, lease => {
        if (!lease || lease.sessionId !== this.sessionId || lease.uid !== auth.currentUser?.uid) return;
        const now = Date.now();
        return { ...lease, username: String(username || lease.username), updatedAt: now, expiresAt: now + LEASE_TTL_MS };
      }, { applyLocally: false }).catch(() => null);
      if (current && !current.committed) this.stopHeartbeat();
    }, HEARTBEAT_MS);
  }

  stopHeartbeat() {
    if (this.heartbeat) window.clearInterval(this.heartbeat);
    this.heartbeat = null;
  }

  stopLeaseWatch() {
    this.stopHeartbeat();
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.disconnectLease?.cancel?.().catch(() => {});
    this.disconnectLease = null;
  }

  async release() {
    const leaseRef = this.leaseRef || await this.getRef().catch(() => null);
    this.stopLeaseWatch();
    this.leaseRef = null;
    if (!leaseRef) return;
    await runTransaction(leaseRef, lease => {
      if (lease?.sessionId === this.sessionId && lease?.uid === auth.currentUser?.uid) return null;
      return;
    }, { applyLocally: false }).catch(() => {});
  }
}

export const competitiveDeviceService = new CompetitiveDeviceService();
