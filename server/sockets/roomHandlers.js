// Kicker Hax - Server-side Room Socket Handlers
import { db } from '../database/memoryDb.js';
import { ServerRoom } from '../models/serverRoom.js';
import { randomInt } from 'node:crypto';
import { ServerMatch } from '../models/serverMatch.js';
import { ROOM_NAME_MAX_LENGTH, ROOM_PASSWORD_MAX_LENGTH } from '../../shared/constants.js';

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(randomInt(chars.length));
  }
  return code;
}

function getPublicLobbyRooms() {
  return db.getAllRooms()
    .filter(room => room.status === 'lobby')
    .map(room => room.getPublicInfo());
}

function isRoomNameTaken(name) {
  const normalized = String(name || '').trim().toLowerCase();
  if (!normalized) return false;
  return db.getAllRooms().some(room => room.name.trim().toLowerCase() === normalized);
}

function broadcastLobbyList(io) {
  io.emit('publicRoomsList', getPublicLobbyRooms());
}

export function registerRoomHandlers(io, socket) {
  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('createRoom', ({ name, password, maxPlayers, duration, goalLimit, fieldSize, showReplay, competitive, profile }) => {
    const normalizedName = String(name || '').trim().slice(0, ROOM_NAME_MAX_LENGTH);
    const normalizedPassword = String(password || '').slice(0, ROOM_PASSWORD_MAX_LENGTH);
    if (!normalizedName) return socket.emit('createRoomError', 'Informe um nome para a sala.');
    if (isRoomNameTaken(normalizedName)) {
      return socket.emit('createRoomError', 'Ja existe uma sala com esse nome.');
    }
    let code;
    let attempts = 0;
    do {
      code = generateRoomCode();
      attempts++;
    } while (db.getRoom(code) && attempts < 100);

    const isCompetitive = !!competitive && !normalizedPassword;
    const room = new ServerRoom(code, normalizedName, socket.id, {
      maxPlayers,
      password: normalizedPassword,
      duration: isCompetitive ? 5 : duration,
      goalLimit: isCompetitive ? 0 : goalLimit,
      fieldSize: isCompetitive ? 'medium' : fieldSize,
      showReplay,
      competitive: isCompetitive,
      hostUsername: profile?.username || 'Host'
    });

    db.createRoom(code, room);
    room.addPlayer(socket.id, profile, 'spectator');

    db.addConnection(socket.id, {
      uid: profile.uid,
      username: profile.username,
      roomCode: code
    });

    socket.join(code);
    socket.emit('roomCreated', code);
    broadcastLobbyList(io);
    io.to(code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('joinRoom', ({ roomCode, password, profile, rejoin = false, matchId = '' }) => {
    const room = db.getRoom(roomCode);
    if (!room) {
      return socket.emit('joinError', 'Sala nao encontrada.');
    }
    if (room.status === 'playing' && rejoin && profile?.uid) {
      const reconnecting = room.reconnectPlayer(profile.uid, socket.id, matchId);
      if (reconnecting?.limitReached) return socket.emit('joinError', 'Limite de retornos atingido.');
      if (!reconnecting || !room.match) return socket.emit('joinError', 'A janela para voltar a partida expirou.');
      db.addConnection(socket.id, { uid: profile.uid, username: profile.username, roomCode: room.code });
      socket.join(room.code);
      room.match.reconnectPlayer(reconnecting.previousId, socket.id, reconnecting.player);
      room.match.resumeAfterReconnect(reconnecting.player.uid);
      socket.emit('matchRejoined', { roomCode: room.code, matchId: room.match.matchId, lobbyInfo: room.getLobbyInfo() });
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
      return;
    }
    if (room.status !== 'lobby') {
      return socket.emit('joinError', 'A partida desta sala ja comecou.');
    }
    if (profile?.uid && room.bannedUids.has(profile.uid)) {
      return socket.emit('joinError', 'Voce foi banido desta sala.');
    }
    if (room.players.length >= room.maxPlayers) {
      return socket.emit('joinError', 'Sala cheia.');
    }
    if (room.password && room.password !== password) {
      return socket.emit('joinError', 'Senha incorreta.');
    }

    room.addPlayer(socket.id, profile, 'spectator');
    db.addConnection(socket.id, {
      uid: profile.uid,
      username: profile.username,
      roomCode: room.code
    });

    socket.join(room.code);
    socket.emit('joinSuccess', room.code);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());

    const joinMsg = room.addChatMessage('Sistema', '', '', `${profile.username} entrou na sala.`);
    io.to(room.code).emit('chatMessage', joinMsg);
    broadcastLobbyList(io);
  });

  socket.on('changeTeam', (team) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby') return;
    if (room.competitive || socket.id !== room.hostId) return;

    if (team === 'red' || team === 'blue' || team === 'spectator') {
      const changed = room.changeTeam(socket.id, team);
      if (changed) {
        io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
      }
    }
  });

  socket.on('toggleReady', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby') return;

    room.toggleReady(socket.id);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  let lastMessageTime = 0;
  socket.on('chatMessage', (text) => {
    const now = Date.now();
    if (now - lastMessageTime < 500) {
      return socket.emit('chatError', 'Por favor, aguarde para enviar mensagens.');
    }
    lastMessageTime = now;

    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    const username = player ?player.username : conn.username;
    const badge = player ?player.badge : '';
    const msg = room.addChatMessage(username, '', badge, text);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('addBot', (team) => {
    socket.emit('startError', 'Bots não são permitidos em salas multiplayer.');
  });

  socket.on('removeBot', (botId) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    room.removePlayer(botId);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('kickPlayer', (targetSocketId) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id) return;

    const targetPlayer = room.players.find(p => p.id === targetSocketId);
    if (!targetPlayer) return;

    if (room.match) {
      if (targetPlayer.disconnected) {
        room.match.forceContinueVote(targetPlayer.uid, targetPlayer.username);
        const voteMsg = room.addChatMessage('Sistema', '', '', `${targetPlayer.username} foi removido do retorno. O time decide em 30 segundos.`);
        io.to(room.code).emit('chatMessage', voteMsg);
        return;
      }
      const teammates = room.players.filter(player => !player.cpu && !player.disconnected
        && player.team === targetPlayer.team && player.id !== targetPlayer.id);
      if (teammates.length > 0) {
        room.markPlayerDisconnected(targetPlayer.id);
        room.match.pauseForDisconnectedTeam(targetPlayer.team === 'red' ? 0 : 1, targetPlayer.uid, targetPlayer.username, { allowRejoin: false, timeoutMs: 30000 });
        room.match.forceContinueVote(targetPlayer.uid, targetPlayer.username);
        const voteMsg = room.addChatMessage('Sistema', '', '', `${targetPlayer.username} foi expulso. O time tem 30 segundos para votar e continuar sem ele.`);
        io.to(room.code).emit('chatMessage', voteMsg);
      } else {
        room.match.stop();
        io.to(room.code).emit('matchAborted', { closeRoom: true });
        room.players.forEach(player => {
          const peer = io.sockets.sockets.get(player.id);
          if (peer) peer.leave(room.code);
          db.removeConnection(player.id);
        });
        db.deleteRoom(room.code);
        broadcastLobbyList(io);
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if (targetSocket) targetSocket.emit('kicked');
        return;
      }
    }
    room.removePlayer(targetSocketId);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());

    const kickMsg = room.addChatMessage('Sistema', '', '', `${targetPlayer.username} foi expulso da sala.`);
    io.to(room.code).emit('chatMessage', kickMsg);

    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
      targetSocket.emit('kicked');
      targetSocket.leave(room.code);
      db.removeConnection(targetSocketId);
    }
    broadcastLobbyList(io);
  });

  socket.on('banPlayer', (targetSocketId) => {
    const conn = db.getConnection(socket.id);
    const room = conn && db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id) return;
    const target = room.players.find(player => player.id === targetSocketId);
    if (!target || target.id === room.hostId || target.cpu) return;
    if (target.uid) room.bannedUids.add(target.uid);
    const teammates = room.players.filter(player => !player.cpu && !player.disconnected
      && player.team === target.team && player.id !== target.id);
    if (room.match && teammates.length > 0) {
      room.markPlayerDisconnected(target.id);
      room.match.pauseForDisconnectedTeam(target.team === 'red' ? 0 : 1, target.uid, target.username, { allowRejoin: false, timeoutMs: 30000 });
      room.match.forceContinueVote(target.uid, target.username);
      const voteMsg = room.addChatMessage('Sistema', '', '', `${target.username} foi banido. O time tem 30 segundos para votar e continuar sem ele.`);
      io.to(room.code).emit('chatMessage', voteMsg);
    } else if (room.match) {
      room.match.stop();
      io.to(room.code).emit('matchAborted', { closeRoom: true });
      room.players.forEach(player => {
        const peer = io.sockets.sockets.get(player.id);
        if (peer) peer.leave(room.code);
        db.removeConnection(player.id);
      });
      db.deleteRoom(room.code);
      broadcastLobbyList(io);
    } else {
      room.removePlayer(target.id);
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
      broadcastLobbyList(io);
    }
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) {
      targetSocket.emit('kicked');
      targetSocket.leave(room.code);
      db.removeConnection(targetSocketId);
    }
  });

  socket.on('updateRoomSettings', (settings) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    room.updateSettings(settings);
    if (room.competitive) {
      room.duration = 5;
      room.goalLimit = 0;
    }
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    broadcastLobbyList(io);
  });

  socket.on('hostChangeTeam', ({ playerId, team }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id || room.competitive) return;
    if (team !== 'red' && team !== 'blue' && team !== 'spectator') return;

    const changed = room.changeTeam(playerId, team);
    if (changed) {
      if (room.match) {
        room.match.syncPlayersFromLobby(room.players, { allowCasualForfeit: false });
        room.match.kickoff();
      }
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    }
  });

  socket.on('hostRandomizeTeams', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id || room.competitive) return;

    const humans = room.players.filter(p => !p.cpu);
    const shuffled = humans.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach((p, index) => {
      p.team = index % 2 === 0 ? 'red' : 'blue';
      p.ready = false;
    });
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('startGame', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    if (room.competitive) {
      const humans = room.players.filter(p => !p.cpu && !p.disconnected && p.status === 'lobby');
      if (humans.length < 2 || humans.length % 2 !== 0) {
        return socket.emit('startError', 'Partida competitiva exige quantidade par de jogadores.');
      }
      if (humans.some(player => !player.ready)) {
        return socket.emit('startError', 'Todos os jogadores precisam marcar pronto antes do sorteio dos times.');
      }
      const shuffled = humans.slice().sort(() => Math.random() - 0.5);
      shuffled.forEach((p, index) => {
        p.team = index < shuffled.length / 2 ? 'red' : 'blue';
      });
      room.duration = 5;
      room.goalLimit = 0;
      if (humans.length <= 2) room.fieldSize = 'small';
      else if (humans.length <= 6) room.fieldSize = 'medium';
      else room.fieldSize = 'large';
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    }

    const activePlayers = room.players.filter(p => p.team !== 'spectator' && !p.cpu);
    const redTeam = activePlayers.filter(p => p.team === 'red');
    const blueTeam = activePlayers.filter(p => p.team === 'blue');
    const notReady = activePlayers.filter(p => !p.ready);

    if (notReady.length > 0) {
      return socket.emit('startError', 'Todos os jogadores precisam marcar pronto antes do início.');
    }

    if (redTeam.length === 0 || blueTeam.length === 0) {
      return socket.emit('startError', 'Cada time precisa de pelo menos 1 jogador.');
    }

    if (room.competitive && redTeam.length !== blueTeam.length) {
      return socket.emit('startError', 'Os times precisam estar equilibrados para iniciar.');
    }

    room.status = 'playing';
    room.players.forEach(p => {
      p.status = 'match';
    });
    room.match = new ServerMatch(
      room.code,
      room.duration,
      room.goalLimit,
      activePlayers,
      io,
      (result) => {
        room.status = 'lobby';
        room.match = null;
        room.chatHistory = [];
        room.resetLobbyStatus();
        room.players.forEach(p => {
          if (p.cpu) p.status = 'lobby';
          else p.status = 'post-game';
        });
        const lobbyInfo = room.getLobbyInfo();
        io.to(room.code).emit('roomChatCleared');
        io.to(room.code).emit('lobbyUpdate', lobbyInfo);
        io.to(room.code).emit('matchEnded', { ...result, lobbyInfo });
        broadcastLobbyList(io);
      },
      room.fieldSize,
      { competitive: room.competitive, allowCasualForfeit: false }
    );

    io.to(room.code).emit('matchStarted', {
      matchId: room.match.matchId,
      startedAt: room.match.startedAt
    });
    broadcastLobbyList(io);
  });

  socket.on('returnToLobby', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.status = 'lobby';
      player.ready = false;
      const lobbyInfo = room.getLobbyInfo();
      io.to(room.code).emit('lobbyUpdate', lobbyInfo);
    }
  });

  socket.on('leaveRoom', () => {
    handleDisconnect(io, socket);
  });

  socket.on('disconnect', () => {
    handleDisconnect(io, socket);
  });
}

function handleDisconnect(io, socket) {
  const conn = db.getConnection(socket.id);
  if (!conn) return;

  const room = db.getRoom(conn.roomCode);
  if (!room) return;

  if (room.hostId === socket.id) {
    if (room.match) {
      const activeMatch = room.match;
      const hostPlayer = room.players.find(player => player.id === socket.id);
      // Emit the forfeit result before destroying the room, including pauses.
      activeMatch.forfeitAgainstTeam(hostPlayer?.team);
      activeMatch.stop();
    }
    io.to(room.code).emit('roomChatCleared');
    io.to(room.code).emit('hostLeft', 'O host saiu. A sala foi encerrada.');
    room.players.forEach(player => {
      const targetSocket = io.sockets.sockets.get(player.id);
      if (targetSocket) targetSocket.leave(room.code);
      db.removeConnection(player.id);
    });
    db.deleteRoom(room.code);
    broadcastLobbyList(io);
    return;
  }

  const activePlayer = room.players.find(player => player.id === socket.id);
  if (room.status === 'playing' && room.match && activePlayer && activePlayer.team !== 'spectator') {
    const disconnected = room.markPlayerDisconnected(socket.id);
    db.removeConnection(socket.id);
    socket.leave(room.code);
    const team = disconnected.team === 'red' ? 0 : 1;
    room.match.pauseForDisconnectedTeam(team, disconnected.uid, disconnected.username, { allowRejoin: true, timeoutMs: 90000 });
    const message = room.addChatMessage('Sistema', '', '📢', `${disconnected.username} perdeu a conexão. Aguardando retorno.`);
    io.to(room.code).emit('chatMessage', message);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    return;
  }

  const removed = room.removePlayer(socket.id);
  db.removeConnection(socket.id);
  socket.leave(room.code);

  if (room.players.length === 0) {
    if (room.match) {
      room.match.stop();
    }
    db.deleteRoom(room.code);
    broadcastLobbyList(io);
    return;
  }

  if (removed) {
    const leaveMsg = room.addChatMessage('Sistema', '', '', `${removed.username} saiu da sala.`);
    io.to(room.code).emit('chatMessage', leaveMsg);
    if (room.match) {
      room.match.syncPlayersFromLobby(room.players, { allowCasualForfeit: true });
    }
  }

  io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  broadcastLobbyList(io);
}
