import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as messageController from "./message.controller";

const router = Router();

// Post a message in a room
router.post("/:roomId", authMiddleware, messageController.postMessage);

// Get all messages for a room
router.get("/:roomId", authMiddleware, messageController.getMessages);

export default router;
