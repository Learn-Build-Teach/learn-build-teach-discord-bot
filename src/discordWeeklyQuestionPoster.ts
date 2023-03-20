import { ForumChannel } from 'discord.js';
import cron from 'node-cron';
import { getDiscordChannel } from './utils/discord';
import { variables } from './variables';

export const postDiscussionQuestion = async () => {
  console.log(variables.DISCORD_DISCUSSIONS_CHANNEL_ID || '');
  try {
    const channel = (await getDiscordChannel(
      variables.DISCORD_DISCUSSIONS_CHANNEL_ID || ''
    )) as ForumChannel;
    if (!channel) {
      console.error('Failed to find discussions channel');
    }
    await channel.threads.create({
      name: 'Quesiton of the Week',
      message: {
        content: 'What are your thoughts? 👇',
      },
    });
  } catch (error) {
    console.error('Failed to post discussion question');
  }
};

export const startDiscussionScheduler = async () => {
  const cronStr = '0 10 * * 1';
  cron.schedule(cronStr, postDiscussionQuestion);
  setTimeout(() => {
    postDiscussionQuestion();
  }, 2000);
  //   await postDiscussionQuestion();
};
