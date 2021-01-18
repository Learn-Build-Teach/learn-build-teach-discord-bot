const Discord = require('discord.js');

module.exports = {
    callback: async (msg) => {
        console.log(msg.channel.name);
    },
};
