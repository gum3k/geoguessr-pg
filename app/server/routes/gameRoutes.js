const express = require('express');
const router = express.Router();
const io = require("../socket");

const gameSessions = {}; // Przechowywanie danych gry 

const roundTimers = {};

// Funkcja do obliczania dystansu między punktami
const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Promień Ziemi w km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Zwraca dystans w km
};

const startRound = (lobbyId, roundTime) => {
    if (!gameSessions[lobbyId]) {
        gameSessions[lobbyId] = { roundActive: true, timeLeft: roundTime };
    } else {
        gameSessions[lobbyId].roundActive = true;
        gameSessions[lobbyId].timeLeft = roundTime;
    }

    io.to(lobbyId).emit("roundStart", { timeLeft: roundTime });

    if (roundTime > 0) {
        if (roundTimers[lobbyId]) clearInterval(roundTimers[lobbyId]); // Usuwamy poprzedni licznik

        roundTimers[lobbyId] = setInterval(() => {
            if (gameSessions[lobbyId].timeLeft > 0) {
                gameSessions[lobbyId].timeLeft -= 1;
                io.to(lobbyId).emit("timerUpdate", { timeLeft: gameSessions[lobbyId].timeLeft });
            } else {
                clearInterval(roundTimers[lobbyId]);
                endRound(lobbyId);
            }
        }, 1000);
    }
};

// Funkcja do obliczania punktów na podstawie dystansu
const calculateScore = (distance) => {
    const e = 2.718281828459045;
    return Math.max(0, Math.round(5000 * e ** (-10 * distance / 20037.852)));
};

// Endpoint do obsługi zgadywania lokacji
router.post('/game/submit-guess', (req, res) => {
    const { lobbyId, playerLocation, targetLocation } = req.body;

    if (!playerLocation || !targetLocation) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    const distance = calculateDistance(playerLocation, targetLocation);
    const score = calculateScore(distance);

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

    res.json({ distance: Math.round(distance), score });
});

// Funkcja do zakończenia rundy
const endRound = (lobbyId) => {
    if (!gameSessions[lobbyId]) return;

    gameSessions[lobbyId].roundActive = false;
    gameSessions[lobbyId].timeLeft = 0;

    io.to(lobbyId).emit("roundEnd", { message: "Czas rundy się skończył!" });

    if (roundTimers[lobbyId]) {
        clearInterval(roundTimers[lobbyId]);
        delete roundTimers[lobbyId];
    }
};

// Endpoint do rozpoczęcia rundy
router.post("/game/start-round", (req, res) => {
    const { lobbyId, roundTime } = req.body;

    if (!lobbyId || roundTime === undefined) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    startRound(lobbyId, roundTime);

    res.json({ message: "Runda rozpoczęta!", roundTime });
});

// Endpoint do pobierania statusu rundy i pozostałego czasu
router.get("/game/round-status/:lobbyId", (req, res) => {
    const lobbyId = req.params.lobbyId;
    const roundData = gameSessions[lobbyId];

    if (!roundData) {
        return res.status(404).json({ error: "Lobby nie istnieje" });
    }

    res.json({
        roundActive: roundData.roundActive,
        timeLeft: roundData.timeLeft || 0,
    });
});

module.exports = router;
