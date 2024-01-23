import express, { Express, Request, Response } from "express";
import playerRoutes from "./routes/playerRoutes";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected!");
});

app.use(express.json());

app.use("/players", playerRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
