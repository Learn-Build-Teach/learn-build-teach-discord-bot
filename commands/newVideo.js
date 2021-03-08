const { shareTable } = require('../utils/Airtable');

module.exports = {
    callback: async (msg) => {
        console.log(msg);
        if (!msg.embeds || !msg.embeds[0]) {
            return console.log(
                'Ignoring !newVideo command since there is no embed data.'
            );
        }

        const embed = msg.embeds[0];
        console.log(`Attempting to share video`, embed);
        const requiredProperties = ['author', 'thumbnail', 'provider'];
        requiredProperties.forEach((prop) => {
            if (!embed[prop]) {
                return console.log(
                    `Ignoring !newVideo command since there is no ${prop}.`
                );
            }
        });

        const {
            url: link,
            title,
            description,
            author: { name: discordUser },
            thumbnail: { url: image },
            provider: { name: provider },
        } = embed;

        if (provider !== 'YouTube') {
            return console.log(
                'Ignoring !newVideo command since the provider is not YouTube).'
            );
        }
        if (!link) {
            return console.log(
                'Ignoring !newVideo command since there is no link'
            );
        }
        if (!title) {
            return console.log(
                'Ignoring !newVideo command since there is no title'
            );
        }

        try {
            await shareTable.create([
                {
                    fields: {
                        discordUser,
                        link,
                        title,
                        ...(image && { image }),
                        ...(description && { description }),
                        tweetable: false,
                    },
                },
            ]);
            await msg.react(`🔥`);
            await msg.reply(`This video has been shared to Airtable!`);
        } catch (err) {
            console.error(
                'Something went wrong in sharing YouTube video to airtable.'
            );
            console.error(err);
            await msg.reply(
                `Failed to save share record 🤷‍♂️. <@361868131997843456> should take a look!`
            );
        }
    },
};
