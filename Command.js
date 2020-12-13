class Command {
    constructor(text, callback, channel) {
        this.text = text;
        this.callback = callback;
        this.channel = channel;
    }

    tryUseCommand(msg) {
        try {
            if (this.channel && msg.channel.name !== this.channel) return;
            if (!msg.content.startsWith(this.text)) return;

            this.callback(msg);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Command;
