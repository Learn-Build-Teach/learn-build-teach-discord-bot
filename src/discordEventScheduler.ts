import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from 'discord.js';
import { getDiscordGuild } from './utils/discord';
import cron from 'node-cron';
import { variables } from './variables';

export const startEventScheduler = async () => {
  try {
    await scheduleWinOfTheWeek();
  } catch (err) {
    console.error('Failed to schedule wins of the week event');
  }
};

//TODO: check to see if one already exists
const scheduleWinOfTheWeek = async () => {
  console.info('Scheduling Learn Build Teach Wins of the Week event');
  const name = 'Learn Build Teach Wins of the Week';
  const description =
    'No win is too small. Take a few minutes to reflect positively on what you accomplished this week and share with the group.';
  const guild = await getDiscordGuild();
  const nextFriday = getNextDayOfWeek(new Date(), 5);
  nextFriday.setHours(9);
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

const getNextDayOfWeek = (date: Date, dayOfWeek: number) => {
  const nextDay = new Date(date.getTime());
  nextDay.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
  return nextDay;
};
const EVERY_SUNDAY_NIGHT_CRON = '00 0 * * 0';

if (variables.ENABLE_EVENTS_SCHEDULER === 'TRUE') {
  console.log('schedule em');
  cron.schedule(EVERY_SUNDAY_NIGHT_CRON, scheduleWinOfTheWeek);
}
