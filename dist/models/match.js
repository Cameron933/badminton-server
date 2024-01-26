"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gameResultSchema = new mongoose_1.default.Schema({
    player1Score: Number,
    player2Score: Number,
});
const matchSchema = new mongoose_1.default.Schema({
    matchId: mongoose_1.default.Schema.Types.ObjectId,
    player1: String,
    player2: String,
    rounds: [gameResultSchema, gameResultSchema],
});
module.exports = mongoose_1.default.model("Match", matchSchema);
