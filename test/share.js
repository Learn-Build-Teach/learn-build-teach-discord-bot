import { shareTable, getDiscordUserById } from '../utils/Airtable.js'
import { isValidUrl } from '../utils/Helpers.js'
import ogs from 'open-graph-scraper'

const shareHandler = async (msg) => {
    if (msg.author.bot) return

    //TODO: WHEN DOES THE CACHE GET ADDED?
    // if (
    //     !msg ||
    //     !msg.member ||
    //     !msg.member.roles ||
    //     !msg.member.roles.cache ||
    //     !msg.member.roles.cache.get(process.env.DISCORD_ACTIVE_ROLE_ID)
    // ) {
    //     return msg.channel.send(
    //         `Sorry, you need an active role to be able to share. You automatically get the active role after you reach level 2. You can check your rank using the command \`!rank\``
    //     );
    // }

    const discordId = msg.author.id
    try {
        const existingUser = await getDiscordUserById(discordId)
        if (!existingUser) {
            return await msg.reply(
                `Before you share, please make sure to update your profile with the following flags. I will use these pieces of information to help share your content.\n

-twitter: your twitter handle
-twitch: your Twitch username
-youtube: your YouTube URL
-instagram: your Instagram username
-github: your Github username
-website: your personal website URL\n

ex. \`!updateProfile -twitter jamesqquick -youtube https://www.youtube.com/c/jamesqquick -website https://www.jamesqquick.com/\`
\n`
            )
        }
    } catch (err) {
        return console.error(err)
    }

    const parts = msg.content.split(' ')
    if (parts.length < 2) return
    const link = parts[1]
    if (!isValidUrl(link)) {
        return msg.channel.send('Please include a valid url')
    }
    //TODO: check to see when the last time they created a record was?
    let ogResult
    try {
        const data = await ogs({ url: link })
        ogResult = data.result
        if (!ogResult.ogTitle) {
            return msg.channel.send(
                `Sorry, this site doesn't appear to have open graph (og) title property.`
            )
        }
    } catch (err) {
        console.error('Something went wrong while scraping data.')
        console.error(err)
        return msg.channel.send(
            `Sorry, there was an issue scraping open graph data. Please make sure this site has og:title property set in the head.`
        )
    }

    try {
        const { ogTitle, ogDescription, ogImage } = ogResult
        console.log(ogResult)

        //let's get the suggested tweet text if available
        let tweetText
        if (parts.length > 2) {
            tweetText = parts.slice(2).join(' ')
        }
        console.log(tweetText)

        if (tweetText && (tweetText + link).length > 230) {
            return msg.channel.send(
                `Make sure that the length of the tweet text and the shared link is less than 240.`
            )
        }
        await shareTable.create([
            {
                fields: {
                    discordUser: msg.author.username,
                    discordId: msg.author.id,
                    link,
                    title: ogTitle,
                    ...(ogImage && { image: ogImage.url }),
                    ...(ogDescription && { description: ogDescription }),
                    tweetable: false,
                    ...(tweetText && { tweetText }),
                },
            },
        ])
        await msg.react(`🔥`)
        await msg.reply(`Content successfully shared. Thanks!`)
    } catch (err) {
        console.error('Something went wrong in sharing to airtable.')
        console.error(err)
        await msg.reply(
            `Failed to save share record 🤷‍♂️. <@361868131997843456> should take a look!`
        )
    }
}

export default {
    callback: shareHandler,
}
