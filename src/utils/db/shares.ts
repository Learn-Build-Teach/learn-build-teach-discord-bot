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

export const createShare = async (
  share: Prisma.ShareCreateInput
): Promise<Share> => {
  return await prisma.share.create({
    data: share,
  });
};
