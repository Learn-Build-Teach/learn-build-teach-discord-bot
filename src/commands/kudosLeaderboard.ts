import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getKudosLeaderboard } from '../db/kudos';
import { EmbedField } from './profile';

import {
  BUILD_EMOJI_NAME,
  LEARN_EMOJI_NAME,
  TEACH_EMOJI_NAME,
} from '../consts';
import { discordClient } from '../utils/discord';
import { Leader } from '../utils/interfaces';

const handleLoadKudosLeaderboard = async (interaction: CommandInteraction) => {
  try {
    const leaders: Leader[] = await getKudosLeaderboard();
    const embed = new MessageEmbed()
      .setAuthor(`Kudos Leaders`)
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
export default {
  callback: handleLoadKudosLeaderboard,
  name: 'kudosleaderboard',
  description: 'View a leaderboard of kudo recipients',
  options: [],
};

const kudoEmojis = [LEARN_EMOJI_NAME, BUILD_EMOJI_NAME, TEACH_EMOJI_NAME];
const customEmojis = discordClient.emojis.cache.filter((emoji) => {
  return kudoEmojis.includes(emoji.name || '');
});

const createLeaderboardFields = (leaders: Leader[]): EmbedField[] => {
  const fields: EmbedField[] = [];
  for (let i = 0; i < leaders.length; i++) {
    fields.push({
      name: leaders[i].username || 'Unknown',
      value: buildLeaderValueField(leaders[i]),
    });
  }
  return fields;
};

const buildLeaderValueField = (leader: Leader): string => {
  const kudos = [
    {
      emoji: customEmojis.find((emoji) => emoji.name === LEARN_EMOJI_NAME),
      points: leader.learnPoints,
    },
    {
      emoji: customEmojis.find((emoji) => emoji.name === BUILD_EMOJI_NAME),
      points: leader.buildPoints,
    },
    {
      emoji: customEmojis.find((emoji) => emoji.name === TEACH_EMOJI_NAME),
      points: leader.teachPoints,
    },
  ]
    .filter((kudo) => kudo.points > 0)
    .sort((a, b) => b.points - a.points);

  return kudos
    .map((kudo) => `${kudo.points} <:${kudo.emoji?.name}:${kudo.emoji?.id}>`)
    .join(' ');
};
