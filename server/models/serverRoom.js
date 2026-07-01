// Kicker Hax - Server-side Room Model

export class ServerRoom {
  constructor(code, name, hostId, options = {}) {
    this.code = code.toUpperCase();
    this.name = name || `Sala de ${code}`;
    this.hostId = hostId;
    this.maxPlayers = options.maxPlayers || 10;
    this.password = options.password || null;
    this.duration = options.duration || 3; // minutes
    this.goalLimit = options.goalLimit || 3; // goals
    this.fieldSize = options.fieldSize || 'medium';
    this.showReplay = true;
    this.players = []; // Array of lobby players
    this.chatHistory = [];
    this.status = 'lobby'; // 'lobby' | 'playing'
    this.match = null; // ServerMatch instance
    this.spectators = []; // Spectators list
  }

  addPlayer(socketId, playerProfile, team = 'spectator') {
    const existing = this.players.find(p => p.id === socketId);
    if (existing) return existing;

    const newPlayer = {
      id: socketId,
      uid: playerProfile.uid || '',
      username: playerProfile.username || 'Jogador',
      badge: playerProfile.badge || '🏳️',
      team: team, // 'red' | 'blue' | 'spectator'
      ready: false,
      ping: 0
    };
    this.players.push(newPlayer);
    return newPlayer;
  }

  removePlayer(socketId) {
    const index = this.players.findIndex(p => p.id === socketId);
    if (index === -1) return null;

    const removed = this.players.splice(index, 1)[0];

    // If host left, transfer host
    if (socketId === this.hostId && this.players.length > 0) {
      this.hostId = this.players[0].id;
    }

    return removed;
  }

  changeTeam(socketId, team) {
    const player = this.players.find(p => p.id === socketId);
    if (!player) return false;
    player.team = team;
    // spectador is never 'ready' by default or needs to toggle
    if (team === 'spectator') player.ready = false;
    return true;
  }

  toggleReady(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (!player || player.team === 'spectator') return false;
    player.ready = !player.ready;
    return player.ready;
  }

  updateSettings(settings) {
    if (settings.name) this.name = settings.name;
    if (settings.maxPlayers) this.maxPlayers = parseInt(settings.maxPlayers, 10);
    if (settings.duration) this.duration = parseInt(settings.duration, 10);
    if (settings.goalLimit) this.goalLimit = parseInt(settings.goalLimit, 10);
    if (settings.password !== undefined) this.password = settings.password || null;
    if (settings.fieldSize) this.fieldSize = settings.fieldSize;
    this.showReplay = true;
  }

  addChatMessage(username, avatar, badge, text) {
    const message = {
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      username,
      avatar: avatar || '',
      badge: badge || '',
      text: text.slice(0, 120) // Limit size
    };
    this.chatHistory.push(message);
    if (this.chatHistory.length > 50) {
      this.chatHistory.shift();
    }
    return message;
  }

  getPublicInfo() {
    return {
      code: this.code,
      name: this.name,
      playersCount: this.players.length,
      maxPlayers: this.maxPlayers,
      hasPassword: !!this.password,
      status: this.status,
      duration: this.duration,
      goalLimit: this.goalLimit,
      hostId: this.hostId
    };
  }

  getLobbyInfo() {
    return {
      code: this.code,
      name: this.name,
      maxPlayers: this.maxPlayers,
      duration: this.duration,
      goalLimit: this.goalLimit,
      fieldSize: this.fieldSize,
      showReplay: this.showReplay,
      hostId: this.hostId,
      status: this.status,
      players: this.players,
      chatHistory: this.chatHistory
    };
  }
}
