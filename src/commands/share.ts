import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { isValidUrl } from '../utils/helpers';
import ogs from 'open-graph-scraper';
import { EMOJI_NAMES } from '../consts';
import { getOrCreateDiscordUser } from '../utils/discordUser';
import { createShare, uploadShareImageFromRemoteURL } from '../db/shares';
import {
  discordClient,
  SlashCommand,
  SlashCommandHandler,
} from '../utils/discord';
import { addNewShareToCache } from '../utils/shareCache';
import { variables } from '../variables';

const execute: SlashCommandHandler = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const link = options.getString('link') || '';
  if (!isValidUrl(link)) {
    return interaction.reply({
      content: `Please include a valid url.`,
      ephemeral: true,
    });
  }
  let ogResult;

  try {
    const data: any = await ogs({ url: link });
    ogResult = data.result;
    if (!ogResult.ogTitle) {
      console.info(
        "This one didn't have an open graph title property which is required for shares."
      );
      return interaction.reply({
        content: `Sorry, site didn't appear to have a title property which is required for shares.`,
        ephemeral: true,
      });
    }
  } catch (err) {
    console.error('Something went wrong while scraping data.');
    console.error(err);
    return interaction.reply({
      content: `Sorry, there was an issue scraping open graph data. Please make sure this site has og:title property set in the head.`,
      ephemeral: true,
    });
  }

  try {
    const { ogTitle: title, ogDescription: description } = ogResult;
    const imageUrl = ogResult?.ogImage?.url || null;
    //TODO: add length validation to title, description, and image
    const { id, username } = interaction.user;
    const user = await getOrCreateDiscordUser(id, username);
    if (!user) {
      return interaction.reply({
        content: `Failed to retrieve existing user or create a new one`,
        ephemeral: true,
      });
    }

    if (!user.username) {
      return interaction.reply({
        content: `Please update your username using the "/updateProfile" command before attempting to share.`,
        ephemeral: true,
      });
    }

    let storageBucketPath;
    if (imageUrl) {
      try {
        storageBucketPath = await uploadShareImageFromRemoteURL(imageUrl);
      } catch (err) {
        console.error(err);
      }
    }

    const createdShare = await createShare({
      discordUserId: user.id,
      link,
      title,
      imageUrl,
      storageBucketPath,
      description,
      tweetable: false,
      tweeted: false,
      emailable: false,
      emailed: false,
    });
    addNewShareToCache(createdShare);
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description || '')
      .addFields(
        { name: 'shareId', value: createdShare.id },
        { name: 'shareLink', value: createdShare.link },
        { name: 'sharerUsername', value: username }
      )
      .setThumbnail(imageUrl)
      .setAuthor({ name: `Share from ${username}` });
    const shareReviewChannel = discordClient.channels.cache.get(
      variables.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL || ''
    ) as TextChannel;
    if (shareReviewChannel) {
      shareReviewChannel
        .send({ embeds: [embed] })
        .then(function (message) {
          message.react(EMOJI_NAMES.APPROVE_EMOJI);
          message.react(EMOJI_NAMES.EMAIL_APPROVED_EMOJI);
          message.react(EMOJI_NAMES.TWITTER_APPROVED_EMOJI);
          message.react(EMOJI_NAMES.REJECT_EMOJI);
        })
        .catch(function (err) {
          console.error('Error reacting to message.');
          console.error(err);
        });
    }

    return interaction.reply({
      content: `Content successfully shared. \n${link}`,
    });
  } catch (err) {
    console.error('Something went wrong in sharing the record.');
    console.error(err);
    return interaction.reply({
      content: `Failed to save share record 🤷‍♂️. <@361868131997843456> should take a look!`,
      ephemeral: true,
    });
  }
};

const data = new SlashCommandBuilder()
  .setName('share')
  .setDescription('Share a piece of content that YOU created.');
data.addStringOption((option) =>
  option
    .setName('link')
    .setDescription(`Link to your content`)
    .setRequired(true)
);

const command: SlashCommand = {
  data,
  execute,
};

export default command;
