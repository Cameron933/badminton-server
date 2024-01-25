import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerId: mongoose.Schema.Types.ObjectId,
  name: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  primaryPoints: { type: Number, default: 0 },
  secondaryPoints: { type: Number, default: 0 },
  previousOpponents: [String],
  matchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
});

module.exports = mongoose.model("Player", playerSchema);
