import { Request, Response } from "express";

const Player = require("../models/Player");
const Match = require("../models/Match");

exports.addMatchResult = async (req: Request, res: Response) => {
  const { player1, player2, results } = req.body;

  // Update Match record
  const newMatch = new Match({ player1, player2, results });
  await newMatch.save();

  // Update Player records
  results.forEach(async (result: any) => {
    const winner = await Player.findOne({ name: result.winner });
    const loser = await Player.findOne({
      name: result.winner === player1 ? player2 : player1,
    });

    // Update primary points
    winner.primaryPoints += 1;

    // Update secondary points
    winner.secondaryPoints += result.scoreDifference;
    loser.secondaryPoints -= result.scoreDifference;

    // Save updates
    await winner.save();
    await loser.save();
  });

  res.status(200).send("Match results added successfully.");
};

exports.getRankings = async (req: Request, res: Response) => {
  const players = await Player.find({}).sort({
    primaryPoints: -1,
    secondaryPoints: -1,
  });
  res.status(200).json(players);
};

exports.getPairings = async (req: Request, res: Response) => {
  try {
    const players = await Player.find({}).sort({
      primaryPoints: -1,
      secondaryPoints: -1,
    });
    let pairings = [];
    let pairedPlayers = new Set();

    for (let i = 0; i < players.length; i++) {
      if (pairedPlayers.has(players[i].name)) continue;

      for (let j = i + 1; j < players.length; j++) {
        if (pairedPlayers.has(players[j].name)) continue;

        const pointDifference = Math.abs(
          players[i].primaryPoints - players[j].primaryPoints
        );
        const haveFacedBefore = players[i].previousOpponents.includes(
          players[j].name
        );

        if (pointDifference <= 10 && !haveFacedBefore) {
          pairings.push({ player1: players[i].name, player2: players[j].name });
          pairedPlayers.add(players[i].name);
          pairedPlayers.add(players[j].name);
          break;
        }
      }
    }

    res.status(200).json(pairings);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
