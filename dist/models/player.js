"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const playerSchema = new mongoose_1.default.Schema({
    playerId: mongoose_1.default.Schema.Types.ObjectId,
    name: String,
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    primaryPoints: { type: Number, default: 0 },
    secondaryPoints: { type: Number, default: 0 },
    previousOpponents: [String],
    matchIds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Match" }],
});
module.exports = mongoose_1.default.model("Player", playerSchema);
