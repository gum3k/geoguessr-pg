const gameTimers = {};
const { calculateDistance } = require("../utils/gameUtils");

exports.startRoundTimer = (io, lobbyId, roundTime, lobbies) => {
  if (roundTime === 0) {
    return;
  }

  if (gameTimers[lobbyId]) clearInterval(gameTimers[lobbyId].interval);

  let timeLeft = roundTime;
  gameTimers[lobbyId] = { timeLeft };

  const interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft -= 1;
      gameTimers[lobbyId].timeLeft = timeLeft;
      io.to(lobbyId).emit("timerUpdate", { timeLeft });
    } else {
      clearInterval(interval);
      delete gameTimers[lobbyId];

      const lobby = lobbies[lobbyId];
      if (!lobby) return;

      if (!lobby.guessedPlayers) {
        lobby.guessedPlayers = new Set();
        lobby.currentGuesses = [];
      }

      for (const player of lobby.players) {
        if (!lobby.guessedPlayers.has(player.id)) {
          lobby.guessedPlayers.add(player.id);
          lobby.currentGuesses.push({
            playerId: player.id,
            playerName: player.name || `Player ${player.id.slice(0, 5)}`,
            playerLocation: null,
            points: 0,
            distance: null,
          });
        }
      }

      const targetLocation = lobby.locations[lobby.currentRoundIndex];
      io.to(lobbyId).emit("roundResults", {
        targetLocation,
        guesses: lobby.currentGuesses,
      });
      io.to(lobbyId).emit("roundEnded");

      lobby.guessedPlayers.clear();
      lobby.currentGuesses = [];
    }
  }, 1000);

  gameTimers[lobbyId].interval = interval;
};

exports.pauseTimer = (lobbyId) => {
  if (gameTimers[lobbyId]) {
    clearInterval(gameTimers[lobbyId].interval);
  }
};

exports.resumeTimer = (io, lobbyId, lobbies) => {
  if (gameTimers[lobbyId]) {
    io.to(lobbyId).emit("timerUpdate", { timeLeft: gameTimers[lobbyId].timeLeft });
    exports.startRoundTimer(io, lobbyId, gameTimers[lobbyId].timeLeft, lobbies);
  }
};
