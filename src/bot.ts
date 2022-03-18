import { KudoCategory } from '@prisma/client';
import { Client, Intents, MessageReaction } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { giveKudos } from './utils/db/kudos';
dotenv.config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const nameToCommandMap: any = {};

client.on('ready', async () => {
  console.log('The Learn Build Teach bot is running!');
  const guildId = process.env.DISCORD_GUILD_ID || '';
  const guild = client.guilds.cache.get(guildId);
  let commands: any;

  client.application?.commands.set([]);
  guild?.commands.set([]);

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }
  const commandsDir = process.env.COMMANDS_DIR || 'commands';
  const commandsFullPath = path.join(__dirname, commandsDir);

  //TODO: handle errors
  const commandFiles = fs.readdirSync(commandsFullPath);
  const filePromises = commandFiles
    .filter(
      (commandFile) =>
        commandFile.endsWith('.js') || commandFile.endsWith('.ts')
    )
    .map((commandFile) => {
      return import(`./commands/${commandFile}`);
    });
  const loadedFiles = await Promise.all(filePromises);

  loadedFiles.forEach((loadedFile) => {
    const commandConfig = loadedFile.default;
    console.log('Loading command', commandConfig.name);
    try {
      commands.create(commandConfig);
      nameToCommandMap[commandConfig.name] = commandConfig;
    } catch (err) {
      console.error(err);
      return;
    }
  });
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (!(reaction instanceof MessageReaction)) return;
  if (reaction.message.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  const { emoji, message } = reaction;
  const { author: originalAuthor } = message;

  if (!originalAuthor || !emoji?.name) return;

  const emojisWeCareAbout = ['learn', 'build', 'teach'];
  if (emojisWeCareAbout.includes(emoji.name || '')) {
    const category: KudoCategory =
      KudoCategory[emoji.name.toUpperCase() as keyof typeof KudoCategory];
    try {
      const kudo = await giveKudos(user.id, originalAuthor.id, category);
      console.info(`Kudo given`, kudo);
    } catch (error) {
      console.error('Well, something went wrong 🤷‍♂️');
    }
  }
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  const existingCommand = nameToCommandMap[commandName];
  if (existingCommand) {
    console.info(
      `Incoming command we care about: ${commandName} from ${interaction.user.username}`
    );
    return existingCommand.callback(interaction, options);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
