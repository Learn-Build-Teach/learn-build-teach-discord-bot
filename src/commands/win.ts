import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  SlashCommandBuilder,
} from 'discord.js';
import { getOrCreateDiscordUser } from '../utils/discordUser';
import { SlashCommand, SlashCommandHandler } from '../utils/discord';
import { KudoCategory } from '../types/types';
import { createWin } from '../db/wins';

const execute: SlashCommandHandler = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  const win = options.getString('win') || '';
  const category = options.getString('category', true);

  try {
    const { id, username } = interaction.user;
    const user = await getOrCreateDiscordUser(id, username);
    if (!user) {
      return interaction.reply({
        content: `Failed to retrieve existing user or create a new one`,
        ephemeral: true,
      });
    }

    if (!user.username) {
      return interaction.reply({
        content: `Please update your username using the "/updateProfile" command before attempting to share.`,
        ephemeral: true,
      });
    }

    const createdWin = await createWin({
      discordUserId: user.id,
      text: win,
      category,
      tweetable: false,
      tweeted: false,
      emailable: false,
      emailed: false,
    });
    if (!createdWin || createdWin === null) {
      return interaction.reply({
        content: 'Failed to share this win',
      });
    }
    // addNewShareToCache(createdShare);
    // const embed = new EmbedBuilder()
    //   .setTitle(title)
    //   .setDescription(description || title)
    //   .addFields(
    //     { name: 'shareId', value: createdShare.id },
    //     { name: 'shareLink', value: createdShare.link },
    //     { name: 'sharerUsername', value: username }
    //   )
    //   .setThumbnail(imageUrl)
    //   .setAuthor({ name: `Share from ${username}` });
    // const shareReviewChannel = (await getDiscordChannel(
    //   variables.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL || ''
    // )) as TextChannel;
    // if (shareReviewChannel) {
    //   shareReviewChannel
    //     .send({ embeds: [embed] })
    //     .then(function (message) {
    //       message.react(EMOJI_NAMES.APPROVE_EMOJI);
    //       message.react(EMOJI_NAMES.EMAIL_APPROVED_EMOJI);
    //       message.react(EMOJI_NAMES.TWITTER_APPROVED_EMOJI);
    //       message.react(EMOJI_NAMES.REJECT_EMOJI);
    //     })
    //     .catch(function (err) {
    //       console.error('Error reacting to message.');
    //       console.error(err);
    //     });
    // }

    return interaction.reply({
      content: `Thank you for sharing your win!`,
    });
  } catch (err) {
    console.error('Something went wrong in sharing the win.');
    console.error(err);
    return interaction.reply({
      content: `Failed to save win record 🤷‍♂️. <@361868131997843456> should take a look!`,
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
  .setName('win')
  .setDescription(
    'Share a recent win. Something you learned, built, or taught no matter how small!'
  );
data
  .addStringOption((option) =>
    option.setName('win').setDescription(`What was your win?`).setRequired(true)
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
