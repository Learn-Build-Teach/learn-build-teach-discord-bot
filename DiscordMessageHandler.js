module.exports = class DiscordMessageHandler {
    constructor(commands) {
        this.commands = {};
        commands.forEach((command) => {
            this.commands[command.text] = command;
        });
    }

    handleMessage = async (msg) => {
        console.info(`${msg.author.username}: ${msg.content}`);
        if (msg.author.bot) return;
        if (!msg.content.startsWith('!')) return;

        const parts = msg.content.split(' ');
        if (parts.length < 2) return;

        const command = parts[0];
        if (this.commands[command]) {
            this.commands[command].tryUseCommand(msg);
        }
    };
};
