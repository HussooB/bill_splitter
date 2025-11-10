import { Response } from "express";
import { AuthRequest } from "../auth/auth.types";
import * as proofService from "./proof.service";

// Upload a proof
export const uploadProof = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { roomId } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "File required" });

  try {
    const proof = await proofService.createProof(roomId, userId, file.path); // use path (Cloudinary URL)
    res.status(201).json({ proof });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to upload proof", error: err.message });
  }
};

// Get all proofs
export const getProofs = async (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;

  try {
    const proofs = await proofService.getProofs(roomId);
    res.json({ proofs });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch proofs", error: err.message });
  }
};
