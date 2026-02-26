const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Configuration Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // À restreindre en production
    methods: ["GET", "POST"]
  }
});

// Stocker les connexions (optionnel)
io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté');

  socket.on('disconnect', () => {
    console.log('🔌 Client déconnecté');
  });
});

// Rendre io accessible dans les contrôleurs
app.set('io', io);

server.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
  console.log(` WebSocket prêt sur le même port`);
});