import express from "express";
import { protect } from "../middlewares/auth";
import { getProfile, updateProfile, changePassword, deleteAccount, getAgents, updateAgentProfile } from "../controllers/user.controller";
const router = express.Router();
//routes
router.get("/user/profile", protect, getProfile);
router.put("/user/profile", protect, updateProfile);
router.put("/user/change-password", protect, changePassword);
router.delete("/user/delete", protect, deleteAccount);
router.get("/users/agents", getAgents);
router.patch("/users/agent-profile", protect, updateAgentProfile);

export default router;
