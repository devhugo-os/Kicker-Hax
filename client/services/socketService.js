// Kicker Hax - Socket.IO Client Service
import { io } from 'socket.io-client';

let socket = null;
let roomCode = null;

export const socketService = {
  connect(url = window.location.origin) {
    if (socket) return socket;
    
    // In dev mode, we connect to local Express on port 8080
    const connectUrl = url.includes(':3000') ? 'http://localhost:8080' : url;
    
    socket = io(connectUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log(`[Socket.IO] Conectado: ${socket.id}`);
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
  createRoom(name, password, maxPlayers, duration, goalLimit, profile) {
    if (!socket) return;
    socket.emit('createRoom', { name, password, maxPlayers, duration, goalLimit, profile });
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

  skipReplay() {
    if (!socket) return;
    socket.emit('skipReplay');
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
