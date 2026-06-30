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
    methods: ['GET', 'POST']
  }
});

// Serve compiled static files
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to source client files (for development integration)
app.use(express.static(path.join(__dirname, '../client')));

// Redirect index routes if needed
app.get('*', (req, res, next) => {
  // If request matches file extension, let express static handle it
  if (req.path.includes('.')) {
    return next();
  }
  // Otherwise, serve SPA index
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);

  // Send initial room listings
  socket.emit('publicRoomsList', db.getAllRooms().filter(r => !r.password).map(r => r.getPublicInfo()));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Kicker Hax Server] Rodando em http://localhost:${PORT}`);
});
