// Kicker Hax - WebRTC Peer-to-Peer & Firebase RTDB Multiplayer Client Service
import { rtdb, auth } from './firebaseService.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, remove, get, update, onValue, off, onDisconnect } from 'firebase/database';
import { ServerRoom } from '../../server/models/serverRoom.js';
import { ServerMatch } from '../../server/models/serverMatch.js';
import { ServerPhysics } from '../../server/models/serverPhysics.js';
import * as C from '../../shared/constants.js';

class P2PSocketService {
  constructor() {
    this.listeners = new Map();
    this.clientId = null;
    this.peer = null;
    this.isHost = false;
    this.roomCode = null;
    this.presenceBound = false;
    
    // Peer connections
    this.connections = []; // guest WebRTC connections (if host)
    this.hostConn = null;   // host WebRTC connection (if guest)
    
    // Host Room state (only instantiated if host)
    this.serverRoom = null;
  }

  connect(url = window.location.origin) {
    if (!this.clientId) {
      this.clientId = 'user_' + Math.random().toString(36).substring(2, 8);
    }
    
    console.log(`[P2PSocket] Inicializado com ID do Cliente: ${this.clientId}`);
    this.listenToPublicRooms();
    this.setupPresenceTracking();
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
  createRoom(name, password, maxPlayers, duration, goalLimit, fieldSize, showReplay, profile) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    this.isHost = true;
    this.roomCode = code;
    
    // Instantiate Host PeerJS
    if (this.peer) this.peer.destroy();
    this.peer = new Peer(this.clientId);
    
    this.peer.on('open', (id) => {
      console.log('[P2PSocket] Host Peer criado:', id);
      
      this.serverRoom = new ServerRoom(code, name, this.clientId, {
        maxPlayers: parseInt(maxPlayers) || 10,
        password: password || null,
        duration: parseInt(duration) || 3,
        goalLimit: parseInt(goalLimit) || 3,
        fieldSize: fieldSize || 'medium',
        showReplay: true
      });
      
      this.serverRoom.addPlayer(this.clientId, profile, 'spectator');

      // Add connection to mock database structure
      this.connections = [];

      // Save room meta record to Firebase RTDB for matchmaking
      const roomRef = ref(rtdb, `multiplayerRooms/${code}`);
      set(roomRef, {
        code,
        name,
        maxPlayers: parseInt(maxPlayers) || 10,
        password: password || '',
        hasPassword: !!password,
        playersCount: 1,
        status: 'lobby',
        duration: parseInt(duration) || 3,
        goalLimit: parseInt(goalLimit) || 3,
        fieldSize: fieldSize || 'medium',
        hostPeerId: id
      }).then(() => {
        this.triggerLocalEvent('roomCreated', code);
        this.triggerLocalEvent('lobbyUpdate', this.serverRoom.getLobbyInfo());
      });
    });

    this.peer.on('connection', (conn) => {
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
  }

  joinRoom(code, password, profile) {
    const roomCode = code.toUpperCase();
    this.isHost = false;
    this.roomCode = roomCode;

    // Fetch room from RTDB
    const roomRef = ref(rtdb, `multiplayerRooms/${roomCode}`);
    get(roomRef).then((snapshot) => {
      if (!snapshot.exists()) {
        this.triggerLocalEvent('joinError', 'Sala não encontrada.');
        return;
      }

      const roomData = snapshot.val();
      if (roomData.status !== 'lobby') {
        this.triggerLocalEvent('joinError', 'A partida desta sala já começou.');
        return;
      }
      if (roomData.password && roomData.password !== password) {
        this.triggerLocalEvent('joinError', 'Senha incorreta.');
        return;
      }

      if (roomData.playersCount >= roomData.maxPlayers) {
        this.triggerLocalEvent('joinError', 'Sala cheia.');
        return;
      }

      // Instantiate Guest PeerJS
      if (this.peer) this.peer.destroy();
      this.peer = new Peer(this.clientId);

      this.peer.on('open', (id) => {
        console.log('[P2PSocket] Conectando como convidado com ID:', id);

        const conn = this.peer.connect(roomData.hostPeerId);
        this.hostConn = conn;

        conn.on('open', () => {
          console.log('[P2PSocket] WebRTC aberto com Host. Enviando requisição de entrada...');
          conn.send({
            event: 'joinRoom',
            data: { profile }
          });
        });

        conn.on('data', (payload) => {
          const { event, data } = payload;
          if (event === 'joinSuccess') {
            this.triggerLocalEvent('joinSuccess', roomCode);
          } else if (event === 'joinError') {
            this.triggerLocalEvent('joinError', data);
            this.leaveRoom();
          } else {
            this.triggerLocalEvent(event, data);
          }
        });

        conn.on('close', () => {
          console.log('[P2PSocket] Host encerrou a conexão.');
          this.triggerLocalEvent('kicked');
          this.leaveRoom();
        });
      });

      this.peer.on('error', (err) => {
        console.error('[P2PSocket] Erro do guest peer:', err);
        this.triggerLocalEvent('joinError', 'Falha ao conectar via WebRTC.');
      });
    });
  }

  leaveRoom() {
    if (this.isHost && this.roomCode) {
      // Remove from matchmaking index
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      remove(roomRef);

      // Halt match simulation
      if (this.serverRoom && this.serverRoom.match) {
        this.serverRoom.match.isHostPaused = false;
        clearInterval(this.serverRoom.match.tickInterval);
      }

      // Close guests WebRTC channels
      this.connections.forEach(c => c.close());
      this.connections = [];
      this.serverRoom = null;
    } else if (this.hostConn) {
      this.hostConn.close();
      this.hostConn = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.isHost = false;
    this.roomCode = null;
  }

  // --------------------------------------------------------------------------
  // HOST NETWORK REQUEST PROCESSING
  // --------------------------------------------------------------------------
  handleHostReceivedData(socketId, event, data, conn) {
    if (!this.serverRoom) return;

    if (event === 'joinRoom') {
      const { profile } = data;
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
      update(roomRef, { playersCount: this.serverRoom.players.length });

      if (conn) conn.send({ event: 'joinSuccess', data: this.roomCode });

      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      const msg = this.serverRoom.addChatMessage('Sistema', '', '📢', `${profile.username} entrou na sala.`);
      this.broadcast('chatMessage', msg);
    } 
    
    else if (event === 'changeTeam') {
      const changed = this.serverRoom.changeTeam(socketId, data);
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
      const username = player ? player.username : 'Jogador';
      const badge = player ? player.badge : '';
      const msg = this.serverRoom.addChatMessage(username, '', badge, data);
      this.broadcast('chatMessage', msg);
    } 
    
    else if (event === 'gameInput') {
      if (this.serverRoom.match) {
        this.serverRoom.match.updateInput(socketId, data);
      }
    }

    else if (event === 'hostFocusChanged') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.isHostPaused = !!data.focusLost;
      }
    }

    else if (event === 'hostSetPaused') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.isHostPaused = !!data.paused;
        const status = data.paused ? 'pausada' : 'retomada';
        const msg = this.serverRoom.addChatMessage('Sistema', '', '📢', `A partida foi ${status} pelo host.`);
        this.broadcast('chatMessage', msg);
      }
    }

    else if (event === 'hostResetMatch') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        this.serverRoom.match.resetMatch();
        this.broadcast('matchReset');
      }
    }

    else if (event === 'hostAddTime') {
      if (socketId === this.serverRoom.hostId && this.serverRoom.match) {
        const seconds = Math.max(0, Math.min(600, Number(data.seconds) || 0));
        this.serverRoom.match.addTime(seconds);
        const msg = this.serverRoom.addChatMessage('Sistema', '', '📢', `O host adicionou ${Math.round(seconds / 60)} minuto(s) ao tempo.`);
        this.broadcast('chatMessage', msg);
      }
    }

    else if (event === 'hostChangeTeam') {
      if (socketId !== this.serverRoom.hostId) return;
      const changed = this.serverRoom.changeTeam(data.playerId, data.team);
      if (changed) {
        if (this.serverRoom.match) {
          const phys = this.serverRoom.match.players.find(p => p.id === data.playerId);
          if (phys) {
            phys.team = data.team === 'red' ? C.Team.RED : C.Team.BLUE;
            this.serverRoom.match.kickoff();
          }
        }
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
      }
    }
  }

  handleHostPlayerDisconnect(conn) {
    const socketId = conn.peer;
    this.connections = this.connections.filter(c => c !== conn);

    if (this.serverRoom) {
      const removed = this.serverRoom.removePlayer(socketId);
      
      const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
      update(roomRef, { playersCount: this.serverRoom.players.length });

      if (removed) {
        const leaveMsg = this.serverRoom.addChatMessage('Sistema', '', '📢', `${removed.username} saiu da sala.`);
        this.broadcast('chatMessage', leaveMsg);
        if (this.serverRoom.match) {
          this.serverRoom.match.isHostPaused = true;
          const pauseMsg = this.serverRoom.addChatMessage('Sistema', '', '📢', 'Partida pausada para o host reorganizar os times.');
          this.broadcast('chatMessage', pauseMsg);
        }
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
    this.emit('chatMessage', text);
  }

  addBot(team) {
    if (!this.isHost || !this.serverRoom) return;

    const botId = `bot_${Math.random().toString(36).substr(2, 5)}`;
    const botProfile = {
      uid: '',
      username: `Bot ${team === 'red' ? 'Vermelho' : 'Azul'} (CPU)`,
      badge: '⚙️',
      cpu: true,
      difficulty: 'medium'
    };

    this.serverRoom.addPlayer(botId, botProfile, team);
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
  }

  removeBot(botId) {
    if (!this.isHost || !this.serverRoom) return;
    this.serverRoom.removePlayer(botId);
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());
  }

  kickPlayer(targetSocketId) {
    if (!this.isHost || !this.serverRoom) return;

    const conn = this.connections.find(c => c.peer === targetSocketId);
    const targetPlayer = this.serverRoom.players.find(p => p.id === targetSocketId);

    if (targetPlayer) {
      this.serverRoom.removePlayer(targetSocketId);
      this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());

      const kickMsg = this.serverRoom.addChatMessage('Sistema', '', '📢', `${targetPlayer.username} foi expulso da sala.`);
      this.broadcast('chatMessage', kickMsg);

      if (conn) {
        conn.send({ event: 'kicked' });
        conn.close();
      }
    }
  }

  updateRoomSettings(settings) {
    if (!this.isHost || !this.serverRoom) return;

    this.serverRoom.updateSettings(settings);
    this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());

    // Update settings in Firebase Realtime Database
    const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
    update(roomRef, {
      name: this.serverRoom.name,
      maxPlayers: this.serverRoom.maxPlayers,
      duration: this.serverRoom.duration,
      goalLimit: this.serverRoom.goalLimit,
      fieldSize: this.serverRoom.fieldSize
    });
  }

  startGame() {
    if (!this.isHost || !this.serverRoom) return;

    const activePlayers = this.serverRoom.players.filter(p => p.team !== 'spectator');
    const redTeam = activePlayers.filter(p => p.team === 'red');
    const blueTeam = activePlayers.filter(p => p.team === 'blue');

    if (redTeam.length === 0 || blueTeam.length === 0) {
      this.triggerLocalEvent('startError', 'Cada time precisa de pelo menos 1 jogador (ou bot).');
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

    // Instantiate physics tick simulator inside host client browser!
    this.serverRoom.match = new ServerMatch(
      this.roomCode,
      this.serverRoom.duration,
      this.serverRoom.goalLimit,
      activePlayers,
      mockIo,
      (result) => {
        // Callback on match end
        this.serverRoom.status = 'lobby';
        this.serverRoom.players.forEach(p => p.ready = false);
        this.serverRoom.match = null;
        this.serverRoom.chatHistory = [];

        this.broadcast('matchEnded', result);
        this.broadcast('lobbyUpdate', this.serverRoom.getLobbyInfo());

        // Update status in Firebase
        const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
        update(roomRef, { status: 'lobby' });
      },
      this.serverRoom.fieldSize
    );

    this.broadcast('matchStarted');

    const roomRef = ref(rtdb, `multiplayerRooms/${this.roomCode}`);
    update(roomRef, { status: 'playing' });
  }

  sendGameInput(inputData) {
    this.emit('gameInput', inputData);
  }

  hostResetMatch() {
    this.emit('hostResetMatch');
  }

  hostSetPaused(paused) {
    this.emit('hostSetPaused', { paused });
  }

  hostAddTime(seconds) {
    this.emit('hostAddTime', { seconds });
  }

  hostChangeTeam(playerId, team) {
    this.emit('hostChangeTeam', { playerId, team });
  }

  // --------------------------------------------------------------------------
  // EVENT LISTENER REGISTRATION
  // --------------------------------------------------------------------------
  onLobbyUpdate(callback) {
    this.on('lobbyUpdate', callback);
  }

  onChat(callback) {
    this.on('chatMessage', callback);
  }

  onMatchStarted(callback) {
    this.on('matchStarted', callback);
  }

  onGameState(callback) {
    this.off('gameState');
    this.on('gameState', callback);
  }

  onPlayReplay(callback) {
    this.on('playReplay', callback);
  }

  onMatchEnded(callback) {
    this.on('matchEnded', callback);
  }

  onKicked(callback) {
    this.on('kicked', callback);
  }

  onPublicRoomsList(callback) {
    this.on('publicRoomsList', callback);
  }

  clearListeners() {
    this.off('lobbyUpdate');
    this.off('chatMessage');
    this.off('matchStarted');
    this.off('gameState');
    this.off('playReplay');
    this.off('matchEnded');
    this.off('kicked');
    this.off('publicRoomsList');
  }

  // --------------------------------------------------------------------------
  // MATCHMAKING PUBLIC ROOMS LISTENING (FIREBASE RTDB)
  // --------------------------------------------------------------------------
  listenToPublicRooms() {
    const roomsRef = ref(rtdb, 'multiplayerRooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data)
        .map(key => data[key])
        .filter(room => room.status === 'lobby');
      this.triggerLocalEvent('publicRoomsList', list);
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
          const count = Object.keys(players).length;
          const el = document.getElementById('online-users-count');
          if (el) el.textContent = count;
        });
      } else {
        const el = document.getElementById('online-users-count');
        if (el) el.textContent = '...';
      }
    });
  }
}

export const socketService = new P2PSocketService();
export default socketService;
