const gameService = require("../services/gameService");
const { calculateDistance, calculateScore } = require("../utils/gameUtils");

exports.submitGuess = (req, res) => {
    const { lobbyId, playerLocation, targetLocation } = req.body;

    if (!playerLocation || !targetLocation) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    const distance = calculateDistance(playerLocation, targetLocation);
    const score = calculateScore(distance);

    if (lobbyId === "singleplayer") {
        if (!global.singleplayerRounds) global.singleplayerRounds = [];
        global.singleplayerRounds.push({
            playerLocation,
            targetLocation,
            score,
            distance
        });
    }

    res.json({ score, distance });
};

exports.startRound = (req, res) => {
    const { lobbyId, roundTime, targetLocation, roundNumber, gameId } = req.body;

    if (!lobbyId || roundTime === undefined) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    gameService.startRound(lobbyId, roundTime, targetLocation, roundNumber, gameId);
    res.json({ message: "Runda rozpoczęta!", roundTime });
};

exports.getRoundStatus = (req, res) => {
    const lobbyId = req.params.lobbyId;

    if (lobbyId === "singleplayer") {
        return res.json(global.singleplayerRounds || []);
    }

    const roundData = gameService.getRoundStatus(lobbyId);
    if (!roundData) {
        return res.status(404).json({ error: "Lobby nie istnieje" });
    }

    res.json(roundData);
};

exports.endGame = (req, res) => {
    const lobbyId = req.params.lobbyId;

    if (lobbyId === "singleplayer") {
        global.singleplayerRounds = [];
        return res.sendStatus(204);
    }

    if (!lobbyId) {
        return res.status(404).json({ error: "Gra nie istnieje" });
    }

    gameService.endGame(lobbyId);
    return res.sendStatus(204);
};