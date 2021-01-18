require('dotenv').config();
const { QuickDiscordBot } = require('quick-chat-bot');
const path = require('path');
const bot = new QuickDiscordBot({
    botToken: process.env.DISCORD_BOT_TOKEN,
    commandsDir: path.join(__dirname, 'commands', process.env.TEST_CHANNEL),
});

bot.connect();
