import { Kudo, KudoCategory, Prisma } from "@prisma/client";
import { prisma } from ".";
import { getOrCreateUser } from "./users";


export const createKudo = async (kudo: Prisma.KudoCreateInput): Promise<Kudo> => {
  return await prisma.kudo.create({
    data: kudo
  });
}

//TODO: use this logic in emoji reactions as well?
export const giveKudos = async (giverId: string, receiverId: string, category: KudoCategory, description: string): Promise<Kudo> => {

  const receivingUser = await getOrCreateUser(receiverId)

  if (!receivingUser) {
    console.error(`Failed to get or create retrieving user with id ${receiverId}`)
    throw new Error("Failed to get or create retrieving user");
  }

  const givingUser = await getOrCreateUser(giverId)

  if (!givingUser) {
    console.error(`Failed to create get or create giving user with id ${giverId} `)
    throw new Error("Failed to get or create givine user.");
  }

  const kudo: Prisma.KudoCreateInput = {
    category,
    description,
    receiver: {
      connect: {
        id: receiverId,
      },
    },
    giver: {
      connect: {
        id: giverId,
      },
    },
  }
  return await createKudo(kudo)
}