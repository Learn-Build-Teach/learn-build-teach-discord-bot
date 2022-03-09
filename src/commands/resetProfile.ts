import {
  CommandInteraction,
} from 'discord.js';
import { getUserById, resetUser } from '../utils/db/users';

const resetProfile = async (
  interaction: CommandInteraction,
) => {
  const discordId = interaction.user.id;
  try {
    let existingUser = await getUserById(discordId);
    if (!existingUser) {
      return interaction.reply({
        content: `Unfortunately, we couldn't find your profile.`,
        ephemeral: true,
      });
    }
    resetUser(existingUser);
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
