import { KudoCategory } from '@prisma/client';
import { Client, MessageReaction } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { giveKudos } from './utils/db/kudos';
dotenv.config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});

const nameToCommandMap: any = {};

client.on('ready', async () => {
  console.log('The Learn Build Teach bot is running!');
  const guildId = process.env.DISCORD_GUILD_ID || '';
  const guild = client.guilds.cache.get(guildId);
  let commands: any;

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
    .filter((commandFile) => commandFile.endsWith('.js') || commandFile.endsWith('.ts'))
    .map((commandFile) => {
      console.log(`${commandsFullPath}/${commandFile}`)
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
  const { emoji, message } = reaction;
  const { author: originalAuthor } = message;

  if (!originalAuthor || !emoji?.name) return;

  const emojisWeCareAbout = ['learn', 'build', 'teach'];
  if (emojisWeCareAbout.includes(emoji.name || '')) {
    const category: KudoCategory =
      KudoCategory[emoji.name.toUpperCase() as keyof typeof KudoCategory]
    try {
      const kudo = await giveKudos(user.id, originalAuthor.id, category);
      console.info(`Kudo given`, kudo);
    } catch (error) {
      console.error("Well, something went wrong 🤷‍♂️")
    }
  }

  // console.log(emoji, user);
});

client.on('interactionCreate', (interaction) => {
  console.log(interaction);
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  const existingCommand = nameToCommandMap[commandName];
  if (existingCommand) {
    return existingCommand.callback(interaction, options);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);




