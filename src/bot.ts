import { APIEmbedField, Events, Message, MessageReaction } from 'discord.js';
import dotenv from 'dotenv';
import { EMOJI_NAMES, kudoEmojis } from './consts';
import { giveKudos } from './db/kudos';
import { markShareAsEmailed, updateShare } from './db/shares';
import { addXpToDiscordUser } from './db/discordUser';
import { KudoCategory } from './types/types';
import { discordClient } from './utils/discord';
import { variables } from './variables';
dotenv.config();

discordClient.on('ready', async () => {
  console.info('The Learn Build Teach bot is running!');
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

  if (channelId === variables.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL) {
    const EmbedBuilder = message?.embeds[0];
    if (!EmbedBuilder) return;

    const shareInfo = EmbedBuilder.fields.reduce(
      (acc: any, cur: APIEmbedField) => {
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

discordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = discordClient.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, interaction.options);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
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

export const startBot = async () => {
  discordClient.login(variables.DISCORD_BOT_TOKEN);
};
