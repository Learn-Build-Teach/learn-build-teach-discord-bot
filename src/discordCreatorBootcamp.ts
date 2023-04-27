import { ForumChannel } from 'discord.js';
import cron from 'node-cron';
import { getDiscordChannel } from './utils/discord';
import { variables } from './variables';

export const postStandupReminder = async () => {
  try {
    const channel = (await getDiscordChannel(
      variables.DISCORD_BOOTCAMP_CHANNEL_ID || ''
    )) as ForumChannel;
    if (!channel) {
      console.error('Failed to find standup channel');
      return;
    }

    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();

    const thread = await channel.threads.create({
      name: `${month} ${day}, ${year} ⏰ - Daily Standup`,
      message: {},
    });
    const bootcampRoleId = variables.DISCORD_BOOTCAMP_ROLE_ID;
    await thread.send(
      `What did you do yesterday? \nWhat are you doing today? \nWhat are your blockers? \n\n <@&${bootcampRoleId}> 👇`
    );
  } catch (error) {
    console.error(error, 'Failed to post standup reminder');
  }
};

const cronStr = '0 6 * * 1-5';
export const startBootcampPoster = async () => {
  cron.schedule(cronStr, postStandupReminder);
  //   setTimeout(postStandupReminder, 1000);
};
