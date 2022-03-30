import { Client, Intents } from 'discord.js';

export const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

export const getDiscordUsernameById = async (id: string) => {
  const user = await discordClient.users.fetch(id);
  return user.username;
};
