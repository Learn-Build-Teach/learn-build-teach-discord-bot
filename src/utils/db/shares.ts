import type { Prisma, Share } from '@prisma/client';
import { prisma } from './index';

export const getShareToTweet = async () => {
  return await prisma.share.findFirst({
    where: {
      tweetable: true,
      tweeted: false,
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
  console.log(updates);
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
