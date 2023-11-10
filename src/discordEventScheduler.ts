import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from 'discord.js';
import { getDiscordGuild } from './utils/discord';
import cron from 'node-cron';
import { variables } from './variables';

//TODO: check to see if one already exists
export const scheduleWinOfTheWeek = async () => {
  console.info('Scheduling Learn Build Teach Wins of the Week event');
  const name = 'Learn Build Teach Wins of the Week';
  const description =
    'No win is too small. Take a few minutes to reflect positively on what you accomplished this week and share with the group.';
  const guild = await getDiscordGuild();
  const nextFriday = getNextDayOfWeek(new Date(), 5);
  nextFriday.setHours(15);
  nextFriday.setMinutes(0);

  const event = await guild?.scheduledEvents.create({
    name,
    description,
    scheduledStartTime: nextFriday,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    entityType: GuildScheduledEventEntityType.Voice,
    channel: variables.DISCORD_GENERAL_VOICE_ID,
  });
  console.info(
    '🚀 ~ file: discordEventScheduler.ts:35 ~ scheduleWinOfTheWeek ~ successfully created event:',
    event
  );
};

export const scheduleLeetCodeLiveCoding = async () => {
  console.info('Scheduling Community Chat Hour event');
  const name = 'LeetCode Live Coding';
  const description = `Let's solve some LeetCode problems!`;
  const guild = await getDiscordGuild();
  const nextThursday = getNextDayOfWeek(new Date(), 4);
  nextThursday.setHours(17);
  nextThursday.setMinutes(0);

  const event = await guild?.scheduledEvents.create({
    name,
    description,
    scheduledStartTime: nextThursday,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    entityType: GuildScheduledEventEntityType.Voice,
    channel: variables.DISCORD_GENERAL_VOICE_ID,
  });
  console.info(
    '🚀 ~ file: discordEventScheduler.ts:35 ~ scheduleLeetCodeLiveCoding ~ successfully created event:',
    event
  );
};

const scheduleEvents = () => {
  try {
    scheduleWinOfTheWeek();
    scheduleLeetCodeLiveCoding();
  } catch (error) {
    console.error('Failed to schedule events');
  }
};

const getNextDayOfWeek = (date: Date, dayOfWeek: number): Date => {
  const nextDay = new Date(date.getTime());
  nextDay.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
  return nextDay;
};

export const startEventScheduler = async () => {
  const DEFAULT_CRON = '00 0 * * 0';
  const cronStr = variables.EVENT_SCHEDULER_CRON || DEFAULT_CRON;
  cron.schedule(cronStr, scheduleEvents);
};
