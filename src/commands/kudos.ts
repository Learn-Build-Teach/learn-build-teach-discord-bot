import { Kudo, KudoCategory, Prisma, Share } from "@prisma/client";
import { CommandInteraction, CommandInteractionOptionResolver, GuildMember, User } from "discord.js";
import { createKudo } from "../utils/db/kudos";
import { getUserById } from "../utils/db/users";

const giveKudos = async (interaction: CommandInteraction,
  options: CommandInteractionOptionResolver) => {
  await interaction.deferReply();

  const mentionedUser = options.getMentionable('user', false);
  console.log(mentionedUser);
  if (!(mentionedUser instanceof GuildMember)) {
    return interaction.editReply({
      content: `You can only give kudos to a User 🥰`,
    });
  }


  const { id: receiverId } = mentionedUser;
  const receivingUser = await getUserById(receiverId);
  console.log(receivingUser);
  //TODO: what if the user doesn't exist? Create them?
  if (!receivingUser) {
    console.info("That usr doesn't exist");
    return interaction.editReply({
      content: `Something wasn't right with those users`,
    });
  }

  const { id: giverId } = interaction.user;
  const givingUser = await getUserById(giverId);

  if (!givingUser) {
    console.info("That user doesn't exist")
    return interaction.editReply({
      content: `Something wasn't right with those users`,
    });
  }

  const description = options.getString('description');

  const kudo: Prisma.KudoCreateInput = {
    category: KudoCategory.LEARN, //TODO: replace with user input
    receiver: {
      connect: {
        id: receiverId
      }
    },
    giver: {
      connect: {
        id: giverId
      }
    },
  }
  const createdKudo = await createKudo(kudo);
  console.log(createdKudo);
  console.log(receivingUser, givingUser, description);
  return interaction.editReply({
    content: `Kudos were given`,
  });
}
export default {
  callback: giveKudos,
  name: 'kudos',
  description: "Give kudos to a community member",
  options: [
    {
      name: 'user',
      description: `Tag the user you want to give kudos to.`,
      required: true,
      type: 'MENTIONABLE',
    },
    {
      name: 'description',
      description: `What are you givin kudos for?`,
      required: true,
      type: 'STRING',
    },
    //TODO: add enum for category type
    // {
    //   name: 'category',
    //   description: `Learning, building, or teaching?`,
    //   required: true,
    //   type: 'CHOICES',
    // },
  ],
};
