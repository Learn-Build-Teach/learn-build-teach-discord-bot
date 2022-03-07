import type { Share } from "@prisma/client"
import { prisma } from "."

export const getShareToTweet = async () => {
  return await prisma.share.findFirst({
    where: {
      tweetable: true,
      tweeted: false
    }
  })
}


export const createShare = async (share: Share) => {
  return await prisma.share.create({
    data: share
  });
}