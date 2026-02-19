import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessageByUserId,
  sendMessage,
  deleteChatPartner
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.delete("/chats", deleteChatPartner);
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage);

export default router;
