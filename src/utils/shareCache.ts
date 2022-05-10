import { Share } from '@prisma/client';
import { getRecentShares } from '../db/shares';

let shares: Share[] = [];

export const getRandomShareFromCache = async () => {
  if (!shares || shares.length === 0) {
    shares = await getRecentShares();
  }
  const randomIndex = Math.floor(Math.random() * shares.length);
  return shares[randomIndex];
};

export const addNewShareToCache = async (share: Share) => {
  shares.push(share);
};
