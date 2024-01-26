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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Player = require("../models/player");
const Match = require("../models/Match");
function findOrCreatePlayer(playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        let player = yield Player.findOne({ name: playerName });
        if (!player) {
            player = new Player({
                playerId: new mongoose_1.default.Types.ObjectId(),
                name: playerName,
                primaryPoints: 0,
                wins: 0,
                losses: 0,
                secondaryPoints: 0,
                previousOpponents: [],
                matchIds: [],
            });
            yield player.save();
        }
        return player;
    });
}
exports.addMatchResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player1, player2, rounds } = req.body;
    if (!rounds || !Array.isArray(rounds) || rounds.length !== 2) {
        return res.status(400).send("Invalid request data");
    }
    const newMatch = new Match({
        matchId: new mongoose_1.default.Types.ObjectId(),
        player1,
        player2,
        rounds,
    });
    yield newMatch.save();
    let player1Wins = 0;
    let player2Wins = 0;
    rounds.forEach((round) => {
        if (round.player1Score > round.player2Score)
            player1Wins++;
        else
            player2Wins++;
    });
    const winnerName = player1Wins > player2Wins ? player1 : player2;
    const loserName = winnerName === player1 ? player2 : player1;
    const winner = yield findOrCreatePlayer(winnerName);
    const loser = yield findOrCreatePlayer(loserName);
    winner.wins += 1;
    loser.losses += 1;
    winner.primaryPoints += 1;
    rounds.forEach((round) => {
        const scoreDifference = Math.abs(round.player1Score - round.player2Score);
        if (winnerName === player1 && round.player1Score > round.player2Score) {
            winner.secondaryPoints += scoreDifference;
            loser.secondaryPoints -= scoreDifference;
        }
        else if (winnerName === player2 &&
            round.player2Score > round.player1Score) {
            winner.secondaryPoints += scoreDifference;
            loser.secondaryPoints -= scoreDifference;
        }
    });
    winner.previousOpponents.push(loser.name);
    loser.previousOpponents.push(winner.name);
    yield winner.save();
    yield loser.save();
    res.status(200).send("Match results added successfully.");
});
exports.getRankings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield Player.find({}).sort({
            primaryPoints: -1,
            secondaryPoints: -1,
        });
        if (players.length === 0) {
            return res.status(200).send("No data found!");
        }
        res.status(200).json(players);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getPairings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const players = yield Player.find({}).sort({
            primaryPoints: -1,
            secondaryPoints: -1,
        });
        if (players.length === 0) {
            return res.status(200).send("No player data!");
        }
        let pairings = [];
        let pairedPlayers = new Set();
        for (let i = 0; i < players.length; i++) {
            if (pairedPlayers.has(players[i].playerId))
                continue;
            let foundPair = false;
            for (let j = i + 1; j < players.length; j++) {
                if (pairedPlayers.has(players[j].playerId))
                    continue;
                const pointDifference = Math.abs(players[i].primaryPoints - players[j].primaryPoints);
                const haveFacedBefore = players[i].previousOpponents.includes(players[j].playerId);
                if (pointDifference <= 10 && !haveFacedBefore) {
                    pairings.push({ player1: players[i].name, player2: players[j].name });
                    pairedPlayers.add(players[i].playerId);
                    pairedPlayers.add(players[j].playerId);
                    foundPair = true;
                    break;
                }
            }
            if (!foundPair)
                break;
        }
        if (pairings.length === 0) {
            return res.status(200).send("All players have faced each other before");
        }
        res.status(200).json(pairings);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
