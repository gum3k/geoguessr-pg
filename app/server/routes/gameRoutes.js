const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const authenticate = require("../utils/authenticate");
const { query } = require('..//database');

router.post("/game/submit-guess", gameController.submitGuess);
router.post("/game/start-round", gameController.startRound);
router.get("/game/round-info/:lobbyId", authenticate, gameController.getRoundStatus);
router.delete("/game/round-info/:lobbyId", gameController.endGame);
router.post('/game/create-game', authenticate, async (req, res) => {
  const { roundAmount, timePerRound, mapName } = req.body;
  const userId = req.user.id;

  try {
    // 1. Tworzenie gry
    const result = await query(`
      INSERT INTO game ("roundAmount", "timePerRound", "mapName")
      VALUES ($1, $2, $3)
      RETURNING gameid
    `, [roundAmount, timePerRound, mapName]);

    const gameId = result.rows[0].gameid;

    // 2. Dodanie do user_game
    await query(`
      INSERT INTO user_game ("userid", "gameid", "gamePoints")
      VALUES ($1, $2, 0)
    `, [userId, gameId]);

    return res.status(201).json({ gameId });
  } catch (err) {
    console.error("Błąd przy tworzeniu gry:", err);
    return res.status(500).json({ message: "Nie udało się utworzyć gry" });
  }
});

router.post('/game/add-round', authenticate, async (req, res) => {
  const { gameId, roundNumber, lat, lon } = req.body;

  try {
    await query(`
      INSERT INTO round ("roundid", "gameid", "roundNumber", "targetLocationLat", "targetLocationLon")
      VALUES (gen_random_uuid(), $1, $2, $3, $4)
    `, [gameId, roundNumber, lat, lon]);

    res.status(201).json({ message: "Round added" });
  } catch (err) {
    console.error("Insert round error:", err);
    res.status(500).json({ error: "Database error" });
  }
});



module.exports = router;
