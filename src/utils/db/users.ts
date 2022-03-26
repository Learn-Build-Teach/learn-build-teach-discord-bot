import prisma from '.';
import type { User } from '.prisma/client';
import { client } from '../../bot';

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const createUser = async (id: string, username: string = '') => {
  return await prisma.user.create({
    data: {
      id,
      username,
    },
  });
};

export const getOrCreateUser = async (id: string, username?: string) => {
  const existingUser = await getUserById(id);
  if (existingUser) {
    return existingUser;
  }
  if (!username) {
    const user = await client.users.fetch(id);
    username = user.username;
  }
  const createdUser = await createUser(id, username);
  console.info({ createdUser });
  return createdUser;
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.user.delete({
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
  return await upsertUser(user);
};

export const upsertUser = async (user: User) => {
  return await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: user,
    create: user,
  });
};
