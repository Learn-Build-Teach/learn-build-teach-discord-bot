import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js';
import { updateDiscordUser } from '../db/discordUser';
import { ProfileSocialConfig, SocialType } from '../types/types';
import { SlashCommand, SlashCommandHandler } from '../utils/discord';
import { getOrCreateDiscordUser } from '../utils/discordUser';
import { isValidHandle, isValidUrl } from '../utils/helpers';

const HANDLE_VALIDATION_MESSAGE = `Please enter a valid handle, not a URL, and no '@'.`;
const URL_VALIDATION_MESSAGE = 'Please enter a valid URL.';
export const socialConfigs = new Map<string, ProfileSocialConfig>([
  [
    'twitter',
    {
      validator: isValidHandle,
      validationMessage: 'Twitter: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://twitter.com/',
    },
  ],
  [
    'instagram',
    {
      validator: isValidHandle,
      validationMessage: 'Instagram: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://instagram.com/',
    },
  ],
  [
    'youtube',
    {
      validator: isValidUrl,
      validationMessage: 'YouTube: ' + URL_VALIDATION_MESSAGE,
      type: SocialType.handle,
    },
  ],
  [
    'github',
    {
      validator: isValidHandle,
      validationMessage: 'Github: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://github.com/',
    },
  ],
  [
    'twitch',
    {
      validator: isValidHandle,
      validationMessage: 'Twitch: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://twitch.tv/',
    },
  ],
  [
    'website',
    {
      validator: isValidUrl,
      validationMessage: 'Website: ' + URL_VALIDATION_MESSAGE,
      type: SocialType.URL,
    },
  ],
  [
    'tiktok',
    {
      validator: isValidHandle,
      validationMessage: 'TikTok: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://tiktok.com/@',
    },
  ],
  [
    'linkedin',
    {
      validator: isValidHandle,
      validationMessage: 'LinkedIn: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://linkedin.com/in/',
    },
  ],
  [
    'polywork',
    {
      validator: isValidHandle,
      validationMessage: 'Polywork: ' + HANDLE_VALIDATION_MESSAGE,
      type: SocialType.handle,
      urlPrefix: 'https://polywork.com/',
    },
  ],
]);

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

  for (const [socialName, socialConfig] of socialConfigs) {
    const optionValue = options.getString(socialName) || '';

    //if it wasn't passed, skip it
    if (!optionValue) continue;

    const validator = socialConfig.validator;
    if (!validator(optionValue)) {
      return interaction.reply({
        content: socialConfig.validationMessage,
        ephemeral: true,
      });
    }
    userUpdates[socialName] = optionValue;
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

for (const [socialName, socialConfig] of socialConfigs) {
  data.addStringOption((option) =>
    option
      .setName(socialName)
      .setDescription(`Your ${socialName} ${socialConfig.type}`)
      .setRequired(false)
  );
}

const command: SlashCommand = {
  data,
  execute,
};

export default command;
