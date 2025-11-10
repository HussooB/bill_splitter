import prisma from "../../prisma/client";

export const createRoom = async (userId: number, title: string, menu: { name: string; price: number; photoUrl?: string }[]) => {
  const room = await prisma.room.create({
    data: {
      title,
      creatorId: userId,
      menu: {
        create: menu
      }
    },
    include: {
      menu: true,
      participants: true
    }
  });

  return room;
};

export const getRoomsForUser = async (userId: number) => {
  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { participants: { some: { id: userId } } }
      ]
    },
    include: {
      participants: true,
      menu: true
    }
  });

  return rooms;
};

export const joinRoom = async (roomId: string, userId: number) => {
  const room = await prisma.room.update({
    where: { id: roomId },
    data: {
      participants: {
        connect: { id: userId }
      }
    },
    include: {
      participants: true,
      menu: true
    }
  });

  return room;
};

export const getRoomById = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      participants: true,
      menu: true,
      messages: true,
      proofs: true,
      creator: true
    }
  });

  return room;
};
