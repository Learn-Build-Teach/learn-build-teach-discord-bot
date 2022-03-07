import { sendTweet } from './utils/twitter.js';
import {
    shareTable,
    getDiscordUserById,
    getShareRecordToTweet,
} from './utils/airtable.js';
import cron from 'node-cron';

const tweetNextShare = async () => {
    console.log('Looking for shares to tweet');
    try {
        const shareRecord = await getShareRecordToTweet();
        if (!shareRecord) return;
        console.log('Found this record to share', shareRecord);
        const { id: shareId } = shareRecord;
        const {
            title,
            link,
            image,
            discordUser: discordUsername,
            tweetText,
            discordId,
        } = shareRecord.fields;

        const tweet = await getTweetFromShare(
            title,
            link,
            discordId,
            discordUsername,
            tweetText
        );
        if (!tweet) return;
        console.log('Potential tweet', tweet);

        if (process.env.SEND_TWEETS === 'TRUE') {
            console.log('Sending tweet');
            await sendTweet(tweet, image);
            shareTable.update(shareId, {
                tweeted: true,
            });
        }
    } catch (err) {
        console.error(err);
        console.error('Something went wrong trying to send a tweet');
    }
};

const getTweetFromShare = async (
    title,
    link,
    discordId,
    discordUsername
) => {
    let tweet;
    const existingUser = await getDiscordUserById(discordId);
    const twitterUsername = existingUser && existingUser.fields.twitter;
    const taggedUser = twitterUsername
        ? `@${twitterUsername.replace('@', '')}`
        : discordUsername;
    tweet = `Check out "${title}" from ${taggedUser} of the #LearnBuildTeach community! \n\n ${link}`;
    return tweet;
};
//tweet available share (if there is one) every morning at 8am GMT
cron.schedule('0 8 * * *', tweetNextShare);
