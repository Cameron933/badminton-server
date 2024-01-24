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
const Player = require("../models/Player");
const Match = require("../models/Match");
exports.addMatchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player1, player2, results } = req.body;
    // Update Match record
    const newMatch = new Match({ player1, player2, results });
    yield newMatch.save();
    // Update Player records
    results.forEach((result) => __awaiter(void 0, void 0, void 0, function* () {
        const winner = yield Player.findOne({ name: result.winner });
        const loser = yield Player.findOne({
            name: result.winner === player1 ? player2 : player1,
        });
        // Update primary points
        winner.primaryPoints += 1;
        // Update secondary points
        winner.secondaryPoints += result.scoreDifference;
        loser.secondaryPoints -= result.scoreDifference;
        // Save updates
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
    const players = yield Player.find({}).sort({
        primaryPoints: -1,
        secondaryPoints: -1,
    });
    let pairings = [];
    // Pairing logic to be implemented
    // ...
    res.status(200).json(pairings);
});
