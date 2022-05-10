import prisma from '.';
import type { User } from '.prisma/client';
import { getOrCreateUser } from '../utils/users';

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const addXpToUser = async (id: string) => {
  const increment = 10;
  await getOrCreateUser(id);
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      xp: { increment },
      numMessages: { increment: 1 },
    },
  });
};

export const createUser = async (id: string, username: string) => {
  return prisma.user.create({
    data: {
      id,
      username,
    },
  });
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};

export const resetUser = async (user: User) => {
  user = {
    ...user,
    username: '',
    github: '',
    twitter: '',
    twitch: '',
    youtube: '',
    website: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    polywork: '',
  };
  return upsertUser(user);
};

export const upsertUser = async (user: User) => {
  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: user,
    create: user,
  });
};
