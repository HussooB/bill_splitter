import prisma from "../../prisma/client";

export const createMessage = async (roomId: string, userId: number, text: string) => {
  return prisma.message.create({
    data: { roomId, senderId: userId, text },
    include: { sender: true }
  });
};

export const getMessages = async (roomId: string) => {
  return prisma.message.findMany({
    where: { roomId },
    include: { sender: true },
    orderBy: { createdAt: "asc" }
  });
};
