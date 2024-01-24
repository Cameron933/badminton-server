"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player = require("../models/player");
const Match = require("../models/Match");
function findOrCreatePlayer(playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        let player = yield Player.findOne({ name: playerName });
        if (!player) {
            player = yield Player.create({ name: playerName, primaryPoints: 0 });
        }
        return player;
    });
}
exports.addMatchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player1, player2, results } = req.body;
    if (!results || !Array.isArray(results)) {
        // console.log(req.body);
        return res.status(400).send("Invalid request data");
    }
    // Update Match record
    const newMatch = new Match({ player1, player2, results });
    yield newMatch.save();
    results.forEach((result) => __awaiter(void 0, void 0, void 0, function* () {
        const winner = yield findOrCreatePlayer(result.winner);
        const loser = yield findOrCreatePlayer(result.winner === player1 ? player2 : player1);
        winner.primaryPoints += 1;
        winner.secondaryPoints += result.scoreDifference;
        loser.secondaryPoints -= result.scoreDifference;
        winner.previousOpponents.push(loser.name);
        loser.previousOpponents.push(winner.name);
        yield winner.save();
        yield loser.save();
    }));
    res.status(200).send("Match results added successfully.");
});
exports.getRankings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const players = yield Player.find({}).sort({
        primaryPoints: -1,
        secondaryPoints: -1,
    });
    res.status(200).json(players);
});
exports.getPairings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield Player.find({}).sort({
            primaryPoints: -1,
            secondaryPoints: -1,
        });
        let pairings = [];
        let pairedPlayers = new Set();
        for (let i = 0; i < players.length; i++) {
            if (pairedPlayers.has(players[i].name))
                continue;
            for (let j = i + 1; j < players.length; j++) {
                if (pairedPlayers.has(players[j].name))
                    continue;
                const pointDifference = Math.abs(players[i].primaryPoints - players[j].primaryPoints);
                const haveFacedBefore = players[i].previousOpponents.includes(players[j].name);
                if (pointDifference <= 10 && !haveFacedBefore) {
                    pairings.push({ player1: players[i].name, player2: players[j].name });
                    pairedPlayers.add(players[i].name);
                    pairedPlayers.add(players[j].name);
                    break;
                }
            }
        }
        res.status(200).json(pairings);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
