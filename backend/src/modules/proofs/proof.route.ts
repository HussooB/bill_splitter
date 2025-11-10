import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as proofController from "./proof.controller";
import { upload } from "../../config/cloudinary"; // updated import

const router = Router();

// Upload a proof (image/file)
router.post("/:roomId", authMiddleware, upload.single("file"), proofController.uploadProof);

// Get all proofs in a room
router.get("/:roomId", authMiddleware, proofController.getProofs);

export default router;
