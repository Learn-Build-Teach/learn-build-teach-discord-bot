import {
  MessageEmbed,
  CommandInteraction,
  CommandInteractionOptionResolver,
  User,
} from 'discord.js';
import { getUserById } from '../utils/db/users';

const getProfile = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const mentionedUser = options.getMentionable('username', false);
  let targetUser = mentionedUser instanceof User ? mentionedUser : interaction.user;

  console.log(`Searching for user, ${targetUser.id}`);
  await interaction.deferReply();
  try {

    const user = await getUserById(targetUser.id);
    if (!!user) {
      const embed = new MessageEmbed()
        .setAuthor(
          `${targetUser.username}'s profile`,
          targetUser.displayAvatarURL()
        )
        .addFields(
          {
            name: 'Twitter',
            value: user.twitter
              ? `https://twitter.com/${user.twitter}`
              : 'n/a',
          },
          {
            name: 'YouTube',
            value: user.youtube || 'n/a',
          },
          {
            name: 'Website',
            value: user.website || 'n/a',
          },
          {
            name: 'Twitch',
            value: user.twitch
              ? `https://twitch.tv/${user.twitch}`
              : 'n/a',
          },
          {
            name: 'Instagram',
            value: user.instagram
              ? `https://instagram.com/${user.instagram}`
              : 'n/a',
          },
          {
            name: 'GitHub',
            value: user.github
              ? `https://github.com/${user.github}`
              : 'n/a',
          }
        );

      interaction.editReply({ embeds: [embed] });
    } else {
      interaction.editReply({
        content: "Couldn't find details on that user",
        //TODO: how do we use this ?ephemeral: true,
      });
    }
  } catch (err) {
    console.error(
      `Something went wrong searching for user profile: ${targetUser.username}.`
    );
    console.error(err);
    return interaction.editReply({
      content: `Something went wrong searching for user profile ${targetUser.username}`,
      //TODO: how do we use this ?ephemeral: true,
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
