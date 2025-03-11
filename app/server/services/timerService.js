const gameTimers = {}; // Przechowywanie timerów dla lobby

exports.startRoundTimer = (io, lobbyId, roundTime) => {
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
      delete gameTimers[lobbyId]; // Usunięcie timera po zakończeniu rundy
    }
  }, 1000);

  gameTimers[lobbyId].interval = interval;
};

exports.pauseTimer = (lobbyId) => {
  if (gameTimers[lobbyId]) {
    clearInterval(gameTimers[lobbyId].interval);
  }
};

exports.resumeTimer = (io, lobbyId) => {
  if (gameTimers[lobbyId]) {
    io.to(lobbyId).emit("timerUpdate", { timeLeft: gameTimers[lobbyId].timeLeft });
    this.startRoundTimer(io, lobbyId, gameTimers[lobbyId].timeLeft);
  }
};
