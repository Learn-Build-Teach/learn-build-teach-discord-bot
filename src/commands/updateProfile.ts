import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { upsertUser } from '../utils/db/users';
import { isValidUrl } from '../utils/helpers';

const validFlags: any = {
  twitter: {
    validate: (str: string) => !isValidUrl(str) && !str.includes('@'),
    validationMessage:
      'Please make sure you enter just your handle (no @) for Twitter',
  },
  website: {
    validate: (str: string) => isValidUrl(str),
    validationMessage:
      'Please make sure you enter a valid URL for your website.',
  },
  youtube: {
    validate: (str: string) => isValidUrl(str),
    validationMessage:
      'Please make sure you enter the full URL to your YouTube channel.',
  },
  twitch: {
    validate: (str: string) => !isValidUrl(str) && !str.includes('@'),
    validationMessage:
      'Please make sure you enter just your username (no @) for Twitch.',
  },
  instagram: {
    validate: (str: string) => !isValidUrl(str) && !str.includes('@'),
    validationMessage:
      'Please make sure you enter just your username (no @) for Instagram.',
  },
  github: {
    validate: (str: string) => !isValidUrl(str) && !str.includes('@'),
    validationMessage:
      'Please make sure you enter just your username (no @) for Github.',
  },
};

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

  const flags = Object.keys(validFlags);
  for (let i = 0; i < flags.length; i++) {
    const flagName = flags[i];
    const flagValue = options.getString(flagName);

    if (!flagValue) continue;

    if (!validFlags[flagName].validate(flagValue)) {
      console.error(`${validFlags[flagName].validationMessage}`);
      return interaction.reply({
        content: validFlags[flagName].validationMessage,
        ephemeral: true,
      });
    }

    userUpdates[flagName] = flagValue;
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

export default {
  callback: updateProfile,
  name: 'updateprofile',
  description:
    'Update your profile with your Twitter, Twitch, Github, Instagram, Website, or YouTube.',
  options: [
    {
      name: 'twitter',
      description: `Your Twitter handle (no @)`,
      required: false,
      type: 'STRING',
    },
    {
      name: 'instagram',
      description: `Your Instagram username (no @)`,
      required: false,
      type: 'STRING',
    },
    {
      name: 'youtube',
      description: `Your YouTube URL`,
      required: false,
      type: 'STRING',
    },
    {
      name: 'github',
      description: `Your Github username (no @)`,
      required: false,
      type: 'STRING',
    },
    {
      name: 'twitch',
      description: `Your Twitch username (no @)`,
      required: false,
      type: 'STRING',
    },
    {
      name: 'website',
      description: `Your website URL`,
      required: false,
      type: 'STRING',
    },
  ],
};
