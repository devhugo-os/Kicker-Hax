// Kicker Hax - Socket.IO Client Service
import { io } from 'socket.io-client';

let socket = null;
let roomCode = null;

export const socketService = {
  connect(url = window.location.origin) {
    if (socket) return socket;
    
    // If not local, default to our production remote Socket server
    let connectUrl = url;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!isLocal) {
      connectUrl = 'https://kicker-hax-server.onrender.com';
      // Wake up sleeping Render container on production
      fetch(connectUrl).catch(() => {});
    } else if (url.includes(':3000') || url.includes(':5173')) {
      connectUrl = `http://${window.location.hostname}:8080`;
    }
    
    const transports = isLocal ? ['polling', 'websocket'] : ['websocket'];

    socket = io(connectUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
      // GitHub Pages has hit CORS failures on Socket.IO polling. Production
      // connects straight through WebSocket, while local dev keeps polling as a fallback.
      transports,
      upgrade: isLocal,
      withCredentials: false
    });

    socket.on('connect', () => {
      console.log(`[Socket.IO] Conectado: ${socket.id}`);
    });

    socket.on('connect_error', (err) => {
      console.warn(`[Socket.IO] Erro de conexão: ${err.message}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Desconectado.`);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket() {
    return socket;
  },

  // Emitters
  createRoom(name, password, maxPlayers, duration, goalLimit, fieldSize, showReplay, profile) {
    if (!socket) return;
    socket.emit('createRoom', { name, password, maxPlayers, duration, goalLimit, fieldSize, showReplay: true, profile });
  },

  joinRoom(code, password, profile) {
    if (!socket) return;
    socket.emit('joinRoom', { roomCode: code, password, profile });
  },

  leaveRoom() {
    if (!socket) return;
    socket.emit('leaveRoom');
  },

  changeTeam(team) {
    if (!socket) return;
    socket.emit('changeTeam', team);
  },

  toggleReady() {
    if (!socket) return;
    socket.emit('toggleReady');
  },

  sendChatMessage(text) {
    if (!socket) return;
    socket.emit('chatMessage', text);
  },

  addBot(team) {
    if (!socket) return;
    socket.emit('addBot', team);
  },

  removeBot(botId) {
    if (!socket) return;
    socket.emit('removeBot', botId);
  },

  kickPlayer(targetSocketId) {
    if (!socket) return;
    socket.emit('kickPlayer', targetSocketId);
  },

  updateRoomSettings(settings) {
    if (!socket) return;
    socket.emit('updateRoomSettings', settings);
  },

  startGame() {
    if (!socket) return;
    socket.emit('startGame');
  },

  sendGameInput(inputData) {
    if (!socket) return;
    socket.emit('gameInput', inputData);
  },

  // Event Listeners Registration
  onLobbyUpdate(callback) {
    if (!socket) return;
    socket.on('lobbyUpdate', callback);
  },

  onChat(callback) {
    if (!socket) return;
    socket.on('chatMessage', callback);
  },

  onMatchStarted(callback) {
    if (!socket) return;
    socket.on('matchStarted', callback);
  },

  onGameState(callback) {
    if (!socket) return;
    // Realtime high frequency event, use off to prevent double binding
    socket.off('gameState');
    socket.on('gameState', callback);
  },

  onPlayReplay(callback) {
    if (!socket) return;
    socket.on('playReplay', callback);
  },

  onMatchEnded(callback) {
    if (!socket) return;
    socket.on('matchEnded', callback);
  },

  onKicked(callback) {
    if (!socket) return;
    socket.on('kicked', callback);
  },

  onPublicRoomsList(callback) {
    if (!socket) return;
    socket.on('publicRoomsList', callback);
  },

  clearListeners() {
    if (!socket) return;
    socket.off('lobbyUpdate');
    socket.off('chatMessage');
    socket.off('matchStarted');
    socket.off('gameState');
    socket.off('playReplay');
    socket.off('matchEnded');
    socket.off('kicked');
    socket.off('publicRoomsList');
  }
};
export default socketService;
