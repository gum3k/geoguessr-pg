const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post("/game/submit-guess", gameController.submitGuess);
router.post("/game/start-round", gameController.startRound);
router.get("/game/round-info/:lobbyId", gameController.getRoundStatus);
router.delete("/game/round-info/:lobbyId", gameController.endGame);

module.exports = router;
