const crypto = require("crypto");

module.exports = function (io) {
  let lobbies = {}; // Store lobbies and their players
  const gameTimers = {}; // Store timers for each lobby

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("createLobby", (data) => {
      const lobbyId = crypto.randomUUID(); // Generate unique lobby ID
      const newLobby = {
        lobbyId,
        rounds: data.rounds,
        roundTime: data.roundTime,
        selectedMode: data.selectedMode,
        mapName: data.mapName,
        locations: [],
        players: [],
      };

      lobbies[lobbyId] = newLobby;
      socket.emit("lobbyCreated", newLobby);
      socket.join(lobbyId);
    });

    socket.on("joinLobby", (lobbyId) => {
      console.log(`Player ${socket.id} joining lobby ${lobbyId}`);

      if (!lobbies[lobbyId]) {
        lobbies[lobbyId] = { players: [] };
      }

      const lobby = lobbies[lobbyId];

      if (!lobby.players.find((player) => player.id === socket.id)) {
        lobby.players.push({ id: socket.id, name: `Player ${socket.id}`, host: false });
      }
      io.to(lobbyId).emit("lobbyData", lobby);
      socket.emit("lobbyData", lobby);
      socket.join(lobbyId);
    });

    socket.on("leaveLobby", (lobbyId) => {
      if (lobbies[lobbyId]) {
        const lobby = lobbies[lobbyId];

        const playerIndex = lobby.players.findIndex((player) => player.id === socket.id);
        if (playerIndex !== -1) {
          const isHost = lobby.players[playerIndex].host;
          lobby.players.splice(playerIndex, 1);

          if (isHost && lobby.players.length > 0) {
            lobby.players[0].host = true;
            io.to(lobbyId).emit("hostChanged", lobby.players[0]);
          }

          if (lobby.players.length === 0) {
            delete lobbies[lobbyId];
          } else {
            io.to(lobbyId).emit("lobbyData", lobby);
          }
        }
      }
    });

    socket.on("startGame", (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (lobby) {
        console.log(`Game starting for lobby ${lobbyId}`);
        io.to(lobbyId).emit("gameStarting", {
          message: "The game is starting!",
          lobbyId,
          rounds: lobby.rounds,
          roundTime: lobby.roundTime,
          selectedMode: lobby.selectedMode,
          mapName: lobby.mapName,
          locations: lobby.locations,
        });

        // Start the timer when the game begins
        io.to(lobbyId).emit("startRoundTimer", { lobbyId, roundTime: lobby.roundTime });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      for (const lobbyId in lobbies) {
        const lobby = lobbies[lobbyId];
        const playerIndex = lobby.players.findIndex((player) => player.id === socket.id);
        if (playerIndex !== -1) {
          const isHost = lobby.players[playerIndex].host;
          lobby.players.splice(playerIndex, 1);

          if (isHost && lobby.players.length > 0) {
            lobby.players[0].host = true;
            io.to(lobbyId).emit("hostChanged", lobby.players[0]);
          }

          if (lobby.players.length === 0) {
            delete lobbies[lobbyId];
          } else {
            io.to(lobbyId).emit("lobbyData", lobby);
          }
        }
      }
    });

    socket.on("getLobbyData", (lobbyId) => {
      if (lobbies[lobbyId]) {
        socket.emit("lobbyData", lobbies[lobbyId]);
      } else {
        socket.emit("lobbyNotFound", { message: "Lobby not found" });
      }
    });

    socket.on("setLocations", (data) => {
      const { lobbyId, locations } = data;
      if (lobbies[lobbyId]) {
        lobbies[lobbyId].locations = locations;
        io.to(lobbyId).emit("locationsUpdated", { locations });
      } else {
        socket.emit("lobbyNotFound", { message: "Lobby not found" });
      }
    });


    socket.on("startRoundTimer", ({ lobbyId, roundTime }) => {
      if (gameTimers[lobbyId]) clearInterval(gameTimers[lobbyId].interval);

      let timeLeft = roundTime;
      gameTimers[lobbyId] = { timeLeft };

      const interval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft -= 1;
          io.to(lobbyId).emit("timerUpdate", { timeLeft });
        } else {
          clearInterval(interval);
          io.to(lobbyId).emit("timerEnded");
        }
      }, 1000);

      gameTimers[lobbyId].interval = interval;
    });

    socket.on("pauseTimer", (lobbyId) => {
      if (gameTimers[lobbyId]) {
        clearInterval(gameTimers[lobbyId].interval);
      }
    });

    socket.on("resumeTimer", (lobbyId) => {
      if (gameTimers[lobbyId]) {
        io.to(lobbyId).emit("timerUpdate", { timeLeft: gameTimers[lobbyId].timeLeft });
        socket.emit("startRoundTimer", { lobbyId, roundTime: gameTimers[lobbyId].timeLeft });
      }
    });
  });
};
