import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { isValidUrl } from '../utils/helpers';
import ogs from 'open-graph-scraper';
import { getOrCreateUser } from '../utils/users';
import { createShare } from '../db/shares';
import { discordClient } from '../utils/discord';
import { addNewShareToCache } from '../utils/shareCache';

const shareHandler = async (
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
      //?Title is required for db record...should it be?
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
    const user = await getOrCreateUser(id, username);
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

    const createdShare = await createShare({
      user: {
        connect: {
          id,
        },
      },
      link,
      title,
      imageUrl,
      description,
      tweetable: false,
      tweeted: false,
      emailable: false,
      emailed: false,
    });
    addNewShareToCache(createdShare);

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description || '')
      .addFields(
        { name: 'shareId', value: createdShare.id },
        { name: 'shareLink', value: createdShare.link },
        { name: 'sharerUsername', value: username },
        { name: 'sharerId', value: createdShare.userId }
      )
      .setThumbnail(imageUrl)
      .setAuthor(`Share from ${username}`);
    const shareReviewChannel = discordClient.channels.cache.get(
      process.env.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL || ''
    ) as TextChannel;
    console.log(shareReviewChannel);
    if (shareReviewChannel) {
      shareReviewChannel
        .send({ embeds: [embed] })
        .then(function (message) {
          message.react('✅');
          message.react('❌');
          message.react('📧');
          message.react('🐦');
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

export default {
  callback: shareHandler,
  name: 'share',
  description: 'Share a link to a piece of content that you created.',
  options: [
    {
      name: 'link',
      description: `Link to your content`,
      required: true,
      type: 'STRING',
    },
  ],
};
