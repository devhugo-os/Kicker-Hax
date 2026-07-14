// Kicker Hax - WebRTC Peer-to-Peer & Firebase RTDB Multiplayer Client Service
import { rtdb, auth } from './firebaseService.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, remove, get, update, onValue, off, onDisconnect, push, onChildAdded, serverTimestamp } from 'firebase/database';
import { ServerRoom } from '../../server/models/serverRoom.js';
import { ServerMatch } from '../../server/models/serverMatch.js';
import { ServerPhysics } from '../../server/models/serverPhysics.js';
import { buildRoomCleanupPatch, getOrphanRoomCodes } from '../utils/roomCleanup.js';
import { CHAT_MESSAGE_MAX_LENGTH, ROOM_NAME_MAX_LENGTH, ROOM_PASSWORD_MAX_LENGTH } from '../../shared/constants.js';

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
    this.peerGeneration = 0;
    this.lastInputSentAt = 0;
    this.lastInputSignature = '';
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
    update(ref(rtdb, `multiplayerRooms/${this.roomCode}/blockedRejoinUids`), { [uid]: true }).catch(() => {});
  }

  connect(url = window.location.origin) {
    if (!this.clientId) {
      this.clientId = `user_${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
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
    const heartbeat = Number(room?.hostHeartbeatAt || room?.updatedAt || 0);
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
    } else if (this.hostConn && this.hostConn.open) {
      // Send payload to host via WebRTC
      this.hostConn.send({ event, data });
    }
  }

  // Broadcast helper for host to send to self + all connected guests
  broadcast(event, data) {
    this.triggerLocalEvent(event, data);
    this.connections.forEach(conn => {
      if (conn.open) {
        conn.send({ event, data });
      }
    });
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
    
    // Instantiate Host PeerJS
    if (this.peer) this.peer.destroy();
    const peerGeneration = ++this.peerGeneration;
    const peer = new Peer(this.clientId);
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
      
      this.serverRoom.addPlayer(this.clientId, profile, 'spectator');

      // Add connection to mock database structure
      this.connections = [];

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

  joinRoom(code, password, profile, options = {}) {
    const roomCode = code.toUpperCase();
    const rejoin = !!options.rejoin;
    if (this.roomOperation) {
      this.triggerLocalEvent('joinError', 'Aguarde a operacao atual terminar.');
      return;
    }
    this.roomOperation = 'join';
    this.isHost = false;
    this.roomCode = roomCode;
    const joinTimeout = window.setTimeout(() => {
      if (this.roomOperation !== 'join' || this.roomCode !== roomCode) return;
      this.triggerLocalEvent('joinError', 'A conexão com a sala demorou demais. Tente novamente.');
      this.leaveRoom();
    }, 15000);
    const finishJoinOperation = () => window.clearTimeout(joinTimeout);

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

      // Instantiate Guest PeerJS
      if (this.peer) this.peer.destroy();
      const peerGeneration = ++this.peerGeneration;
      const peer = new Peer(this.clientId);
      this.peer = peer;

      peer.on('open', (id) => {
        if (this.peer !== peer || this.peerGeneration !== peerGeneration || this.roomOperation !== 'join') return;
        console.log('[P2PSocket] Conectando como convidado com ID:', id);

        const conn = this.peer.connect(roomData.hostPeerId);
        this.hostConn = conn;

        conn.on('open', () => {
          console.log('[P2PSocket] WebRTC aberto com Host. Enviando requisição de entrada...');
          conn.send({
            event: 'joinRoom',
            data: { profile, rejoin, password }
          });
        });

        conn.on('data', (payload) => {
          const { event, data } = payload;
          if (event === 'joinSuccess') {
            finishJoinOperation();
            this.roomOperation = null;
            const lobbyInfo = data?.lobbyInfo || null;
            if (lobbyInfo) this.triggerLocalEvent('lobbyUpdate', lobbyInfo);
            this.listenToRoomChat(roomCode);
            this.watchHostLifecycle(roomCode);
            this.triggerLocalEvent('joinSuccess', { code: roomCode, lobbyInfo });
          } else if (event === 'matchRejoined') {
            finishJoinOperation();
            this.roomOperation = null;
            this.listenToRoomChat(roomCode);
            this.watchHostLifecycle(roomCode);
            this.triggerLocalEvent('matchRejoined', data);
          } else if (event === 'joinError') {
            finishJoinOperation();
            this.triggerLocalEvent('joinError', data);
            this.leaveRoom();
          } else {
            this.triggerLocalEvent(event, data);
          }
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
    if (!this.isHost && this.roomCode && auth.currentUser?.uid) {
      localStorage.setItem(`kicker_hax_rejoin_${auth.currentUser.uid}`, JSON.stringify({
        code: this.roomCode,
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
      this.serverRoom = null;
    } else if (this.hostConn) {
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
    // PeerJS can emit close either synchronously or after cleanup.
    setTimeout(() => { this.isLeavingRoom = false; }, 0);
  }

  // --------------------------------------------------------------------------
  // HOST NETWORK REQUEST PROCESSING
  // --------------------------------------------------------------------------
  handleHostReceivedData(socketId, event, data, conn) {
    if (!this.serverRoom) return;

    if (event === 'joinRoom') {
      const { profile, rejoin, password } = data || {};
      const reconnecting = rejoin && this.serverRoom.status === 'playing'
        ? this.serverRoom.reconnectPlayer(profile?.uid, socketId)
        : null;

      if (rejoin && this.serverRoom.status === 'playing') {
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
        update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { updatedAt: Date.now() }).catch(() => {});
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${reconnecting.player.username} voltou para a partida.` });
        if (conn) conn.send({ event: 'matchRejoined', data: { roomCode: this.roomCode, lobbyInfo: this.serverRoom.getLobbyInfo() } });
        return;
      }

      if (this.serverRoom.password && this.serverRoom.password !== String(password || '')) {
        if (conn) conn.send({ event: 'joinError', data: 'Senha incorreta.' });
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

      this.serverRoom.addPlayer(socketId, profile, 'spectator');

      // Update matchmaking metadata count
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      update(roomRef, { playersCount: this.serverRoom.players.length, updatedAt: Date.now() });

      const lobbyInfo = this.serverRoom.getLobbyInfo();
      if (conn) conn.send({ event: 'joinSuccess', data: { code: this.roomCode, lobbyInfo } });

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
      const team = player.team === 'red' ? 0 : 1;
      const teammates = this.serverRoom.players.filter(item => !item.cpu && !item.disconnected
        && item.team === player.team && item.id !== player.id);
      this.blockRoomRejoin(player.uid);

      if (teammates.length === 0) {
        this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${player.username} desistiu. O time adversário venceu por W.O.` });
        this.serverRoom.match.forfeitAgainstTeam(team);
        return;
      }

      this.serverRoom.markPlayerDisconnected(player.id);
      this.serverRoom.match.pauseForDisconnectedTeam(team, player.uid, player.username, { allowRejoin: false, timeoutMs: 30000 });
      this.serverRoom.match.forceContinueVote(player.uid, player.username);
      this.sendRoomChatMessage({ username: 'Sistema', badge: '📢', text: `${player.username} desistiu. O time tem 30 segundos para decidir se continua com um jogador a menos.` });
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      if (socketId === this.clientId) this.triggerLocalEvent('surrenderAccepted');
      else if (conn?.open) conn.send({ event: 'surrenderAccepted' });
    }

    else if (event === 'ping') {
      // A tiny echo packet measures actual WebRTC round-trip time. The host
      // handles its own packet locally and guests receive the same response.
      const payload = { sentAt: Number(data?.sentAt) || Date.now() };
      this.serverRoom.match?.touchPlayer(socketId);
      if (socketId === this.clientId) {
        this.triggerLocalEvent('pong', payload);
      } else if (conn?.open) {
        conn.send({ event: 'pong', data: payload });
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
        update(ref(rtdb, `multiplayerRooms/${this.roomCode}`), { status: 'lobby', updatedAt: Date.now() });
      }
    }

    else if (event === 'returnToLobby') {
      const player = this.serverRoom.players.find(item => item.id === socketId);
      if (!player) return;
      // Do not rebuild the whole room before everyone returns from results.
      player.status = 'lobby';
      player.ready = false;
      player.team = 'spectator';
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
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
    this.connections = this.connections.filter(c => c !== conn);

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
      duration: this.serverRoom.duration,
      goalLimit: this.serverRoom.goalLimit,
      fieldSize: this.serverRoom.fieldSize,
      updatedAt: Date.now()
    });
  }

  sendGameInput(inputData) {
    const now = Date.now();
    const signature = `${inputData.x}|${inputData.y}|${+!!inputData.shoot}|${+!!inputData.sprint}|${+!!inputData.dribble}|${+!!inputData.tackle}|${+!!inputData.power}|${+!!inputData.mobileTackleAssist}`;
    const actionChanged = signature !== this.lastInputSignature;
    // 30 Hz is responsive enough for close tackles while unchanged input is
    // still coalesced to protect the host from redundant packets.
    if (!actionChanged && now - this.lastInputSentAt < 33) return;
    this.lastInputSentAt = now;
    this.lastInputSignature = signature;
    this.emit('gameInput', inputData);
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

  voteContinueWithoutDisconnected() {
    this.emit('voteContinueWithoutDisconnected');
  }

  surrenderMatch() {
    this.emit('surrenderMatch');
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
    if (!this.isActiveRoomRecord(room)) {
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
