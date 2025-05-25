const crypto = require("crypto");
const timerService = require("./services/timerService");
const { calculateDistance } = require("./utils/gameUtils");
const { query } = require("./database");

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
        maxPlayers: data.maxPlayers || 8
      };

      lobbies[lobbyId] = newLobby;
      socket.emit("lobbyCreated", newLobby);
      socket.join(lobbyId);
    });

    socket.on("joinLobby", ({ lobbyId, accountId, username }) => {
      const lobby = lobbies[lobbyId];
      if (!lobby) {
      socket.emit("error", "Lobby nie istnieje");
      return;
      }

      if (lobby.players.length >= lobby.maxPlayers) {
        socket.emit("error", "Lobby jest pełne");
        return;
      }
      lobby.players.push({ id: socket.id, accountId, name: username });

      console.log(`User ${username} joined lobby ${lobbyId}`);
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

    socket.on("startGame", async (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (!lobby) return;

      console.log(`Rozpoczynanie gry w lobby ${lobbyId}`);

      io.to(lobbyId).emit("gameStarting", {
        message: "The game is starting!",
        lobbyId,
        rounds: lobby.rounds,
        roundTime: lobby.roundTime,
        selectedMode: lobby.selectedMode,
        map: lobby.map.name,
        locations: lobby.locations,
      });

      try {
        const result = await query(`
          INSERT INTO game ("roundAmount", "timePerRound", "mapName")
          VALUES ($1, $2, $3)
          RETURNING gameid
        `, [lobby.rounds, lobby.roundTime, lobby.map.name]);

        const gameId = result.rows[0].gameid;

        for (const player of lobby.players) {
          if (player.accountId) {
            await query(`
              INSERT INTO user_game ("userid", "gameid", "gamePoints")
              VALUES ($1, $2, 0)
            `, [player.accountId, gameId]);
          }
        }

        timerService.startRoundTimer(io, lobbyId, lobby.roundTime, lobbies);
      } catch (error) {
        console.error("Błąd startGame:", error);
        io.to(lobbyId).emit("error", "Błąd podczas uruchamiania gry.");
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
      timerService.startRoundTimer(io, lobbyId, roundTime, lobbies);
    });

    socket.on("pauseTimer", (lobbyId) => {
      timerService.pauseTimer(lobbyId);
    });

    socket.on("resumeTimer", (lobbyId) => {
      timerService.resumeTimer(io, lobbyId, lobbies);
    });

    socket.on("playerGuessed", ({ lobbyId, playerLocation, points }) => {
      const lobby = lobbies[lobbyId];
      if (!lobby) return;

      if (!lobby.guessedPlayers) {
        lobby.guessedPlayers = new Set();
        lobby.currentGuesses = [];
      }

      if (lobby.guessedPlayers.has(socket.id)) return;

      lobby.guessedPlayers.add(socket.id);

      const player = lobby.players.find(p => p.id === socket.id);
      
      const targetLocation = lobby.locations[lobby.currentRoundIndex];
      const distance = playerLocation ? calculateDistance(playerLocation, targetLocation) : null;

      lobby.currentGuesses.push({
        playerId: socket.id,
        playerName: player?.name || `Player ${socket.id.slice(0, 5)}`,
        playerLocation: playerLocation,
        points: points ?? 0,
        distance: distance ?? 0,
      });

      io.to(lobbyId).emit("playerGuessedNotification", {
        playerName: player?.name || `Player ${socket.id.slice(0, 5)}`,
        playerId: socket.id,
      });

      if (lobby.guessedPlayers.size >= lobby.players.length) {
        const targetLocation = lobby.locations[lobby.currentRoundIndex];

        console.log(`[playerGuessed] ALL_GUESSED in ${lobbyId}, emitting roundResults and roundEnded`);

        io.to(lobbyId).emit("roundResults", {
          targetLocation,
          guesses: lobby.currentGuesses,
        });

        io.to(lobbyId).emit("roundEnded");

        lobby.guessedPlayers.clear();
        lobby.currentGuesses = [];
      }
    });

    socket.on("nextRound", (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (!lobby || !lobby.locations) return;

      if (lobby.currentRoundIndex + 1 >= lobby.locations.length) {
        io.to(lobbyId).emit("gameOver");
        return;
      }
        lobby.guessedPlayers = new Set();
        lobby.currentGuesses = [];
      lobby.currentRoundIndex += 1; 
      io.to(lobbyId).emit("startNextRound", {
        nextIndex: lobby.currentRoundIndex,
        roundTime: lobby.roundTime,
      });
    });
    
  });
};
