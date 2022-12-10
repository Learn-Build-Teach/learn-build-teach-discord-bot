import { getRecentShares } from '../db/shares';
import { ShareWithUsername } from '../types/types';

let shares: ShareWithUsername[] = [];

export const getRandomShareFromCache = async () => {
  if (!shares || shares.length === 0) {
    shares = await getRecentShares();
  }
  const randomIndex = Math.floor(Math.random() * shares.length);
  return shares[randomIndex];
};

export const addNewShareToCache = async (share: ShareWithUsername) => {
  shares.push(share);
};
