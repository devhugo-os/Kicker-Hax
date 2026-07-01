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

  socket.on('hostChangeFieldSize', ({ size }) => {
    const conn = db.getConnection(socket.id);
    if (!conn) return;

    const room = db.getRoom(conn.roomCode);
    if (!room) return;

    if (room.hostId !== socket.id) return;

    room.fieldSize = size;
    if (room.match) {
      room.match.changeFieldSize(size);
    }
    
    io.to(room.code).emit('fieldSizeUpdated', { size });
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
}
