import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { deleteUser, getUserById } from '../utils/db/users';

const resetProfile = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const discordId = interaction.user.id;
  try {
    const existingUser = await getUserById(discordId);
    if (!existingUser) {
      return interaction.reply({
        content: `Unfortunately, we couldn't find your profile.`,
        ephemeral: true,
      });
    }
    await deleteUser(existingUser.id);
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
