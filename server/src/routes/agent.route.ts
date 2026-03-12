import express from "express";
import { getAgents } from "../controllers/agent.controller";

const router = express.Router();

router.get("/", getAgents);

export default router;
