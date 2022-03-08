import type { Prisma, Share } from "@prisma/client"
import { prisma } from "./index"

export const getShareToTweet = async () => {
  return await prisma.share.findFirst({
    where: {
      tweetable: true,
      tweeted: false
    }
  })
}


export const createShare = async (share: Prisma.ShareCreateInput): Promise<Share> => {
  return await prisma.share.create({
    data: share
  });
}
