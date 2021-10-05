import {
    MessageEmbed,
    CommandInteraction,
    CommandInteractionOptionResolver,
    User,
} from 'discord.js';
import { userTable, minifyRecords } from '../utils/Airtable.js';

const getProfile = async (
    /** @type { CommandInteraction } */ interaction,
    /** @type { CommandInteractionOptionResolver } */ options
) => {
    const mentionedUser = options.getMentionable('username', false);
    /** @type { User } */
    let targetUser;
    if (!mentionedUser) {
        targetUser = interaction.user;
    } else {
        targetUser = mentionedUser.user;
    }

    console.log(`Searching for user, ${targetUser.username}`);
    try {
        await interaction.deferReply();
        const records = minifyRecords(
            await userTable
                .select({
                    maxRecords: 1,
                    filterByFormula: `{discordId} = "${targetUser.id}"`,
                })
                .firstPage()
        );

        if (records.length === 1) {
            const user = records[0];

            const embed = new MessageEmbed()
                .setAuthor(
                    `${targetUser.username}'s profile`,
                    targetUser.displayAvatarURL()
                )
                .addFields(
                    {
                        name: 'Twitter',
                        value: user?.fields?.twitter
                            ? `https://twitter.com/${user?.fields?.twitter}`
                            : 'n/a',
                    },
                    {
                        name: 'YouTube',
                        value: user?.fields?.youtube || 'n/a',
                    },
                    {
                        name: 'Website',
                        value: user?.fields?.website || 'n/a',
                    },
                    {
                        name: 'Twitch',
                        value: user?.fields?.twitch
                            ? `https://twitch.tv/${user?.fields?.twitch}`
                            : 'n/a',
                    },
                    {
                        name: 'Instagram',
                        value: user?.fields?.instagram
                            ? `https://instagram.com/${user?.fields?.instagram}`
                            : 'n/a',
                    },
                    {
                        name: 'GitHub',
                        value: user?.fields?.github
                            ? `https://github.com/${user?.fields?.github}`
                            : 'n/a',
                    }
                );

            interaction.editReply({ embeds: [embed] });
        } else {
            interaction.reply({
                content: "Couldn't find details on that user",
                ephemeral: true,
            });
        }
    } catch (err) {
        console.error(
            `Something went wrong searching for user profile: ${targetUser.username}.`
        );
        console.error(err);
        return interaction.reply({
            content: `Something went wrong searching for user profile ${targetUser.username}`,
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
            required: false,
            type: 'MENTIONABLE',
        },
    ],
};
