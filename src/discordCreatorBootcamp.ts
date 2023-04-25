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

    await channel.threads.create({
      name: `Daily Standup Reminder ⏰ - ${month} ${day}, ${year}`,
      message: {
        content: `What did you do yesterday?
        What are you doing today?
        What are your blockers?`,
      },
    });
  } catch (error) {
    console.error(error, 'Failed to post standup reminder');
  }
};

const cronStr = '0 1 * * 1-5';
export const startBootcampPoster = async () => {
  cron.schedule(cronStr, postStandupReminder);
};
