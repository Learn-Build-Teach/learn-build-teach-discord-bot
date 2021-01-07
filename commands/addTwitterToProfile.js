const { userTable } = require('../utils/Airtable');
const { isValidUrl } = require('../utils/Helpers');

const addTwitterToProfile = async (msg) => {
    const parts = msg.content.split(' ');
    if (parts.length !== 2) return;
    const twitterUsername = parts[1];

    try {
        const discordUsername = msg.author.username;
        const records = minifyRecords(
            await shareTable
                .select({
                    maxRecords: 1,
                    filterByFormula: `{discordUsername} = "${discordUsername}"`,
                })
                .firstPage()
        );

        if (records.length === 1) {
            //user already exists so update
            const userId = records[0].id;
            await userTable.update(userId, {
                twitterUsername,
            });
            console.log('User successfully updated', twitterUsername);
        } else {
            //user does not exist, so create
            const newUser = {
                fields: {
                    discordUsername,
                    twitterUsername,
                },
            };
            userTable.create([newUser]);
            console.log('User successfully created', newUser);
        }

        await msg.react(`🔥`);
        await msg.reply(`Profile updated succcessful. Thanks!`);
    } catch (err) {
        console.error('Something went wrong while scraping data.');
        console.error(err);
        return msg.channel.send(
            `Sorry, there was an issue scraping open graph data. Please make sure this site has og:title property set in the head.`
        );
    }
};

module.exports = {
    text: 'profileTwitter',
    callback: addTwitterToProfile,
};
