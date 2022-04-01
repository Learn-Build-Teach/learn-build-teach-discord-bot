import type { Prisma, Share } from '@prisma/client';
import prisma from './index';

export const getShareToTweet = async () => {
  return await prisma.share.findFirst({
    where: {
      tweetable: true,
      tweeted: false,
    },
  });
};

export const getRecentShares = async (limit: number) => {
  return await prisma.share.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
};

export const markShareAsTweeted = async (id: string) => {
  return await prisma.share.update({
    where: {
      id,
    },
    data: {
      tweeted: true,
    },
  });
};

export const reviewShare = async (
  id: string,
  emailable?: boolean,
  tweetable?: boolean
) => {
  const updates: any = {};
  if (emailable !== undefined) {
    updates.emailable = emailable;
  }
  if (tweetable !== undefined) {
    updates.tweetable = tweetable;
  }
  return await prisma.share.update({
    where: {
      id,
    },
    data: updates,
  });
};

export const createShare = async (
  share: Prisma.ShareCreateInput
): Promise<Share> => {
  return await prisma.share.create({
    data: share,
  });
};
