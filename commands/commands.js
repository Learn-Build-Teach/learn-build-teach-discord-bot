const Discord = require('discord.js');

module.exports = {
    callback: async (msg) => {
        const commandsEmbed = new Discord.MessageEmbed()
            .setColor('#de5254')
            .setTitle('LBT Bot Commands')
            .addFields(
                { name: '!updateProfile', value: updateProfileText },
                { name: '!profile', value: profileText },
                { name: '!resetProfile', value: resetProfileText },
                { name: '!share', value: shareText },
                { name: '!commands', value: commandsText }
            );
        msg.channel.send(commandsEmbed);
    },
};

const updateProfileText = `
Update your profile with the following flags. I will use these pieces of information to help share your content.\n
    -twitter: your twitter handle
    -twitch: your Twitch username
    -youtube: your YouTube URL
    -instagram: your Instagram username
    -github: your Github username
    -website: your personal website URL\n
    ex. \`!updateProfile -twitter jamesqquick -youtube https://www.youtube.com/c/jamesqquick -website https://www.jamesqquick.com/\`
    \n`;

const profileText = `
Get profile details about you or another discord member.
    
    ex. \`!profile\` for yourself or \`!profile @James Q Quick\` for someone else
    \n`;

const resetProfileText = `
Clear your existing profile in case your display name has changed, you entered incorrect info, etc.
    
    ex. \`!resetProfile\`
    \n`;

const shareText = `
Share a piece of content (article, video, etc.) by including a valid URL. I will consider sharing this on Twitter and/or my newsletter. You can (optionally) include a suggested tweet text after the URL.

    ex. \`!share https://www.jamesqquick.com/\ This is a suggested tweet text\`
    \n`;

const commandsText = `
Show a list of available commands

    ex. \`!commands\`
\n`;
