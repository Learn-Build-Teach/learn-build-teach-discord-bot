import prisma from './src/db';
import { DISCORD_USER_TABLE_NAME } from './src/db/discordUser';
import { KUDO_TABLE_NAME } from './src/db/kudos';
import { SHARE_TABLE_NAME } from './src/db/shares';
import { DiscordUser, Kudo, Share } from './src/types/types';
import { supabase } from './src/utils/supabase';

const getUsers = async () => {
  const users = await prisma.user.findMany();
  const formattedUsers: DiscordUser[] = users.map((user) => {
    console.log(user.lastActiveTimestamp.toISOString());
    const discordUser: DiscordUser = {
      id: user.id,
      createdAt: user.createdAt.toISOString(),
      lastActive: user.lastActiveTimestamp.toISOString(),
      username: user.username || '',
      github: user.github || undefined,
      twitter: user.twitter || undefined,
      twitch: user.twitch || undefined,
      youtube: user.youtube || undefined,
      website: user.website || undefined,
      instagram: user.instagram || undefined,
      tiktok: user.tiktok || undefined,
      linkedin: user.linkedin || undefined,
      polywork: user.polywork || undefined,
      numMessages: user.numMessages,
      xp: user.xp,
    };
    return discordUser;
  });
  //   console.log(formattedUsers);
  return formattedUsers;
};

const getShares = async () => {
  const shares = await prisma.share.findMany();
  const formattedShares: Share[] = shares.map((share) => {
    const supabaseShare: Share = {
      id: share.id,
      createdAt: share.createdAt.toISOString(),
      link: share.link,
      title: share.title,
      description: share.description || undefined,
      imageUrl: share.imageUrl || '',
      emailable: share.emailable || false,
      tweetable: share.tweetable || false,
      tweeted: share.tweeted || false,
      emailed: share.emailed || false,
      discordUserId: share.userId,
    };
    return supabaseShare;
  });
  console.log(formattedShares.length);
  return formattedShares;
};

const uploadSharesToSupabase = async () => {
  const shares = await getShares();
  const { data, error } = await supabase.from(SHARE_TABLE_NAME).insert(shares);
  if (error) {
    console.error(error);
  }
};

// uploadSharesToSupabase();

const uploadUsersToSupabase = async () => {
  const discordUsers = await getUsers();
  const { data, error } = await supabase
    .from(DISCORD_USER_TABLE_NAME)
    .insert(discordUsers);

  if (error) {
    console.error(error);
  }

  console.log(data);
};

// uploadUsersToSupabase();

const getKudos = async (): Promise<Kudo[]> => {
  const kudos = await prisma.kudo.findMany();
  console.log(kudos);
  const formattedKudos: Kudo[] = kudos.map((kudo) => {
    const formattedKudo: Kudo = {
      id: kudo.id,
      createdAt: kudo.createdAt.toISOString(),
      category: kudo.category,
      description: kudo.description || undefined,
      points: kudo.points,
      receiverId: kudo.receiverId,
      giverId: kudo.giverId,
      multiplier: kudo.multiplier,
    };
    return formattedKudo;
  });
  return formattedKudos;
};

const uploadKudosToSupabase = async () => {
  const kudos = await getKudos();
  const { data, error } = await supabase.from(KUDO_TABLE_NAME).insert(kudos);

  if (error) {
    return console.error(error);
  }

  console.log(data);
};

const uploadAllDataToSupabase = async () => {
  await uploadUsersToSupabase();
  await uploadSharesToSupabase();
  await uploadKudosToSupabase();
};

// uploadAllDataToSupabase();
// uploadKudosToSupabase();
// getKudos();
