import { Response } from "express";
import { AuthRequest } from "../auth/auth.types"; // adjust path
import * as roomService from "./room.service";

// Create a room
export const createRoomHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.userId; // now typed
  const { title, menu } = req.body;

  try {
    const room = await roomService.createRoom(userId!, title, menu); // ! if you are sure it's always present
    res.status(201).json({ room, roomLink: `/rooms/${room.id}` });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to create room", error: err.message });
  }
};

// Get rooms for current user
export const getRoomsHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const rooms = await roomService.getRoomsForUser(userId!);
    res.json({ rooms });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch rooms", error: err.message });
  }
};

// Join a room
export const joinRoomHandler = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { roomId } = req.body;

  try {
    const room = await roomService.joinRoom(roomId, userId!);
    res.json({ room });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to join room", error: err.message });
  }
};

// Get room by ID
export const getRoomByIdHandler = async (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;

  try {
    const room = await roomService.getRoomById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ room });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch room", error: err.message });
  }
};
