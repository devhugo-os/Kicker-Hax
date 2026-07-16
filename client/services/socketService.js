// Kicker Hax - WebRTC Peer-to-Peer & Firebase RTDB Multiplayer Client Service
import firebaseService, { rtdb, auth } from './firebaseService.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, remove, get, update, onValue, off, onDisconnect, push, onChildAdded, serverTimestamp } from 'firebase/database';
import { ServerRoom } from '../../server/models/serverRoom.js';
import { ServerMatch } from '../../server/models/serverMatch.js';
import { ServerPhysics } from '../../server/models/serverPhysics.js';
import { buildRoomCleanupPatch, getOrphanRoomCodes, getRoomActivityTimestamp } from '../utils/roomCleanup.js';
import {
  decodeRealtimePacket,
  encodeRealtimePacket,
  shouldDropRealtimeState
} from '../utils/realtimeTransport.js';
import {
  compactMultiplayerPayload,
  sanitizeMultiplayerProfile
} from '../../shared/multiplayerPayload.js';
import { CHAT_MESSAGE_MAX_LENGTH, ROOM_NAME_MAX_LENGTH, ROOM_PASSWORD_MAX_LENGTH } from '../../shared/constants.js';

// Prefer direct WebRTC routes, including local-network candidates, and keep a
// small ICE pool ready so joining a room does not stall the first inputs.
const PEER_OPTIONS = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 4,
    bundlePolicy: 'max-bundle'
  }
};

const customSkinCache = new Map();

function resolveCustomSkinsInLobbyInfo(lobbyInfo, triggerRedraw) {
  const target = lobbyInfo?.players ? lobbyInfo : lobbyInfo?.lobbyInfo;
  if (!target?.players) return;
  target.players.forEach(player => {
    if (player.skin !== 'custom' || !player.uid) return;
    const cached = customSkinCache.get(player.uid);
    if (cached) {
      player.skin = cached;
      return;
    }
    firebaseService.getUserProfile(player.uid).then(profile => {
      const image = profile?.equippedSkinImage;
      if (!image) return;
      customSkinCache.set(player.uid, image);
      player.skin = image;
      triggerRedraw?.();
    }).catch(() => {});
  });
}

class P2PSocketService {
  constructor() {
    this.listeners = new Map();
    this.clientId = null;
    this.peer = null;
    this.isHost = false;
    this.roomCode = null;
    this.roomInstanceId = null;
    this.presenceBound = false;
    
    // Peer connections
    this.connections = []; // guest WebRTC connections (if host)
    this.hostConn = null;   // host WebRTC connection (if guest)
    this.realtimeConnections = new Map(); // guest id -> unordered state channel
    this.realtimeHostConn = null;
    this.gameStateSequence = 0;
    
    // Host Room state (only instantiated if host)
    this.serverRoom = null;
    this.roomHeartbeatInterval = null;
    this.roomChatUnsub = null;
    this.roomLifecycleUnsub = null;
    this.hostLeaseWatchInterval = null;
    this.lastHostHeartbeatAt = 0;
    this.hostDepartureReported = false;
    this.unloadBound = false;
    this.isLeavingRoom = false;
    this.connectionInitialized = false;
    this.roomOperation = null;
    this.joinResponseRetries = new Map();
    this.peerGeneration = 0;
    this.lastInputSentAt = 0;
    this.lastInputSignature = '';
    this.lastInputActionSignature = '';
    this.activeMatchId = null;
    const isNativeFrame = new URLSearchParams(window.location.search).get('native') === '1' && window.parent !== window;
    const sessionStore = isNativeFrame ? localStorage : sessionStorage;
    this.sessionId = sessionStore.getItem('kicker_hax_session_id') || `session_${Date.now()}_${crypto.randomUUID()}`;
    sessionStore.setItem('kicker_hax_session_id', this.sessionId);
  }

  async cleanupRoomData(roomCode) {
    if (!roomCode) return;
    const code = String(roomCode).toUpperCase();
    await update(ref(rtdb), buildRoomCleanupPatch(code));
  }

  async cleanupRoomChats(roomCode) {
    if (!roomCode) return;
    const code = String(roomCode).toUpperCase();
    await Promise.allSettled([
      remove(ref(rtdb, `roomChats/${code}`)),
      remove(ref(rtdb, `matchChats/${code}`))
    ]);
  }

  blockRoomRejoin(uid) {
    if (!this.roomCode || !uid) return;
    this.serverRoom?.blockedRejoinUids?.add(uid);
    update(ref(rtdb, `multiplayerRooms/${this.roomCode}/blockedRejoinUids`), { [uid]: true }).catch(() => {});
  }

  /** Applies one authoritative surrender for active or disconnected players. */
  acceptPlayerSurrender(player, conn = null) {
    if (!player || !this.serverRoom?.match || this.serverRoom.status !== 'playing'
      || player.cpu || player.team === 'spectator') return false;
    const match = this.serverRoom.match;
    const team = player.team === 'red' ? 0 : 1;
    const teammates = this.serverRoom.players.filter(item => !item.cpu && !item.disconnected
      && item.team === player.team && item.id !== player.id);

    this.blockRoomRejoin(player.uid);
    const accepted = { roomCode: this.roomCode, matchId: match.matchId };
    if (conn?.open) conn.send({ event: 'abandonAccepted', data: accepted });
    else if (player.id === this.clientId) this.triggerLocalEvent('surrenderAccepted', accepted);

    if (teammates.length === 0) {
      this.sendRoomChatMessage({
        username: 'Sistema',
        badge: '',
        text: `${player.username} desistiu. O time adversário venceu por W.O.`
      });
      match.forfeitAgainstTeam(team);
      return true;
    }

    if (!player.disconnected) this.serverRoom.markPlayerDisconnected(player.id);
    if (!match.disconnectPauseUntil) {
      match.pauseForDisconnectedTeam(team, player.uid, player.username, {
        allowRejoin: false,
        timeoutMs: 30000
      });
    }
    match.forceContinueVote(player.uid, player.username);
    this.sendRoomChatMessage({
      username: 'Sistema',
      badge: '',
      text: `${player.username} desistiu. O time tem 30 segundos para decidir se continua com um jogador a menos.`
    });
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { updatedAt: Date.now() }).catch(() => {});
    return true;
  }

  generateClientId() {
    this.clientId = `user_${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
    console.log(`[P2PSocket] Novo ID de conexão: ${this.clientId}`);
  }

  connect(url = window.location.origin) {
    if (!this.clientId) {
      this.generateClientId();
    }
    if (this.connectionInitialized) return this;
    this.connectionInitialized = true;
    console.log(`[P2PSocket] Inicializado com ID do Cliente: ${this.clientId}`);
    this.listenToPublicRooms();
    this.setupPresenceTracking();
    if (!this.unloadBound) {
      this.unloadBound = true;
      window.addEventListener('pagehide', () => {
        // Guests must leave too; otherwise their peer can remain in the
        // host's roster after closing the tab and create a ghost player.
        if (this.roomCode) this.leaveRoom();
      });
    }
    return this;
  }

  disconnect() {
    this.leaveRoom();
  }

  getSocket() {
    return this;
  }

  get id() {
    return this.clientId;
  }

  /** A playersCount alone is leftover data, never a joinable multiplayer room. */
  isActiveRoomRecord(room, now = Date.now()) {
    const heartbeat = getRoomActivityTimestamp(room);
    return !!room
      && /^[A-Z0-9]{6}$/.test(String(room.code || ''))
      && typeof room.name === 'string' && room.name.trim().length > 0
      && typeof room.hostPeerId === 'string' && room.hostPeerId.length > 0
      && typeof room.hostUsername === 'string' && room.hostUsername.length > 0
      && Number.isInteger(Number(room.maxPlayers)) && Number(room.maxPlayers) >= 2
      && Number.isFinite(Number(room.playersCount)) && Number(room.playersCount) >= 0
      && ['lobby', 'playing'].includes(room.status)
      && heartbeat > 0 && now - heartbeat < 15000;
  }

  hasLiveHostConnection() {
    return this.isHost || !!(this.hostConn && this.hostConn.open && !this.hostDepartureReported);
  }

  /**
   * Validates the local return reservation against the authoritative RTDB
   * room. A stale record is removed so it cannot block future matchmaking.
   */
  async getActiveMatchReservation(uid = auth.currentUser?.uid) {
    if (!uid) return null;
    const key = `kicker_hax_rejoin_${uid}`;
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      saved = null;
    }
    if (!saved?.code || !saved?.matchId) {
      localStorage.removeItem(key);
      return null;
    }

    const room = await this.getPublicRoomMeta(saved.code).catch(() => null);
    const active = room?.status === 'playing'
      && room.matchId === saved.matchId
      && !room.blockedRejoinUids?.[uid]
      && !room.bannedUids?.[uid];
    if (!active) {
      localStorage.removeItem(key);
      return null;
    }
    return { saved, room };
  }

  // Socket-like Listener Registry
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  once(event, callback) {
    const tempCb = (data) => {
      this.off(event, tempCb);
      callback(data);
    };
    this.on(event, tempCb);
  }

  off(event, callback) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const arr = this.listeners.get(event);
    if (arr) {
      this.listeners.set(event, arr.filter(x => x !== callback));
    }
  }

  triggerLocalEvent(event, data) {
    if (['lobbyUpdate', 'joinSuccess', 'matchRejoined'].includes(event)) {
      resolveCustomSkinsInLobbyInfo(data, () => {
        const lobbyInfo = data?.lobbyInfo || data;
        window.setTimeout(() => this.triggerLocalEvent('lobbyUpdate', lobbyInfo), 0);
      });
    }
    this.syncMatchLifecycle(event, data);
    const arr = this.listeners.get(event);
    if (arr) {
      arr.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[P2PSocket] Erro no listener do evento ${event}:`, e);
        }
      });
    }
  }

  emit(event, data) {
    if (this.isHost) {
      // Direct local execution for host's own emissions
      this.handleHostReceivedData(this.clientId, event, data);
    } else if (['gameInput', 'ping'].includes(event) && this.realtimeHostConn?.open) {
      const bufferedAmount = Number(this.realtimeHostConn.dataChannel?.bufferedAmount || 0);
      if (!shouldDropRealtimeState(event, bufferedAmount)) {
        this.realtimeHostConn.send(encodeRealtimePacket(event, data));
      }
    } else if (this.hostConn && this.hostConn.open) {
      // Send payload to host via WebRTC
      this.hostConn.send({ event, data });
    }
  }

  // Broadcast helper for host to send to self + all connected guests
  broadcast(event, data) {
    // High-frequency game states must not be cloned. Only lifecycle payloads
    // carrying lobby data pass through the compact control-channel boundary.
    const hasLobbyData = event === 'lobbyUpdate' || data?.lobbyInfo;
    const transportData = hasLobbyData
      ? compactMultiplayerPayload(data)
      : data;
    const transportPayload = event === 'gameState'
      ? { ...transportData, transportSequence: ++this.gameStateSequence }
      : transportData;
    // Local skin hydration may replace "custom" with a cached Base64 image.
    // It must never mutate the object reserved for the WebRTC channel.
    const localPayload = hasLobbyData
      ? compactMultiplayerPayload(transportPayload)
      : transportPayload;
    this.triggerLocalEvent(event, localPayload);
    this.connections.forEach(conn => {
      if (conn.open) {
        const realtimeConn = this.realtimeConnections.get(conn.peer);
        // State snapshots are replaceable and must never fall back to the
        // reliable JSON channel. That fallback previously crossed PeerJS's
        // 16 KB JSON limit and left guests with an empty frozen field.
        if (event === 'gameState' && !realtimeConn?.open) return;
        const target = event === 'gameState' ? realtimeConn : conn;
        const bufferedAmount = Number(target.dataChannel?.bufferedAmount || 0);
        if (shouldDropRealtimeState(event, bufferedAmount)) return;
        try {
          const packet = event === 'gameState'
            ? encodeRealtimePacket(event, transportPayload)
            : { event, data: transportPayload };
          target.send(packet);
        } catch (error) {
          if (event !== 'gameState') console.warn(`[P2PSocket] Falha ao enviar ${event}:`, error);
        }
      }
    });
  }

  syncMatchLifecycle(event, data = {}) {
    if (event === 'matchStarted' || event === 'matchRejoined') {
      this.activeMatchId = data?.matchId || this.activeMatchId;
      return;
    }
    if (!['matchEnded', 'matchAborted', 'kicked', 'hostLeft'].includes(event)) return;
    this.activeMatchId = null;
    if (auth.currentUser?.uid) {
      localStorage.removeItem(`kicker_hax_rejoin_${auth.currentUser.uid}`);
    }
  }

  // --------------------------------------------------------------------------
  // ROOM LIFECYCLE
  // --------------------------------------------------------------------------
  async createRoom(name, password, maxPlayers, duration, goalLimit, fieldSize, showReplay, profile, competitive = false) {
    if (this.roomOperation) {
      this.triggerLocalEvent('createRoomError', 'Aguarde a operacao atual terminar.');
      return;
    }
    this.roomOperation = 'create';
    if (await this.getActiveMatchReservation(profile?.uid)) {
      this.roomOperation = null;
      this.triggerLocalEvent('createRoomError', 'Volte para a partida reservada ou abandone-a antes de criar outra sala.');
      return;
    }
    const normalizedName = String(name || '').trim().slice(0, ROOM_NAME_MAX_LENGTH);
    const normalizedPassword = String(password || '').slice(0, ROOM_PASSWORD_MAX_LENGTH);
    const isCompetitive = !!competitive && !normalizedPassword;
    const roomDuration = isCompetitive ? 5 : (Number.isFinite(parseInt(duration)) ? parseInt(duration) : 3);
    const roomGoalLimit = isCompetitive ? 0 : (Number.isFinite(parseInt(goalLimit)) ? parseInt(goalLimit) : 3);
    const roomFieldSize = isCompetitive ? 'medium' : (fieldSize || 'medium');
    let roomsSnapshot;
    try {
      roomsSnapshot = await get(ref(rtdb, 'multiplayerRooms'));
    } catch (error) {
      this.roomOperation = null;
      this.triggerLocalEvent('createRoomError', 'Nao foi possivel verificar as salas existentes.');
      return;
    }
    const rooms = roomsSnapshot.val() || {};
    const nameTaken = Object.values(rooms).some(room =>
      String(room.name || '').trim().toLowerCase() === normalizedName.toLowerCase() &&
      room.status === 'lobby' &&
      Date.now() - (room.updatedAt || 0) < 45000
    );
    if (nameTaken) {
      this.roomOperation = null;
      this.triggerLocalEvent('createRoomError', 'Já existe uma sala ativa com esse nome.');
      return;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), value => chars[value % chars.length]).join('');
    let code = randomCode();
    while (rooms[code]) code = randomCode();
    
    this.isHost = true;
    this.roomCode = code;
    this.roomInstanceId = crypto.randomUUID();
    
    this.generateClientId();
    // Instantiate Host PeerJS
    if (this.peer) this.peer.destroy();
    const peerGeneration = ++this.peerGeneration;
    const peer = new Peer(this.clientId, PEER_OPTIONS);
    this.peer = peer;
    
    peer.on('open', async (id) => {
      if (this.peer !== peer || this.peerGeneration !== peerGeneration || this.roomOperation !== 'create') return;
      console.log('[P2PSocket] Host Peer criado:', id);
      
      this.serverRoom = new ServerRoom(code, normalizedName, this.clientId, {
        maxPlayers: parseInt(maxPlayers) || 10,
        password: normalizedPassword || null,
        duration: roomDuration,
        goalLimit: roomGoalLimit,
        fieldSize: roomFieldSize,
        showReplay: true,
        competitive: isCompetitive,
        hostUsername: profile?.username || 'Host'
      });
      
      this.serverRoom.addPlayer(this.clientId, sanitizeMultiplayerProfile(profile), 'spectator');

      // Add connection to mock database structure
      this.connections = [];
      this.realtimeConnections.forEach(conn => conn.close());
      this.realtimeConnections.clear();
      this.gameStateSequence = 0;

      // A reused room code must never inherit chat from a previous room.
      await this.cleanupRoomChats(code).catch(() => {});

      // Save room meta record to Firebase RTDB for matchmaking
      const roomRef = ref(rtdb, `multiplayerRooms/${code}`);
      const now = Date.now();
      set(roomRef, {
        code,
        instanceId: this.roomInstanceId,
        name: normalizedName,
        maxPlayers: parseInt(maxPlayers) || 10,
        hasPassword: !!normalizedPassword,
        playersCount: 1,
        status: 'lobby',
        duration: roomDuration,
        goalLimit: roomGoalLimit,
        fieldSize: roomFieldSize,
        competitive: isCompetitive,
        hostPeerId: id,
        hostUid: profile?.uid || auth.currentUser?.uid || '',
        hostUsername: profile?.username || 'Host',
        hostHeartbeatAt: now,
        createdAt: now,
        updatedAt: now
      }).then(() => {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration || this.roomCode !== code) return;
        // Keep all room-owned records in one server-side disconnect update.
        // Separate removals can delete the room first and invalidate the host
        // permission needed to remove its chats.
        onDisconnect(ref(rtdb)).update(buildRoomCleanupPatch(code));
        this.startRoomHeartbeat();
        this.listenToRoomChat(code);
        this.roomOperation = null;
        this.triggerLocalEvent('roomCreated', code);
        this.triggerLocalEvent('lobbyUpdate', this.serverRoom.getLobbyInfo());
      }).catch((error) => {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration) return;
        console.error('[P2PSocket] Falha ao publicar a sala:', error);
        this.cleanupRoomData(code).catch(() => {});
        peer.destroy();
        this.peer = null;
        this.serverRoom = null;
        this.isHost = false;
        this.roomCode = null;
        this.roomOperation = null;
        this.triggerLocalEvent('createRoomError', 'Nao foi possivel criar a sala. Tente novamente.');
      });
    });

    peer.on('connection', (conn) => {
      const realtimeChannel = conn.metadata?.channel === 'realtime';
      if (realtimeChannel) {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration) {
          conn.close();
          return;
        }
        conn.on('open', () => this.realtimeConnections.set(conn.peer, conn));
        conn.on('data', (payload) => {
          const packet = decodeRealtimePacket(payload);
          if (['gameInput', 'ping'].includes(packet?.event)) {
            this.handleHostReceivedData(conn.peer, packet.event, packet.data, conn);
          }
        });
        conn.on('close', () => {
          if (this.realtimeConnections.get(conn.peer) === conn) this.realtimeConnections.delete(conn.peer);
        });
        conn.on('error', () => {
          if (this.realtimeConnections.get(conn.peer) === conn) this.realtimeConnections.delete(conn.peer);
        });
        return;
      }
      if (this.peer !== peer || this.peerGeneration !== peerGeneration) {
        conn.close();
        return;
      }
      console.log('[P2PSocket] Recebida tentativa de conexão de:', conn.peer);
      
      conn.on('data', (payload) => {
        if (payload && payload.event) {
          this.handleHostReceivedData(conn.peer, payload.event, payload.data, conn);
        }
      });
      
      conn.on('close', () => {
        this.handleHostPlayerDisconnect(conn);
      });

      conn.on('error', (err) => {
        console.error('[P2PSocket] Erro no canal de dados do peer:', err);
      });
    });

    peer.on('error', (error) => {
      if (this.peer !== peer || this.peerGeneration !== peerGeneration) return;
      if (this.serverRoom && this.roomOperation !== 'create') {
        // PeerJS signalling may disconnect while already-open data channels and
        // the authoritative local match are healthy. Keep the room alive and
        // ask PeerJS to register again instead of destroying a live match.
        console.warn('[P2PSocket] Sinalizacao WebRTC perdida; tentando reconectar.', error);
        if (peer.disconnected && !peer.destroyed) {
          try { peer.reconnect(); } catch { /* The heartbeat will clean up a dead room. */ }
        }
        return;
      }
      console.error('[P2PSocket] Falha ao iniciar host WebRTC:', error);
      this.cleanupRoomData(code).catch(() => {});
      peer.destroy();
      this.peer = null;
      this.serverRoom = null;
      this.isHost = false;
      this.roomCode = null;
      this.roomOperation = null;
      this.triggerLocalEvent('createRoomError', 'Falha ao iniciar a conexao WebRTC da sala.');
    });
  }

  async joinRoom(code, password, profile, options = {}) {
    const roomCode = code.toUpperCase();
    const rejoin = !!options.rejoin;
    const abandon = !!options.abandon;
    const matchId = String(options.matchId || '');
    const joinAttemptId = crypto.randomUUID();
    if (this.roomOperation) {
      this.triggerLocalEvent('joinError', 'Aguarde a operacao atual terminar.');
      return;
    }
    this.roomOperation = 'join';
    if (!rejoin && !abandon && await this.getActiveMatchReservation(profile?.uid)) {
      this.roomOperation = null;
      this.triggerLocalEvent('joinError', 'Volte para a partida reservada ou abandone-a antes de entrar em outra sala.');
      return;
    }
    this.isHost = false;
    this.roomCode = roomCode;
    let joinRequestInterval = null;
    let stopJoinReceipt = null;
    const joinTimeout = window.setTimeout(() => {
      if (this.roomOperation !== 'join' || this.roomCode !== roomCode) return;
      finishJoinOperation();
      this.triggerLocalEvent('joinError', 'A conexão com a sala demorou demais. Tente novamente.');
      this.leaveRoom();
    }, 15000);
    const finishJoinOperation = () => {
      window.clearTimeout(joinTimeout);
      if (joinRequestInterval) window.clearInterval(joinRequestInterval);
      joinRequestInterval = null;
      stopJoinReceipt?.();
      stopJoinReceipt = null;
    };

    // Fetch room from RTDB
    const roomRef = ref(rtdb, `multiplayerRooms/${roomCode}`);
    get(roomRef).then(async (snapshot) => {
      if (!snapshot.exists()) {
        finishJoinOperation();
        this.cleanupRoomData(roomCode).catch(() => {});
        this.roomCode = null;
        this.roomOperation = null;
        this.triggerLocalEvent('joinError', 'Sala não encontrada.');
        return;
      }

      const roomData = snapshot.val();
      this.roomInstanceId = roomData.instanceId || '';
      if (roomData.status !== 'lobby' && !rejoin) {
        finishJoinOperation();
        this.roomOperation = null;
        this.triggerLocalEvent('joinError', 'A partida desta sala já começou.');
        return;
      }
      // The RTDB count is a discovery hint and can lag one heartbeat. The
      // browser-host validates the real roster after WebRTC connects.
      if (roomData.bannedUids && profile?.uid && roomData.bannedUids[profile.uid]) {
        finishJoinOperation();
        this.roomOperation = null;
        this.triggerLocalEvent('joinError', 'Você foi banido desta sala.');
        return;
      }

      // A fresh PeerJS ID prevents a stale signalling registration from a
      // previous room attempt from receiving the new host response.
      this.generateClientId();
      if (this.peer) this.peer.destroy();
      const peerGeneration = ++this.peerGeneration;
      const peer = new Peer(this.clientId, PEER_OPTIONS);
      this.peer = peer;

      peer.on('open', (id) => {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration || this.roomOperation !== 'join') return;
        console.log('[P2PSocket] Conectando como convidado com ID:', id);

        const conn = this.peer.connect(roomData.hostPeerId, {
          reliable: true,
          serialization: 'json',
          metadata: { channel: 'control', joinAttemptId }
        });
        this.hostConn = conn;

        let joinAccepted = false;
        let realtimeOpening = false;
        // Negotiating both channels together can make PeerJS deliver the
        // lobby response to a channel that is not ready yet. State traffic is
        // replaceable, so it starts only after the reliable join is accepted.
        const openRealtimeChannel = () => {
          if (realtimeOpening || this.realtimeHostConn?.open || this.peer !== peer || !joinAccepted) return;
          realtimeOpening = true;
          const realtimeConn = peer.connect(roomData.hostPeerId, {
            reliable: false,
            serialization: 'raw',
            metadata: { channel: 'realtime', joinAttemptId }
          });
          this.realtimeHostConn = realtimeConn;
          realtimeConn.on('open', () => { realtimeOpening = false; });
          realtimeConn.on('data', payload => {
            const packet = decodeRealtimePacket(payload);
            if (['gameState', 'pong'].includes(packet?.event)) {
              this.triggerLocalEvent(packet.event, packet.data);
            }
          });
          const clearRealtime = () => {
            realtimeOpening = false;
            if (this.realtimeHostConn === realtimeConn) this.realtimeHostConn = null;
            window.setTimeout(openRealtimeChannel, 600);
          };
          realtimeConn.on('close', clearRealtime);
          realtimeConn.on('error', clearRealtime);
        };
        const handleHostPayload = (payload) => {
          const { event, data } = payload || {};
          if (data?.joinAttemptId && data.joinAttemptId !== joinAttemptId) return;
          if (event === 'lobbyUpdate' && !joinAccepted
            && data?.players?.some(player => player.id === this.clientId)) {
            handleHostPayload({
              event: 'joinSuccess',
              data: { code: roomCode, lobbyInfo: data, joinAttemptId }
            });
            return;
          }
          if (event === 'joinSuccess') {
            try {
              conn.send({ event: 'joinConfirmed', data: { roomCode, joinAttemptId } });
            } catch { /* Host retries until the ACK can be delivered. */ }
            if (joinAccepted) return;
            joinAccepted = true;
            finishJoinOperation();
            this.roomOperation = null;
            openRealtimeChannel();
            const lobbyInfo = data?.lobbyInfo || null;
            if (lobbyInfo) this.triggerLocalEvent('lobbyUpdate', lobbyInfo);
            this.listenToRoomChat(roomCode);
            this.watchHostLifecycle(roomCode);
            this.triggerLocalEvent('joinSuccess', { code: roomCode, lobbyInfo });
            if (!lobbyInfo) {
              try {
                conn.send({ event: 'requestLobbySync', data: { joinAttemptId } });
              } catch { /* A subsequent lobby broadcast provides the same state. */ }
            }
          } else if (event === 'matchRejoined') {
            try {
              conn.send({ event: 'joinConfirmed', data: { roomCode, joinAttemptId } });
            } catch { /* Host retries until the ACK can be delivered. */ }
            if (joinAccepted) return;
            joinAccepted = true;
            finishJoinOperation();
            this.roomOperation = null;
            openRealtimeChannel();
            this.listenToRoomChat(roomCode);
            this.watchHostLifecycle(roomCode);
            this.triggerLocalEvent('matchRejoined', data);
            if (!data?.lobbyInfo) {
              try {
                conn.send({ event: 'requestLobbySync', data: { joinAttemptId } });
              } catch { /* A subsequent lobby broadcast provides the same state. */ }
            }
          } else if (event === 'abandonAccepted') {
            if (joinAccepted) return;
            joinAccepted = true;
            finishJoinOperation();
            this.roomOperation = null;
            this.activeMatchId = null;
            if (auth.currentUser?.uid) {
              localStorage.removeItem(`kicker_hax_rejoin_${auth.currentUser.uid}`);
            }
            this.triggerLocalEvent('abandonAccepted', data);
            this.leaveRoom();
          } else if (event === 'joinError') {
            finishJoinOperation();
            this.triggerLocalEvent('joinError', data);
            this.leaveRoom();
          } else if (event) {
            this.triggerLocalEvent(event, data);
          }
        };

        // The host writes this lightweight receipt after accepting the player.
        // It lets the guest enter even if the first WebRTC response is lost.
        if (profile?.uid && !abandon) {
          const receiptRef = ref(rtdb, `multiplayerRooms/${roomCode}/joinReceipts/${profile.uid}`);
          stopJoinReceipt = onValue(receiptRef, snapshot => {
            const receipt = snapshot.val();
            if (!receipt || receipt.joinAttemptId !== joinAttemptId
              || receipt.instanceId !== this.roomInstanceId) return;
            handleHostPayload({
              event: receipt.event === 'matchRejoined' ? 'matchRejoined' : 'joinSuccess',
              data: {
                code: roomCode,
                roomCode,
                matchId: receipt.matchId || matchId,
                lobbyInfo: null,
                joinAttemptId
              }
            });
          });
        }

        conn.on('open', () => {
          console.log('[P2PSocket] WebRTC aberto com Host. Enviando requisição de entrada...');
          const safeProfile = sanitizeMultiplayerProfile(profile);
          const sendJoinRequest = () => {
            try {
              conn.send({
                event: 'joinRoom',
                data: { profile: safeProfile, rejoin, abandon, password, matchId, joinAttemptId }
              });
            } catch { /* The retry interval handles a channel still opening. */ }
          };
          sendJoinRequest();
          joinRequestInterval = window.setInterval(() => {
            if (this.roomOperation === 'join' && !joinAccepted) sendJoinRequest();
          }, 2000);
        });

        conn.on('data', handleHostPayload);
        conn.on('error', error => {
          console.warn('[P2PSocket] Erro no canal de entrada:', error);
        });

        conn.on('close', () => {
          if (this.isLeavingRoom) return;
          console.log('[P2PSocket] Host encerrou a conexão.');
          this.triggerLocalEvent('hostLeft', 'O host saiu. A sala foi encerrada.');
          this.leaveRoom();
        });
      });

      peer.on('error', (err) => {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration) return;
        finishJoinOperation();
        console.error('[P2PSocket] Erro do guest peer:', err);
        this.triggerLocalEvent('joinError', 'Falha ao conectar via WebRTC.');
        this.leaveRoom();
      });
    }).catch((error) => {
      if (this.roomOperation !== 'join') return;
      finishJoinOperation();
      console.error('[P2PSocket] Falha ao buscar sala:', error);
      this.roomCode = null;
      this.roomOperation = null;
      this.triggerLocalEvent('joinError', 'Nao foi possivel consultar a sala.');
    });
  }

  leaveRoom() {
    if (this.isLeavingRoom) return;
    // The original timestamp is created when the match starts. Refresh it at
    // the actual disconnect so a late competitive dropout still receives the
    // full reconnect window in the arena list.
    if (!this.isHost && this.roomCode && this.activeMatchId && auth.currentUser?.uid) {
      localStorage.setItem(`kicker_hax_rejoin_${auth.currentUser.uid}`, JSON.stringify({
        code: this.roomCode,
        matchId: this.activeMatchId,
        savedAt: Date.now()
      }));
    }
    this.isLeavingRoom = true;
    if (this.isHost && this.roomCode) {
      if (this.roomHeartbeatInterval) {
        clearInterval(this.roomHeartbeatInterval);
        this.roomHeartbeatInterval = null;
      }
      // Remove from matchmaking index
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      this.cleanupRoomData(this.roomCode);
      this.stopRoomChat();
      this.stopWatchingHostLifecycle();

      // A host departure is a forfeit for the opponent. It must run before
      // peer channels and realtime room data are removed.
      let matchEndedByHostExit = false;
      if (this.serverRoom && this.serverRoom.match) {
        const activeMatch = this.serverRoom.match;
        const hostPlayer = this.serverRoom.players.find(player => player.id === this.clientId);
        matchEndedByHostExit = activeMatch.forfeitAgainstTeam(hostPlayer?.team);
        activeMatch.isHostPaused = false;
        activeMatch.stopTicker();
      }

      // Close guests WebRTC channels
      this.connections.forEach(c => {
        if (c.open && !matchEndedByHostExit) c.send({ event: 'hostLeft', data: 'O host saiu. A partida foi encerrada.' });
        c.close();
      });
      this.connections = [];
      this.realtimeConnections.forEach(conn => conn.close());
      this.realtimeConnections.clear();
      this.serverRoom = null;
    } else if (this.hostConn) {
      this.realtimeHostConn?.close();
      this.realtimeHostConn = null;
      this.hostConn.close();
      this.hostConn = null;
      this.stopRoomChat();
      this.stopWatchingHostLifecycle();
    }

    if (this.peer) {
      this.peerGeneration += 1;
      this.peer.destroy();
      this.peer = null;
    }

    this.isHost = false;
    this.roomCode = null;
    this.roomInstanceId = null;
    this.hostDepartureReported = false;
    this.roomOperation = null;
    this.activeMatchId = null;
    this.gameStateSequence = 0;
    this.joinResponseRetries.forEach(entry => {
      window.clearInterval(entry.interval);
      window.clearTimeout(entry.timeout);
    });
    this.joinResponseRetries.clear();
    // PeerJS can emit close either synchronously or after cleanup.
    setTimeout(() => { this.isLeavingRoom = false; }, 0);
  }

  // --------------------------------------------------------------------------
  // HOST NETWORK REQUEST PROCESSING
  // --------------------------------------------------------------------------
  clearJoinResponseRetry(socketId, joinAttemptId = '') {
    const retry = this.joinResponseRetries.get(socketId);
    if (!retry) return;
    if (joinAttemptId && retry.joinAttemptId && retry.joinAttemptId !== joinAttemptId) return;
    window.clearInterval(retry.interval);
    window.clearTimeout(retry.timeout);
    this.joinResponseRetries.delete(socketId);
  }

  sendJoinResponseWithRetry(socketId, conn, event, data) {
    this.clearJoinResponseRetry(socketId);
    const payload = { event, data: compactMultiplayerPayload(data) };
    const send = () => {
      if (!conn?.open) return;
      try { conn.send(payload); } catch { /* The next retry uses the control channel again. */ }
    };
    send();
    const interval = window.setInterval(send, 700);
    const timeout = window.setTimeout(() => this.clearJoinResponseRetry(socketId), 12000);
    this.joinResponseRetries.set(socketId, {
      interval,
      timeout,
      joinAttemptId: String(data?.joinAttemptId || '')
    });
  }

  publishJoinReceipt(uid, joinAttemptId, event, matchId = '') {
    if (!this.roomCode || !uid || !joinAttemptId) return;
    set(ref(rtdb, `multiplayerRooms/${this.roomCode}/joinReceipts/${uid}`), {
      joinAttemptId,
      event,
      matchId: matchId || '',
      instanceId: this.roomInstanceId || '',
      acceptedAt: Date.now()
    }).catch(error => console.warn('[P2PSocket] Falha ao confirmar entrada no RTDB:', error));
  }

  handleHostReceivedData(socketId, event, data, conn) {
    if (!this.serverRoom) return;

    if (event === 'joinConfirmed') {
      this.clearJoinResponseRetry(socketId, String(data?.joinAttemptId || ''));
      return;
    }

    if (event === 'joinRoom') {
      const { profile, rejoin, abandon, password, matchId, joinAttemptId = '' } = data || {};

      // Retries receive a new PeerJS ID. Rebind the existing lobby entry by
      // authenticated UID instead of briefly duplicating and then removing it.
      if (this.serverRoom.status === 'lobby' && profile?.uid) {
        const duplicatePlayer = this.serverRoom.players.find(player =>
          player.uid === profile.uid && player.id !== this.serverRoom.hostId
        );
        if (duplicatePlayer) {
          const previousId = duplicatePlayer.id;
          this.connections = this.connections.filter(channel => channel.peer !== previousId);
          this.realtimeConnections.get(previousId)?.close();
          this.realtimeConnections.delete(previousId);
          duplicatePlayer.id = socketId;
          if (conn && !this.connections.includes(conn)) {
            conn.peerId = socketId;
            this.connections.push(conn);
          }
          const lobbyInfo = this.serverRoom.getLobbyInfo();
          this.publishJoinReceipt(profile.uid, joinAttemptId, 'joinSuccess');
          this.sendJoinResponseWithRetry(socketId, conn, 'joinSuccess', {
            code: this.roomCode,
            lobbyInfo,
            joinAttemptId
          });
          this.broadcast('lobbyUpdate', lobbyInfo);
          return;
        }
      }
      if (abandon && rejoin && this.serverRoom.status === 'playing') {
        const player = this.serverRoom.players.find(item => item.uid && item.uid === profile?.uid);
        if (!player || !this.serverRoom.match || (matchId && matchId !== this.serverRoom.match.matchId)) {
          if (conn?.open) conn.send({ event: 'joinError', data: 'A partida para abandonar não está mais disponível.' });
          return;
        }
        if (player.disconnected && this.serverRoom.match.disconnectVoting
          && this.serverRoom.match.disconnectedUids.has(player.uid)) {
          this.blockRoomRejoin(player.uid);
          if (conn?.open) conn.send({
            event: 'abandonAccepted',
            data: { roomCode: this.roomCode, matchId, joinAttemptId }
          });
          return;
        }
        this.acceptPlayerSurrender(player, conn);
        return;
      }
      const alreadyRejoined = rejoin && this.serverRoom.status === 'playing'
        ? this.serverRoom.players.find(player => player.id === socketId && !player.disconnected)
        : null;
      if (alreadyRejoined && this.serverRoom.match) {
        this.publishJoinReceipt(profile?.uid, joinAttemptId, 'matchRejoined', this.serverRoom.match.matchId);
        this.sendJoinResponseWithRetry(socketId, conn, 'matchRejoined', {
          roomCode: this.roomCode,
          matchId: this.serverRoom.match.matchId,
          lobbyInfo: this.serverRoom.getLobbyInfo(),
          joinAttemptId
        });
        return;
      }
      const reconnecting = rejoin && this.serverRoom.status === 'playing'
        ? this.serverRoom.reconnectPlayer(profile?.uid, socketId, matchId)
        : null;

      if (rejoin && this.serverRoom.status === 'playing') {
        if (reconnecting?.blocked) {
          if (conn) conn.send({ event: 'joinError', data: 'Você abandonou esta partida e não pode mais voltar.' });
          return;
        }
        if (reconnecting?.limitReached) {
          this.blockRoomRejoin(reconnecting.player.uid);
          if (conn) conn.send({ event: 'joinError', data: 'Limite de 2 retornos atingido. Voce nao pode mais voltar a esta partida.' });
          return;
        }
        if (!reconnecting || !this.serverRoom.match) {
          if (conn) conn.send({ event: 'joinError', data: 'A janela para voltar a partida expirou.' });
          return;
        }
        if (conn) {
          conn.peerId = socketId;
          this.connections.push(conn);
        }
        this.serverRoom.match.reconnectPlayer(reconnecting.previousId, socketId, reconnecting.player);
        this.serverRoom.match.resumeAfterReconnect(reconnecting.player.uid);
        this.publishJoinReceipt(reconnecting.player.uid, joinAttemptId, 'matchRejoined', this.serverRoom.match.matchId);
        update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { updatedAt: Date.now() }).catch(() => {});
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${reconnecting.player.username} voltou para a partida.` });
        if (conn) this.sendJoinResponseWithRetry(socketId, conn, 'matchRejoined', {
          roomCode: this.roomCode,
          matchId: this.serverRoom.match.matchId,
          lobbyInfo: this.serverRoom.getLobbyInfo(),
          joinAttemptId
        });
        return;
      }

      if (this.serverRoom.password && this.serverRoom.password !== String(password || '')) {
        if (conn) conn.send({ event: 'joinError', data: 'Senha incorreta.' });
        return;
      }

      const existingPlayer = this.serverRoom.players.find(player => player.id === socketId);
      if (existingPlayer) {
        if (conn && !this.connections.includes(conn)) {
          conn.peerId = socketId;
          this.connections.push(conn);
        }
        this.publishJoinReceipt(profile?.uid, joinAttemptId, 'joinSuccess');
        this.sendJoinResponseWithRetry(socketId, conn, 'joinSuccess', {
          code: this.roomCode,
          lobbyInfo: this.serverRoom.getLobbyInfo(),
          joinAttemptId
        });
        return;
      }

      if (this.serverRoom.players.length >= this.serverRoom.maxPlayers) {
        if (conn) conn.send({ event: 'joinError', data: 'Sala cheia.' });
        return;
      }

      // Save player WebRTC data channel
      if (conn) {
        conn.peerId = socketId;
        this.connections.push(conn);
      }

      this.serverRoom.addPlayer(socketId, sanitizeMultiplayerProfile(profile), 'spectator');

      // Update matchmaking metadata count
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      const joinedAt = Date.now();
      update(roomRef, {
        playersCount: this.serverRoom.players.length,
        hostHeartbeatAt: joinedAt,
        updatedAt: joinedAt
      });

      const lobbyInfo = this.serverRoom.getLobbyInfo();
      this.publishJoinReceipt(profile?.uid, joinAttemptId, 'joinSuccess');
      if (conn) this.sendJoinResponseWithRetry(socketId, conn, 'joinSuccess', {
        code: this.roomCode,
        lobbyInfo,
        joinAttemptId
      });

      this.broadcast('lobbyUpdate', lobbyInfo);
      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${profile.username} entrou na sala.` });
    } 
    
    else if (event === 'changeTeam') {
      if (socketId !== this.serverRoom.hostId) return;
      if (this.serverRoom.competitive) return;
      const changed = this.serverRoom.changeTeam(data.playerId, data.team);
      if (changed) {
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      }
    } 
    
    else if (event === 'toggleReady') {
      this.serverRoom.toggleReady(socketId);
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    } 
    
    else if (event === 'chatMessage') {
      const player = this.serverRoom.players.find(p => p.id === socketId);
      this.sendRoomChatMessage({
        uid: player?.uid || '',
        username: player ? player.username : 'Jogador',
        badge: player ? player.badge : '',
        staffRole: player?.staffRole || '',
        text: data
      });
    } 
    
    else if (event === 'gameInput') {
      if (this.serverRoom.match) {
        this.serverRoom.match.updateInput(socketId, data);
      }
    }

    else if (event === 'requestLobbySync') {
      if (!conn) return;
      const player = this.serverRoom.players.find(item => item.id === socketId);
      if (!player) return;
      try {
        conn.send({
          event: 'lobbyUpdate',
          data: compactMultiplayerPayload(this.serverRoom.getLobbyInfo())
        });
      } catch { /* The next host broadcast will carry the same state. */ }
    }

    else if (event === 'matchClientReady') {
      const match = this.serverRoom.match;
      if (!match || (data?.matchId && data.matchId !== match.matchId)) return;
      match.touchPlayer(socketId);
      match.markClientReady(socketId);
    }

    else if (event === 'voteContinueWithoutDisconnected') {
      if (!this.serverRoom.match) return;
      const vote = this.serverRoom.match.voteContinueWithoutDisconnected(socketId);
      if (!vote.accepted) return;
      this.broadcast('continueVoteStatus', vote);
      if (!vote.passed) return;
      const disconnectedUids = [...this.serverRoom.match.disconnectedUids];
      const disconnectedPlayers = this.serverRoom.players.filter(player => disconnectedUids.includes(player.uid));
      const disconnectedName = disconnectedPlayers.map(player => player.username).join(' e ') || 'Jogador';
      disconnectedPlayers.forEach(player => {
        this.blockRoomRejoin(player.uid);
        this.serverRoom.removePlayer(player.id);
      });
      this.serverRoom.match.continueWithoutDisconnected();
      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `Votação aprovada. A partida continua sem ${disconnectedName}.` });
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { playersCount: this.serverRoom.players.length, updatedAt: Date.now() }).catch(() => {});
    }

    else if (event === 'surrenderMatch') {
      if (!this.serverRoom.match || this.serverRoom.status !== 'playing') return;
      const player = this.serverRoom.players.find(item => item.id === socketId);
      if (!player || player.cpu || player.team === 'spectator' || player.disconnected) return;
      this.acceptPlayerSurrender(player, null);
      if (socketId !== this.clientId && conn?.open) conn.send({ event: 'surrenderAccepted' });
    }

    else if (event === 'ping') {
      // A tiny echo packet measures actual WebRTC round-trip time. The host
      // handles its own packet locally and guests receive the same response.
      const payload = { sentAt: Number(data?.sentAt) || Date.now() };
      this.serverRoom.match?.touchPlayer(socketId);
      if (socketId === this.clientId) {
        this.triggerLocalEvent('pong', payload);
      } else if (conn?.open) {
        const packet = conn.metadata?.channel === 'realtime'
          ? encodeRealtimePacket('pong', payload)
          : { event: 'pong', data: payload };
        conn.send(packet);
      }
    }

    else if (event === 'hostFocusChanged') {
      return;
    }

    else if (event === 'hostSetPaused') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        if (this.serverRoom.competitive) return;
        if (this.serverRoom.match.disconnectPauseUntil) return;
        this.serverRoom.match.isHostPaused = !!data.paused;
        this.serverRoom.match.pauseTicks = 0;
        const status = data.paused ?'pausada' : 'retomada';
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `A partida foi ${status} pelo host.` });
      }
    }

    else if (event === 'hostResetMatch') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.resetMatch();
        this.broadcast('matchReset');
      }
    }

    else if (event === 'hostEndMatchToLobby') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.stop();
        this.serverRoom.match = null;
        this.serverRoom.status = 'lobby';
        this.serverRoom.resetLobbyStatus();
        this.serverRoom.chatHistory = [];
        this.cleanupRoomChats(this.roomCode).catch(() => {});
        const lobbyInfo = this.serverRoom.getLobbyInfo();
        this.broadcast('lobbyUpdate', lobbyInfo);
        this.broadcast('matchAborted', { lobbyInfo });
        update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), {
          status: 'lobby',
          matchId: null,
          matchEndedAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }

    else if (event === 'returnToLobby') {
      const player = this.serverRoom.players.find(item => item.id === socketId);
      if (!player) return;
      // Do not rebuild the whole room before everyone returns from results.
      player.status = 'lobby';
      player.ready = false;
      player.team = 'spectator';
      player.disconnected = false;
      player.disconnectedAt = null;
      const lobbyInfo = this.serverRoom.getLobbyInfo();
      this.broadcast('lobbyUpdate', lobbyInfo);
      const returnedPayload = { lobbyInfo };
      if (socketId === this.clientId) {
        this.triggerLocalEvent('returnedToLobby', returnedPayload);
      } else if (conn?.open) {
        conn.send({ event: 'returnedToLobby', data: returnedPayload });
      }
      const lobbyCount = this.serverRoom.players.filter(item => item.status === 'lobby').length;
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { playersCount: lobbyCount, updatedAt: Date.now() }).catch(() => {});
    }

    else if (event === 'voteSkipReplay') {
      if (!this.serverRoom.match) return;
      const vote = this.serverRoom.match.voteSkipReplay(socketId);
      if (!vote.accepted) return;
      this.broadcast('replayVoteStatus', vote);
      if (vote.passed) this.broadcast('replaySkipped');
    }

    else if (event === 'hostSkipReplay') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.skipReplay();
        this.broadcast('replaySkipped');
      }
    }

    else if (event === 'hostAddTime') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        const seconds = Math.max(-600, Math.min(600, Number(data.seconds) || 0));
        this.serverRoom.match.addTime(seconds);
        const verb = seconds >= 0 ? 'adicionou' : 'removeu';
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `O host ${verb} ${Math.round(Math.abs(seconds) / 60)} minuto(s).` });
      }
    }

    else if (event === 'hostSetPassword') {
      if (socketId !== this.serverRoom.hostId || this.serverRoom.status !== 'lobby') return;
      const password = String(data?.password || '').slice(0, ROOM_PASSWORD_MAX_LENGTH);
      this.serverRoom.updateSettings({ password, competitive: password ? false : this.serverRoom.competitive });
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), {
        hasPassword: !!password,
        competitive: this.serverRoom.competitive,
        updatedAt: Date.now()
      }).catch(() => {});
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    }

    else if (event === 'hostSetCompetitive') {
      if (socketId !== this.serverRoom.hostId || this.serverRoom.status !== 'lobby') return;
      this.serverRoom.updateSettings({ competitive: !!data?.competitive });
      if (this.serverRoom.competitive) {
        this.serverRoom.duration = 5;
        this.serverRoom.goalLimit = 0;
      }
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), {
        competitive: this.serverRoom.competitive,
        duration: this.serverRoom.duration,
        goalLimit: this.serverRoom.goalLimit,
        updatedAt: Date.now()
      }).catch(() => {});
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    }

    else if (event === 'banPlayer') {
      if (socketId !== this.serverRoom.hostId) return;
      const target = this.serverRoom.players.find(p => p.id === data?.playerId);
      if (!target || target.id === this.serverRoom.hostId || target.cpu) return;
      if (target.uid) {
        this.serverRoom.bannedUids.add(target.uid);
        update(ref(rtdb, `multiplayerRooms/${this.roomCode}/bannedUids`), { [target.uid]: true }).catch(() => {});
      }
      this.kickPlayer(target.id);
      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${target.username} foi banido desta sala.` });
    }

    else if (event === 'hostChangeTeam') {
      if (socketId !== this.serverRoom.hostId) return;
      if (this.serverRoom.competitive) return;
      if (!['red', 'blue', 'spectator'].includes(data.team)) return;
      const changed = this.serverRoom.changeTeam(data.playerId, data.team);
      if (changed) {
        if (this.serverRoom.match) {
          this.serverRoom.match.syncPlayersFromLobby(this.serverRoom.players, { allowCasualForfeit: false });
          this.serverRoom.match.kickoff();
        }
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      }
    }

    else if (event === 'hostRandomizeTeams') {
      if (socketId !== this.serverRoom.hostId || this.serverRoom.status !== 'lobby' || this.serverRoom.competitive) return;
      this.randomizeCasualTeams();
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { updatedAt: Date.now() }).catch(() => {});
    }
  }

  handleSilentGuestDisconnect(physicalPlayer) {
    if (!physicalPlayer || !this.serverRoom?.match || this.serverRoom.status !== 'playing') return;
    const rosterPlayer = this.serverRoom.players.find(player => player.id === physicalPlayer.id);
    if (!rosterPlayer || rosterPlayer.disconnected || rosterPlayer.team === 'spectator') return;
    if ((rosterPlayer.rejoinCount || 0) >= 2) {
      // A disconnected roster record cannot cast the final continuation vote.
      const teammates = this.serverRoom.players.filter(player => !player.cpu && !player.disconnected && player.team === rosterPlayer.team && player.id !== rosterPlayer.id);
      this.blockRoomRejoin(rosterPlayer.uid);
      if (teammates.length === 0) {
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${rosterPlayer.username} excedeu o limite de retornos. O time adversário venceu.` });
        this.serverRoom.match.forfeitAgainstTeam(rosterPlayer.team === 'red' ? 0 : 1);
        return;
      }
      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${rosterPlayer.username} excedeu o limite de retornos. O time pode votar para continuar sem ele.` });
    }
    const overReturnLimit = (rosterPlayer.rejoinCount || 0) >= 2;
    const reserved = this.serverRoom.markPlayerDisconnected(rosterPlayer.id);
    this.serverRoom.match.pauseForDisconnectedTeam(
      reserved.team === 'red' ? 0 : 1,
      reserved.uid,
      reserved.username,
      overReturnLimit ? { allowRejoin: false, timeoutMs: 30000 } : {}
    );
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${reserved.username} perdeu a conexão. Aguardando retorno por 1 minuto e 30 segundos.` });
    update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { updatedAt: Date.now() }).catch(() => {});
    if (overReturnLimit) {
      this.sendRoomChatMessage({ username: 'Sistema', badge: '', text: 'Retorno bloqueado. A votacao do time encerra em 30 segundos.' });
    }
  }

  handleHostPlayerDisconnect(conn) {
    const socketId = conn.peer;
    this.clearJoinResponseRetry(socketId);
    this.connections = this.connections.filter(c => c !== conn);
    this.realtimeConnections.get(socketId)?.close();
    this.realtimeConnections.delete(socketId);

    if (this.serverRoom) {
      const departingPlayer = this.serverRoom.players.find(player => player.id === socketId);
      const activeMatchDisconnect = this.serverRoom.match && departingPlayer && !departingPlayer.cpu
        && departingPlayer.team !== 'spectator' && this.serverRoom.status === 'playing';
      if (activeMatchDisconnect) {
        this.handleSilentGuestDisconnect(departingPlayer);
        return;
      }
      const removed = this.serverRoom.removePlayer(socketId);
      
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      update(roomRef, { playersCount: this.serverRoom.players.length, updatedAt: Date.now() });

      if (removed) {
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${removed.username} saiu da sala.` });
      }

      if (this.serverRoom.match?.disconnectPauseUntil) {
        // The authoritative match keeps the missing physical player until the
        // vote resolves. Re-syncing from the lobby here would erase that
        // record before continueWithoutDisconnected can remove it cleanly.
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
        return;
      }

      if (this.serverRoom.match) {
        this.serverRoom.match.syncPlayersFromLobby(this.serverRoom.players, { allowCasualForfeit: true });
      }

      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    }
  }

  // --------------------------------------------------------------------------
  // LOBBY CONTROL ACTIONS (HOST ONLY OR GUEST)
  // --------------------------------------------------------------------------
  changeTeam(team) {
    this.emit('changeTeam', team);
  }

  toggleReady() {
    this.emit('toggleReady');
  }

  sendChatMessage(text) {
    if (this.isHost && this.serverRoom) {
      const player = this.serverRoom.players.find(p => p.id === this.clientId);
      this.sendRoomChatMessage({
        uid: player?.uid || '',
        username: player?.username || 'Jogador',
        badge: player?.badge || '',
        staffRole: player?.staffRole || '',
        text
      });
      return;
    }
    this.emit('chatMessage', text);
  }

  addBot(team) {
    return;
  }

  removeBot(botId) {
    if (!this.isHost || !this.serverRoom) return;
    this.serverRoom.removePlayer(botId);
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
    update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { playersCount: this.serverRoom.players.length, updatedAt: Date.now() });
  }

  kickPlayer(targetSocketId) {
    if (!this.isHost || !this.serverRoom) return;
    if (targetSocketId === this.serverRoom.hostId) return;

    const conn = this.connections.find(c => c.peer === targetSocketId);
    const targetPlayer = this.serverRoom.players.find(p => p.id === targetSocketId);

    if (targetPlayer) {
      if (this.serverRoom.match && targetPlayer.disconnected) {
        // A host may deny a reserved reconnect. The affected side receives
        // its final continuation vote instead of leaving the match paused.
        this.blockRoomRejoin(targetPlayer.uid);
        this.serverRoom.match.forceContinueVote(targetPlayer.uid, targetPlayer.username);
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${targetPlayer.username} foi removido do retorno. O time decide em 30 segundos.` });
        return;
      }

      if (this.serverRoom.match) {
        const teammates = this.serverRoom.players.filter(player => !player.cpu
          && !player.disconnected && player.team === targetPlayer.team && player.id !== targetPlayer.id);
        this.blockRoomRejoin(targetPlayer.uid);
        if (teammates.length > 0) {
          // A kick/ban never awards the host a free win. The affected team is
          // offered the same final vote used for a failed reconnect.
          this.serverRoom.markPlayerDisconnected(targetPlayer.id);
          this.serverRoom.match.pauseForDisconnectedTeam(
            targetPlayer.team === 'red' ? 0 : 1,
            targetPlayer.uid,
            targetPlayer.username,
            { allowRejoin: false, timeoutMs: 30000 }
          );
          this.serverRoom.match.forceContinueVote(targetPlayer.uid, targetPlayer.username);
          this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${targetPlayer.username} foi expulso. O time tem 30 segundos para votar e continuar sem ele.` });
        } else {
          // A 1v1 cannot vote. Close the room without results or XP and send
          // everyone to the arena rather than giving the host a free victory.
          const closingCode = this.roomCode;
          this.serverRoom.match.stop();
          this.broadcast('matchAborted', { closeRoom: true, removedPlayerId: targetPlayer.id });
          if (conn) {
            // Let the administrative abort reach the guest before closing the
            // channel; otherwise its close handler can mistake this for a host
            // abandonment and award XP/result.
            setTimeout(() => conn.close(), 180);
          }
          this.cleanupRoomData(closingCode).catch(() => {});
          this.serverRoom = null;
          this.roomCode = null;
          this.isHost = false;
          return;
        }
      }
      this.serverRoom.removePlayer(targetSocketId);
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { playersCount: this.serverRoom.players.length, updatedAt: Date.now() });

      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${targetPlayer.username} foi expulso da sala.` });

      if (conn) {
        conn.send({ event: 'kicked' });
        conn.close();
      }
    }
  }

  updateRoomSettings(settings) {
    if (!this.isHost || !this.serverRoom) return;

    this.serverRoom.updateSettings(settings);
    if (this.serverRoom.competitive) {
      this.serverRoom.duration = 5;
      this.serverRoom.goalLimit = 0;
    }
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());

    // Update settings in Firebase Realtime Database
    const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
    update(roomRef, {
      name: this.serverRoom.name,
      maxPlayers: this.serverRoom.maxPlayers,
      duration: this.serverRoom.duration,
      goalLimit: this.serverRoom.goalLimit,
      fieldSize: this.serverRoom.fieldSize,
      competitive: this.serverRoom.competitive,
      updatedAt: Date.now()
    });
  }

  startGame() {
    if (!this.isHost || !this.serverRoom) return;

    if (this.serverRoom.competitive) {
      const humans = this.serverRoom.players.filter(p => !p.cpu && !p.disconnected && p.status === 'lobby');
      if (humans.length < 2 || humans.length % 2 !== 0) {
        this.triggerLocalEvent('startError', 'Partida competitiva exige quantidade par de jogadores.');
        return;
      }
      if (humans.some(player => !player.ready)) {
        this.triggerLocalEvent('startError', 'Todos os jogadores precisam marcar pronto antes do sorteio dos times.');
        return;
      }
      this.applyCompetitiveStartRules();
    }

    // Only people who are actually back in this lobby can block a new start.
    // Post-game/disconnected roster records are kept for lifecycle cleanup but
    // are not invisible match participants.
    const activePlayers = this.serverRoom.players.filter(p => p.status === 'lobby' && !p.disconnected && p.team !== 'spectator' && !p.cpu);
    const redTeam = activePlayers.filter(p => p.team === 'red');
    const blueTeam = activePlayers.filter(p => p.team === 'blue');
    const notReady = activePlayers.filter(p => !p.ready);

    if (redTeam.length === 0 || blueTeam.length === 0) {
      this.triggerLocalEvent('startError', 'Cada time precisa de pelo menos 1 jogador.');
      return;
    }
    if (notReady.length > 0) {
      this.triggerLocalEvent('startError', 'Todos os jogadores precisam marcar pronto.');
      return;
    }
    if (this.serverRoom.competitive && redTeam.length !== blueTeam.length) {
      this.triggerLocalEvent('startError', 'Os times precisam estar equilibrados.');
      return;
    }

    this.serverRoom.status = 'playing';

    // Mock IO object to pass to ServerMatch
    const mockIo = {
      to: (roomCode) => ({
        emit: (event, data) => {
          this.broadcast(event, data);
        }
      })
    };

    // Keep this concrete room reference. A transient PeerJS signalling error
    // must never leave a running match callback dereferencing a null room.
    const matchRoom = this.serverRoom;

    // Instantiate physics tick simulator inside host client browser!
    this.serverRoom.match = new ServerMatch(
      this.roomCode,
      this.serverRoom.duration,
      this.serverRoom.goalLimit,
      activePlayers,
      mockIo,
      (result) => {
        if (!matchRoom || this.serverRoom !== matchRoom) return;
        // Callback on match end
        matchRoom.status = 'lobby';
        matchRoom.match = null;
        matchRoom.chatHistory = [];
        this.cleanupRoomChats(this.roomCode).catch(() => {});

        matchRoom.resetLobbyStatus();
        matchRoom.players.forEach(player => {
          player.status = player.cpu ? 'lobby' : 'post-game';
        });
        const lobbyInfo = matchRoom.getLobbyInfo();
        this.broadcast('lobbyUpdate', lobbyInfo);
        this.broadcast('matchEnded', { ...result, lobbyInfo });

        // Update status in Firebase
        const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
        update(roomRef, {
          status: 'lobby',
          matchId: null,
          matchEndedAt: Date.now(),
          playersCount: 0,
          updatedAt: Date.now()
        });
      },
      this.serverRoom.fieldSize,
      {
        competitive: this.serverRoom.competitive,
        allowCasualForfeit: false,
        hostPlayerId: this.clientId,
        onGuestConnectionLost: (physicalPlayer) => this.handleSilentGuestDisconnect(physicalPlayer)
      }
    );

    this.broadcast('matchStarted', {
      matchId: this.serverRoom.match.matchId,
      startedAt: this.serverRoom.match.startedAt
    });

    const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
    update(roomRef, {
      status: 'playing',
      matchId: this.serverRoom.match.matchId,
      duration: this.serverRoom.duration,
      goalLimit: this.serverRoom.goalLimit,
      fieldSize: this.serverRoom.fieldSize,
      updatedAt: Date.now()
    });
  }

  sendGameInput(inputData) {
    const now = Date.now();
    const normalized = {
      ...inputData,
      x: Math.round(Number(inputData.x || 0) * 100) / 100,
      y: Math.round(Number(inputData.y || 0) * 100) / 100
    };
    const actionSignature = `${+!!normalized.shoot}|${+!!normalized.sprint}|${+!!normalized.dribble}|${+!!normalized.tackle}|${+!!normalized.power}|${+!!normalized.mobileTackleAssist}`;
    const signature = `${normalized.x}|${normalized.y}|${actionSignature}`;
    const urgentActionChanged = actionSignature !== this.lastInputActionSignature;
    // Movement is capped at 30 Hz; button edges bypass that cap so mobile
    // actions arrive immediately without joystick jitter flooding WebRTC.
    if (!urgentActionChanged && now - this.lastInputSentAt < 33) return;
    this.lastInputSentAt = now;
    this.lastInputSignature = signature;
    this.lastInputActionSignature = actionSignature;
    this.emit('gameInput', normalized);
  }

  sendMatchClientReady() {
    this.emit('matchClientReady', { matchId: this.activeMatchId });
  }

  hostResetMatch() {
    this.emit('hostResetMatch');
  }

  hostSetPaused(paused) {
    if (this.serverRoom?.competitive) return;
    this.emit('hostSetPaused', { paused });
  }

  hostAddTime(seconds) {
    this.emit('hostAddTime', { seconds });
  }

  hostSetPassword(password) {
    this.emit('hostSetPassword', { password });
  }

  hostSetCompetitive(competitive) {
    this.emit('hostSetCompetitive', { competitive });
  }

  banPlayer(playerId) {
    this.emit('banPlayer', { playerId });
  }

  hostRandomizeTeams() {
    this.emit('hostRandomizeTeams');
  }

  hostChangeTeam(playerId, team) {
    this.emit('hostChangeTeam', { playerId, team });
  }

  hostEndMatchToLobby() {
    this.emit('hostEndMatchToLobby');
  }

  returnToLobby() {
    this.emit('returnToLobby');
  }

  voteContinueWithoutDisconnected() {
    this.emit('voteContinueWithoutDisconnected');
  }

  surrenderMatch() {
    this.emit('surrenderMatch');
  }

  abandonMatch(code, password, profile, matchId) {
    this.joinRoom(code, password, profile, { rejoin: true, abandon: true, matchId });
  }

  voteSkipReplay() {
    this.emit('voteSkipReplay');
  }

  skipReplay() {
    if (this.isHost) {
      this.emit('hostSkipReplay');
    } else {
      this.triggerLocalEvent('replaySkipped');
    }
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENER REGISTRATION
  // --------------------------------------------------------------------------
  onLobbyUpdate(callback) {
    this.off('lobbyUpdate');
    this.on('lobbyUpdate', callback);
  }

  onChat(callback) {
    this.off('chatMessage');
    this.on('chatMessage', callback);
  }

  onMatchStarted(callback) {
    this.off('matchStarted');
    this.on('matchStarted', callback);
  }

  onGameState(callback) {
    this.off('gameState');
    this.on('gameState', callback);
  }

  onPlayReplay(callback) {
    this.off('playReplay');
    this.on('playReplay', callback);
  }

  onMatchEnded(callback) {
    this.off('matchEnded');
    this.on('matchEnded', callback);
  }

  onKicked(callback) {
    this.off('kicked');
    this.on('kicked', callback);
  }

  onPublicRoomsList(callback) {
    this.off('publicRoomsList');
    this.on('publicRoomsList', callback);
  }

  clearListeners() {
    this.off('lobbyUpdate');
    this.off('chatMessage');
    this.off('matchStarted');
    this.off('gameState');
    this.off('playReplay');
    this.off('matchEnded');
    this.off('matchAborted');
    this.off('replaySkipped');
    this.off('hostLeft');
    this.off('roomChatCleared');
    this.off('kicked');
    this.off('publicRoomsList');
    this.off('matchRejoined');
    this.off('surrenderAccepted');
  }

  // --------------------------------------------------------------------------
  // MATCHMAKING PUBLIC ROOMS LISTENING (FIREBASE RTDB)
  // --------------------------------------------------------------------------
  listenToPublicRooms() {
    const roomsRef = ref(rtdb, 'multiplayerRooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const now = Date.now();
      const list = Object.keys(data)
        .map(key => data[key])
        .filter(room => this.isActiveRoomRecord(room, now) && room.status === 'lobby');
      Object.values(data)
        .filter(room => room?.code && !this.isActiveRoomRecord(room, now))
        .forEach(room => this.cleanupRoomData(room.code).catch(() => {}));
      this.cleanupOrphanRoomChats(data).catch(() => {});
      this.triggerLocalEvent('publicRoomsList', list);
    });
  }

  refreshPublicRooms() {
    get(ref(rtdb, 'multiplayerRooms')).then(snapshot => {
      const data = snapshot.val() || {};
      const now = Date.now();
      const list = Object.values(data).filter(room => this.isActiveRoomRecord(room, now) && room.status === 'lobby');
      Object.values(data)
        .filter(room => room?.code && !this.isActiveRoomRecord(room, now))
        .forEach(room => {
          this.cleanupRoomData(room.code).catch(() => {});
        });
      this.triggerLocalEvent('publicRoomsList', list);
    });
  }

  async getPublicRoomMeta(code) {
    const roomCode = String(code || '').toUpperCase();
    if (roomCode.length !== 6) return null;
    const snapshot = await get(ref(rtdb, `multiplayerRooms/${roomCode}`));
    if (!snapshot.exists()) {
      await this.cleanupRoomData(roomCode).catch(() => {});
      return null;
    }

    const room = snapshot.val();
    const connectedToThisRoom = this.roomCode === roomCode && this.hasLiveHostConnection();
    if (!this.isActiveRoomRecord(room) && !connectedToThisRoom) {
      await this.cleanupRoomData(roomCode).catch(() => {});
      return null;
    }
    return room;
  }

  startRoomHeartbeat() {
    if (this.roomHeartbeatInterval) clearInterval(this.roomHeartbeatInterval);
    this.roomHeartbeatInterval = setInterval(() => {
      if (!this.isHost || !this.roomCode) return;
      const roomStatus = this.serverRoom?.status || 'lobby';
      const liveLobbyPlayers = this.serverRoom?.players?.filter(player => player.status === 'lobby').length || 0;
      update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), {
        playersCount: roomStatus === 'lobby' ? liveLobbyPlayers : (this.serverRoom?.players?.length || 0),
        status: roomStatus,
        hostHeartbeatAt: Date.now(),
        updatedAt: Date.now()
      }).catch(() => {});
    }, 5000);
  }

  async cleanupOrphanRoomChats(roomIndex = null) {
    const rooms = roomIndex || (await get(ref(rtdb, 'multiplayerRooms'))).val() || {};
    const chatSnapshot = await get(ref(rtdb, 'roomChats'));
    const matchChatSnapshot = await get(ref(rtdb, 'matchChats'));
    const orphanCodes = getOrphanRoomCodes(rooms, chatSnapshot.val(), matchChatSnapshot.val());
    await Promise.allSettled(orphanCodes.map(code => this.cleanupRoomChats(code)));
  }

  watchHostLifecycle(roomCode) {
    this.stopWatchingHostLifecycle();
    const roomRef = ref(rtdb, `multiplayerRooms/${roomCode}`);
    this.lastHostHeartbeatAt = Date.now();
    this.hostDepartureReported = false;
    this.roomLifecycleUnsub = onValue(roomRef, snapshot => {
      if (!snapshot.exists()) {
        this.reportHostDeparture('O host saiu. A sala foi encerrada.');
        return;
      }
      const room = snapshot.val() || {};
      this.lastHostHeartbeatAt = Number(room.hostHeartbeatAt || room.updatedAt || Date.now());
    });
    this.hostLeaseWatchInterval = setInterval(() => {
      if (this.isHost || !this.roomCode) return;
      if (Date.now() - this.lastHostHeartbeatAt > 15000) {
        this.reportHostDeparture('O host perdeu a conexão. A partida foi encerrada.');
      }
    }, 3000);
  }

  stopWatchingHostLifecycle() {
    if (this.roomLifecycleUnsub) this.roomLifecycleUnsub();
    if (this.hostLeaseWatchInterval) clearInterval(this.hostLeaseWatchInterval);
    this.roomLifecycleUnsub = null;
    this.hostLeaseWatchInterval = null;
  }

  reportHostDeparture(message) {
    if (this.isHost || this.hostDepartureReported) return;
    this.hostDepartureReported = true;
    this.triggerLocalEvent('hostLeft', message);
    this.leaveRoom();
  }

  listenToRoomChat(roomCode) {
    this.stopRoomChat();
    const expectedRoomCode = String(roomCode || '').toUpperCase();
    const chatRef = ref(rtdb, `roomChats/${expectedRoomCode}`);
    const unsubscribeValue = onValue(chatRef, (snapshot) => {
      if (this.roomCode !== expectedRoomCode) return;
      if (!snapshot.exists()) this.triggerLocalEvent('roomChatCleared');
    });
    const unsubscribeChild = onChildAdded(chatRef, (snapshot) => {
      if (this.roomCode !== expectedRoomCode) return;
      const msg = { ...snapshot.val(), id: snapshot.key };
      if (msg.instanceId && this.roomInstanceId && msg.instanceId !== this.roomInstanceId) return;
      if (msg) this.triggerLocalEvent('chatMessage', msg);
    });
    this.roomChatUnsub = () => {
      unsubscribeValue();
      unsubscribeChild();
    };
  }

  stopRoomChat() {
    if (this.roomChatUnsub) {
      this.roomChatUnsub();
      this.roomChatUnsub = null;
    }
  }

  async sendRoomChatMessage(message) {
    if (!this.roomCode) return;
    const msg = {
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      uid: message.uid || '',
      username: message.username || 'Jogador',
      badge: message.badge || '',
      staffRole: message.staffRole || '',
      instanceId: this.roomInstanceId || '',
      text: String(message.text || '').trim().slice(0, CHAT_MESSAGE_MAX_LENGTH),
      // Host wall time is immediately sortable. serverTimestamp resolves later
      // and caused clients to append old messages grouped by sender.
      timestamp: Date.now()
    };
    if (!msg.text) return;
    await push(ref(rtdb, `roomChats/${this.roomCode}`), msg).catch(() => {
      this.triggerLocalEvent('chatMessage', msg);
    });
  }

  applyCompetitiveStartRules() {
    const humans = this.serverRoom.players.filter(p => !p.cpu && !p.disconnected && p.status === 'lobby');
    const evenCount = humans.length - (humans.length % 2);
    const shuffled = humans.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach((p, index) => {
      p.team = index < evenCount / 2 ? 'red' : 'blue';
    });
    const activeCount = evenCount;
    this.serverRoom.duration = 5;
    this.serverRoom.goalLimit = 0;
    if (activeCount <= 2) this.serverRoom.fieldSize = 'small';
    else if (activeCount <= 6) this.serverRoom.fieldSize = 'medium';
    else this.serverRoom.fieldSize = 'large';
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
  }

  randomizeCasualTeams() {
    if (!this.serverRoom || this.serverRoom.competitive) return;
    const humans = this.serverRoom.players.filter(p => !p.cpu);
    const shuffled = humans.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach((p, index) => {
      p.team = index % 2 === 0 ? 'red' : 'blue';
      p.ready = false;
    });
  }

  stopListeningToPublicRooms() {
    const roomsRef = ref(rtdb, 'multiplayerRooms');
    off(roomsRef);
  }

  setupPresenceTracking() {
    if (this.presenceBound) return;
    this.presenceBound = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`[Presence] Usuário autenticado: ${user.uid}. Monitorando presença...`);
        const connectedRef = ref(rtdb, '.info/connected');
        const myPresenceRef = ref(rtdb, `presence/${user.uid}`);
        
        onValue(connectedRef, (snap) => {
          if (snap.val() === true) {
            set(myPresenceRef, {
              uid: user.uid,
              username: user.displayName || 'Jogador',
              timestamp: Date.now()
            });
            onDisconnect(myPresenceRef).remove();
          }
        });

        // Monitor global presence list to update count in real-time
        const presenceRef = ref(rtdb, 'presence');
        onValue(presenceRef, (snap) => {
          const players = snap.val() || {};
          const count = Math.max(1, Object.keys(players).length);
          document.querySelectorAll('#online-users-count, [data-online-users-count]').forEach(el => {
            el.textContent = count;
          });
        });
      } else {
        document.querySelectorAll('#online-users-count, [data-online-users-count]').forEach(el => {
          el.textContent = '...';
        });
      }
    });
  }
}

export const socketService = new P2PSocketService();
export default socketService;
