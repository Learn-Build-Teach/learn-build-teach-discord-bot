import { EmbedField, Message, MessageReaction } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { EMOJI_NAMES, kudoEmojis } from './consts';
import { giveKudos } from './db/kudos';
import { markShareAsEmailed, updateShare } from './db/shares';
import { addXpToDiscordUser } from './db/discordUser';
import { KudoCategory } from './types/types';
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
  if (user.bot) return;

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

  if (!originalAuthor || !emoji?.name) return;

  //Handle Kudos
  if (kudoEmojis.includes(emoji.name || '')) {
    if (user.id === originalAuthor.id) {
      console.info(
        `${user.username} tried to give themselves a kudo, but they can't!`
      );
      return;
    }

    const category: KudoCategory =
      KudoCategory[emoji.name.toUpperCase() as keyof typeof KudoCategory];
    try {
      const kudo = await giveKudos(user.id, originalAuthor.id, category);
      console.info(`Kudo given`, kudo);
    } catch (error) {
      console.error(error);
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

    let actionMessage;
    if (!shareInfo.shareId) {
      actionMessage = 'Emoji reaction on a message without a share id';
    } else if (emoji.name === EMOJI_NAMES.APPROVE_EMOJI) {
      await updateShare(shareInfo.shareId, {
        emailable: true,
        tweetable: true,
      });
      actionMessage = `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Twitter and Email.`;
    } else if (emoji.name === EMOJI_NAMES.EMAIL_APPROVED_EMOJI) {
      await updateShare(shareInfo.shareId, { emailable: true });
      actionMessage = `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Email.`;
    } else if (emoji.name === EMOJI_NAMES.TWITTER_APPROVED_EMOJI) {
      await updateShare(shareInfo.shareId, { tweetable: true });
      actionMessage = `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} approved for Twitter.`;
    } else if (emoji.name === EMOJI_NAMES.REJECT_EMOJI) {
      await updateShare(shareInfo.shareId, {
        emailable: false,
        tweetable: false,
      });
      actionMessage = `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} rejected for Twitter and Email.`;
    } else if (emoji.name === EMOJI_NAMES.EMAIL_SENT_EMOJI) {
      await markShareAsEmailed(shareInfo.shareId);
      actionMessage = `Share ${shareInfo.shareId} from ${shareInfo.sharerUsername} was marked as emailed.`;
    }
    if (actionMessage) {
      console.info(actionMessage);
      reaction.message.channel.send(actionMessage);
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

discordClient.on('message', async (message: Message) => {
  const userId = message?.author.id;
  if (!userId) return;
  try {
    await addXpToDiscordUser(userId);
    console.info(`Added xp to user: ${userId}`);
  } catch (err) {
    console.error(err);
  }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
