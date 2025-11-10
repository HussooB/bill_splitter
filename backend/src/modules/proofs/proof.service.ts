import prisma from "../../prisma/client";

export const createProof = async (roomId: string, userId: number, fileUrl: string) => {
  return prisma.paymentProof.create({
    data: { roomId, senderId: userId, fileUrl },
    include: { sender: true },
  });
};

export const getProofs = async (roomId: string) => {
  return prisma.paymentProof.findMany({
    where: { roomId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
};
