import { Server } from "socket.io";

export default (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", (data) => io.to(data.roomId).emit("newMessage", data));
    socket.on("sendProof", (data) => io.to(data.roomId).emit("newProof", data));

    socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
  });
};
