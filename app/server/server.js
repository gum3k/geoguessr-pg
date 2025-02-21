const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes');
require('dotenv').config(); // For environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Allow requests from this domain
    methods: ["GET", "POST"],        // Allow these methods
    allowedHeaders: ["my-custom-header"], // Optional: Specify any custom headers
    credentials: true                 // Optional: If you are dealing with credentials (cookies)
  }
});

const PORT = process.env.PORT || 5000;

// Lobby management
let lobbies = {}; // Object to store lobbies and their players

// Serve React app from the client build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.use('/api', routes);

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle lobby creation
  socket.on('createLobby', (data) => {
    const lobbyId = Math.floor(Math.random() * 1000000); // Generate a random lobby ID
    const newLobby = {
      lobbyId,
      rounds: data.rounds,
      roundTime: data.roundTime,
      selectedMode: data.selectedMode,
      mapName: data.mapName,
      players: [{ id: socket.id, name: `Player ${socket.id}` }] // Add the current player to the lobby
    };

    // Store the new lobby
    lobbies[lobbyId] = newLobby;

    // Emit the 'lobbyCreated' event with lobby data to the client (host)
    socket.emit('lobbyCreated', newLobby);
    console.log(`Lobby created: ${lobbyId} with data:`, newLobby);
  });

  // Handle player joining a lobby
  socket.on('joinLobby', (lobbyId) => {
    if (lobbies[lobbyId]) {
      const lobby = lobbies[lobbyId];
      const newPlayer = { id: socket.id, name: `Player ${socket.id}` };
      lobby.players.push(newPlayer);

      // Notify all clients in the lobby that a new player joined
      io.to(lobbyId).emit('playerJoined', newPlayer);

      // Add the player to the lobby room
      socket.join(lobbyId);

      // Emit the lobby details to the joining player
      socket.emit('lobbyData', lobby);

      console.log(`Player ${socket.id} joined lobby ${lobbyId}`);
    } else {
      socket.emit('error', 'Lobby not found');
    }
  });

  // Handle player leaving a lobby
  socket.on('leaveLobby', (lobbyId) => {
    if (lobbies[lobbyId]) {
      const lobby = lobbies[lobbyId];
      const playerIndex = lobby.players.findIndex((player) => player.id === socket.id);
      if (playerIndex !== -1) {
        const removedPlayer = lobby.players.splice(playerIndex, 1)[0];

        // Notify all clients in the lobby that a player left
        io.to(lobbyId).emit('playerLeft', removedPlayer.id);

        // If no players are left, delete the lobby
        if (lobby.players.length === 0) {
          delete lobbies[lobbyId];
        }
      }
      socket.leave(lobbyId);
    } else {
      socket.emit('error', 'Lobby not found');
    }
  });

  // Handle starting the game
  socket.on('startGame', (lobbyId) => {
    if (lobbies[lobbyId]) {
      const lobby = lobbies[lobbyId];
      if (lobby.players.length >= 2) { // Ensure at least two players are in the lobby
        io.to(lobbyId).emit('gameStarted'); // Notify all players in the lobby that the game has started
        console.log(`Game started in lobby ${lobbyId}`);
      } else {
        socket.emit('error', 'Not enough players to start the game');
      }
    } else {
      socket.emit('error', 'Lobby not found');
    }
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    // Check if the player was in a lobby and remove them if so
    for (const lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      const playerIndex = lobby.players.findIndex((player) => player.id === socket.id);
      if (playerIndex !== -1) {
        const removedPlayer = lobby.players.splice(playerIndex, 1)[0];

        // Notify the remaining players that the player left
        io.to(lobbyId).emit('playerLeft', removedPlayer.id);

        // If no players are left, delete the lobby
        if (lobby.players.length === 0) {
          delete lobbies[lobbyId];
        }

        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
