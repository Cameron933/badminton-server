const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  wins: Number,
  losses: Number,
  points: Number,
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
