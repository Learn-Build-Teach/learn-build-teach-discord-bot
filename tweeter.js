const { sendTweet } = require('./utils/Twitter');
const { shareTable } = require('./utils/Airtable');
//setup cron job
//poll airtable for links
//tweet one and mark as shared
//sendTweet('Test');

const getNextTweetableShare = async () => {
    const record = await shareTable
        .select({
            maxRecords: 1,
            filterByFormula: `{tweetable} = "1"`,
        })
        .firstPage();
    console.log(record);
};

getNextTweetableShare();
