import {
    CommandInteraction,
    CommandInteractionOptionResolver,
} from 'discord.js';
import { shareTable, getDiscordUserById } from '../utils/Airtable.js';
import { isValidUrl } from '../utils/Helpers.js';
import ogs from 'open-graph-scraper';

const shareHandler = async (
    /** @type {CommandInteraction} */ interaction,
    /** @type {CommandInteractionOptionResolver} */ options
) => {
    const discordId = interaction.user.id;
    await interaction.deferReply();
    try {
        const existingUser = await getDiscordUserById(discordId);
        if (!existingUser) {
            return interaction.editReply({
                content: `Before you share, please make sure to update your profile with the following flags. I will use these pieces of information to help share your content.`,
                ephemeral: true,
            });
        }
    } catch (err) {
        return console.error(err);
    }

    const link = options.getString('link');

    if (!isValidUrl(link)) {
        return interaction.editReply({
            content: `Please include a valid url.`,
        });
    }
    let ogResult;

    try {
        const data = await ogs({ url: link });
        ogResult = data.result;
        if (!ogResult.ogTitle) {
            return interaction.editReply({
                content: `Sorry, this site doesn't appear to have open graph (og) title property.`,
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
        const { ogTitle, ogDescription, ogImage } = ogResult;
        console.log(ogResult);

        //let's get the suggested tweet text if available
        let tweetText = options.getString('tweettext');

        console.log('tweet text', tweetText);

        if (tweetText && (tweetText + link).length > 230) {
            return interaction.editReply({
                content: `Make sure that the length of the tweet text and the shared link is less than 240.`,
            });
        }

        await shareTable.create([
            {
                fields: {
                    discordUser: interaction.user.username,
                    discordId: interaction.user.id,
                    link,
                    title: ogTitle,
                    ...(ogImage && { image: ogImage.url }),
                    ...(ogDescription && { description: ogDescription }),
                    tweetable: false,
                    ...(tweetText && { tweetText }),
                },
            },
        ]);
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
        {
            name: 'tweettext',
            description: `Sample text for a tweet`,
            required: false,
            type: 'STRING',
        },
    ],
};
