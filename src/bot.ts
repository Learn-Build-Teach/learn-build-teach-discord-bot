import { KudoCategory } from '@prisma/client';
import { EmbedField, MessageReaction } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BUILD_EMOJI_NAME, LEARN_EMOJI_NAME, TEACH_EMOJI_NAME } from './consts';
import { giveKudos } from './db/kudos';
import { reviewShare } from './db/shares';
import { discordClient } from './utils/discord';

dotenv.config();

const nameToCommandMap: any = {};

discordClient.on('ready', async () => {
  console.info('The Learn Build Teach bot is running!');
  const guildId = process.env.DISCORD_GUILD_ID || '';
  const guild = discordClient.guilds.cache.get(guildId);
  let commands: any;

  //Don't do this in testing because you'll use your max number of registered commands 🥰
  if (process.env.NODE_ENV === 'production') {
    discordClient.application?.commands.set([]);
    guild?.commands.set([]);
  }

  if (guild) {
    commands = guild.commands;
  } else {
    commands = discordClient.application?.commands;
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
    console.info('Loading command', commandConfig.name);
    try {
      commands.create(commandConfig);
      nameToCommandMap[commandConfig.name] = commandConfig;
    } catch (err) {
      console.error(err);
      return;
    }
  });
});

discordClient.on('messageReactionAdd', async (reaction, user) => {
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
  const { author: originalAuthor, channelId } = message;

  const APPROVE_EMOJI = '✅';
  const REJECT_EMOJI = '❌';
  const EMAIL_APPROVED_EMOJI = '📧';
  const TWITTER_APPROVED_EMOJI = '🐦';

  if (!originalAuthor || !emoji?.name) return;
  if (message.author?.bot) return;
  if (user.id === originalAuthor.id) {
    console.info(
      `${user.username} tried to give themselves a kudo, but they can't!`
    );
    return;
  }

  //Handle Kudos
  const kudoEmojis = [LEARN_EMOJI_NAME, BUILD_EMOJI_NAME, TEACH_EMOJI_NAME];
  if (kudoEmojis.includes(emoji.name || '')) {
    const category: KudoCategory =
      KudoCategory[emoji.name.toUpperCase() as keyof typeof KudoCategory];
    try {
      const kudo = await giveKudos(user.id, originalAuthor.id, category);
      console.info(`Kudo given`, kudo);
    } catch (error) {
      console.error('Well, something went wrong 🤷‍♂️');
    }
  }

  //Handle Share Approvals
  if (channelId === process.env.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL) {
    const messageEmbed = message?.embeds[0];
    if (!messageEmbed) return;

    const shareInfo = messageEmbed.fields.reduce(
      (acc: any, cur: EmbedField) => {
        acc[cur.name] = cur.value;
        return acc;
      },
      {}
    );

    if (!shareInfo.shareId) {
      console.info('Emoji reaction on a message without a share id');
      return;
    }

    if (emoji.name === APPROVE_EMOJI) {
      await reviewShare(shareInfo.shareId, true, true);
      reaction.message.channel.send(
        `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Twitter and Email.`
      );
    } else if (emoji.name === EMAIL_APPROVED_EMOJI) {
      await reviewShare(shareInfo.shareId, true, undefined);
      reaction.message.channel.send(
        `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Email.`
      );
    } else if (emoji.name === TWITTER_APPROVED_EMOJI) {
      await reviewShare(shareInfo.shareId, undefined, true);
      reaction.message.channel.send(
        `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Twitter.`
      );
    } else if (emoji.name === REJECT_EMOJI) {
      await reviewShare(shareInfo.shareId, false, false);
      reaction.message.channel.send(
        `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} rejected for Twitter and Email.`
      );
    }
  }
});

discordClient.on('interactionCreate', (interaction) => {
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

discordClient.login(process.env.DISCORD_BOT_TOKEN);
