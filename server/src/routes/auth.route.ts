import express from "express";
import { register, login, logout, changePassword,getMe } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/changePassword", protect, changePassword);
router.get("/me", protect, getMe);


export default router;
