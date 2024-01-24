const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");

router.post("/matches", tournamentController.addMatchResult);
router.get("/rankings", tournamentController.getRankings);
router.get("/pairings", tournamentController.getPairings);

module.exports = router;
