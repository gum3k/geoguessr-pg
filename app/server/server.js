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
      players: [] // Add host as the first player
    };

    lobbies[lobbyId] = newLobby;

    // Emit to the client that the lobby has been created
    socket.emit('lobbyCreated', newLobby);
  });

  // Handle joining a lobby
  socket.on('joinLobby', (lobbyId) => {
    console.log(`Player ${socket.id} joining lobby ${lobbyId}`);
    
    if (!lobbies[lobbyId]) {
      lobbies[lobbyId] = { players: [] };
    }

    // Add player to the lobby
    const lobby = lobbies[lobbyId];
    const player = { id: socket.id, name: `Player ${socket.id}` };
    
    if (!lobby.players.find(player => player.id === socket.id)) {
      lobby.players.push({ id: socket.id, name: `Player ${socket.id}`, host: false });
    }

    // Emit the updated lobby data to all players in the lobby
    io.to(lobbyId).emit('lobbyData', lobby);  // Send updated lobby data to all players in this lobby

    // Emit the lobby data to the new player
    socket.emit('lobbyData', lobby); // Send the updated lobby data to the new player

    // Join the lobby room
    socket.join(lobbyId);
  });

  // Handle player leaving the lobby
  socket.on('leaveLobby', (lobbyId) => {
    if (lobbies[lobbyId]) {
      const lobby = lobbies[lobbyId];
      
      // Remove player from the lobby
      const playerIndex = lobby.players.findIndex(player => player.id === socket.id);
      if (playerIndex !== -1) {
        lobby.players.splice(playerIndex, 1);
      }

      // Emit updated lobby data to all players in the lobby
      io.to(lobbyId).emit('lobbyData', lobby); // Notify all players in the lobby
    }
  });


  // Handle starting the game
  socket.on('startGame', (lobbyId) => {
    const lobby = lobbies[lobbyId];
    if (lobby) {
      console.log(`Game starting for lobby ${lobbyId}`);

      // Broadcast to all players in the lobby to start the game
      io.to(lobbyId).emit('gameStarting', { message: 'The game is starting!', lobbyId });
      
      // Optionally, do other game setup logic here
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
