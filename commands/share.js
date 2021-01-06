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
        const { result, error } = await ogs({ url: link });

        const { ogUrl, ogTitle, ogDescription, ogType, ogImage } = result;
        if (error || !ogTitle || !ogDescription || !ogImage) {
            return msg.channel.send(
                `Sorry, there was an issue scraping open graph data.`
            );
        }
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
        await msg.react(`🔥`);
        await msg.reply(`Content successfully shared. Thanks!`);
    } catch (err) {
        console.log('Something went wrong in share.');
        console.error(err);
    }
};

module.exports = {
    callback: shareHandler,
};
