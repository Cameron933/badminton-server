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
  const players = await Player.find({}).sort({
    primaryPoints: -1,
    secondaryPoints: -1,
  });

  let pairings: any = [];
  // Pairing logic to be implemented
  // ...

  res.status(200).json(pairings);
};
