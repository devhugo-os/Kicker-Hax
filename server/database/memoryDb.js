// Kicker Hax - In-memory Database

class MemoryDb {
  constructor() {
    this.rooms = new Map();         // roomCode -> ServerRoom
    this.connections = new Map();   // socketId -> { uid, username, roomCode }
  }

  getRoom(code) {
    if (!code) return null;
    return this.rooms.get(code.toUpperCase());
  }

  createRoom(code, room) {
    this.rooms.set(code.toUpperCase(), room);
  }

  deleteRoom(code) {
    this.rooms.delete(code.toUpperCase());
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  addConnection(socketId, connectionData) {
    this.connections.set(socketId, connectionData);
  }

  getConnection(socketId) {
    return this.connections.get(socketId);
  }

  removeConnection(socketId) {
    this.connections.delete(socketId);
  }
}

export const db = new MemoryDb();
