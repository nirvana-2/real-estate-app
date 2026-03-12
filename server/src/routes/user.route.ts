import express from "express";
import { protect } from "../middlewares/auth";
import { getProfile, updateProfile, changePassword, deleteAccount, getAgents, updateAgentProfile } from "../controllers/user.controller";
const router = express.Router();
//routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete", protect, deleteAccount);
router.get("/agents", getAgents);
router.patch("/agent-profile", protect, updateAgentProfile);

export default router;
