const gameService = require("../services/gameService");

exports.submitGuess = async (req, res) => {
  const { lobbyId, playerLocation, targetLocation, userId, roundNumber, gameId } = req.body;

  try {
    const result = await gameService.processGuess(
      lobbyId,
      playerLocation,
      targetLocation,
      userId,
      roundNumber,
      gameId
    );

    console.log("Zwracany wynik:", result);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Błąd w submitGuess:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.startRound = (req, res) => {
    const { lobbyId, roundTime, targetLocation, roundNumber, gameId } = req.body;

    if (!lobbyId || roundTime === undefined) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    gameService.startRound(lobbyId, roundTime, targetLocation, roundNumber, gameId);
    res.json({ message: "Runda rozpoczęta!", roundTime });
};

exports.getRoundStatus = async (req, res) => {
  const lobbyId = req.params.lobbyId;
  const userId = req.user.id;

  console.log("userId:", userId);
  console.log("lobbyId:", lobbyId);

  const roundData = await gameService.getRoundStatus(lobbyId, userId);

  if (!roundData) {
    return res.status(404).json({ error: "Lobby nie istnieje" });
  }

  res.json(roundData);
};

exports.endGame = (req, res) => {
    const lobbyId = req.params.lobbyId;

    if (!lobbyId) {
        return res.status(404).json({ error: "Gra nie istnieje" });
    }

    gameService.endGame(lobbyId);
    return res.sendStatus(204);
}