import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
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
  const commandsDir = process.env.COMMANDS_DIR || '';
  console.log({ commandsDir })
  //TODO: handle errors
  const commandFiles = fs.readdirSync(commandsDir);

  const filePromises = commandFiles
    .filter((commandFile) => commandFile.endsWith('.ts'))
    .map((commandFile) => {
      console.log(`${commandsDir}/${commandFile}`)
      return import(`${commandsDir}/${commandFile}`);
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

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  const existingCommand = nameToCommandMap[commandName];
  if (existingCommand) {
    return existingCommand.callback(interaction, options);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
