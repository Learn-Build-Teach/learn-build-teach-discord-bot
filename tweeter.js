const { sendTweet } = require('./utils/Twitter');
const { shareTable, minifyRecords } = require('./utils/Airtable');
const cron = require('node-cron');

const tweetNextShare = async () => {
    console.log('Looking for shares to tweet');
    try {
        const records = minifyRecords(
            await shareTable
                .select({
                    maxRecords: 1,
                    filterByFormula: `AND({tweetable} = "1", {tweeted} != "1")`,
                })
                .firstPage()
        );
        if (records.length !== 1) return;
        const shareId = records[0].id;
        console.log('Found this record to share', records[0]);
        const { title, link, image, discordUser } = records[0].fields;

        const tweetText = `Check out "${title}" from ${discordUser} of the #LearnBuildTeach community! \n\n ${link}`;
        console.log('Potential tweet', tweetText);

        if (process.env.SEND_TWEETS === 'TRUE') {
            sendTweet(tweetText, image);
            shareTable.update(shareId, {
                tweeted: true,
            });
        }
    } catch (err) {
        console.error(err);
        console.error('Something went wrong trying to send a tweet');
    }
};

//tweet available share (if there is one) every morning at 8am GMT
cron.schedule('0 8 * * *', tweetNextShare);
