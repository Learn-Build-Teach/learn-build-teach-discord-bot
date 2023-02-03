import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import {
  Share,
  ShareInsert,
  ShareUpdate,
  ShareWithUsername,
} from '../types/types';
import { supabase } from '../utils/supabase';

export const SHARE_TABLE_NAME = 'Share';
export const SHARE_STORAGE_NAME = 'lbt-shares';
export const getShareToTweet = async () => {
  const { data, error } = await supabase
    .from(SHARE_TABLE_NAME)
    .select()
    .eq('tweetable', true)
    .eq('tweeted', false)
    .limit(1);

  if (error) {
    throw error;
  }

  return data[0] as Share;
};

export const getRecentShares = async (
  limit: number = 20
): Promise<ShareWithUsername[]> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .select(
      `id, createdAt, link, title, description, imageUrl, tweetable, discordUserId,
        user:discordUserId(username)`
    )
    .eq('emailable', true)
    .limit(limit)
    .order('createdAt', { ascending: false });

  if (res.error) {
    throw res.error;
  }

  return res.data as ShareWithUsername[];
};

export const markShareAsTweeted = async (id: string): Promise<Share> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .update({ tweeted: true })
    .eq('id', id)
    .select();

  if (res.error) {
    throw res.error;
  }

  return res.data[0] as Share;
};

export const updateShare = async (
  id: string,
  shareUpdate: ShareUpdate
): Promise<Share> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .update(shareUpdate)
    .eq('id', id)
    .select();

  if (res.error) {
    throw res.error;
  }

  return res.data[0] as Share;
};

export const markShareAsEmailed = async (id: string): Promise<Share> => {
  return await updateShare(id, { emailed: true });
};

export const createShare = async (
  share: ShareInsert
): Promise<ShareWithUsername | null> => {
  const { data } = await supabase
    .from(SHARE_TABLE_NAME)
    .select('link')
    .eq('link', share.link);

  // If the shared data is empty, i.e., the link doesn't already exist, add it.
  if (!data || data.length === 0) {
    const res = await supabase
      .from(SHARE_TABLE_NAME)
      .insert(share)
      .select(
        `id, createdAt, link, title, description, imageUrl, tweetable, 
      user:discordUserId(username)`
      );
    if (res.error) {
      throw res.error;
    }

    return res.data[0] as ShareWithUsername;
  }

  console.info('This link was already shared...');
  return null;
};

export const getSharesForNewsletter = async (): Promise<
  ShareWithUsername[]
> => {
  const limit = 10;
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .select(
      `id, createdAt, link, title, description, imageUrl, tweetable, discordUserId,
          user:discordUserId(username)`
    )
    .eq('emailable', true)
    .eq('emailed', false)
    .limit(limit)
    .order('createdAt', { ascending: false });

  if (res.error) {
    throw res.error;
  }

  const shares = res.data as ShareWithUsername[];
  const namesSet = new Set<string>();
  const sharesByUniqueAuthors: ShareWithUsername[] = shares.reduce(
    (filteredShares: ShareWithUsername[], share) => {
      if (namesSet.has(share.user.username)) return filteredShares;
      namesSet.add(share.user.username);
      filteredShares.push(share);
      return filteredShares;
    },
    []
  );

  return sharesByUniqueAuthors.slice(0, 5);
};

export const uploadShareImageFromRemoteURL = async (
  imageURL: string
): Promise<string> => {
  const extension = getURLExtension(imageURL);

  if (!extension) {
    throw new Error(`Failed to retrieve extension from URL: ${imageURL}`);
  }
  const uuid = uuidv4();
  const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'utf-8');
  const { data, error } = await supabase.storage
    .from(SHARE_STORAGE_NAME)
    .upload(`${uuid}.${extension}`, buffer, {
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data.path;
};

function getURLExtension(url: string) {
  return url.split(/[#?]/)[0].split('.').pop()?.trim();
}
