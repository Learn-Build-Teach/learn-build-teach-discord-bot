import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getKudosLeaderboard } from '../utils/db/kudos';
import { EmbedField } from './profile';
import { client } from '../bot';
import {
  BUILD_EMOJI_NAME,
  LEARN_EMOJI_NAME,
  TEACH_EMOJI_NAME,
} from '../consts';

const handleLoadKudosLeaderboard = async (interaction: CommandInteraction) => {
  try {
    const leaders: Leader[] = await getKudosLeaderboard();
    console.log(leaders);
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

export interface Leader {
  username: string;
  totalPoints: number;
  learnPoints: number;
  buildPoints: number;
  teachPoints: number;
  id: string;
}

const kudoEmojis = [LEARN_EMOJI_NAME, BUILD_EMOJI_NAME, TEACH_EMOJI_NAME];
const customEmojis = client.emojis.cache.filter((emoji) => {
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
  const values = [];
  if (leader.learnPoints > 0) {
    const learnEmoji = customEmojis.find((emoji) => {
      return emoji.name === 'learn';
    });
    values.push(
      `${leader.learnPoints} <:${learnEmoji?.name}:${learnEmoji?.id}>`
    );
  }
  if (leader.buildPoints > 0) {
    const buildEmoji = customEmojis.find((emoji) => {
      return emoji.name === 'build';
    });
    values.push(
      `${leader.buildPoints} <:${buildEmoji?.name}:${buildEmoji?.id}>`
    );
  }
  if (leader.teachPoints > 0) {
    const teachEmoji = customEmojis.find((emoji) => {
      return emoji.name === 'teach';
    });
    values.push(
      `${leader.teachPoints} <:${teachEmoji?.name}:${teachEmoji?.id}>`
    );
  }
  return values.join(' ');
};
