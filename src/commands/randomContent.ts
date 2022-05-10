import { Share } from '@prisma/client';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getRandomShareFromCache } from '../utils/shareCache';

const getRandomContent = async (interaction: CommandInteraction) => {
  try {
    const randomShare = await getRandomShareFromCache();
    const embed = createShareEmbed(randomShare);
    return interaction.channel?.send({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: `Something went wrong with getting a random share.`,
      ephemeral: true,
    });
  }
};

const createShareEmbed = (share: Share): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(share.title)
    .setDescription(share.description || '')
    .setURL(share.link)
    .setAuthor(`From User ${share.userId}`)
    .setTimestamp(share.createdAt);
};

export default {
  callback: getRandomContent,
  name: 'randomcontent',
  description: 'Get a random piece of content.',
};
