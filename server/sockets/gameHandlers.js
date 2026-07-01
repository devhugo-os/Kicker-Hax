// Kicker Hax - Server-side Game Socket Handlers
import { db } from '../database/memoryDb.js';
import * as C from '../../shared/constants.js';

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

  socket.on('hostSetPaused', ({ paused }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || !room.match) return;

    room.match.isHostPaused = !!paused;
    const status = paused ? 'pausada' : 'retomada';
    const msg = room.addChatMessage('Sistema', '', '📢', `A partida foi ${status} pelo host.`);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('hostAddTime', ({ seconds }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id || !room.match) return;

    const safeSeconds = Math.max(0, Math.min(600, Number(seconds) || 0));
    room.match.addTime(safeSeconds);
    const msg = room.addChatMessage('Sistema', '', '📢', `O host adicionou ${Math.round(safeSeconds / 60)} minuto(s) ao tempo.`);
    io.to(room.code).emit('chatMessage', msg);
  });

  socket.on('hostChangeTeam', ({ playerId, team }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.hostId !== socket.id) return;
    if (!['red', 'blue', 'spectator'].includes(team)) return;

    const changed = room.changeTeam(playerId, team);
    if (!changed) return;

    if (room.match) {
      const player = room.match.players.find(p => p.id === playerId);
      if (player && team !== 'spectator') {
        player.team = team === 'red' ? C.Team.RED : C.Team.BLUE;
        room.match.kickoff();
      }
    }

    io.to(room.code).emit('lobbyUpdate', room.getLobbyInfo());
  });

  socket.on('hostFocusChanged', ({ focusLost }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'playing' || !room.match) return;

    // Only host can pause the game by changing focus
    if (room.hostId === socket.id) {
      room.match.isHostPaused = !!focusLost;
    }
  });
}
