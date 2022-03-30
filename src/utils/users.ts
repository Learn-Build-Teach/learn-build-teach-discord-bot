import { createUser, getUserById } from '../db/users';
import { discordClient } from '../utils/discord';

export const getOrCreateUser = async (id: string, username?: string) => {
  const existingUser = await getUserById(id);
  if (existingUser) {
    return existingUser;
  }
  if (!username) {
    const user = await discordClient.users.fetch(id);
    username = user.username;
  }
  const createdUser = await createUser(id, username);
  console.info({ createdUser });
  return createdUser;
};
