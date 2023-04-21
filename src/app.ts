//load environment variables
import './variables';
import { startBot } from './bot';
import { variables } from './variables';
import { startDiscussionScheduler } from './discordWeeklyQuestionPoster';
import { startEventScheduler } from './discordEventScheduler';
import { startTweetScheduler } from './tweeter';

//run the express server
import './server/index';
import { startBootcampPoster } from './discordCreatorBootcamp';

const load = async () => {
  await startBot();

  if (!variables.POST_WEEKLY_DISCUSSION_QUESTION) {
    console.info('Weekly discussion question poster is not turned on');
  } else {
    await startDiscussionScheduler();
    console.info('weekly discussion question poster started.');
  }

  if (!variables.ENABLE_EVENTS_SCHEDULER) {
    console.info('Event scheduler is not turned on');
  } else {
    await startEventScheduler();
    console.info('event scheduler started.');
  }

  await startBootcampPoster();
  console.info('bootcamp poster started.');

  if (!variables.SEND_TWEETS) {
    console.info('Tweeter is not turned on');
  } else {
    await startTweetScheduler();
    console.info('Tweet scheduler started.');
  }
};

load();
