import { saveDiscussionQuestions } from '../DiscussionQuestion';
import { discussionQuestions } from './discussionQuestions';
import { createDiscordUsersTable } from './tables';

const seedDiscussionQuestions = async () => {
  try {
    await saveDiscussionQuestions(discussionQuestions);
    console.log('Saved discussion questions');
  } catch (err) {
    console.error(err);
  }
};

export const seed = async () => {
  await seedDiscussionQuestions();
};

(async () => {
  await createDiscordUsersTable();
  // await seed();
})();
