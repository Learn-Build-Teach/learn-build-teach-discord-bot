const { userTable, minifyRecords } = require('../utils/Airtable');
const Discord = require('discord.js');
const commands = require('./commands');

const getProfile = async (msg) => {
    let targetUsername = msg.author.id;
    const parts = msg.content.split(' ');
    if (parts.length === 2) {
        targetUsername = parts[1].replace('<@!', '').replace('>', '');
    }
    console.log(targetUsername);
    console.log(msg.content);

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
            const commandsEmbed = new Discord.MessageEmbed()
                .setColor('#de5254')
                .setTitle('Profile for ${user.discordUsername}');

            user.fields.twitter &&
                commandsEmbed.addFields({
                    name: 'Twitter',
                    value: user.fields.twitter || '',
                });
            user.fields.twitter &&
                commandsEmbed.addFields({
                    name: 'YouTube',
                    value: user.fields.youtube || '',
                });
            user.fields.website &&
                commandsEmbed.addFields({
                    name: 'Website',
                    value: user.fields.website || '',
                });
            user.fields.twitch &&
                commandsEmbed.addFields({
                    name: 'Twitch',
                    value: user.fields.twitch || '',
                });
            msg.channel.send(commandsEmbed);
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
