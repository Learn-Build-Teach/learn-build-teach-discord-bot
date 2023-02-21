import {
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  SlashCommandBuilder,
  EmbedField,
} from 'discord.js';
import { SlashCommand } from '../utils/discord';

import { getOrCreateDiscordUser } from '../utils/discordUser';
import { socialConfigs } from './updateProfile';

//defining user as type any so we can dynamically pull values
const createUserProfileFields = (user: any): EmbedField[] => {
  const fields: EmbedField[] = [];
  for (const [socialName, socialConfig] of socialConfigs) {
    const optionName = socialName;
    if (user[optionName]) {
      fields.push({
        name: optionName.toUpperCase(),
        value: (socialConfig.urlPrefix || '') + user[optionName],
        inline: false,
      });
    }
  }
  return fields;
};
const execute = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const mentionedUser = options.getMentionable('username', false);

  const targetUser =
    mentionedUser instanceof GuildMember
      ? mentionedUser.user
      : interaction.user;

  try {
    const user = await getOrCreateDiscordUser(targetUser.id);
    if (user) {
      //TODO: update to include new fields
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${targetUser.username}'s profile`,
          iconURL: targetUser.displayAvatarURL(),
        })
        .addFields(createUserProfileFields(user));

      return interaction.reply({ embeds: [embed] });
    } else {
      return interaction.reply({
        content: "Couldn't find details on that user",
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

const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('View a profile.');
data.addMentionableOption((option) =>
  option
    .setName('username')
    .setDescription(`Tag the user you are looking for`)
    .setRequired(false)
);

const command: SlashCommand = {
  data,
  execute,
};

export default command;
