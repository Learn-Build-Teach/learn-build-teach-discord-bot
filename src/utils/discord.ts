import {
  Channel,
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Guild,
  IntentsBitField,
  Partials,
  SlashCommandBuilder,
} from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { variables } from '../variables';

export default class DiscordClient extends Client {
  commands: Collection<any, any>; // use correct type :)
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.loadCommands();
  }
  async loadCommands() {
    this.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = readdirSync(commandsPath).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { default: command } = await import(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.info(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

export type SlashCommandHandler = (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => any | Promise<any>;

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: SlashCommandHandler;
}

export const discordClient = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
  ],
});

export const getDiscordUsernameById = async (id: string) => {
  const user = await discordClient.users.fetch(id);
  return user.username;
};

export const getDiscordGuild = async (): Promise<Guild | undefined> => {
  try {
    const guildId = variables.DISCORD_GUILD_ID || '';
    let guild = discordClient.guilds.cache.get(guildId);
    if (!guild) {
      guild = await discordClient.guilds.fetch(guildId);
    }
    return guild;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const getDiscordChannel = async (
  channelID: string
): Promise<Channel | null> => {
  const channelFromCache = await discordClient.channels.cache.get(channelID);
  if (channelFromCache) return channelFromCache;

  return await discordClient.channels.fetch(channelID);
};
