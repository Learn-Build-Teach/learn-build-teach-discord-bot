import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { variables } from './variables';

const deployCommands = async () => {
  const commands = [];

  const commandsPath = path.join(__dirname, '../dist/commands');
  const commandFiles = readdirSync(commandsPath).filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
  );

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(variables.DISCORD_BOT_TOKEN);

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      await rest.put(
        Routes.applicationGuildCommands(
          variables.DISCORD_CLIENT_ID,
          variables.DISCORD_GUILD_ID
        ),
        { body: commands }
      );

      console.log(`Commands uploaded successfully`);
    } catch (error) {
      console.error(error);
    }
  })();
};

deployCommands();
