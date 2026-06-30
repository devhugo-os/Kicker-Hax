// Kicker Hax - Server Entrypoint
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoomHandlers } from './sockets/roomHandlers.js';
import { registerGameHandlers } from './sockets/gameHandlers.js';
import { db } from './database/memoryDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  },
  // Allow both transports for maximum compatibility
  transports: ['polling', 'websocket'],
  allowUpgrades: true
});

// Explicit CORS headers for all HTTP requests (needed for Socket.IO polling from GitHub Pages)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve compiled static files (production build)
app.use(express.static(path.join(__dirname, '../dist')));

// Serve source files for development (client/, shared/, server/)
// The client imports modules from ../../shared/ and ../../server/models/
// so we need to serve those directories at the project root level
app.use(express.static(path.join(__dirname, '../client')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));
app.use('/server', express.static(path.join(__dirname, '../server')));

// Redirect index routes if needed
app.get('*', (req, res, next) => {
  // If request matches file extension, let express static handle it
  if (req.path.includes('.')) {
    return next();
  }
  // Otherwise, serve SPA index
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

let onlineCount = 0;
io.on('connection', (socket) => {
  onlineCount++;
  io.emit('onlineUsersCount', onlineCount);

  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);

  // Send initial room listings
  socket.emit('publicRoomsList', db.getAllRooms().map(r => r.getPublicInfo()));

  socket.on('disconnect', () => {
    onlineCount = Math.max(0, onlineCount - 1);
    io.emit('onlineUsersCount', onlineCount);
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Kicker Hax Server] Rodando em http://localhost:${PORT}`);
});
