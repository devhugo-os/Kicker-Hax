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

  socket.on('skipReplay', () => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room || room.status !== 'playing' || !room.match) return;

    // Only host can skip replay
    if (room.hostId === socket.id && room.match.status === 'replay') {
      room.match.countdownTimer = 0; // instantly end replay cooldown
    }
  });
}
