import { Request, Response } from "express";
const Player = require("./models/player");

export const addPlayer = async (req: Request, res: Response) => {
  try {
    const newPlayer = new Player({
      name: req.body.name,
      wins: req.body.wins,
      losses: req.body.losses,
      points: req.body.points,
    });
    await newPlayer.save();
    res.status(201).send(newPlayer);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
