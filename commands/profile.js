const { userTable, minifyRecords } = require('../utils/Airtable');
const Discord = require('discord.js');
const commands = require('./commands');

const getProfile = async (msg) => {
    let targetUsername = msg.author.id;
    const parts = msg.content.split(' ');
    if (parts.length === 2) {
        targetUsername = parts[1].replace('<@!', '').replace('>', '');
    }
    console.log(`Searching for user, ${targetUsername}`);

    try {
        const records = minifyRecords(
            await userTable
                .select({
                    maxRecords: 1,
                    filterByFormula: `{discordId} = "${targetUsername}"`,
                })
                .firstPage()
        );

        if (records.length === 1) {
            const user = records[0];
            const profileEmbed = new Discord.MessageEmbed()
                .setColor('#de5254')
                .setTitle(`Profile for ${user.fields.discordUsername}`);

            user.fields.twitter &&
                profileEmbed.addFields({
                    name: 'Twitter',
                    value: `[${user.fields.twitter}](https://twitter.com/${user.fields.twitter})` || '',
                });
            user.fields.youtube &&
                profileEmbed.addFields({
                    name: 'YouTube',
                    value: user.fields.youtube || '',
                });
            user.fields.website &&
                profileEmbed.addFields({
                    name: 'Website',
                    value: user.fields.website || '',
                });
            user.fields.twitch &&
                profileEmbed.addFields({
                    name: 'Twitch',
                    value: `[${user.fields.twitch}](https://www.twitch.tv/${user.fields.twitch})` || '',
                });
            user.fields.instagram &&
                profileEmbed.addFields({
                    name: 'Instagram',
                    value: `[${user.fields.instagram}](https://www.instagram.com/${user.fields.instagram})` || '',
                });
            msg.channel.send(profileEmbed);
        } else {
            await msg.reply(`Couldn't find details on that user.`);
        }
    } catch (err) {
        console.error(
            `Something went wrong searching for user profile: ${targetUsername}.`
        );
        console.error(err);
        return msg.channel.send(
            `Something went wrong searching for user profile: ${targetUsername}.`
        );
    }
};

module.exports = {
    callback: getProfile,
};
