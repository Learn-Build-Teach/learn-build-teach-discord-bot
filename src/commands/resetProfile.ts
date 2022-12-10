import { CommandInteraction } from 'discord.js';
import { getDiscordUserById, resetDiscordUser } from '../db/discordUser';

const resetProfile = async (interaction: CommandInteraction) => {
  const userId = interaction.user.id;
  try {
    const existingUser = await getDiscordUserById(userId);
    if (!existingUser) {
      return interaction.reply({
        content: `Unfortunately, we couldn't find your profile.`,
        ephemeral: true,
      });
    }
    resetDiscordUser(existingUser);
    return interaction.reply({
      content: `Profile has been reset.`,
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
