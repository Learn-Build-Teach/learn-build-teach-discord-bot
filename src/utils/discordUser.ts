import { createDiscordUser, getDiscordUserById } from '../db/discordUser';
import { DiscordUser } from '../types/types';
import { discordClient } from './discord';

export const getOrCreateDiscordUser = async (
  id: string,
  username?: string
): Promise<DiscordUser> => {
  const existingUser = await getDiscordUserById(id);
  if (existingUser) {
    return existingUser;
  }
  if (!username) {
    const user = await discordClient.users.fetch(id);
    username = user.username;
  }
  const createdUser = await createDiscordUser(id, username);
  return createdUser;
};
