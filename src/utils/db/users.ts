import { prisma } from ".";
import type { User } from "@prisma/client"



export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
  });
  return user;
}

export const createUser = async (id: string, username: string = "") => {
  return await prisma.user.create({
    data: {
      id,
      username
    }
  })
}

export const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.user.delete({
    where: {
      id
    }
  })
}

export const upsertUser = async (user: User) => {
  return await prisma.user.upsert({
    where: {
      id: user.id
    },
    update: user,
    create: user
  });
}

