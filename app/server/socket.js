module.exports = function (io) {
  let lobbies = {}; // Store lobbies and their players

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
        locations: [], // Add locations to the lobby data
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
        io.to(lobbyId).emit('gameStarting', { 
          message: 'The game is starting!', 
          lobbyId,
          rounds: lobby.rounds,
          roundTime: lobby.roundTime,
          selectedMode: lobby.selectedMode,
          mapName: lobby.mapName,
          locations: lobby.locations
        });
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

    socket.on('getLobbyData', (lobbyId) => {
      if (lobbies[lobbyId]) {
        socket.emit('lobbyData', lobbies[lobbyId]);
      } else {
        socket.emit('lobbyNotFound', { message: 'Lobby not found' });
      }
    });

    // New event listener for setting locations
    socket.on('setLocations', (data) => {
      const { lobbyId, locations } = data;
      if (lobbies[lobbyId]) {
        lobbies[lobbyId].locations = locations;
        io.to(lobbyId).emit('locationsUpdated', { locations });
      } else {
        socket.emit('lobbyNotFound', { message: 'Lobby not found' });
      }
    });
  });
};
