const gameService = require("../services/gameService");

exports.submitGuess = (req, res) => {
    const { lobbyId, playerLocation, targetLocation } = req.body;

    if (!playerLocation || !targetLocation) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const result = gameService.processGuess(lobbyId, playerLocation, targetLocation);
    res.json(result);
};

exports.startRound = (req, res) => {
    const { lobbyId, roundTime } = req.body;

    if (!lobbyId || roundTime === undefined) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    gameService.startRound(lobbyId, roundTime);
    res.json({ message: "Runda rozpoczęta!", roundTime });
};

exports.getRoundStatus = (req, res) => {
    const lobbyId = req.params.lobbyId;
    const roundData = gameService.getRoundStatus(lobbyId);

    if (!roundData) {
        return res.status(404).json({ error: "Lobby nie istnieje" });
    }

    res.json(roundData);
};
