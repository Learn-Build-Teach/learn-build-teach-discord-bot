import { getOrCreateDiscordUser } from '../utils/discordUser';
import { supabase } from '../utils/supabase';
import {
  Kudo,
  KudoCategory,
  KudoInsert,
  KudoWithUsernames,
  Leader,
} from '../types/types';

export const createKudo = async (kudo: KudoInsert): Promise<Kudo> => {
  const res = await supabase.from('Kudo').insert(kudo).select();
  if (res.error) {
    throw res.error;
  }
  return res.data[0] as Kudo;
};

export const giveKudos = async (
  giverId: string,
  receiverId: string,
  category: KudoCategory,
  description?: string
): Promise<Kudo> => {
  const receivingUser = await getOrCreateDiscordUser(receiverId);
  if (!receivingUser) {
    console.error(
      `Failed to get or create retrieving user with id ${receiverId}`
    );
    throw new Error('Failed to get or create retrieving user');
  }
  const givingUser = await getOrCreateDiscordUser(giverId);
  if (!givingUser) {
    console.error(
      `Failed to create get or create giving user with id ${giverId} `
    );
    throw new Error('Failed to get or create givine user.');
  }

  const kudo: KudoInsert = {
    category,
    description,
    receiverId,
    giverId,
  };

  return await createKudo(kudo);
};

// @ts-ignore
export const getKudosLeaderboard = async (): Promise<Leader[]> => {
  const res = await supabase.from('Kudo').select(`
  id, createdAt, category, description, points, receiverId, giverId, multiplier,
    receiver:receiverId(username),
    giver:giverId(username)
  `);

  if (res.error) {
    throw res.error;
  }

  const kudosWithUsernames = res.data as KudoWithUsernames[];

  const leaders = kudosWithUsernames.reduce(
    (acc: Map<string, Leader>, record: any) => {
      //Filter records without a username
      if (!record.receiver.username) return acc;

      if (acc.has(record.receiverId)) {
        const prevValue = acc.get(record.receiverId);
        acc.set(record.receiverId, {
          id: record.receiverId,
          username: record.receiver.username,
          totalPoints: (prevValue?.totalPoints || 0) + record.points,
          learnPoints:
            record.category === KudoCategory.LEARN
              ? (prevValue?.learnPoints || 0) + record.points
              : prevValue?.learnPoints || 0,
          buildPoints:
            record.category === KudoCategory.BUILD
              ? (prevValue?.buildPoints || 0) + record.points
              : prevValue?.buildPoints || 0,
          teachPoints:
            record.category === KudoCategory.TEACH
              ? (prevValue?.teachPoints || 0) + record.points
              : prevValue?.teachPoints || 0,
        });
      } else {
        acc.set(record.receiverId, {
          id: record.receiverId,
          username: record.receiver.username,
          totalPoints: record.points,
          learnPoints: record.category === 'LEARN' ? record.points : 0,
          buildPoints: record.category === 'BUILD' ? record.points : 0,
          teachPoints: record.category === 'TEACH' ? record.points : 0,
        });
      }
      return acc;
    },
    new Map<string, Leader>()
  );
  return [...leaders.values()]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);
};
