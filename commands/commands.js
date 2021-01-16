module.exports = {
    callback: async (msg) => {
        return await msg.reply(
            `
**!updateProfile**: Update your profile with the following flags. I will use these pieces of information to help share your content!
    -twitter: your twitter handle
    -twitch: your Twitch username
    -youtube: your YouTube url
    -website: your personal website
    ex. \`!updateProfile -twitter jamesqquick -youtube https://www.youtube.com/c/jamesqquick -website https://www.jamesqquick.com/\`

**!share**: Share a piece of content (article, video, etc.) by including a valid URL. I will consider sharing this on Twitter and/or my newsletter. You can (optionally) include a suggested tweet text after the URL.
    ex. \`!share https://www.jamesqquick.com/\ This is a suggested tweet text\`

**!commands**: Show a list of available commands
    ex. \`!commands\`
`
        );
    },
};
