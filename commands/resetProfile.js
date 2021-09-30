import { deleteUserRecord, getDiscordUserById } from '../utils/Airtable.js';

const resetProfile = async (interaction, options) => {
    const discordId = interaction.user.id;
    try {
        const existingUser = await getDiscordUserById(discordId);
        if (!existingUser) {
            return interaction.reply({
                content: `Unfortunately, we couldn't find your profile.`,
                ephemeral: true,
            });
        }
        await deleteUserRecord(existingUser.id);
        return interaction.reply({
            content: `Profile has been reset/deleted.`,
            ephemeral: true,
        });
    } catch (err) {
        console.error(err);
        return interaction.reply({
            content: `Something went wrong resetting your profile.`,
            ephemeral: true,
        });
    }
};

export default {
    callback: resetProfile,
    name: 'resetprofile',
    description: 'Reset your profile settings',
};
