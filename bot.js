import { Client } from 'discord.js'
import dotenv, { config } from 'dotenv'
import fs from 'fs'
dotenv.config()

const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
})

const nameToCommandMap = {}

client.on('ready', async () => {
    console.log('The Learn Build Teach bot is running!')
    const guildId = process.env.DISCORD_GUILD_ID
    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    const commandsDir = 'commands' //process.env.COMMANDS_DIR;
    const commandFiles = fs.readdirSync(commandsDir)

    const filePromises = commandFiles
        .filter((commandFile) => commandFile.endsWith('.js'))
        .map((commandFile) => {
            return import(`./${commandsDir}/${commandFile}`)
        })
    const loadedFiles = await Promise.all(filePromises)

    loadedFiles.forEach((loadedFile) => {
        const commandConfig = loadedFile.default
        console.log('Loading command', commandConfig)
        try {
            commands.create(commandConfig)
            nameToCommandMap[commandConfig.name] = commandConfig
        } catch (err) {
            console.error(err)
            return
        }
    })
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return

    const { commandName, options } = interaction
    const existingCommand = nameToCommandMap[commandName]
    if (existingCommand) {
        return existingCommand.callback(interaction, options)
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
