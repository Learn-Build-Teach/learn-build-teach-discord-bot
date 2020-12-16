const { table: airtable } = require('./Airtable');
const { isValidUrl } = require('./Utils');

const share = async (msg) => {
    const parts = msg.content.split(' ');
    if (parts.length !== 2) return;
    const link = parts[1];
    if (!isValidUrl(link)) {
        msg.channel.send('Please include a valid url');
        return;
    }
    try {
        //TODO: check to see when the last time they created a record was?
        //TODO: command for backlogging videos to watch later?
        await airtable.create([
            { fields: { name: msg.author.username, link } },
        ]);
        msg.reply(`Content successfully shared. Thanks!`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    share,
};
