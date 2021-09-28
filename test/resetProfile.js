import { deleteUserRecord, getDiscordUserById } from '../utils/Airtable.js'

const resetProfile = async (msg) => {
    if (msg.author.bot) return

    const discordId = msg.author.id
    try {
        const existingUser = await getDiscordUserById(discordId)
        if (!existingUser) {
            return await msg.reply(
                `Unfortunately, we couldn't find your profile.`
            )
        }
        await deleteUserRecord(existingUser.id)
        await msg.react(`👍`)
        return await msg.reply(`Profile has been reset/deleted.`)
    } catch (err) {
        console.error(err)
        return await msg.reply(`Something went wrong resetting your profile.`)
    }
}

export default {
    callback: resetProfile,
}
