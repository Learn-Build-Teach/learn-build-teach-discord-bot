const { shareTable } = require('../utils/Airtable');
const { isValidUrl } = require('../utils/Helpers');
const ogs = require('open-graph-scraper');

const shareHandler = async (msg) => {
    const parts = msg.content.split(' ');
    if (parts.length !== 2) return;
    const link = parts[1];
    if (!isValidUrl(link)) {
        msg.channel.send('Please include a valid url');
        return;
    }
    try {
        //TODO: check to see when the last time they created a record was?
        const { result } = await ogs({ url: link });
        const { ogUrl, ogTitle, ogDescription, ogType, ogImage } = result;
        console.log({ ogUrl, ogTitle, ogDescription, ogType, ogImage });

        await shareTable.create([
            {
                fields: {
                    discordUser: msg.author.username,
                    link,
                    title: ogTitle,
                    image: ogImage.url,
                    description: ogDescription,
                },
            },
        ]);
        msg.reply(`Content successfully shared. Thanks!`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    callback: shareHandler,
};
