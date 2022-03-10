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
    const mentionedUser = options.getMentionable('user', false)

    if (!(mentionedUser instanceof GuildMember)) {
      return interaction.reply({
        content: `You can only give kudos to a User 🥰`,
      })
    }

    const { id: receiverId } = mentionedUser
    const { id: giverId } = interaction.user

    //If the giver and receiver are the same just abort
    //no need to let people kudo themselves I think
    if (receiverId === giverId) return

    const description = options.getString('for', true)
    const categoryString = options.getString('category', true)

    //HACK: https://stackoverflow.com/questions/50417254/dynamically-access-enum-in-typescript-by-key
    const category: KudoCategory =
      KudoCategory[categoryString as keyof typeof KudoCategory]

    giveKudos(giverId, receiverId, category, description)
    return interaction.reply({
      content: `${category} Kudos were given to ${mentionedUser.user.username} for '${description}'`,
    })
  } catch (err) {
    console.error(err)
    return interaction.reply({
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
