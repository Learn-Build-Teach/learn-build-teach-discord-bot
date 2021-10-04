import {
    CommandInteraction,
    CommandInteractionOptionResolver,
} from 'discord.js';
import { userTable, minifyRecords } from '../utils/Airtable.js';

const getProfile = async (
    /** @type {CommandInteraction} */ interaction,
    /** @type {CommandInteractionOptionResolver} */ options
) => {
    let targetUser = options.getMentionable('username', true);
    console.log(`Searching for user, ${targetUser.user.username}`);
    try {
        await interaction.deferReply();
        const records = minifyRecords(
            await userTable
                .select({
                    maxRecords: 1,
                    filterByFormula: `{discordId} = "${targetUser.user.id}"`,
                })
                .firstPage()
        );

        if (records.length === 1) {
            const user = records[0];
            const content = `${targetUser.user.username}'s Profile
                Twitter - https://twitter.com/${user?.fields?.twitter || 'n/a'}
                YouTube - ${user?.fields?.youtube || 'n/a'}
                Website - ${user?.fields?.website || 'n/a'}
                Twitch - https://twitch.tv/${user?.fields?.twitch || 'n/a'}
                Instagram - https://instagram.com/${
                    user?.fields?.instagram || 'n/a'
                }
                Github - https://github.com/${user?.fields?.github || 'n/a'}
                `;

            interaction.editReply({ content, ephemeral: true });
        } else {
            interaction.reply({
                content: "Couldn't find details on that user",
                ephemeral: true,
            });
        }
    } catch (err) {
        console.error(
            `Something went wrong searching for user profile: ${targetUser.user.username}.`
        );
        console.error(err);
        return interaction.reply({
            content: `Something went wrong searching for user profile ${targetUser.user.username}`,
            ephemeral: true,
        });
    }
};

export default {
    callback: getProfile,
    name: 'profile',
    description: "Get a user's profile details",
    options: [
        {
            name: 'username',
            description: `Tag the user you are looking for.`,
            required: true,
            type: 'MENTIONABLE',
        },
    ],
};
