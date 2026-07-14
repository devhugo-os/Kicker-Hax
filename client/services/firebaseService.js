// Kicker Hax - Firebase Auth & Firestore Client Service
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup,
  signInWithCredential,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  orderBy, 
  limit, 
  getDocs,
  deleteDoc,
  runTransaction
} from 'firebase/firestore';
import { getDatabase, ref, push, onChildAdded, onValue, serverTimestamp, query as rtdbQuery, orderByChild, endAt, get, update, set, remove, onDisconnect, runTransaction as runRtdbTransaction } from 'firebase/database';
import { groupSeasonHistoryByUid, mergeCompetitiveHistoryStats } from '../utils/statReconciliation.js';
import { getPendingSkinRequests, getSkinQueueCleanup, normalizeCommunitySkinName } from '../utils/skinQueue.js';
import { getSessionLeaseLifetime } from '../utils/sessionLease.js';
import { getInsufficientCoinsMessage } from '../utils/marketPricing.js';
import { appendChestPurchaseReceipt, findChestPurchaseReceipt, getDuplicateChestRefund, normalizeChestPurchaseId } from '../utils/chestPurchase.js';
import { getWritableHistoryUids } from '../utils/matchHistory.js';
import { findStaffProfileByRole } from '../utils/staffProfiles.js';
import { CHAT_MESSAGE_MAX_LENGTH, SKIN_IMAGE_MAX_BYTES, SKIN_NAME_MAX_LENGTH } from '../../shared/constants.js';

const _dec = (val) => atob(val);
const firebaseConfig = {
  apiKey: _dec("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),
  authDomain: _dec("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzZWFwcC5jb20="),
  databaseURL: _dec("aHR0cHM6Ly9raWNrZXJoYXgtb25saW5lLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="),
  projectId: _dec("a2lja2VyaGF4LW9ubGluZQ=="),
  storageBucket: _dec("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzdG9yYWdlLmFwcA=="),
  messagingSenderId: _dec("MzM3NTk4NDY1MTcw"),
  appId: _dec("MTozMzc1OTg0NjUxNzA6d2ViOjE5MDU0YWI4NDBkODBkMmMyMDUyNGI="),
  measurementId: _dec("Ry0xWjhWN0NWRkcw")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Explicit local persistence keeps an authenticated mobile browser session after
// Firebase returns from Google. Some Android browsers otherwise recreate a
// temporary session while restoring the redirected tab.
const authPersistenceReady = setPersistence(auth, browserLocalPersistence)
  .catch(err => console.warn('[Auth] Local persistence was not enabled:', err));
const db = getFirestore(app);
const rtdb = getDatabase(app);
// A visible data reset for the 9.7 season. Old documents are intentionally
// retained in Firebase for audit safety, but no longer affect game UI/ranking.
export const CURRENT_SEASON_ID = '21.0';
export const CURRENT_COSMETIC_RESET_ID = '21.0';
const normalizeCosmetics = profile => profile?.cosmeticResetId === CURRENT_COSMETIC_RESET_ID
  ? profile
  : { ...profile, ownedSkins: ['rookie'], equippedSkinId: 'rookie', equippedSkinImage: null };
const emptySeasonStats = uid => ({
  uid,
  seasonId: CURRENT_SEASON_ID,
  matchesPlayed: 0, wins: 0, losses: 0, draws: 0, goals: 0, shots: 0,
  dribbles: 0, assists: 0, ownGoals: 0, mvps: 0, tackles: 0, possessionTotal: 0,
  possessionMatches: 0, processedMatchIds: {}
});
const getLaunchParams = () => new URLSearchParams(window.location.search);
const NATIVE_AUTH_MESSAGE = 'KICKER_HAX_NATIVE_GOOGLE';
const NATIVE_LOGIN_REQUEST = 'KICKER_HAX_NATIVE_LOGIN_REQUEST';
const SESSION_LEASE_VERSION = typeof __KICKER_HAX_VERSION__ !== 'undefined' ? __KICKER_HAX_VERSION__ : '24.0.0';
const isPermissionError = error => String(error?.code || error?.message || '').toLowerCase().includes('permission');

function isNativeCompanionFrame() {
  return getLaunchParams().get('native') === '1' && window.parent !== window;
}

const sessionStorageForRuntime = isNativeCompanionFrame() ? localStorage : sessionStorage;

const nativeAuthReady = (async () => {
  if (!isNativeCompanionFrame()) return null;

  return new Promise(resolve => {
    let settled = false;
    let unsubscribeAuth = () => {};
    const finish = result => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', receiveNativeToken);
      unsubscribeAuth();
      clearTimeout(timeout);
      resolve(result);
    };
    const receiveNativeToken = async event => {
      if (event.source !== window.parent || event.data?.type !== NATIVE_AUTH_MESSAGE) return;
      const accessToken = String(event.data.accessToken || '');
      if (!accessToken) return finish(null);
      try {
        await authPersistenceReady;
        // Google Play Services authenticates natively; Firebase receives the
        // access token inside this WebView, so no external browser is involved.
        finish(await signInWithCredential(auth, GoogleAuthProvider.credential(null, accessToken)));
      } catch (err) {
        console.error('[Auth] Native Google credential was rejected:', err);
        window.parent.postMessage({ type: 'KICKER_HAX_NATIVE_AUTH_FAILED' }, '*');
        finish(null);
      }
    };
    const timeout = setTimeout(() => finish(null), 15000);
    window.addEventListener('message', receiveNativeToken);
    // A previous Firebase session is enough to open the game. Do not hold the
    // app on its launcher while Google Play Services refreshes silently.
    unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) finish(user);
    });
    window.parent.postMessage({ type: 'KICKER_HAX_NATIVE_READY' }, '*');
  });
})().catch(err => {
  console.error('[Auth] Failed to initialize native authentication:', err);
  return null;
});

export const firebaseService = {
  // The Cordova frame survives app restarts as the same device. A stable ID
  // avoids treating that restored Firebase login as a second browser session.
  sessionId: sessionStorageForRuntime.getItem('kicker_hax_session_id') || `session_${Math.random().toString(36).slice(2)}_${Date.now()}`,

  // Authentication methods
  async loginWithGoogle() {
    if (isNativeCompanionFrame()) {
      // The enclosing Cordova page owns Google Play Services and replies with
      // a native access token. Never send app users to the system browser.
      window.parent.postMessage({ type: NATIVE_LOGIN_REQUEST }, '*');
      return null;
    }
    await authPersistenceReady;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    await this.ensureUserProfile(result.user);
    return result;
  },

  async bootstrapAuth() {
    await nativeAuthReady;
  },

  async ensureUserProfile(user) {
    if (!user) return null;

    // Check if this is the first login by verifying if a profile exists
    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
      // First login, register default profile and stats
      const randomTag = Math.floor(Math.random() * 9000) + 1000;
      const safeName = (user.displayName || 'Jogador').replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const generatedUsername = `${safeName}${randomTag}`.substring(0, 12);

      const userProfile = {
        uid: user.uid,
        username: generatedUsername,
        displayName: generatedUsername,
        badge: '👤', // Default badge
        bio: '',
        level: 1,
        xp: 0,
        coins: 0,
        ownedSkins: ['rookie'],
        equippedSkinId: 'rookie',
        cosmeticResetId: CURRENT_COSMETIC_RESET_ID,
        seasonId: CURRENT_SEASON_ID,
        isNewUser: true, // Mark as new user to force username pick
        dateCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        settings: {
          volume: 80,
          quality: 'high',
          fieldSize: 'medium'
        }
      };

      const userStats = emptySeasonStats(user.uid);

      await setDoc(doc(db, 'users', user.uid), userProfile);
      await setDoc(doc(db, 'stats', user.uid), userStats);
    } else {
      // Update last login
      const existing = profileSnap.data();
      const statsRef = doc(db, 'stats', user.uid);
      const statsSnap = await getDoc(statsRef);
      const statsNeedReset = !statsSnap.exists() || statsSnap.data().seasonId !== CURRENT_SEASON_ID;
      if (existing.seasonId !== CURRENT_SEASON_ID) {
        // A season migration preserves identity/settings but resets every
        // progression and cosmetic value exactly once for this account.
        await updateDoc(profileRef, {
          lastLogin: new Date().toISOString(),
          seasonId: CURRENT_SEASON_ID,
          level: 1,
          xp: 0,
          coins: 0,
          ownedSkins: ['rookie'],
          equippedSkinId: 'rookie',
          equippedSkinImage: null,
          cosmeticResetId: CURRENT_COSMETIC_RESET_ID,
          processedXpMatchIds: {}
        });
      } else if (existing.cosmeticResetId !== CURRENT_COSMETIC_RESET_ID) {
        // Version 10.0 starts a fresh cosmetic collection without touching the
        // current season's XP, coins or competitive statistics.
        await updateDoc(profileRef, {
          lastLogin: new Date().toISOString(),
          ownedSkins: ['rookie'],
          equippedSkinId: 'rookie',
          equippedSkinImage: null,
          cosmeticResetId: CURRENT_COSMETIC_RESET_ID
        });
      } else {
        await updateDoc(profileRef, { lastLogin: new Date().toISOString() });
      }
      // Retry the stats half independently. This repairs accounts whose user
      // document migrated before older Firestore rules rejected the reset.
      if (statsNeedReset) {
        await setDoc(statsRef, emptySeasonStats(user.uid)).catch(error => {
          // Profile/login must remain usable while an administrator publishes
          // the season-reset rule. Competitive persistence retries later.
          const warningKey = `kicker_hax_stats_reset_warning_${CURRENT_SEASON_ID}_${user.uid}`;
          if (!sessionStorage.getItem(warningKey)) {
            sessionStorage.setItem(warningKey, '1');
            console.warn('[Kicker Stats] Reset sazonal aguardando regras do Firestore:', error);
          }
        });
      }
    }

    // Recover results that the host recorded while this account was offline.
    // All writes remain scoped to the authenticated user's own documents.
    await this.reconcileMatchHistory(user.uid).catch(error => {
      console.warn('[Kicker Stats] Não foi possível reconciliar resultados pendentes:', error);
    });
    return await this.getUserProfile(user.uid);
  },

  async logout() {
    if (auth.currentUser) {
      await remove(ref(rtdb, `activeSessions/${auth.currentUser.uid}`)).catch(() => {});
    }
    return await signOut(auth);
  },

  subscribeToAuth(callback) {
    return onAuthStateChanged(auth, callback);
  },

  async claimActiveSession(user, force = false) {
    sessionStorageForRuntime.setItem('kicker_hax_session_id', this.sessionId);
    const sessionRef = ref(rtdb, `activeSessions/${user.uid}`);
    try {
      const snapshot = await get(sessionRef);
      const current = snapshot.val();
      const now = Date.now();
      const sameRelease = current?.leaseVersion === SESSION_LEASE_VERSION;
      const mobileLease = window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
      const leaseLifetime = getSessionLeaseLifetime({ coarsePointer: mobileLease, maxTouchPoints: navigator.maxTouchPoints });
      if (!force && sameRelease && current?.sessionId && current.sessionId !== this.sessionId && now - (current.timestamp || 0) < leaseLifetime) {
        const error = new Error('Esta conta ja esta aberta em outro navegador ou computador.');
        error.code = 'active-session';
        throw error;
      }
      await set(sessionRef, {
        uid: user.uid,
        sessionId: this.sessionId,
        leaseVersion: SESSION_LEASE_VERSION,
        timestamp: now
      });
      onDisconnect(sessionRef).remove();
    } catch (error) {
      // A missing RTDB rule must not lock the account out of the game. The
      // single-session guard becomes best-effort until rules are deployed.
      if (isPermissionError(error)) {
        console.warn('[Session] Regra activeSessions indisponível; acesso liberado nesta tela.', error);
        return false;
      }
      throw error;
    }
    if (this.sessionInterval) {
      clearInterval(this.sessionInterval);
    }
    this.sessionInterval = setInterval(async () => {
      if (auth.currentUser?.uid !== user.uid) return;
      try {
        const activeSnapshot = await get(sessionRef);
        if (activeSnapshot.val()?.sessionId !== this.sessionId) {
          clearInterval(this.sessionInterval);
          this.sessionInterval = null;
          return;
        }
        await update(sessionRef, { timestamp: Date.now(), leaseVersion: SESSION_LEASE_VERSION });
      } catch (error) {
        // Connectivity/rules failures are retried by the next heartbeat and
        // must never eject an already authenticated player.
        console.warn('[Session] Nao foi possivel renovar a sessao ativa:', error);
      }
    }, 15000);
    return true;
  },

  // Firestore reading / writing
  async getUserProfile(uid) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? normalizeCosmetics(docSnap.data()) : null;
  },

  async updateUserProfile(uid, data) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  },

  async getUserStats(uid) {
    const docRef = doc(db, 'stats', uid);
    const docSnap = await getDoc(docRef);
    const stored = docSnap.exists() && docSnap.data().seasonId === CURRENT_SEASON_ID
      ? docSnap.data()
      : emptySeasonStats(uid);
    try {
      const history = await this.getRecentHistory(uid, 20);
      return mergeCompetitiveHistoryStats(stored, history, uid);
    } catch (error) {
      console.warn('[Kicker Stats] Histórico indisponível para reconciliação visual:', error);
    }
    return stored;
  },

  async getStaffProfile(role) {
    const normalizedRole = ['developer', 'influencer'].includes(role) ? role : '';
    if (!normalizedRole) return null;
    const exactSnapshot = await getDocs(query(
      collection(db, 'users'),
      where('staffRole', '==', normalizedRole),
      limit(1)
    ));
    const exactProfile = exactSnapshot.docs[0];
    if (exactProfile) return normalizeCosmetics({ uid: exactProfile.id, ...exactProfile.data() });

    // Older assignments can contain capitalization or surrounding spaces.
    // Credits must normalize them exactly like profile and gameplay tags do.
    const allProfiles = await getDocs(collection(db, 'users'));
    const profile = findStaffProfileByRole(
      allProfiles.docs.map(profileDoc => ({ uid: profileDoc.id, ...profileDoc.data() })),
      normalizedRole
    );
    return profile ? normalizeCosmetics(profile) : null;
  },

  async saveMatchResult(uid, isWin, isLoss, isDraw, goals, shots, dribbles, assists, ownGoals, isMvp, xpGained, tackles = 0, possessionPct = 0, matchId = null, coinReward = 0) {
    const statsRef = doc(db, 'stats', uid);
    const userRef = doc(db, 'users', uid);
    const safeMatchId = matchId ? String(matchId).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) : null;

    await runTransaction(db, async (transaction) => {
      const statsSnap = await transaction.get(statsRef);
      const userSnap = await transaction.get(userRef);

      if (!statsSnap.exists() || !userSnap.exists()) {
        throw new Error("Documento não encontrado");
      }

      const stats = statsSnap.data();
      const user = userSnap.data();
      const seasonStats = stats.seasonId === CURRENT_SEASON_ID ? stats : emptySeasonStats(uid);
      const seasonUser = user.seasonId === CURRENT_SEASON_ID ? user : { ...user, level: 1, xp: 0, processedXpMatchIds: {} };
      const processedMatchIds = seasonStats.processedMatchIds || {};
      if (safeMatchId && processedMatchIds[safeMatchId]) {
        return;
      }

      // Update statistics
      const updatedStats = {
        ...seasonStats,
        seasonId: CURRENT_SEASON_ID,
        matchesPlayed: (seasonStats.matchesPlayed || 0) + 1,
        wins: (seasonStats.wins || 0) + (isWin ?1 : 0),
        losses: (seasonStats.losses || 0) + (isLoss ?1 : 0),
        draws: (seasonStats.draws || 0) + (isDraw ?1 : 0),
        goals: (seasonStats.goals || 0) + goals,
        shots: (seasonStats.shots || 0) + shots,
        dribbles: (seasonStats.dribbles || 0) + dribbles,
        assists: (seasonStats.assists || 0) + assists,
        ownGoals: (seasonStats.ownGoals || 0) + ownGoals,
        mvps: (seasonStats.mvps || 0) + (isMvp ?1 : 0),
        tackles: (seasonStats.tackles || 0) + tackles,
        possessionTotal: (seasonStats.possessionTotal || 0) + possessionPct,
        possessionMatches: (seasonStats.possessionMatches || 0) + 1,
        processedMatchIds: safeMatchId
          ? { ...processedMatchIds, [safeMatchId]: true }
          : processedMatchIds
      };

      // Update XP & level calculations
      let currentXp = (seasonUser.xp || 0) + xpGained;
      let currentLevel = seasonUser.level || 1;
      let xpNeeded = currentLevel * 100;

      while (currentXp >= xpNeeded) {
        currentXp -= xpNeeded;
        currentLevel++;
        xpNeeded = currentLevel * 100;
      }

      transaction.update(statsRef, updatedStats);
      transaction.update(userRef, {
        xp: currentXp,
        level: currentLevel,
        coins: Math.max(0, (seasonUser.coins || 0) + Math.max(0, coinReward || 0)),
        seasonId: CURRENT_SEASON_ID,
        lastLogin: new Date().toISOString()
      });
    });
  },

  async purchaseSkinChest(uid, chest, skin, purchaseId) {
    const userRef = doc(db, 'users', uid);
    const safePurchaseId = normalizeChestPurchaseId(purchaseId);
    if (!safePurchaseId) throw new Error('A abertura do baú não possui um identificador válido.');
    return runTransaction(db, async transaction => {
      const snap = await transaction.get(userRef);
      if (!snap.exists()) throw new Error('Perfil não encontrado.');
      const profile = snap.data();
      const coins = Number(profile.coins || 0);
      const previous = findChestPurchaseReceipt(profile.chestPurchaseReceipts, safePurchaseId);
      if (previous) {
        return {
          ...previous,
          recovered: true,
          profile: { coins, ownedSkins: profile.ownedSkins || ['rookie'] }
        };
      }
      if (coins < chest.price) {
        throw new Error(getInsufficientCoinsMessage(coins, chest.price, `abrir o ${chest.name}`));
      }
      const owned = Array.isArray(profile.ownedSkins) ? [...profile.ownedSkins] : ['rookie'];
      const duplicate = owned.includes(skin.id);
      // The refund is committed together with the receipt. If the app closes,
      // replaying the same purchase ID returns this receipt without charging
      // again, while preserving the already-applied 25% duplicate refund.
      const refund = duplicate ? getDuplicateChestRefund(chest.price) : 0;
      if (!duplicate) owned.push(skin.id);
      const receipt = {
        id: safePurchaseId,
        chestId: chest.id,
        skinId: skin.id,
        duplicate,
        refund,
        createdAt: Date.now()
      };
      const next = {
        coins: coins - chest.price + refund,
        ownedSkins: owned,
        chestPurchaseReceipts: appendChestPurchaseReceipt(profile.chestPurchaseReceipts, receipt)
      };
      transaction.update(userRef, next);
      return { ...receipt, profile: next };
    });
  },

  async equipSkin(uid, skin) {
    const payload = {
      equippedSkinId: skin.id,
      equippedSkinImage: skin.custom ? skin.image : null
    };
    await updateDoc(doc(db, 'users', uid), payload);
    return payload;
  },

  async purchaseDailySkin(uid, skin, price) {
    if (!skin?.id || !skin?.image) throw new Error('Esta skin ainda não está disponível para compra.');
    const userRef = doc(db, 'users', uid);
    const assetRef = ref(rtdb, `skinAssets/${skin.id}`);
    const assetSnapshot = await get(assetRef);
    if (!assetSnapshot.exists()) {
      await set(assetRef, { name: skin.name || 'Skin da comunidade', image: skin.image, creatorUid: skin.creatorUid || '' });
    }
    const next = await runTransaction(db, async transaction => {
      const snap = await transaction.get(userRef);
      if (!snap.exists()) throw new Error('Perfil não encontrado.');
      const profile = snap.data();
      const coins = Number(profile.coins || 0);
      if (coins < price) {
        throw new Error(getInsufficientCoinsMessage(coins, price, 'comprar a skin selecionada'));
      }
      const owned = Array.isArray(profile.ownedSkins) ? [...profile.ownedSkins] : ['rookie'];
      if (owned.includes(skin.id)) throw new Error('Você já possui esta skin.');
      owned.push(skin.id);
      const updated = { coins: coins - price, ownedSkins: owned };
      transaction.update(userRef, updated);
      return updated;
    });
    return next;
  },

  async getSkinAsset(id) {
    const snapshot = await get(ref(rtdb, `skinAssets/${id}`));
    return snapshot.exists() ? { id, ...snapshot.val(), custom: true } : null;
  },

  skinDayKey(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  },

  async hasSkinRequestToday(uid) {
    const snapshot = await get(ref(rtdb, `skinRequests/${this.skinDayKey()}/${uid}`));
    return snapshot.exists();
  },

  async submitSkinRequest(uid, username, skinName, image) {
    const name = normalizeCommunitySkinName(skinName);
    if (name.length < 3 || name.length > SKIN_NAME_MAX_LENGTH) throw new Error(`O nome da skin deve ter entre 3 e ${SKIN_NAME_MAX_LENGTH} caracteres.`);
    const imageMatch = String(image || '').match(/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/);
    const padding = imageMatch?.[2].endsWith('==') ? 2 : imageMatch?.[2].endsWith('=') ? 1 : 0;
    const imageBytes = imageMatch ? Math.max(0, Math.floor(imageMatch[2].length * 3 / 4) - padding) : 0;
    if (!imageMatch || imageBytes > SKIN_IMAGE_MAX_BYTES) throw new Error('A skin precisa ser PNG ou JPG e ter no máximo 500 KB.');
    const day = this.skinDayKey();
    const requestRef = ref(rtdb, `skinRequests/${day}/${uid}`);
    const result = await runRtdbTransaction(requestRef, current => current
      ? undefined
      : { uid, username, name, image, createdAt: Date.now(), day, requestId: `${day}_${uid}` });
    if (!result.committed) throw new Error('Você já enviou uma solicitação hoje.');
  },

  skinPeriodKey(cadence, date = new Date()) {
    if (cadence === 'daily') return this.skinDayKey(date);
    if (cadence === 'monthly') return this.skinDayKey(date).slice(0, 7);
    const local = new Date(`${this.skinDayKey(date)}T12:00:00`);
    const weekday = (local.getDay() + 6) % 7;
    local.setDate(local.getDate() - weekday);
    return this.skinDayKey(local);
  },

  async getFeaturedSkin(cadence) {
    const period = this.skinPeriodKey(cadence);
    const featuredRoot = ref(rtdb, `skinFeatured/${cadence}`);
    const featuredSnapshot = await get(featuredRoot);
    const featured = featuredSnapshot.val() || {};
    if (featured[period]) return featured[period];
    const previous = Object.keys(featured).sort().map(key => featured[key]).at(-1) || null;
    const [requestsSnapshot, allFeaturedSnapshot] = await Promise.all([
      get(ref(rtdb, 'skinRequests')),
      get(ref(rtdb, 'skinFeatured'))
    ]);
    const requestsByDay = requestsSnapshot.val() || {};
    const candidates = getPendingSkinRequests(requestsByDay, allFeaturedSnapshot.val() || {}, this.skinDayKey());
    if (!candidates.length) {
      if (!previous) return null;
      const carried = { ...previous, period, carried: true };
      const carryResult = await runRtdbTransaction(ref(rtdb, `skinFeatured/${cadence}/${period}`), current => current || carried);
      return carryResult.snapshot.val();
    }
    const hash = [...`${cadence}_${period}`].reduce((sum, char) => ((sum * 31) + char.charCodeAt(0)) >>> 0, 7);
    const winner = candidates[hash % candidates.length];
    const requestId = winner.requestId || `${winner.requestDay}_${winner.uid}`;
    const selected = {
      id: `community_${requestId.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
      name: normalizeCommunitySkinName(winner.name) || 'Skin da comunidade',
      username: winner.username,
      creatorUid: winner.uid,
      image: winner.image,
      requestId,
      requestDay: winner.requestDay,
      cadence,
      period
    };
    const committed = await runRtdbTransaction(ref(rtdb, `skinFeatured/${cadence}/${period}`), current => current || selected);
    return committed.snapshot.val();
  },

  async getFeaturedSkins() {
    // Resolve sequentially so one pending request cannot win two vitrines
    // during the same page load before the first selection is persisted.
    const daily = await this.getFeaturedSkin('daily');
    const weekly = await this.getFeaturedSkin('weekly');
    const monthly = await this.getFeaturedSkin('monthly');
    const result = { daily, weekly, monthly };
    this.cleanupSkinRequestQueue().catch(error => console.warn('[Kicker Market] Limpeza da fila adiada:', error));
    return result;
  },

  async cleanupSkinRequestQueue(maxPending = 180) {
    const [requestsSnapshot, featuredSnapshot] = await Promise.all([
      get(ref(rtdb, 'skinRequests')),
      get(ref(rtdb, 'skinFeatured'))
    ]);
    const cleanup = getSkinQueueCleanup(
      requestsSnapshot.val() || {},
      featuredSnapshot.val() || {},
      this.skinDayKey(),
      maxPending
    );
    if (!cleanup.length) return 0;
    const removals = Object.fromEntries(cleanup.map(item => [`${item.requestDay}/${item.uid}`, null]));
    await update(ref(rtdb, 'skinRequests'), removals);
    return cleanup.length;
  },

  async saveXpOnly(uid, xpGained, matchId = null) {
    const userRef = doc(db, 'users', uid);
    const safeMatchId = matchId ? String(matchId).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) : null;
    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error("Documento nao encontrado");
      }

      const user = userSnap.data();
      const seasonUser = user.seasonId === CURRENT_SEASON_ID ? user : { ...user, level: 1, xp: 0, processedXpMatchIds: {} };
      const processedXpMatchIds = seasonUser.processedXpMatchIds || {};
      if (safeMatchId && processedXpMatchIds[safeMatchId]) {
        return;
      }
      let currentXp = (seasonUser.xp || 0) + Math.max(0, xpGained || 0);
      let currentLevel = seasonUser.level || 1;
      let xpNeeded = currentLevel * 100;

      while (currentXp >= xpNeeded) {
        currentXp -= xpNeeded;
        currentLevel++;
        xpNeeded = currentLevel * 100;
      }

      transaction.update(userRef, {
        xp: currentXp,
        level: currentLevel,
        seasonId: CURRENT_SEASON_ID,
        lastLogin: new Date().toISOString(),
        ...(safeMatchId ? { [`processedXpMatchIds.${safeMatchId}`]: true } : {})
      });
    });
  },

  async addMatchToHistory(matchData) {
    const safeId = String(matchData.matchId || `${matchData.date}-${(matchData.playerUids || []).join('-')}`)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 120);
    const category = matchData.competitive || matchData.category === 'competitive' ? 'competitive' : 'casual';
    // Every participant writes only its own immutable receipt. This respects
    // Firestore ownership rules and avoids one unauthorized peer write
    // invalidating an otherwise successful casual result.
    const writableUids = getWritableHistoryUids(matchData.playerUids, auth.currentUser?.uid);
    if (!writableUids.length) throw new Error('Usuário atual não pertence ao resultado da partida.');
    await Promise.all(writableUids.map(async uid => {
      const historyRef = doc(db, 'history', `${uid}_${safeId}`);
      const existing = await getDoc(historyRef);
      if (!existing.exists()) {
        try {
          await setDoc(historyRef, { ...matchData, playerUids: [uid], seasonId: CURRENT_SEASON_ID });
        } catch (error) {
          // Host and guest can finish simultaneously. If the immutable record
          // now exists, the competing create succeeded and this is not a loss.
          if (!(await getDoc(historyRef)).exists()) throw error;
        }
      }
      await this.trimHistoryCategory(uid, category);
    }));
  },

  async reconcileMatchHistory(uid) {
    if (!uid) return;
    const history = await this.getRecentHistory(uid, 20);
    for (const match of history) {
      const matchId = match.matchId || match.id;
      if (!matchId) continue;
      const team = match.playerTeams?.[uid];
      if (team === undefined || team === null || team === 'spectator') continue;
      const winner = match.winner;
      const isDraw = winner === 'draw';
      const isWin = !isDraw && String(team) === String(winner);
      const isLoss = !isDraw && !isWin;
      const stats = (match.playerStats || []).find(item => item.uid === uid) || {};
      const isMvp = match.mvp?.uid === uid || match.mvpUid === uid;
      const xp = isWin ? 80 : isDraw ? 30 : 15;
      if (match.competitive || match.category === 'competitive') {
        const coins = isWin ? 30 : isDraw ? 18 : 10;
        await this.saveMatchResult(
          uid, isWin, isLoss, isDraw,
          stats.goals || 0, stats.shots || 0, stats.dribbles || 0,
          stats.assists || 0, stats.ownGoals || 0, isMvp, xp, stats.tackles || 0,
          stats.possessionPct || 0, matchId, coins
        );
      } else {
        await this.saveXpOnly(uid, xp, matchId);
      }
    }
  },

  /** Retains the ten newest games independently for casual and competitive play. */
  async trimHistoryCategory(uid, category) {
    if (!uid) return;
    const historyRef = collection(db, 'history');
    const snapshots = await getDocs(query(historyRef, where('playerUids', 'array-contains', uid)));
    const matches = snapshots.docs
      .map(snapshot => ({ ref: snapshot.ref, ...snapshot.data() }))
      .filter(match => match.seasonId === CURRENT_SEASON_ID)
      .filter(match => (match.competitive || match.category === 'competitive') ? category === 'competitive' : category === 'casual')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    await Promise.all(matches.slice(10).map(match => deleteDoc(match.ref)));
  },

  async getRecentHistory(uid, limitCount = 100) {
    const historyRef = collection(db, 'history');
    // Read the complete per-user receipt set before filtering by season. A
    // pre-filter limit can let legacy documents hide the newest season games.
    const q = query(historyRef, where('playerUids', 'array-contains', uid));
    const querySnapshot = await getDocs(q);
    const byMatch = new Map();
    querySnapshot.forEach(d => {
      const data = { id: d.id, ...d.data() };
      const key = data.matchId || d.id;
      if (!byMatch.has(key)) byMatch.set(key, data);
    });
    const list = [...byMatch.values()]
      .filter(match => match.seasonId === CURRENT_SEASON_ID)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    // Shared legacy documents remain readable, but the visible history must
    // always keep ten casual and ten competitive games per player.
    const competitive = list.filter(match => match.competitive || match.category === 'competitive').slice(0, 10);
    const casual = list.filter(match => !(match.competitive || match.category === 'competitive')).slice(0, 10);
    return [...competitive, ...casual]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, Math.max(20, limitCount));
  },

  async getGlobalRanking(criteria = 'wins', maxCount = 10) {
    try {
      const [querySnapshot, statsSnapshot, historySnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'stats')),
        getDocs(collection(db, 'history'))
      ]);
      const statsByUid = new Map(statsSnapshot.docs.map(statsDoc => [statsDoc.id, statsDoc.data()]));
      const historyByUid = groupSeasonHistoryByUid(
        historySnapshot.docs.map(historyDoc => ({ id: historyDoc.id, ...historyDoc.data() })),
        CURRENT_SEASON_ID
      );
      let ranking = [];

      for (const userDoc of querySnapshot.docs) {
        const userData = normalizeCosmetics(userDoc.data());
        const uid = userData.uid || userDoc.id;
        if (!uid) continue;
        const rawStats = statsByUid.get(uid) || {};
        const storedStats = rawStats.seasonId === CURRENT_SEASON_ID ? rawStats : {};
        // Match receipts are the durable fallback when a client could save
        // history but its stats transaction was interrupted or rejected.
        const statsData = mergeCompetitiveHistoryStats(storedStats, historyByUid.get(uid) || [], uid);
        const seasonActive = userData.seasonId === CURRENT_SEASON_ID;
        ranking.push({
          uid,
          username: userData.username,
          displayName: userData.username,
          badge: userData.badge || '🏳️',
          equippedSkinId: userData.equippedSkinId || 'rookie',
          equippedSkinImage: userData.equippedSkinImage || null,
          staffRole: userData.staffRole || '',
          level: seasonActive ? (userData.level || 1) : 1,
          wins: statsData.wins || 0,
          losses: statsData.losses || 0,
          draws: statsData.draws || 0,
          matchesPlayed: statsData.matchesPlayed || 0,
          goals: statsData.goals || 0,
          shots: statsData.shots || 0,
          dribbles: statsData.dribbles || 0,
          assists: statsData.assists || 0,
          ownGoals: statsData.ownGoals || 0,
          tackles: statsData.tackles || 0,
          possessionAvg: (statsData.matchesPlayed || 0) > 0
            ? Math.round((statsData.possessionTotal || 0) / (statsData.matchesPlayed || 1))
            : 0,
          mvps: statsData.mvps || 0,
          xp: seasonActive ? (userData.xp || 0) : 0,
          // Wallet balance belongs to the user document and remains rankable
          // even if competitive statistics are waiting for season migration.
          coins: Number(userData.coins || 0),
          skinCount: Array.isArray(userData.ownedSkins)
            ? new Set(userData.ownedSkins.filter(id => id !== 'rookie')).size
            : 0
        });
      }

      // Filter out players who have 0 or less in the selected criteria
      ranking = ranking.filter(r => {
        if (criteria === 'level') return (r.level || 0) > 0;
        if (criteria === 'wins') return (r.wins || 0) > 0;
        if (criteria === 'goals') return (r.goals || 0) > 0;
        if (criteria === 'shots') return (r.shots || 0) > 0;
        if (criteria === 'dribbles') return (r.dribbles || 0) > 0;
        if (criteria === 'assists') return (r.assists || 0) > 0;
        if (criteria === 'matches') return (r.matchesPlayed || 0) > 0;
        if (criteria === 'mvps') return (r.mvps || 0) > 0;
        if (criteria === 'losses') return (r.losses || 0) > 0;
        if (criteria === 'draws') return (r.draws || 0) > 0;
        if (criteria === 'ownGoals') return (r.ownGoals || 0) > 0;
        if (criteria === 'tackles') return (r.tackles || 0) > 0;
        if (criteria === 'possession') return (r.possessionAvg || 0) > 0;
        if (criteria === 'coins') return r.coins > 0;
        if (criteria === 'skins') return r.skinCount > 0;
        if (criteria === 'overall') {
          const score = (r.wins * 8) + (r.goals * 5) + (r.mvps * 10) + (r.dribbles * 2) + r.shots + (r.matchesPlayed * 0.5) - (r.losses * 2);
          return score > 0;
        }
        return true;
      });

      // Sort in-memory in Javascript
      if (criteria === 'level') {
        ranking.sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          return b.xp - a.xp;
        });
      } else if (criteria === 'wins') {
        ranking.sort((a, b) => b.wins - a.wins);
      } else if (criteria === 'goals') {
        ranking.sort((a, b) => b.goals - a.goals);
      } else if (criteria === 'shots') {
        ranking.sort((a, b) => b.shots - a.shots);
      } else if (criteria === 'dribbles') {
        ranking.sort((a, b) => b.dribbles - a.dribbles);
      } else if (criteria === 'assists') {
        ranking.sort((a, b) => b.assists - a.assists);
      } else if (criteria === 'matches') {
        ranking.sort((a, b) => b.matchesPlayed - a.matchesPlayed);
      } else if (criteria === 'mvps') {
        ranking.sort((a, b) => b.mvps - a.mvps);
      } else if (criteria === 'losses') {
        ranking.sort((a, b) => b.losses - a.losses);
      } else if (criteria === 'draws') {
        ranking.sort((a, b) => b.draws - a.draws);
      } else if (criteria === 'ownGoals') {
        ranking.sort((a, b) => b.ownGoals - a.ownGoals);
      } else if (criteria === 'tackles') {
        ranking.sort((a, b) => b.tackles - a.tackles);
      } else if (criteria === 'possession') {
        ranking.sort((a, b) => b.possessionAvg - a.possessionAvg);
      } else if (criteria === 'coins') {
        ranking.sort((a, b) => b.coins - a.coins);
      } else if (criteria === 'skins') {
        ranking.sort((a, b) => b.skinCount - a.skinCount || b.coins - a.coins);
      } else if (criteria === 'overall') {
        ranking.sort((a, b) => {
          const scoreA = (a.wins * 8) + (a.goals * 5) + (a.mvps * 10) + (a.dribbles * 2) + a.shots + (a.matchesPlayed * 0.5) - (a.losses * 2);
          const scoreB = (b.wins * 8) + (b.goals * 5) + (b.mvps * 10) + (b.dribbles * 2) + b.shots + (b.matchesPlayed * 0.5) - (b.losses * 2);
          return scoreB - scoreA;
        });
      }

      return ranking.slice(0, maxCount);
    } catch (e) {
      console.error("[Firestore] Error fetching ranking:", e);
      throw e;
    }
  },

  async isUsernameUnique(username, uid) {
    const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    let unique = true;
    querySnapshot.forEach((docSnap) => {
      if (docSnap.id !== uid) {
        unique = false;
      }
    });
    return unique;
  },

  // ==========================================================================
  // REALTIME DATABASE (GLOBAL CHAT)
  // ==========================================================================
  async pruneOldChatMessages() {
    try {
      const chatRef = ref(rtdb, 'globalChat');
      const twoHoursAgo = Date.now() - 7200000;
      const oldQuery = rtdbQuery(chatRef, orderByChild('timestamp'), endAt(twoHoursAgo));
      const snapshot = await get(oldQuery);
      const allSnapshot = await get(chatRef);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = null;
        });
        await update(chatRef, updates);
      }
      if (allSnapshot.exists() && allSnapshot.size >= 450) {
        const updates = {};
        allSnapshot.forEach(child => {
          updates[child.key] = null;
        });
        await update(chatRef, updates);
        return;
      }

      if (allSnapshot.exists() && allSnapshot.size > 400) {
        const messages = [];
        allSnapshot.forEach(child => {
          messages.push({ key: child.key, timestamp: child.val().timestamp || 0 });
        });
        messages.sort((a, b) => a.timestamp - b.timestamp);
        const overflow = messages.slice(0, Math.max(0, messages.length - 300));
        if (overflow.length) {
          const updates = {};
          overflow.forEach(msg => {
            updates[msg.key] = null;
          });
          await update(chatRef, updates);
        }
      }
    } catch (e) {
      console.warn("Pruning skipped or unauthorized:", e);
    }
  },

  async sendGlobalChatMessage(profile, text) {
    // Run cleanup in background before sending
    this.pruneOldChatMessages().catch(err => console.warn(err));

    const chatRef = ref(rtdb, 'globalChat');
    await push(chatRef, {
      uid: profile.uid,
      username: profile.username, // Only username goes to RTDB chat
      badge: profile.badge || '👤',
      staffRole: profile.staffRole || '',
      text: String(text || '').trim().slice(0, CHAT_MESSAGE_MAX_LENGTH),
      timestamp: Date.now()
    });
  },

  subscribeToGlobalChat(callback, onReset, onError) {
    const chatRef = ref(rtdb, 'globalChat');
    const handleError = error => {
      console.warn('[GlobalChat] Realtime Database listener failed:', error);
      onError?.(error);
    };
    const unsubscribeValue = onValue(chatRef, (snapshot) => {
      if (!snapshot.exists() && onReset) onReset();
    }, handleError);
    const unsubscribeChild = onChildAdded(chatRef, (snapshot) => {
      callback({ ...snapshot.val(), id: snapshot.key });
    }, handleError);
    return () => {
      unsubscribeValue();
      unsubscribeChild();
    };
  }
};
export { auth, db, rtdb };
export default firebaseService;
