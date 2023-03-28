import { ForumChannel } from 'discord.js';
import cron from 'node-cron';
import {
  getUnaskedQuestion,
  markQuestionAsAsked,
} from './db/DiscussionQuestion';
import { getDiscordChannel } from './utils/discord';
import { variables } from './variables';

export const postDiscussionQuestion = async () => {
  try {
    const question = await getUnaskedQuestion();
    if (!question) {
      return console.error('Failed to find a question to post');
    }
    const channel = (await getDiscordChannel(
      variables.DISCORD_DISCUSSIONS_CHANNEL_ID || ''
    )) as ForumChannel;
    if (!channel) {
      console.error('Failed to find discussions channel');
      return;
    }
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    await channel.threads.create({
      name: `Discussion question of the week - ${month} ${day}, ${year}`,
      message: {
        content: `${question.question} 👇`,
      },
    });
    console.info(`Discussion question posted: ${question.question}`);
    await markQuestionAsAsked(question.id);
  } catch (error) {
    console.error(error, 'Failed to post discussion question');
  }
};

//0: 0 seconds
//0: 0 minutes (i.e., the beginning of the hour)
//15: 3 pm UTC
//*: any day of the month
//*: any month
//1: Monday (0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday)
const cronStr = '0 15 * * 1';
export const startDiscussionScheduler = async () => {
  cron.schedule(cronStr, postDiscussionQuestion);
};
