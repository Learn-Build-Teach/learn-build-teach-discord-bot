import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ShareWithUsername } from '../types/types';
import { getRandomShareFromCache } from '../utils/shareCache';

const getRandomContent = async (interaction: CommandInteraction) => {
  try {
    const randomShare = await getRandomShareFromCache();
    console.log(randomShare);
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

const createShareEmbed = (share: ShareWithUsername): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(share.title)
    .setDescription(share.description || '')
    .setURL(share.link)
    .addField('Author', `By @${share.user.username}`, true)
    .setTimestamp(new Date(share.createdAt));
};

export default {
  callback: getRandomContent,
  name: 'randomcontent',
  description: 'Get a random piece of content.',
};
