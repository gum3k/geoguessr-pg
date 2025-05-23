const io = require("../socket");
const gameUtils = require("../utils/gameUtils");
const { query } = require('../database');

const gameSessions = {};
const roundTimers = {};

exports.processGuess = async (lobbyId, playerLocation, targetLocation, userId, roundNumber, gameId) => {
  const distance = gameUtils.calculateDistance(playerLocation, targetLocation);
  const score = gameUtils.calculateScore(distance);
  const sessionId =  !lobbyId || lobbyId.length > 10 ? gameId : lobbyId;
  
  if (!gameSessions[sessionId]) {
    gameSessions[sessionId] = { rounds: [] };
  }

  gameSessions[sessionId].rounds.push({ playerLocation, targetLocation, distance, points: score });

  try {
    const result = await query(
      `SELECT roundid FROM round WHERE "gameid" = $1 AND "roundNumber" = $2`,
      [gameId, roundNumber]
    );

    if (result.rows.length === 0) {
      throw new Error("Nie znaleziono rundy dla podanego gameId i roundNumber");
    }

    const roundId = result.rows[0].roundid;

    await query(
      `INSERT INTO guess ("roundid", "userid", "guessLocationLat", "guessLocationLon", "distance", "points", "guessTime")
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [roundId, userId, playerLocation.lat, playerLocation.lng, distance, score]
    );

  } catch (err) {
    console.error("Błąd przy zapisie guessa:", err);
  }
  console.log("Dystans:", distance);
  console.log("Wynik:", score);

  return { distance: Math.round(distance), score };
};


exports.startRound = (lobbyId, roundTime, targetLocation, roundNumber, gameId) => {
    const sessionId =  !lobbyId || lobbyId.length > 10 ? "singleplayer" : lobbyId;

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

exports.getRoundStatus = async (lobbyId, userId) => {
    const sessionId =  lobbyId; //tu trzeba zrobić że z gameId działa a nie że każdy singleplayer to singleplayer

    const totalPoints = gameSessions[sessionId].rounds.reduce((sum, round) => sum + (round.points || 0), 0);

    console.log("sesje:", gameSessions[sessionId])
    console.log("Suma punktów:", totalPoints);

    try {
    await query(`
        INSERT INTO user_game ("userid", "gameid", "gamePoints")
        VALUES ($1, $2, $3)
        ON CONFLICT ("userid", "gameid")
        DO UPDATE SET "gamePoints" = EXCLUDED."gamePoints"
    `, [userId, sessionId, totalPoints]);

    console.log("Zapisano punkty do user_game:", { userId, gameId: sessionId, totalPoints });
    } catch (err) {
        console.error("Błąd przy zapisie do user_game:", err);
    }

    if (!gameSessions[sessionId]) return [];
    return gameSessions[sessionId].rounds;
};
