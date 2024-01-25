import { Request, Response } from "express";
import mongoose from "mongoose";

const Player = require("../models/player");
const Match = require("../models/Match");

async function findOrCreatePlayer(playerName: string) {
  let player = await Player.findOne({ name: playerName });
  if (!player) {
    player = new Player({
      playerId: new mongoose.Types.ObjectId(),
      name: playerName,
      primaryPoints: 0,
      wins: 0,
      losses: 0,
      secondaryPoints: 0,
      previousOpponents: [],
      matchIds: [],
    });
    await player.save();
  }
  return player;
}

exports.addMatchResult = async (req: Request, res: Response) => {
  const { player1, player2, rounds } = req.body;

  if (!rounds || !Array.isArray(rounds) || rounds.length !== 2) {
    return res.status(400).send("Invalid request data");
  }

  const newMatch = new Match({
    matchId: new mongoose.Types.ObjectId(),
    player1,
    player2,
    rounds,
  });
  await newMatch.save();

  let player1Wins = 0;
  let player2Wins = 0;

  rounds.forEach((round) => {
    if (round.player1Score > round.player2Score) player1Wins++;
    else player2Wins++;
  });

  const winnerName = player1Wins > player2Wins ? player1 : player2;
  const loserName = winnerName === player1 ? player2 : player1;

  const winner = await findOrCreatePlayer(winnerName);
  const loser = await findOrCreatePlayer(loserName);

  winner.wins += 1;
  loser.losses += 1;
  winner.primaryPoints += 1;

  rounds.forEach((round) => {
    const scoreDifference = Math.abs(round.player1Score - round.player2Score);
    if (winnerName === player1 && round.player1Score > round.player2Score) {
      winner.secondaryPoints += scoreDifference;
      loser.secondaryPoints -= scoreDifference;
    } else if (
      winnerName === player2 &&
      round.player2Score > round.player1Score
    ) {
      winner.secondaryPoints += scoreDifference;
      loser.secondaryPoints -= scoreDifference;
    }
  });

  winner.previousOpponents.push(loser.name);
  loser.previousOpponents.push(winner.name);

  await winner.save();
  await loser.save();

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
