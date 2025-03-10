const express = require('express');
const router = express.Router();

const gameSessions = {}; // Przechowywanie danych gry 

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

// Endpoint do pobierania wyników dla singleplayer
router.get('/game/round-info/:lobbyId', (req, res) => {
    const lobbyId = req.params.lobbyId;
    res.json(gameSessions[lobbyId] || []);
});

module.exports = router;
