import { WinInsert, WinWithUsername } from '../types/types';
import { supabase } from '../utils/supabase';

export const WIN_TABLE_NAME = 'Win';

export const createWin = async (
  win: WinInsert
): Promise<WinWithUsername | null> => {
  const res = await supabase
    .from(WIN_TABLE_NAME)
    .insert(win)
    .select(
      `id, createdAt, text, category, tweetable, tweeted, emailable, emailed, discordUserId, user:discordUserId(username)`
    );

  if (res.error) {
    throw res.error;
  }
  return res.data[0] as WinWithUsername;
};
