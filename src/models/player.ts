import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: String,
  primaryPoints: { type: Number, default: 0 },
  secondaryPoints: { type: Number, default: 0 },
  previousOpponents: [String],
});

module.exports = mongoose.model("Player", playerSchema);
