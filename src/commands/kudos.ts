import { KudoCategory, Prisma } from '.prisma/client';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
} from 'discord.js';
import { createKudo } from '../utils/db/kudos';
import { getOrCreateUser } from '../utils/db/users';

const choices = Object.keys(KudoCategory).map((key) => {
  return {
    name: KudoCategory[key as keyof typeof KudoCategory],
    value: KudoCategory[key as keyof typeof KudoCategory],
  };
});

const giveKudos = async (
  interaction: CommandInteraction,
  options: CommandInteractionOptionResolver
) => {
  await interaction.deferReply();

  const mentionedUser = options.getMentionable('user', false);
  console.log(mentionedUser);
  if (!(mentionedUser instanceof GuildMember)) {
    return interaction.editReply({
      content: `You can only give kudos to a User 🥰`,
    });
  }

  const { id: receiverId } = mentionedUser;
  const receivingUser = await getOrCreateUser(receiverId);
  console.log({ receivingUser });
  //Just incase we aren't able to create the user lets leave the guard in place
  if (!receivingUser) {
    console.info("That user doesn't exist");
    return interaction.editReply({
      content: `Something wasn't right with those users`,
    });
  }

  const { id: giverId } = interaction.user;
  const givingUser = await getOrCreateUser(giverId);

  if (!givingUser) {
    console.info("That user doesn't exist");
    return interaction.editReply({
      content: `Something wasn't right with those users`,
    });
  }

  const description = options.getString('description');
  const categoryString = options.getString('category', true);
  //HACK: https://stackoverflow.com/questions/50417254/dynamically-access-enum-in-typescript-by-key
  const category: KudoCategory =
    KudoCategory[categoryString as keyof typeof KudoCategory];
  console.log({ categoryString });

  const kudo: Prisma.KudoCreateInput = {
    category: category,
    receiver: {
      connect: {
        id: receiverId,
      },
    },
    giver: {
      connect: {
        id: giverId,
      },
    },
  };
  const createdKudo = await createKudo(kudo);
  console.log(createdKudo);
  console.log(receivingUser, givingUser, description);
  return interaction.editReply({
    content: `Kudos were given`,
  });
};
export default {
  callback: giveKudos,
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
      name: 'description',
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
};
