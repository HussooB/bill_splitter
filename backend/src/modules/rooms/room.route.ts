import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as roomController from "./room.controller";

const router = Router();

// Auth required
router.post("/", authMiddleware, roomController.createRoomHandler);
router.get("/", authMiddleware, roomController.getRoomsHandler);
router.post("/join", authMiddleware, roomController.joinRoomHandler);
router.get("/:roomId", authMiddleware, roomController.getRoomByIdHandler);

export default router;
