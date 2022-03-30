import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { upsertUser } from '../db/users';
import { isValidUrl } from '../utils/helpers';

const updateProfile = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const username = interaction.user.username;
  const id = interaction.user.id;
  const userUpdates: any = {
    id,
    username,
  };

  for (let i = 0; i < profileSocialOptions.length; i++) {
    const commandOption = profileSocialOptions[i];
    const optionName = commandOption.name;
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
    await upsertUser(userUpdates);

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

export const profileSocialOptions = [
  {
    name: 'twitter',
    description: `Your Twitter Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'instagram',
    description: `Your Instagram Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'youtube',
    description: `Your YouTube Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'github',
    description: `Your Github Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'twitch',
    description: `Your Twitch Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'website',
    description: `Your website Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'tiktok',
    description: `Your TikTok Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'linkedin',
    description: `Your LinkedIn Url`,
    required: false,
    type: 'STRING',
  },
  {
    name: 'polywork',
    description: `Your Polywork Url`,
    required: false,
    type: 'STRING',
  },
];

export default {
  callback: updateProfile,
  name: 'updateprofile',
  description: 'Update your profile.',
  options: profileSocialOptions,
};
