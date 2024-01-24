import { Request, Response } from "express";

const Player = require("../models/player");
const Match = require("../models/Match");

async function findOrCreatePlayer(playerName: string) {
  let player = await Player.findOne({ name: playerName });
  if (!player) {
    player = await Player.create({ name: playerName, primaryPoints: 0 });
  }
  return player;
}

exports.addMatchResult = async (req: Request, res: Response) => {
  const { player1, player2, results } = req.body;

  if (!results || !Array.isArray(results)) {
    // console.log(req.body);
    return res.status(400).send("Invalid request data");
  }

  // Update Match record
  const newMatch = new Match({ player1, player2, results });
  await newMatch.save();

  results.forEach(async (result: any) => {
    const winner = await findOrCreatePlayer(result.winner);
    const loser = await findOrCreatePlayer(
      result.winner === player1 ? player2 : player1
    );

    winner.primaryPoints += 1;
    winner.secondaryPoints += result.scoreDifference;
    loser.secondaryPoints -= result.scoreDifference;

    winner.previousOpponents.push(loser.name);
    loser.previousOpponents.push(winner.name);

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

        if (players[i].name === players[j].name) continue;

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
