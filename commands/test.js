const Discord = require('discord.js');

module.exports = {
    callback: async (msg) => {
        if (msg.author.bot) return;

        console.log(msg.channel.name);
    },
};
