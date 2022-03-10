import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { isValidUrl } from '../utils/helpers';
import ogs from 'open-graph-scraper';
import { createUser, getUserById } from '../utils/db/users';
import { createShare } from '../utils/db/shares';

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
      console.info(
        "This one didn't have an open graph title property, but we'll keep it for now :)"
      );
    }
  } catch (err) {
    console.error('Something went wrong while scraping data.');
    console.error(err);
    return interaction.editReply({
      content: `Sorry, there was an issue scraping open graph data. Please make sure this site has og:title property set in the head.`,
    });
  }

  try {
    const {
      ogTitle: title,
      ogDescription: description,
      ogImage: { url: imageUrl },
    } = ogResult;
    //TODO: add length validation to title, description, and image
    const { id } = interaction.user;
    let user = await getUserById(id);
    if (!user) {
      user = await createUser(id);
    }

    await createShare({
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

    await interaction.editReply({
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
