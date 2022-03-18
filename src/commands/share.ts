import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { isValidUrl } from '../utils/helpers';
import ogs from 'open-graph-scraper';
import { createUser, getUserById } from '../utils/db/users';
import { createShare } from '../utils/db/shares';
import { client } from '../bot';

const shareHandler = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  await interaction.deferReply();

  const link = options.getString('link') || '';

  if (!isValidUrl(link)) {
    return interaction.editReply({
      content: `Please include a valid url.`,
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
      return interaction.editReply({
        content: `Sorry, site didn't appear to have a title property which is required for shares.`,
      });
    }
  } catch (err) {
    console.error('Something went wrong while scraping data.');
    console.error(err);
    return interaction.editReply({
      content: `Sorry, there was an issue scraping open graph data. Please make sure this site has og:title property set in the head.`,
    });
  }

  try {
    const { ogTitle: title, ogDescription: description } = ogResult;
    const imageUrl = ogResult?.ogImage?.url || null;
    //TODO: add length validation to title, description, and image
    const { id, username } = interaction.user;
    let user = await getUserById(id);
    if (!user) {
      user = await createUser(id);
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

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .addFields(
        { name: 'shareId', value: createdShare.id },
        { name: 'shareLink', value: createdShare.link },
        { name: 'sharerUsername', value: username },
        { name: 'sharerId', value: createdShare.userId }
      )
      .setThumbnail(imageUrl)
      .setAuthor(`Share from ${username}`);
    const shareReviewChannel = client.channels.cache.get(
      process.env.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL || ''
    ) as TextChannel;
    if (shareReviewChannel) {
      shareReviewChannel.send({ embeds: [embed] });
    }

    return await interaction.editReply({
      content: `Content successfully shared. Thanks!\n${link}`,
    });
  } catch (err) {
    console.error('Something went wrong in sharing to airtable.');
    console.error(err);
    return interaction.editReply({
      content: `Failed to save share record 🤷‍♂️. <@361868131997843456> should take a look!`,
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
