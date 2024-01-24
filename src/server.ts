import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const tournamentRoutes = require("./routes/tournamentRoutes");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected!");
});

app.use(express.json());

app.use("/players", tournamentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
