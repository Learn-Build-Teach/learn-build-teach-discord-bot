import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getKudosLeaderboard } from '../utils/db/kudos';
import { EmbedField } from './profile';

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
  points: number;
  id: string;
}

const createLeaderboardFields = (leaders: Leader[]): EmbedField[] => {
  const fields: EmbedField[] = [];
  for (let i = 0; i < leaders.length; i++) {
    fields.push({
      name: leaders[i].username,
      value: leaders[i].points + '',
    });
  }
  return fields;
};
