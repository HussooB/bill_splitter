import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import roomRoutes from "./modules/rooms/room.route";
import proofRoutes from "./modules/proofs/proof.route";
import messageRoutes from "./modules/messages/message.route";

const app = express();

// Allow requests from any origin (for development)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // optional, only needed if frontend sends cookies
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/proofs", proofRoutes);
app.use("/api/messages", messageRoutes);

export default app;
