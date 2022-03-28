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

// @ts-ignore
export const getKudosLeaderboard = async (): Promise<Leader[]> => {
  const pointsStuff = await prisma.kudo.findMany({
    include: {
      receiver: {
        select: {
          username: true,
        },
      },
    },
  });
  const leaders = pointsStuff.reduce((acc, record) => {
    if (acc.has(record.receiverId)) {
      const prevValue = acc.get(record.receiverId);
      acc.set(record.receiverId, {
        id: record.receiverId,
        username: record.receiver.username || 'Unknown',
        totalPoints: (prevValue?.totalPoints || 0) + record.points,
        learnPoints:
          record.category === 'LEARN'
            ? (prevValue?.learnPoints || 0) + record.points
            : prevValue?.learnPoints || 0,
        buildPoints:
          record.category === 'BUILD'
            ? (prevValue?.buildPoints || 0) + record.points
            : prevValue?.buildPoints || 0,
        teachPoints:
          record.category === 'TEACH'
            ? (prevValue?.teachPoints || 0) + record.points
            : prevValue?.teachPoints || 0,
      });
    } else {
      acc.set(record.receiverId, {
        id: record.receiverId,
        username: record.receiver.username || 'Unknown',
        totalPoints: record.points,
        learnPoints: record.category === 'LEARN' ? record.points : 0,
        buildPoints: record.category === 'BUILD' ? record.points : 0,
        teachPoints: record.category === 'TEACH' ? record.points : 0,
      });
    }
    return acc;
  }, new Map<string, Leader>());
  return [...leaders.values()]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);
};
