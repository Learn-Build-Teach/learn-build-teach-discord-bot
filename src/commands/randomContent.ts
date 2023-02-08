import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { ShareWithUsername } from '../types/types';
import { SlashCommand, SlashCommandHandler } from '../utils/discord';
import { getRandomShareFromCache } from '../utils/shareCache';

const execute: SlashCommandHandler = async (
  interaction: CommandInteraction
) => {
  try {
    const randomShare = await getRandomShareFromCache();
    const embed = createShareEmbed(randomShare);
    return interaction.reply({
      embeds: [embed],
    });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: `Something went wrong with getting a random share.`,
      ephemeral: true,
    });
  }
};

const createShareEmbed = (share: ShareWithUsername): EmbedBuilder => {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(share.title)
    .setDescription(share.description || '')
    .setURL(share.link)
    .addFields({
      name: 'Author',
      value: `By @${share.user.username}`,
    })
    .setTimestamp(new Date(share.createdAt));
};

const data = new SlashCommandBuilder()
  .setName('randomcontent')
  .setDescription('Get a random piece of content');

const command: SlashCommand = {
  data,
  execute,
};

export default command;
