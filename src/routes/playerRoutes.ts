import express from "express";
import { addPlayer } from "../controllers/playerController";

const router = express.Router();

router.post("/addPlayer", addPlayer);

export default router;
