"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express = require("express");
const app = express();
dotenv_1.default.config();
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
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
