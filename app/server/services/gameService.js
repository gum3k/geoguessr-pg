const io = require("../socket");
const gameUtils = require("../utils/gameUtils");

const gameSessions = {};
const roundTimers = {};

exports.processGuess = (lobbyId, playerLocation, targetLocation) => {
    const distance = gameUtils.calculateDistance(playerLocation, targetLocation);
    const score = gameUtils.calculateScore(distance);

    if (!lobbyId || lobbyId === "singleplayer") {
        if (!gameSessions["singleplayer"]) {
            gameSessions["singleplayer"] = [];
        }
        gameSessions["singleplayer"].push({ playerLocation, targetLocation, distance, score });
    } else {
        if (!gameSessions[lobbyId]) {
            gameSessions[lobbyId] = [];
        }
        gameSessions[lobbyId].push({ playerLocation, targetLocation, distance, score });
    }

    return { distance: Math.round(distance), score };
};

exports.startRound = (lobbyId, roundTime) => {
    if (!gameSessions[lobbyId]) {
        gameSessions[lobbyId] = { roundActive: true, timeLeft: roundTime };
    } else {
        gameSessions[lobbyId].roundActive = true;
        gameSessions[lobbyId].timeLeft = roundTime;
    }

    io.to(lobbyId).emit("roundStart", { timeLeft: roundTime });

    if (roundTime > 0) {
        if (roundTimers[lobbyId]) clearInterval(roundTimers[lobbyId]);

        roundTimers[lobbyId] = setInterval(() => {
            if (gameSessions[lobbyId].timeLeft > 0) {
                gameSessions[lobbyId].timeLeft -= 1;
                io.to(lobbyId).emit("timerUpdate", { timeLeft: gameSessions[lobbyId].timeLeft });
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
    return gameSessions[lobbyId] || null;
};
