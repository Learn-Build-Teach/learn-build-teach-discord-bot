import { Kudo, KudoCategory, Prisma } from '@prisma/client';
import prisma from '.';
import { Leader } from '../../commands/kudosLeaderboard';
import { getOrCreateUser } from './users';

export const createKudo = async (
  kudo: Prisma.KudoCreateInput
): Promise<Kudo> => {
  return await prisma.kudo.create({
    data: kudo,
  });
};

export const giveKudos = async (
  giverId: string,
  receiverId: string,
  category: KudoCategory,
  description?: string
): Promise<Kudo> => {
  const receivingUser = await getOrCreateUser(receiverId);

  if (!receivingUser) {
    console.error(
      `Failed to get or create retrieving user with id ${receiverId}`
    );
    throw new Error('Failed to get or create retrieving user');
  }

  const givingUser = await getOrCreateUser(giverId);

  if (!givingUser) {
    console.error(
      `Failed to create get or create giving user with id ${giverId} `
    );
    throw new Error('Failed to get or create givine user.');
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
  };
  return await createKudo(kudo);
};

export const getKudosLeaderboard = async (): Promise<Leader[]> => {
  //? I don't know how to get everything (points + username) in one query...
  const pointsStuff = await prisma.kudo.groupBy({
    by: ['receiverId'],
    _sum: {
      points: true,
    },
    orderBy: {
      _count: {
        points: 'desc',
      },
    },
    take: 10,
  });

  const userIds = pointsStuff.map((record) => record.receiverId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      username: true,
      id: true,
    },
  });

  const leaders: Leader[] = pointsStuff.map((record, i) => ({
    id: record.receiverId || '',
    points: record._sum.points || 0,
    username: users[i].username || '',
  }));
  return leaders;
};
