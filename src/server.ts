import { Express, Request, Response } from "express";
import dotenv from "dotenv";

const express = require("express");
const app: Express = express();

dotenv.config();

const cors = require("cors");
const tournamentRoutes = require("./routes/tournamentRoutes");
app.use(cors());

app.use(express.json());
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected!");
});

app.use(tournamentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
