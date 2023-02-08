import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { SlashCommand, SlashCommandHandler } from '../utils/discord';
import { giveKudos } from '../db/kudos';
import { KudoCategory } from '../types/types';
import { variables } from '../variables';

const execute: SlashCommandHandler = async (interaction, options) => {
  try {
    const mentionedUser = options.getMentionable('user', false);
    if (!(mentionedUser instanceof GuildMember) || mentionedUser.user.bot) {
      return interaction.reply({
        content: `You can only give kudos to a User 🥰`,
        ephemeral: true,
      });
    }

    const { id: receiverId } = mentionedUser;
    const { id: giverId } = interaction.user;

    //Don't let users give themselves kudos
    if (variables.ALLOW_SELF_KUDOS !== 'TRUE' && receiverId === giverId)
      return interaction.reply({
        content: `Silly rabbit, you can't give kudos to yourself!`,
        ephemeral: true,
      });

    const description = options.getString('for', true);
    const categoryString = options.getString('category', true);

    //HACK: https://stackoverflow.com/questions/50417254/dynamically-access-enum-in-typescript-by-key
    const category: KudoCategory =
      KudoCategory[categoryString as keyof typeof KudoCategory];

    await giveKudos(giverId, receiverId, category, description);
    return interaction.reply({
      content: `${category} Kudos were given to ${mentionedUser.user.username} for '${description}'`,
      ephemeral: true,
    });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: `Something went wrong giving kudos :(`,
      ephemeral: true,
    });
  }
};

const choices = Object.keys(KudoCategory).map((key) => {
  return {
    name: KudoCategory[key as keyof typeof KudoCategory],
    value: KudoCategory[key as keyof typeof KudoCategory],
  };
});

const data = new SlashCommandBuilder()
  .setName('kudos')
  .setDescription('Give kudos to a community member');
data
  .addMentionableOption((option) =>
    option
      .setName('user')
      .setDescription(`Tag the user you want to give kudos to.`)
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('for')
      .setDescription('What are you giving kudos for?')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('category')
      .setDescription('Learning, building or teaching')
      .setRequired(true)
      .addChoices(...choices)
  );

const command: SlashCommand = {
  data,
  execute,
};

export default command;
