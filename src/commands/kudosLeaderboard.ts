import {
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
  SlashCommandBuilder,
} from 'discord.js';
import { getKudosLeaderboard } from '../db/kudos';

import { EMOJI_NAMES, kudoEmojis } from '../consts';
import { discordClient, SlashCommand } from '../utils/discord';
import { Leader } from '../types/types';

const execute = async (interaction: CommandInteraction) => {
  try {
    const leaders = await getKudosLeaderboard();
    const embed = new EmbedBuilder()
      .setAuthor({
        name: '`Kudos Leaders`',
      })
      .addFields(createLeaderboardFields(leaders));

    return interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: `Something went wrong giving kudos :(`,
      ephemeral: true,
    });
  }
};

const createLeaderboardFields = (leaders: Leader[]): EmbedField[] => {
  const fields: EmbedField[] = [];
  for (let i = 0; i < leaders.length; i++) {
    fields.push({
      name: leaders[i].username || 'Unknown',
      value: buildLeaderValueField(leaders[i]),
      inline: false,
    });
  }
  return fields;
};

const buildLeaderValueField = (leader: Leader): string => {
  const customEmojis = discordClient.emojis.cache.filter((emoji) => {
    return kudoEmojis.includes(emoji.name || '');
  });

  const kudos = [
    {
      emoji: customEmojis.find(
        (emoji) => emoji.name === EMOJI_NAMES.LEARN_EMOJI_NAME
      ),
      points: leader.learnPoints,
    },
    {
      emoji: customEmojis.find(
        (emoji) => emoji.name === EMOJI_NAMES.BUILD_EMOJI_NAME
      ),
      points: leader.buildPoints,
    },
    {
      emoji: customEmojis.find(
        (emoji) => emoji.name === EMOJI_NAMES.TEACH_EMOJI_NAME
      ),
      points: leader.teachPoints,
    },
  ]
    .filter((kudo) => kudo.points > 0)
    .sort((a, b) => b.points - a.points);
  return kudos
    .map((kudo) => `${kudo.points} <:${kudo.emoji?.name}:${kudo.emoji?.id}>`)
    .join(' ');
};

const data = new SlashCommandBuilder()
  .setName('kudosleaderboard')
  .setDescription('View a leaderboard of kudo recipients');

const command: SlashCommand = {
  data,
  execute,
};

export default command;
