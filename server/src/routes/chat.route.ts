import { Router } from "express";
import {
  getConversation,
  getConversationByPath,
  getMyConversations,
  markConversationAsRead,
  deleteConversation,
} from "../controllers/chat.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/history", protect as any, getConversation as any);
router.get("/list", protect as any, getMyConversations as any);
router.get("/conversations", protect as any, getMyConversations as any);
router.get("/:propertyId/:otherUserId", protect as any, getConversationByPath as any);
router.patch("/:propertyId/:otherUserId/read", protect as any, markConversationAsRead as any);
router.delete("/:propertyId/:otherUserId", protect as any, deleteConversation as any);

export default router;
