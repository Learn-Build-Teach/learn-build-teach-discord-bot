import { KudoCategory, Prisma } from '.prisma/client'
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
} from 'discord.js'
import { giveKudos } from '../utils/db/kudos'

const choices = Object.keys(KudoCategory).map((key) => {
  return {
    name: KudoCategory[key as keyof typeof KudoCategory],
    value: KudoCategory[key as keyof typeof KudoCategory],
  }
})

const handleKudos = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  try {

    await interaction.deferReply()

    const mentionedUser = options.getMentionable('user', false)

    if (!(mentionedUser instanceof GuildMember)) {
      return interaction.editReply({
        content: `You can only give kudos to a User 🥰`,
      })
    }

    const { id: receiverId } = mentionedUser
    const { id: giverId } = interaction.user


    const description = options.getString('for', true);
    const categoryString = options.getString('category', true)

    //HACK: https://stackoverflow.com/questions/50417254/dynamically-access-enum-in-typescript-by-key
    const category: KudoCategory =
      KudoCategory[categoryString as keyof typeof KudoCategory]

    giveKudos(giverId, receiverId, category, description);
    return interaction.editReply({
      content: `${category} Kudos were given to ${mentionedUser.user.username} for '${description}'`,
    })
  } catch (err) {
    console.error(err)
    return interaction.editReply({
      content: `Something went wrong giving kudos :(`,
    })
  }
}
export default {
  callback: handleKudos,
  name: 'kudos',
  description: 'Give kudos to a community member',
  options: [
    {
      name: 'user',
      description: `Tag the user you want to give kudos to.`,
      required: true,
      type: 'MENTIONABLE',
    },
    {
      name: 'for',
      description: `What are you givin kudos for?`,
      required: true,
      type: 'STRING',
    },
    {
      name: 'category',
      description: `Learning, building, or teaching?`,
      required: true,
      type: 'STRING',
      choices: choices,
    },
  ],
}
