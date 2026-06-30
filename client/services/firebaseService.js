// Kicker Hax - Firebase Auth & Firestore Client Service
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup,
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
  runTransaction
} from 'firebase/firestore';
import { getDatabase, ref, push, onChildAdded, serverTimestamp, query as rtdbQuery, orderByChild, endAt, get, update } from 'firebase/database';

const _dec = (val) => atob(val);
const firebaseConfig = {
  apiKey: _dec("QUl6YVN5Q2FUUWE2Sm9NajJNQmdEZ2Rwb25WQllfTkFlUU84X3Vz"),
  authDomain: _dec("a2lja2VyaGF4LW9ubGluZS5maXJlYmFzYXBwLmNvbQ=="),
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
const db = getFirestore(app);
const rtdb = getDatabase(app);

export const firebaseService = {
  // Authentication methods
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
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
        isNewUser: true, // Mark as new user to force username pick
        dateCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        settings: {
          volume: 80,
          quality: 'high',
          fieldSize: 'medium'
        }
      };

      const userStats = {
        uid: user.uid,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        goals: 0,
        assists: 0,
        saves: 0
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      await setDoc(doc(db, 'stats', user.uid), userStats);
    } else {
      // Update last login
      await updateDoc(profileRef, { lastLogin: new Date().toISOString() });
    }
    
    return result;
  },

  async logout() {
    return await signOut(auth);
  },

  subscribeToAuth(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Firestore reading / writing
  async getUserProfile(uid) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateUserProfile(uid, data) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  },

  async getUserStats(uid) {
    const docRef = doc(db, 'stats', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async saveMatchResult(uid, isWin, isLoss, isDraw, goals, assists, saves, xpGained) {
    const statsRef = doc(db, 'stats', uid);
    const userRef = doc(db, 'users', uid);

    await runTransaction(db, async (transaction) => {
      const statsSnap = await transaction.get(statsRef);
      const userSnap = await transaction.get(userRef);

      if (!statsSnap.exists() || !userSnap.exists()) {
        throw new Error("Documento não encontrado");
      }

      const stats = statsSnap.data();
      const user = userSnap.data();

      // Update statistics
      const updatedStats = {
        matchesPlayed: (stats.matchesPlayed || 0) + 1,
        wins: (stats.wins || 0) + (isWin ? 1 : 0),
        losses: (stats.losses || 0) + (isLoss ? 1 : 0),
        draws: (stats.draws || 0) + (isDraw ? 1 : 0),
        goals: (stats.goals || 0) + goals,
        assists: (stats.assists || 0) + assists,
        saves: (stats.saves || 0) + saves
      };

      // Update XP & level calculations
      let currentXp = (user.xp || 0) + xpGained;
      let currentLevel = user.level || 1;
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
        lastLogin: new Date().toISOString()
      });
    });
  },

  async addMatchToHistory(matchData) {
    const historyRef = doc(collection(db, 'history'));
    await setDoc(historyRef, matchData);
  },

  async getRecentHistory(uid, limitCount = 5) {
    const historyRef = collection(db, 'history');
    const q = query(
      historyRef,
      where('playerUids', 'array-contains', uid),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list.slice(0, limitCount);
  },

  async getGlobalRanking(criteria = 'wins', maxCount = 10) {
    let q;
    if (criteria === 'level') {
      const usersRef = collection(db, 'users');
      q = query(usersRef, orderBy('level', 'desc'), orderBy('xp', 'desc'), limit(maxCount));
      const querySnapshot = await getDocs(q);
      const ranking = [];
      
      // Match users with their stats
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        const statsData = await this.getUserStats(userData.uid) || {};
        ranking.push({
          username: userData.username,
          displayName: userData.username,
          badge: userData.badge,
          level: userData.level,
          wins: statsData.wins || 0,
          losses: statsData.losses || 0,
          goals: statsData.goals || 0
        });
      }
      return ranking;
    } else {
      // Wins or Goals
      const statsRef = collection(db, 'stats');
      q = query(statsRef, orderBy(criteria, 'desc'), limit(maxCount));
      const querySnapshot = await getDocs(q);
      const ranking = [];

      for (const statsDoc of querySnapshot.docs) {
        const statsData = statsDoc.data();
        const userData = await this.getUserProfile(statsData.uid);
        if (userData) {
          ranking.push({
            username: userData.username,
            displayName: userData.username,
            badge: userData.badge,
            level: userData.level,
            wins: statsData.wins || 0,
            losses: statsData.losses || 0,
            goals: statsData.goals || 0
          });
        }
      }
      return ranking;
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
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = null;
        });
        await update(chatRef, updates);
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
      text: text,
      timestamp: serverTimestamp()
    });
  },

  subscribeToGlobalChat(callback) {
    const chatRef = ref(rtdb, 'globalChat');
    onChildAdded(chatRef, (snapshot) => {
      callback(snapshot.val());
    });
  }
};
export { auth, db, rtdb };
export default firebaseService;
