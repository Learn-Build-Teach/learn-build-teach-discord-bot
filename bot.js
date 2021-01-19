require('dotenv').config();
const { QuickDiscordBot } = require('quick-chat-bot');
const path = require('path');
const bot = new QuickDiscordBot({
    botToken: process.env.DISCORD_BOT_TOKEN,
    commandsDir: path.join(__dirname, 'commands'),
    testChannel: process.env.DISCORD_TEST_CHANNEL_NAME,
    testMode: process.env.DISCORD_TEST_MODE === 'TRUE' ? true : false,
});

bot.connect();
