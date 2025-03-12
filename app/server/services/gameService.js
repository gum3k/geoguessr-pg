const io = require("../socket");
const gameUtils = require("../utils/gameUtils");

const gameSessions = {};
const roundTimers = {};

exports.processGuess = (lobbyId, playerLocation, targetLocation) => {
    const distance = gameUtils.calculateDistance(playerLocation, targetLocation);
    const score = gameUtils.calculateScore(distance);
    const sessionId = lobbyId || "singleplayer";

    if (!gameSessions[sessionId]) {
        gameSessions[sessionId] = { rounds: [] };
    }

    gameSessions[sessionId].rounds.push({ playerLocation, targetLocation, distance, points: score });
    return { distance: Math.round(distance), score };
};


exports.startRound = (lobbyId, roundTime) => {
    const sessionId = lobbyId || "singleplayer";

    if (!gameSessions[sessionId]) {
        gameSessions[sessionId] = { rounds: [] };
    }

    gameSessions[sessionId].roundActive = true;
    gameSessions[sessionId].timeLeft = roundTime;

    io.to(lobbyId).emit("roundStart", { timeLeft: roundTime });

    if (roundTime > 0) {
        if (roundTimers[lobbyId]) clearInterval(roundTimers[lobbyId]);

        roundTimers[lobbyId] = setInterval(() => {
            if (gameSessions[sessionId].timeLeft > 0) {
                gameSessions[sessionId].timeLeft -= 1;
                io.to(lobbyId).emit("timerUpdate", { timeLeft: gameSessions[sessionId].timeLeft });
            } else {
                clearInterval(roundTimers[lobbyId]);
                exports.endRound(lobbyId);
            }
        }, 1000);
    }
};

exports.endRound = (lobbyId) => {
    if (!gameSessions[lobbyId]) return;

    gameSessions[lobbyId].roundActive = false;
    gameSessions[lobbyId].timeLeft = 0;

    io.to(lobbyId).emit("roundEnd", { message: "Czas rundy się skończył!" });

    if (roundTimers[lobbyId]) {
        clearInterval(roundTimers[lobbyId]);
        delete roundTimers[lobbyId];
    }
};

exports.getRoundStatus = (lobbyId) => {
    const sessionId = lobbyId || "singleplayer";
    if (!gameSessions[sessionId]) return [];
    return gameSessions[sessionId].rounds;
};

