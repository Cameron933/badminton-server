import mongoose from "mongoose";

const gameResultSchema = new mongoose.Schema({
  player1Score: Number,
  player2Score: Number,
});

const matchSchema = new mongoose.Schema({
  matchId: mongoose.Schema.Types.ObjectId,
  player1: String,
  player2: String,
  rounds: [gameResultSchema, gameResultSchema],
});

module.exports = mongoose.model("Match", matchSchema);
