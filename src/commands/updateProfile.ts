import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js';
import { updateDiscordUser } from '../db/discordUser';
import { SlashCommand, SlashCommandHandler } from '../utils/discord';
import { getOrCreateDiscordUser } from '../utils/discordUser';
import { isValidUrl } from '../utils/helpers';

export const socials = [
  'twitter',
  'instagram',
  'youtube',
  'github',
  'twitch',
  'website',
  'tiktok',
  'linkedin',
  'polywork',
];

const execute: SlashCommandHandler = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const username = interaction.user.username;
  const id = interaction.user.id;
  const userUpdates: any = {
    id,
    username,
  };

  for (let i = 0; i < socials.length; i++) {
    const optionName = socials[i];
    const optionValue = options.getString(optionName) || '';

    //if it wasn't passed, skip it
    if (!optionValue) continue;

    if (!isValidUrl(optionValue)) {
      return interaction.reply({
        content: `Please enter a valid url for your ${optionName} account.`,
        ephemeral: true,
      });
    }
    userUpdates[optionName] = optionValue;
  }
  try {
    await getOrCreateDiscordUser(id, username);
    await updateDiscordUser(id, userUpdates);

    interaction.reply({
      content: 'Profile updated successfully 🔥',
      ephemeral: true,
    });
  } catch (err) {
    console.error('Something went wrong while trying to update profile.');
    console.error(err);
    interaction.reply({
      content:
        '`Sorry, something went wrong. We failed to update your profile.`',
      ephemeral: true,
    });
  }
};

const data = new SlashCommandBuilder()
  .setName('updateprofile')
  .setDescription('Update your profile');

socials.forEach((social) => {
  data.addStringOption((option) =>
    option
      .setName(social)
      .setDescription(`Your ${social} Url`)
      .setRequired(false)
  );
});

const command: SlashCommand = {
  data,
  execute,
};

export default command;
