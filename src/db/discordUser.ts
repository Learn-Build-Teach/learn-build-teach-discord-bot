import { DiscordUser, DiscordUserUpdate } from '../types/types';
import { supabase } from '../utils/supabase';
import { getOrCreateDiscordUser } from '../utils/discordUser';
export const DISCORD_USER_TABLE_NAME = 'DiscordUsers';

export const getDiscordUserById = async (
  id: string
): Promise<DiscordUser | null> => {
  const res = await supabase
    .from(DISCORD_USER_TABLE_NAME)
    .select()
    .eq('id', id);

  if (res.error) {
    throw res.error;
  }
  return res.data[0] || null;
};

export const addXpToDiscordUser = async (id: string) => {
  const increment = 10;
  const discordUser = await getOrCreateDiscordUser(id);
  //TODO: increments should probably be handled at the db
  return await updateDiscordUser(discordUser.id, {
    xp: discordUser.xp + increment,
  });
};

export const createDiscordUser = async (
  id: string,
  username: string
): Promise<DiscordUser> => {
  const res = await supabase
    .from(DISCORD_USER_TABLE_NAME)
    .insert({ id, username })
    .select();
  if (res.error) {
    throw res.error;
  }

  return res.data[0] as DiscordUser;
};

export const deleteDiscordUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(DISCORD_USER_TABLE_NAME)
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const resetDiscordUser = async (user: DiscordUser) => {
  user = {
    ...user,
    username: '',
    github: '',
    twitter: '',
    twitch: '',
    youtube: '',
    website: '',
    instagram: '',
    tiktok: '',
    linkedin: '',
    polywork: '',
  };
  return updateDiscordUser(user.id, user);
};

export const updateDiscordUser = async (
  id: string,
  user: DiscordUserUpdate
): Promise<DiscordUser> => {
  const res = await supabase
    .from(DISCORD_USER_TABLE_NAME)
    .update(user)
    .eq('id', id)
    .select();

  if (res.error) {
    throw res.error;
  }
  return res.data[0] as DiscordUser;
};
