const crypto = require("crypto");
const timerService = require("./services/timerService");

module.exports = function (io) {
  let lobbies = {}; // Store lobbies and their players

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("createLobby", (data) => {
      const lobbyId = Math.random().toString(36).substr(2, 6).toUpperCase();
      const newLobby = {
        lobbyId,
        rounds: data.rounds,
        roundTime: data.roundTime,
        selectedMode: data.selectedMode,
        map: data.map,
        locations: [],
        players: [],
        guessCount: 0,
        currentRoundIndex: 0,
      };

      lobbies[lobbyId] = newLobby;
      socket.emit("lobbyCreated", newLobby);
      socket.join(lobbyId);
    });

    socket.on("joinLobby", lobbyId => {
      const lobby = lobbies[lobbyId];
      if (!lobby) {
        socket.emit("error", "Lobby nie istnieje");
        return;
      }
      if (!lobby.players.find(p => p.id === socket.id)) {
        lobby.players.push({ id: socket.id });
      }
      socket.join(lobbyId);
      io.to(lobbyId).emit("lobbyData", lobby);
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
          map: lobby.map.name,
          locations: lobby.locations,
        });

        // Start the timer when the game begins
        timerService.startRoundTimer(io, lobbyId, lobby.roundTime);
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

    socket.on("checkLobby", (lobbyId, callback) => {
      const exists = !!lobbies[lobbyId];
      callback(exists);
    });

    socket.on("startRoundTimer", ({ lobbyId, roundTime }) => {
      timerService.startRoundTimer(io, lobbyId, roundTime);
    });

    socket.on("pauseTimer", (lobbyId) => {
      timerService.pauseTimer(lobbyId);
    });

    socket.on("resumeTimer", (lobbyId) => {
      timerService.resumeTimer(io, lobbyId);
    });

    socket.on("playerGuessed", lobbyId => {
      const lobby = lobbies[lobbyId];
      if (!lobby) return;
      if (!lobby.guessedPlayers) {
        lobby.guessedPlayers = new Set();
      }
      
      lobby.guessedPlayers.add(socket.id);
      console.log(`[playerGuessed] lobby ${lobbyId}: ${lobby.guessedPlayers.size}/${lobby.players.length}`);
      
      if (lobby.guessedPlayers.size >= lobby.players.length) {
        console.log(`[playerGuessed] ALL_GUESSED in ${lobbyId}, emitting roundEnded`);
        io.to(lobbyId).emit("roundEnded");
        lobby.guessedPlayers.clear();
      }
    });

    socket.on("nextRound", (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (!lobby || !lobby.locations) return;

      if (lobby.currentRoundIndex + 1 >= lobby.locations.length) {
        io.to(lobbyId).emit("gameOver");
        return;
      }

      lobby.currentRoundIndex += 1; 
      io.to(lobbyId).emit("startNextRound", {
        nextIndex: lobby.currentRoundIndex,
        roundTime: lobby.roundTime,
      });
    });
    
  });
};
