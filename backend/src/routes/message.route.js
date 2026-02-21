import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessageByUserId,
  sendMessage,
  deleteConversation
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessageRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.delete("/chats/:id", deleteConversation);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessageRateLimiter, sendMessage);

export default router;
