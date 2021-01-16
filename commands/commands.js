module.exports = {
    callback: async (msg) => {
        return await msg.reply(
            `
**!updateProfile**: Update your profile with the following flags
    -twitter: your twitter handle
    -twitch: your Twitch username
    -youtube: your YouTube url
    -website: your personal website
    ex. \`!updateProfile -twitter jamesqquick -youtube https://www.youtube.com/c/jamesqquick -website https://www.jamesqquick.com/\`

**!share**: Share a piece of content (article, video, etc.) by including a valid URL
    ex. \`!share https://www.jamesqquick.com/\`

**!commands**: Show a list of available commands
    ex. \`!commands\`
`
        );
    },
};
