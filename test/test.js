export default {
    callback: async (msg) => {
        if (msg.author.bot) return

        console.log(msg.channel.name)
    },
}
