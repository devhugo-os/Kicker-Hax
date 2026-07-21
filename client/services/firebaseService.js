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
import { getDatabase, ref, push, onChildAdded, onChildRemoved, onValue, serverTimestamp, query as rtdbQuery, orderByChild, endAt, get, update, set, remove, onDisconnect, runTransaction as runRtdbTransaction } from 'firebase/database';
import { groupSeasonHistoryByUid, mergeCompetitiveHistoryStats } from '../utils/statReconciliation.js';
import {
  getHourlySkinQueue,
  getPendingSkinRequests,
  getSkinQueueCleanup,
  normalizeCommunitySkinName,
  pickHourlySkin
} from '../utils/skinQueue.js';
import {
  calculateOverallRating,
  compareOverallRanking,
  comparePossessionRanking,
  compareRatingRanking,
  compareWinRateRanking,
  getAverageMatchRating
} from '../utils/rankingScore.js';
import { getSessionLeaseLifetime } from '../utils/sessionLease.js';
import { getInsufficientCoinsMessage } from '../utils/marketPricing.js';
import { appendChestPurchaseReceipt, findChestPurchaseReceipt, getDuplicateChestRefund, normalizeChestPurchaseId } from '../utils/chestPurchase.js';
import { getMatchParticipantUids, getWritableHistoryUids, matchIncludesPlayer } from '../utils/matchHistory.js';
import { findStaffProfileByRole } from '../utils/staffProfiles.js';
import { CHAT_MESSAGE_MAX_LENGTH, SKIN_IMAGE_MAX_BYTES, SKIN_NAME_MAX_LENGTH } from '../../shared/constants.js';
import { getFeaturedCycle } from '../utils/featuredCycle.js';
import { getSaoPauloChatDayWindow } from '../utils/chatRetention.js';
import { getSeasonId } from '../utils/seasonCycle.js';
import { consumeChatRateLimit } from '../utils/chatRateLimit.js';

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
let realtimeServerOffsetMs = 0;
onValue(ref(rtdb, '.info/serverTimeOffset'), snapshot => {
  realtimeServerOffsetMs = Number(snapshot.val() || 0);
}, () => {});
// Every São Paulo calendar month starts a new competitive season. Cosmetics
// and KX Coins are lifetime account assets and are intentionally preserved.
export const CURRENT_SEASON_ID = getSeasonId('monthly');
export const CURRENT_COSMETIC_RESET_ID = '50.0';
const normalizeCosmetics = profile => {
  const activeSeason = profile?.seasonId === CURRENT_SEASON_ID;
  const activeCosmetics = profile?.cosmeticResetId === CURRENT_COSMETIC_RESET_ID;
  return {
    ...profile,
    ...(activeSeason ? {} : { level: 1, xp: 0, processedXpMatchIds: {} }),
    ...(activeCosmetics ? {} : {
      ownedSkins: ['rookie'], equippedSkinId: 'rookie', equippedSkinImage: null,
      skinPurchaseValues: {}, chestPurchaseReceipts: []
    })
  };
};
const emptySeasonStats = uid => ({
  uid,
  seasonId: CURRENT_SEASON_ID,
  matchesPlayed: 0, wins: 0, losses: 0, draws: 0, goals: 0, shots: 0,
  dribbles: 0, assists: 0, ownGoals: 0, mvps: 0, tackles: 0, possessionTotal: 0,
  possessionMatches: 0, ratingTotal: 0, ratingMatches: 0,
  processedMatchIds: {}, processedRatingMatchIds: {}
});
const getLaunchParams = () => new URLSearchParams(window.location.search);
const NATIVE_AUTH_MESSAGE = 'KICKER_HAX_NATIVE_GOOGLE';
const NATIVE_LOGIN_REQUEST = 'KICKER_HAX_NATIVE_LOGIN_REQUEST';
const SESSION_LEASE_VERSION = typeof __KICKER_HAX_VERSION__ !== 'undefined' ? __KICKER_HAX_VERSION__ : '58.0.0';
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
  getRealtimeNow() {
    return Date.now() + realtimeServerOffsetMs;
  },
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
        // Monthly season migration preserves identity, controls, purchased
        // skins and KX Coins while restarting competitive progression.
        await updateDoc(profileRef, {
          lastLogin: new Date().toISOString(),
          seasonId: CURRENT_SEASON_ID,
          level: 1,
          xp: 0,
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
          cosmeticResetId: CURRENT_COSMETIC_RESET_ID,
          skinPurchaseValues: {},
          chestPurchaseReceipts: []
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
    this.cleanupOwnedOldRecordings(user.uid).catch(error => {
      console.warn('[Kicker Recording] Limpeza mensal adiada:', error);
    });
    this.cleanupOwnedOldHistory(user.uid).catch(error => {
      console.warn('[Kicker History] Limpeza mensal adiada:', error);
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

  async saveMatchResult(uid, isWin, isLoss, isDraw, goals, shots, dribbles, assists, ownGoals, isMvp, xpGained, tackles = 0, possessionPct = 0, matchId = null, coinReward = 0, matchRating = 0) {
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
      const processedRatingMatchIds = seasonStats.processedRatingMatchIds || {};
      const parsedRating = Number(matchRating);
      const safeRating = Number.isFinite(parsedRating)
        ? Math.max(1, Math.min(10, parsedRating))
        : 5;
      const ratingAlreadySaved = safeMatchId && processedRatingMatchIds[safeMatchId];
      if (safeMatchId && processedMatchIds[safeMatchId] && ratingAlreadySaved) {
        return;
      }
      if (safeMatchId && processedMatchIds[safeMatchId]) {
        transaction.update(statsRef, {
          ratingTotal: (seasonStats.ratingTotal || 0) + safeRating,
          ratingMatches: (seasonStats.ratingMatches || 0) + 1,
          processedRatingMatchIds: { ...processedRatingMatchIds, [safeMatchId]: true }
        });
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
        ratingTotal: (seasonStats.ratingTotal || 0) + safeRating,
        ratingMatches: (seasonStats.ratingMatches || 0) + 1,
        processedMatchIds: safeMatchId
          ? { ...processedMatchIds, [safeMatchId]: true }
          : processedMatchIds,
        processedRatingMatchIds: safeMatchId
          ? { ...processedRatingMatchIds, [safeMatchId]: true }
          : processedRatingMatchIds
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
      await set(assetRef, { name: skin.name || 'Skin da comunidade', image: skin.image, creatorUid: skin.creatorUid || '', value: Number(price || 0) });
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
      const skinPurchaseValues = { ...(profile.skinPurchaseValues || {}), [skin.id]: Number(price || 0) };
      const updated = { coins: coins - price, ownedSkins: owned, skinPurchaseValues };
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
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    return `${CURRENT_SEASON_ID}_${day}`;
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
    return `${CURRENT_SEASON_ID}_${getFeaturedCycle(cadence, date).period}`;
  },

  async getFeaturedSkin(cadence) {
    const cycle = getFeaturedCycle(cadence);
    const period = this.skinPeriodKey(cadence);
    const featuredRoot = ref(rtdb, `skinFeatured/${cadence}`);
    const featuredSnapshot = await get(featuredRoot);
    const featured = featuredSnapshot.val() || {};
    if (featured[period]) return featured[period];
    const [requestsSnapshot, allFeaturedSnapshot] = await Promise.all([
      get(ref(rtdb, 'skinRequests')),
      get(ref(rtdb, 'skinFeatured'))
    ]);
    const requestsByDay = requestsSnapshot.val() || {};
    const currentRequests = Object.fromEntries(Object.entries(requestsByDay)
      .filter(([requestDay]) => requestDay.startsWith(`${CURRENT_SEASON_ID}_`)));
    const allFeatured = allFeaturedSnapshot.val() || {};
    if (cadence === 'hourly') {
      const queue = getHourlySkinQueue(currentRequests, allFeatured, this.skinDayKey());
      const winner = pickHourlySkin(queue, cycle.cycleIndex);
      if (!winner) return null;
      const requestId = winner.requestId || `${winner.requestDay}_${winner.uid}`;
      const selected = {
        id: winner.id || `community_${requestId.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        name: normalizeCommunitySkinName(winner.name) || 'Skin da comunidade',
        username: winner.username,
        creatorUid: winner.creatorUid || winner.uid,
        image: winner.image,
        requestId,
        requestDay: winner.requestDay,
        cadence,
        period,
        startsAt: cycle.startsAt,
        expiresAt: cycle.expiresAt,
        createdAt: Date.now(),
        ...(winner.sourceCadence ? {
          carried: true,
          sourceCadence: winner.sourceCadence,
          sourcePeriod: winner.sourcePeriod
        } : {})
      };
      const committed = await runRtdbTransaction(
        ref(rtdb, `skinFeatured/${cadence}/${period}`),
        current => current || selected
      );
      return committed.snapshot.val();
    }
    const candidates = getPendingSkinRequests(currentRequests, allFeatured, this.skinDayKey());
    if (!candidates.length) {
      const previousEntries = Object.entries(allFeatured).flatMap(([sourceCadence, periods]) =>
        Object.entries(periods || {}).map(([sourcePeriod, item]) => ({ sourceCadence, sourcePeriod, item }))
      ).filter(entry => entry.item?.image && String(entry.sourcePeriod).startsWith(`${CURRENT_SEASON_ID}_`))
        .sort((a, b) => Number(a.item.createdAt || a.item.startsAt || 0) - Number(b.item.createdAt || b.item.startsAt || 0));
      const previousEntry = previousEntries.at(-1) || null;
      const previous = previousEntry?.item || null;
      if (!previous) return null;
      const carried = {
        ...previous,
        cadence,
        period,
        startsAt: cycle.startsAt,
        expiresAt: cycle.expiresAt,
        carried: true,
        sourceCadence: previousEntry.sourceCadence,
        sourcePeriod: previousEntry.sourcePeriod
      };
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
      period,
      startsAt: cycle.startsAt,
      expiresAt: cycle.expiresAt,
      createdAt: Date.now()
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
    const hourly = await this.getFeaturedSkin('hourly');
    const result = { hourly, daily, weekly, monthly };
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
    const participantUids = getMatchParticipantUids(matchData);
    // Every participant writes only its own immutable receipt. This respects
    // Firestore ownership rules and avoids one unauthorized peer write
    // invalidating an otherwise successful casual result.
    const writableUids = getWritableHistoryUids(participantUids, auth.currentUser?.uid);
    if (!writableUids.length) throw new Error('Usuário atual não pertence ao resultado da partida.');
    await Promise.all(writableUids.map(async uid => {
      const historyRef = doc(db, 'history', `${uid}_${safeId}`);
      const existing = await getDoc(historyRef);
      if (!existing.exists()) {
        try {
          await setDoc(historyRef, {
            ...matchData,
            participantUids,
            playerUids: [uid],
            seasonId: CURRENT_SEASON_ID
          });
        } catch (error) {
          // Host and guest can finish simultaneously. If the immutable record
          // now exists, the competing create succeeded and this is not a loss.
          if (!(await getDoc(historyRef)).exists()) throw error;
        }
      }
      await this.trimHistoryCategory(uid, category);
    }));
  },

  subscribeToUserPresence(uid, callback) {
    if (!uid) return () => {};
    return onValue(ref(rtdb, `presence/${uid}`), snapshot => {
      const value = snapshot.val() || {};
      callback?.({ online: snapshot.exists() && value.online !== false, ...value });
    }, () => callback?.({ online: false }));
  },

  async findUserByUsername(username) {
    const normalized = String(username || '').trim().toLowerCase();
    if (!normalized) return null;
    const snapshot = await getDocs(query(collection(db, 'users'), where('username', '==', normalized), limit(1)));
    if (snapshot.empty) return null;
    const result = snapshot.docs[0];
    return { uid: result.id, ...normalizeCosmetics(result.data()) };
  },

  async donateSkin(senderUid, recipientUsername, skinId) {
    const recipient = await this.findUserByUsername(recipientUsername);
    if (!recipient) throw new Error('Nenhum jogador foi encontrado com esse nome.');
    if (recipient.uid === senderUid) throw new Error('Você não pode doar uma skin para si mesmo.');
    if (!skinId || skinId === 'rookie') throw new Error('A skin Novato não pode ser doada.');
    const senderRef = doc(db, 'users', senderUid);
    const recipientRef = doc(db, 'users', recipient.uid);
    const giftRef = doc(collection(db, 'skinGifts'));
    await runTransaction(db, async transaction => {
      const [senderSnap, recipientSnap] = await Promise.all([transaction.get(senderRef), transaction.get(recipientRef)]);
      if (!senderSnap.exists() || !recipientSnap.exists()) throw new Error('Um dos perfis não está disponível.');
      const sender = senderSnap.data();
      const receiver = recipientSnap.data();
      const owned = Array.isArray(sender.ownedSkins) ? sender.ownedSkins : ['rookie'];
      if (!owned.includes(skinId)) throw new Error('Esta skin não está mais no seu inventário.');
      if ((sender.equippedSkinId || 'rookie') === skinId) throw new Error('Equipe outra skin antes de doar esta.');
      if ((receiver.ownedSkins || ['rookie']).includes(skinId)) throw new Error('Esse jogador já possui esta skin.');
      const purchaseValues = { ...(sender.skinPurchaseValues || {}) };
      const skinValue = Math.max(0, Number(purchaseValues[skinId] || 0));
      delete purchaseValues[skinId];
      const receiverOwned = Array.isArray(receiver.ownedSkins) ? [...receiver.ownedSkins] : ['rookie'];
      receiverOwned.push(skinId);
      const claimedAt = Date.now();
      transaction.update(senderRef, { ownedSkins: owned.filter(id => id !== skinId), skinPurchaseValues: purchaseValues });
      transaction.update(recipientRef, {
        ownedSkins: receiverOwned,
        skinPurchaseValues: { ...(receiver.skinPurchaseValues || {}), [skinId]: skinValue },
        lastReceivedGiftId: giftRef.id
      });
      transaction.set(giftRef, {
        senderUid,
        senderUsername: sender.username || '',
        recipientUid: recipient.uid,
        recipientUsername: receiver.username || '',
        skinId,
        skinValue,
        status: 'claimed',
        createdAt: claimedAt,
        claimedAt
      });
    });
    return recipient;
  },

  /** Completes gifts created by older releases that waited for recipient login. */
  async finalizeSentSkinGifts(senderUid, recipientUid = '') {
    if (!senderUid) return [];
    const snapshots = await getDocs(query(collection(db, 'skinGifts'), where('senderUid', '==', senderUid), limit(30)));
    const completed = [];
    for (const giftSnap of snapshots.docs) {
      const gift = giftSnap.data();
      if (gift.status !== 'pending' || (recipientUid && gift.recipientUid !== recipientUid)) continue;
      const accepted = await runTransaction(db, async transaction => {
        const receiverRef = doc(db, 'users', gift.recipientUid);
        const [freshGift, receiverSnap] = await Promise.all([transaction.get(giftSnap.ref), transaction.get(receiverRef)]);
        if (!freshGift.exists() || freshGift.data().status !== 'pending' || !receiverSnap.exists()) return false;
        const receiver = receiverSnap.data();
        const owned = Array.isArray(receiver.ownedSkins) ? [...receiver.ownedSkins] : ['rookie'];
        if (owned.includes(gift.skinId)) return false;
        owned.push(gift.skinId);
        transaction.update(receiverRef, {
          ownedSkins: owned,
          skinPurchaseValues: { ...(receiver.skinPurchaseValues || {}), [gift.skinId]: Number(gift.skinValue || 0) },
          lastReceivedGiftId: giftSnap.id
        });
        transaction.update(giftSnap.ref, { status: 'claimed', claimedAt: Date.now() });
        return true;
      });
      if (accepted) completed.push(gift);
    }
    return completed;
  },

  async claimPendingSkinGifts(uid) {
    // A consulta usa apenas o destinatario para funcionar sem indice composto;
    // o status e validado novamente dentro da transacao antes da entrega.
    const gifts = await getDocs(query(collection(db, 'skinGifts'), where('recipientUid', '==', uid), limit(30)));
    const claimed = [];
    for (const giftSnap of gifts.docs) {
      const gift = giftSnap.data();
      if (gift.status !== 'pending') continue;
      const userRef = doc(db, 'users', uid);
      const accepted = await runTransaction(db, async transaction => {
        const [freshGift, userSnap] = await Promise.all([transaction.get(giftSnap.ref), transaction.get(userRef)]);
        if (!freshGift.exists() || freshGift.data().status !== 'pending' || !userSnap.exists()) return false;
        const profile = userSnap.data();
        const owned = Array.isArray(profile.ownedSkins) ? [...profile.ownedSkins] : ['rookie'];
        if (!owned.includes(gift.skinId)) owned.push(gift.skinId);
        transaction.update(userRef, {
          ownedSkins: owned,
          skinPurchaseValues: { ...(profile.skinPurchaseValues || {}), [gift.skinId]: Number(gift.skinValue || 0) }
        });
        transaction.update(giftSnap.ref, { status: 'claimed', claimedAt: Date.now() });
        return true;
      });
      if (accepted) claimed.push(gift);
    }
    return claimed;
  },

  async saveMatchRecording(recordingId, recordingData) {
    if (!auth.currentUser?.uid || !recordingId || !recordingData?.data) {
      throw new Error('Gravação inválida.');
    }
    await setDoc(doc(db, 'matchRecordings', recordingId), {
      ...recordingData,
      seasonId: CURRENT_SEASON_ID
    });
  },

  async cleanupOwnedOldRecordings(uid) {
    if (!uid) return 0;
    const snapshots = await getDocs(query(collection(db, 'matchRecordings'), where('ownerUid', '==', uid)));
    const obsolete = snapshots.docs.filter(snapshot => snapshot.data().seasonId !== CURRENT_SEASON_ID);
    await Promise.all(obsolete.map(snapshot => deleteDoc(snapshot.ref)));
    return obsolete.length;
  },

  async cleanupOwnedOldHistory(uid) {
    if (!uid) return 0;
    const snapshots = await getDocs(query(collection(db, 'history'), where('playerUids', 'array-contains', uid)));
    const obsolete = snapshots.docs.filter(snapshot => snapshot.data().seasonId !== CURRENT_SEASON_ID);
    await Promise.all(obsolete.map(snapshot => deleteDoc(snapshot.ref)));
    return obsolete.length;
  },

  async getMatchRecording(recordingId) {
    if (!recordingId) return null;
    const snapshot = await getDoc(doc(db, 'matchRecordings', recordingId));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
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
          stats.possessionPct || 0, matchId, coins, stats.rating || 5
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
    await Promise.all(matches.slice(10).map(async match => {
      await deleteDoc(match.ref);
      if (match.recordingId) {
        await deleteDoc(doc(db, 'matchRecordings', match.recordingId)).catch(() => {});
      }
    }));
  },

  async getRecentHistory(uid, limitCount = 100) {
    const historyRef = collection(db, 'history');
    // Legacy receipts contain only the UID of the client that persisted them.
    // Scan once and recognize all cited participants so another player's
    // successful receipt can restore this profile's history and statistics.
    const querySnapshot = await getDocs(historyRef);
    const byMatch = new Map();
    querySnapshot.forEach(d => {
      const data = { id: d.id, ...d.data() };
      if (!matchIncludesPlayer(data, uid)) return;
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
        const rankingPlayer = {
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
          possessionMatches: statsData.possessionMatches || statsData.matchesPlayed || 0,
          possessionAvg: (statsData.possessionMatches || statsData.matchesPlayed || 0) > 0
            ? Math.round((statsData.possessionTotal || 0) / (statsData.possessionMatches || statsData.matchesPlayed || 1))
            : 0,
          ratingTotal: Number(statsData.ratingTotal || 0),
          ratingMatches: Number(statsData.ratingMatches || 0),
          ratingAvg: getAverageMatchRating(statsData),
          mvps: statsData.mvps || 0,
          xp: seasonActive ? (userData.xp || 0) : 0,
          // Wallet balance belongs to the user document and remains rankable
          // even if competitive statistics are waiting for season migration.
          coins: Number(userData.coins || 0),
          skinCount: userData.cosmeticResetId === CURRENT_COSMETIC_RESET_ID && Array.isArray(userData.ownedSkins)
            ? new Set(userData.ownedSkins.filter(id => id !== 'rookie')).size
            : 0
        };
        rankingPlayer.overall = calculateOverallRating(rankingPlayer);
        ranking.push(rankingPlayer);
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
        if (criteria === 'rating') return (r.ratingMatches || 0) > 0;
        if (criteria === 'coins') return r.coins > 0;
        if (criteria === 'skins') return r.skinCount > 0;
        if (criteria === 'winrate') return (r.matchesPlayed || 0) > 0;
        if (criteria === 'overall') {
          return (r.matchesPlayed || 0) > 0;
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
        ranking.sort(comparePossessionRanking);
      } else if (criteria === 'rating') {
        ranking.sort(compareRatingRanking);
      } else if (criteria === 'coins') {
        ranking.sort((a, b) => b.coins - a.coins);
      } else if (criteria === 'skins') {
        ranking.sort((a, b) => b.skinCount - a.skinCount || b.coins - a.coins);
      } else if (criteria === 'winrate') {
        ranking.sort(compareWinRateRanking);
      } else if (criteria === 'overall') {
        ranking.sort(compareOverallRanking);
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
      const { startsAt } = getSaoPauloChatDayWindow();
      const oldQuery = rtdbQuery(chatRef, orderByChild('timestamp'), endAt(startsAt - 1));
      const snapshot = await get(oldQuery);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = null;
        });
        await update(chatRef, updates);
      }
      const allSnapshot = await get(chatRef);
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

    const now = this.getRealtimeNow();
    let retryAfterMs = 0;
    const limiter = await runRtdbTransaction(ref(rtdb, `chatRateLimits/global/${profile.uid}`), current => {
      const result = consumeChatRateLimit(current, now);
      retryAfterMs = result.retryAfterMs;
      return result.allowed ? result.state : undefined;
    }, { applyLocally: false });
    if (!limiter.committed) {
      const cooldownError = new Error(`Aguarde ${Math.max(1, Math.ceil(retryAfterMs / 1000))}s antes de enviar outra mensagem.`);
      cooldownError.code = 'chat-rate-limited';
      cooldownError.retryAfterMs = retryAfterMs;
      throw cooldownError;
    }
    const chatRef = ref(rtdb, 'globalChat');
    await push(chatRef, {
      uid: profile.uid,
      username: profile.username, // Only username goes to RTDB chat
      badge: profile.badge || '👤',
      staffRole: profile.staffRole || '',
      text: String(text || '').trim().slice(0, CHAT_MESSAGE_MAX_LENGTH),
      timestamp: now
    });
  },

  subscribeToGlobalChat(callback, onReset, onError, onRemoved) {
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
    const unsubscribeRemoved = onChildRemoved(chatRef, (snapshot) => {
      onRemoved?.(snapshot.key);
    }, handleError);
    return () => {
      unsubscribeValue();
      unsubscribeChild();
      unsubscribeRemoved();
    };
  }
};
export { auth, db, rtdb };
export default firebaseService;
