const express = require('express');
const path = require('path');
const routes = require('./routes');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true
  }
});

let lobbies = {}; // Store lobbies and their players

// Serve React app from the client build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.use('/api', routes);

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createLobby', (data) => {
    const lobbyId = Math.floor(Math.random() * 1000000);
    const newLobby = {
      lobbyId,
      rounds: data.rounds,
      roundTime: data.roundTime,
      selectedMode: data.selectedMode,
      mapName: data.mapName,
      players: []
    };

    lobbies[lobbyId] = newLobby;

    socket.emit('lobbyCreated', newLobby);
    socket.join(lobbyId);
  });

  socket.on('joinLobby', (lobbyId) => {
    console.log(`Player ${socket.id} joining lobby ${lobbyId}`);
    
    if (!lobbies[lobbyId]) {
      lobbies[lobbyId] = { players: [] };
    }

    const lobby = lobbies[lobbyId];
    
    if (!lobby.players.find(player => player.id === socket.id)) {
      lobby.players.push({ id: socket.id, name: `Player ${socket.id}`, host: false });
    }
    io.to(lobbyId).emit('lobbyData', lobby);
    socket.emit('lobbyData', lobby);
    socket.join(lobbyId);
  });

  socket.on('leaveLobby', (lobbyId) => {
    if (lobbies[lobbyId]) {
      const lobby = lobbies[lobbyId];
      
      const playerIndex = lobby.players.findIndex(player => player.id === socket.id);
      if (playerIndex !== -1) {
        const isHost = lobby.players[playerIndex].host;
        lobby.players.splice(playerIndex, 1);

        if (isHost && lobby.players.length > 0) {
          lobby.players[0].host = true; // Promote the first player to host
          io.to(lobbyId).emit('hostChanged', lobby.players[0]);
        }

        if (lobby.players.length === 0) {
          delete lobbies[lobbyId]; // Delete the lobby if no players are left
        } else {
          io.to(lobbyId).emit('lobbyData', lobby);
        }
      }
    }
  });

  socket.on('startGame', (lobbyId) => {
    const lobby = lobbies[lobbyId];
    if (lobby) {
      console.log(`Game starting for lobby ${lobbyId}`);
      io.to(lobbyId).emit('gameStarting', { message: 'The game is starting!', lobbyId });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    for (const lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      const playerIndex = lobby.players.findIndex(player => player.id === socket.id);
      if (playerIndex !== -1) {
        const isHost = lobby.players[playerIndex].host;
        lobby.players.splice(playerIndex, 1);

        if (isHost && lobby.players.length > 0) {
          lobby.players[0].host = true; // Promote the first player to host
          io.to(lobbyId).emit('hostChanged', lobby.players[0]);
        }

        if (lobby.players.length === 0) {
          delete lobbies[lobbyId]; // Delete the lobby if no players are left
        } else {
          io.to(lobbyId).emit('lobbyData', lobby);
        }
      }
    }
  });
});

server.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
