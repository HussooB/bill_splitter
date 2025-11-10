import { Response } from "express";
import { AuthRequest } from "../auth/auth.types";
import * as messageService from "./message.service";

// Post a new message
export const postMessage = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { roomId } = req.params;
  const { text } = req.body;

  try {
    const message = await messageService.createMessage(roomId, userId, text);
    res.status(201).json({ message });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

// Get all messages for a room
export const getMessages = async (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;

  try {
    const messages = await messageService.getMessages(roomId);
    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};
