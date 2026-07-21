// Kicker Hax - Server-side Room Model
import { CHAT_MESSAGE_MAX_LENGTH, ROOM_NAME_MAX_LENGTH, ROOM_PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH } from '../../shared/constants.js';
import { compactLobbyInfo } from '../../shared/multiplayerPayload.js';

function normalizeStaffRole(role) {
  const normalized = String(role || '').trim().toLowerCase();
  return ['developer', 'influencer'].includes(normalized) ? normalized : '';
}

export class ServerRoom {
  constructor(code, name, hostId, options = {}) {
    this.code = code.toUpperCase();
    this.name = String(name || `Sala de ${code}`).trim().slice(0, ROOM_NAME_MAX_LENGTH);
    this.hostId = hostId;
    this.hostUsername = options.hostUsername || 'Host';
    this.maxPlayers = options.maxPlayers || 10;
    this.password = String(options.password || '').slice(0, ROOM_PASSWORD_MAX_LENGTH) || null;
    this.competitive = !!options.competitive && !this.password;
    this.duration = options.duration ?? 3; // minutes
    this.goalLimit = options.goalLimit ?? 3; // goals
    this.fieldSize = options.fieldSize || 'medium';
    this.showReplay = options.showReplay !== undefined ?!!options.showReplay : true;
    this.players = []; // Array of lobby players
    this.chatHistory = [];
    this.bannedUids = new Set();
    this.blockedRejoinUids = new Set();
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
      username: String(playerProfile.username || 'Jogador').slice(0, USERNAME_MAX_LENGTH),
      badge: playerProfile.badge || '🏳️',
      skin: playerProfile.skin || '',
      skinId: playerProfile.skinId || playerProfile.equippedSkinId || '',
      staffRole: normalizeStaffRole(playerProfile.staffRole),
      overall: Math.max(40, Math.min(99, Number(playerProfile.overall) || 40)),
      team: team, // 'red' | 'blue' | 'spectator'
      ready: false,
      ping: 0,
      cpu: !!playerProfile.cpu,
      difficulty: playerProfile.difficulty || 'medium',
      status: 'lobby',
      rejoinCount: 0
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

  /** Keeps a match player in the roster while their WebRTC channel reconnects. */
  markPlayerDisconnected(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (!player) return null;
    player.disconnected = true;
    player.disconnectedAt = Date.now();
    player.status = 'disconnected';
    player.ready = false;
    return player;
  }

  /** Rebinds the reserved roster entry to the new temporary PeerJS id. */
  reconnectPlayer(uid, socketId, matchId = '') {
    if (this.status !== 'playing' || !this.match || !matchId || this.match.matchId !== matchId) return null;
    if (this.blockedRejoinUids.has(uid)) return { blocked: true, player: this.players.find(p => p.uid === uid) };
    const player = this.players.find(p => p.uid === uid && p.disconnected);
    if (!player) return null;
    if ((player.rejoinCount || 0) >= 2) return { limitReached: true, player };
    const previousId = player.id;
    player.id = socketId;
    player.disconnected = false;
    player.disconnectedAt = null;
    player.status = 'playing';
    player.rejoinCount = (player.rejoinCount || 0) + 1;
    return { player, previousId };
  }

  changeTeam(socketId, team) {
    const player = this.players.find(p => p.id === socketId);
    if (!player) return false;
    player.team = team;
    // spectador is never 'ready' by default or needs to toggle
    player.ready = false;
    return true;
  }

  resetLobbyStatus(options = {}) {
    const moveToSpectator = options.moveToSpectator !== false;
    this.players.forEach(player => {
      player.ready = false;
      player.ping = 0;
      if (moveToSpectator) player.team = 'spectator';
    });
  }

  toggleReady(socketId) {
    const player = this.players.find(p => p.id === socketId);
    if (!player || (player.team === 'spectator' && !this.competitive)) return false;
    player.ready = !player.ready;
    return player.ready;
  }

  updateSettings(settings) {
    if (settings.name) this.name = String(settings.name).trim().slice(0, ROOM_NAME_MAX_LENGTH);
    if (settings.maxPlayers) this.maxPlayers = parseInt(settings.maxPlayers, 10);
    if (settings.duration !== undefined) this.duration = parseInt(settings.duration, 10);
    if (settings.goalLimit !== undefined) this.goalLimit = parseInt(settings.goalLimit, 10);
    if (settings.password !== undefined) this.password = String(settings.password || '').slice(0, ROOM_PASSWORD_MAX_LENGTH) || null;
    if (settings.competitive !== undefined) this.competitive = !!settings.competitive && !this.password;
    if (settings.fieldSize) this.fieldSize = settings.fieldSize;
    this.showReplay = true;
  }

  addChatMessage(username, avatar, badge, text) {
    const message = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      username,
      avatar: avatar || '',
      badge: badge || '',
      text: String(text || '').trim().slice(0, CHAT_MESSAGE_MAX_LENGTH)
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
      competitive: this.competitive,
      status: this.status,
      duration: this.duration,
      goalLimit: this.goalLimit,
      hostId: this.hostId,
      hostUsername: this.hostUsername
    };
  }

  getLobbyInfo() {
    return compactLobbyInfo({
      code: this.code,
      name: this.name,
      maxPlayers: this.maxPlayers,
      duration: this.duration,
      goalLimit: this.goalLimit,
      fieldSize: this.fieldSize,
      showReplay: this.showReplay,
      competitive: this.competitive,
      hostId: this.hostId,
      hostUsername: this.hostUsername,
      status: this.status,
      players: this.players
    });
  }

}
