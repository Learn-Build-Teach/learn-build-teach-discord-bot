require('dotenv').config();
const Discord = require('discord.js');
const discordClient = new Discord.Client();
const Command = require('./Command');
const DiscordMessageHandler = require('./DiscordMessageHandler');
const { share } = require('./Commands');
const logger = require('./Logger');
const commands = [];
commands.push(new Command('!share', share, process.env.SHARE_CHANNEL_NAME));

const messageHandler = new DiscordMessageHandler(commands);
discordClient.on('ready', () => {
    logger.info('Learn Build Teach is active');
});
discordClient.on('message', messageHandler.handleMessage);

discordClient.login(process.env.DISCORD_BOT_TOKEN);
