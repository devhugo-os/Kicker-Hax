// Kicker Hax - Server-side Room Socket Handlers
import { db } from '../database/memoryDb.js';
import { ServerRoom } from '../models/serverRoom.js';
import { ServerMatch } from '../models/serverMatch.js';

// Simple helper to generate unique 6-digit room codes
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function registerRoomHandlers(io, socket) {
  // Heartbeat ping/pong for latency measurement
  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('createRoom', ({ name, password, maxPlayers, duration, goalLimit, profile }) => {
    let code;
    let attempts = 0;
    do {
      code = generateRoomCode();
      attempts++;
    } while (db.getRoom(code) && attempts < 100);

    const room = new ServerRoom(code, name, socket.id, {
      maxPlayers,
      password,
      duration,
      goalLimit
    });

    db.createRoom(code, room);
    
    // Add host to room
    room.addPlayer(socket.id, profile, 'spectator');

    // Register user in database connections
    db.addConnection(socket.id, {
      uid: profile.uid,
      username: profile.username,
      roomCode: code
    });

    socket.join(code);
    socket.emit('roomCreated', code);
    
    // Broadcast public rooms update to lobby clients
    io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
    io.to(code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('joinRoom', ({ roomCode, password, profile }) => {
    const room = db.getRoom(roomCode);
    if (!room) {
      return socket.emit('joinError', 'Sala não encontrada.');
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
    
    // Inform other players
    const joinMsg = room.addChatMessage('Sistema', '', '📢', `${profile.username} entrou na sala.`);
    io.to(room.code).emit('chatMessage', joinMsg);

    // Refresh public rooms list counts
    io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
  });

  socket.on('changeTeam', (team) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby') return;

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

  // Antispam mechanism for chat messages
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
    const username = player ? player.username : conn.username;
    const badge = player ? player.badge : '';

    const msg = room.addChatMessage(username, '', badge, text);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('addBot', (team) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    const botId = `bot_${Math.random().toString(36).substr(2, 5)}`;
    const botProfile = {
      uid: '',
      username: `Bot ${team === 'red' ? 'Vermelho' : 'Azul'} (CPU)`,
      badge: '⚙️',
      cpu: true,
      difficulty: 'medium'
    };

    room.addPlayer(botId, botProfile, team);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
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
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    const targetPlayer = room.players.find(p => p.id === targetSocketId);
    if (targetPlayer) {
      room.removePlayer(targetSocketId);
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());

      const kickMsg = room.addChatMessage('Sistema', '', '📢', `${targetPlayer.username} foi expulso da sala.`);
      io.to(room.code).emit('chatMessage', kickMsg);

      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit('kicked');
        targetSocket.leave(room.code);
        db.removeConnection(targetSocketId);
      }
    }
  });

  socket.on('updateRoomSettings', (settings) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    room.updateSettings(settings);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
  });

  socket.on('startGame', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'lobby' || room.hostId !== socket.id) return;

    const redTeam = room.players.filter(p => p.team === 'red');
    const blueTeam = room.players.filter(p => p.team === 'blue');

    if (redTeam.length === 0 || blueTeam.length === 0) {
      return socket.emit('startError', 'Cada time precisa de pelo menos 1 jogador (ou bot).');
    }

    room.status = 'playing';
    
    // Start game tick simulation
    room.match = new ServerMatch(
      room.code,
      room.duration,
      room.goalLimit,
      room.players,
      io,
      (score) => {
        // Callback on match end
        room.status = 'lobby';
        room.players.forEach(p => p.ready = false);
        room.match = null;
        io.to(room.code).emit('matchEnded', score);
        io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
        io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
      }
    );

    io.to(room.code).emit('matchStarted');
    io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
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
  if (room) {
    const removed = room.removePlayer(socket.id);
    db.removeConnection(socket.id);
    socket.leave(room.code);

    if (room.players.length === 0) {
      if (room.match) {
        room.match.stop();
      }
      db.deleteRoom(room.code);
    } else {
      if (removed) {
        const leaveMsg = room.addChatMessage('Sistema', '', '📢', `${removed.username} saiu da sala.`);
        io.to(room.code).emit('chatMessage', leaveMsg);
      }
      io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    }

    // Refresh public rooms list
    io.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
  }
}
