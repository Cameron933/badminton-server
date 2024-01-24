import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  results: [
    {
      winner: String,
      scoreDifference: Number,
    },
  ],
});

module.exports = mongoose.model("Match", matchSchema);
