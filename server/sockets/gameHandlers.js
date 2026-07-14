// Kicker Hax - Server-side Game Socket Handlers
import { db } from '../database/memoryDb.js';

export function registerGameHandlers(io, socket) {
  socket.on('gameInput', (inputData) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'playing' || !room.match) return;

    room.match.updateInput(socket.id, inputData);
  });

  socket.on('hostResetMatch', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room) return;

    if (room.hostId !== socket.id) return;

    if (room.match) {
      room.match.resetMatch();
    }

    io.to(room.code).emit('matchReset');
  });

  socket.on('hostEndMatchToLobby', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || room.competitive) return;

    if (room.match) {
      room.match.stop();
      room.match = null;
    }
    room.status = 'lobby';
    room.resetLobbyStatus();
    room.chatHistory = [];
    const lobbyInfo = room.getLobbyInfo();
    io.to(room.code).emit('roomChatCleared');
    io.to(room.code).emit('lobbyUpdate', lobbyInfo);
    io.to(room.code).emit('matchAborted', { lobbyInfo });
  });

  socket.on('hostSkipReplay', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || !room.match || room.competitive) return;
    room.match.skipReplay();
    io.to(room.code).emit('replaySkipped');
  });

  socket.on('hostSetPaused', ({ paused }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || !room.match || room.competitive) return;

    room.match.isHostPaused = !!paused;
    if (!paused) {
      room.match.pauseTicks = 0;
    }
    const status = paused ?'pausada' : 'retomada';
    const msg = room.addChatMessage('Sistema', '', '📢', `A partida foi ${status} pelo host.`);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('hostAddTime', ({ seconds }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || !room.match) return;

    const safeSeconds = Math.max(-600, Math.min(600, Number(seconds) || 0));
    room.match.addTime(safeSeconds);
    const verb = safeSeconds >= 0 ? 'adicionou' : 'removeu';
    const msg = room.addChatMessage('Sistema', '', '📢', `O host ${verb} ${Math.round(Math.abs(safeSeconds) / 60)} minuto(s).`);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('hostChangeTeam', ({ playerId, team }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || room.competitive) return;
    if (!['red', 'blue', 'spectator'].includes(team)) return;

    const changed = room.changeTeam(playerId, team);
    if (!changed) return;

    if (room.match) {
      room.match.syncPlayersFromLobby(room.players, { allowCasualForfeit: false });
      room.match.kickoff();
    }

    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('hostFocusChanged', ({ focusLost }) => {
    // Focus changes must not pause multiplayer anymore; only explicit host pause does.
  });

  socket.on('surrenderMatch', () => {
    const conn = db.getConnection(socket.id);
    const room = conn && db.getRoom(conn.roomCode);
    if (!room?.match || room.status !== 'playing') return;
    const player = room.players.find(item => item.id === socket.id);
    if (!player || player.cpu || player.team === 'spectator' || player.disconnected) return;
    const team = player.team === 'red' ? 0 : 1;
    const teammates = room.players.filter(item => !item.cpu && !item.disconnected
      && item.team === player.team && item.id !== player.id);

    if (teammates.length === 0) {
      const msg = room.addChatMessage('Sistema', '', '📢', `${player.username} desistiu. O time adversário venceu por W.O.`);
      io.to(room.code).emit('chatMessage', msg);
      room.match.forfeitAgainstTeam(team);
      return;
    }

    room.markPlayerDisconnected(player.id);
    room.match.pauseForDisconnectedTeam(team, player.uid, player.username, { allowRejoin: false, timeoutMs: 30000 });
    room.match.forceContinueVote(player.uid, player.username);
    const msg = room.addChatMessage('Sistema', '', '📢', `${player.username} desistiu. O time decide em 30 segundos se continua com um jogador a menos.`);
    io.to(room.code).emit('chatMessage', msg);
    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
    socket.emit('surrenderAccepted');
  });
}
