import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentVariables {
  DISCORD_ADMIN_SHARE_REVIEW_CHANNEL?: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  DISCORD_GENERAL_VOICE_ID?: string;
  ALLOW_SELF_KUDOS?: string;
  SEND_TWEETS?: boolean;
  SERVER_API_KEY: string;
  TWITTER_ACCESS_TOKEN_KEY?: string;
  TWITTER_ACCESS_TOKEN_SECRET?: string;
  TWITTER_CONSUMER_KEY?: string;
  TWITTER_CONSUMER_SECRET?: string;
  EMAIL_ALERTS_ON?: string;
  EMAIL_ALERTS_RECIPIENT?: string;
  EMAIL_ALERTS_SENDER?: string;
  SENDGRID_API_KEY?: string;
  SUPABASE_PROJECT_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  YOUTUBE_API_KEY?: string;
  PORT?: string;
  ENABLE_EVENTS_SCHEDULER?: boolean;
  EVENT_SCHEDULER_CRON?: string;
  DISCORD_DISCUSSIONS_CHANNEL_ID?: string;
  POST_WEEKLY_DISCUSSION_QUESTION?: boolean;
  HIGHLIGHT_PROJECT_ID?: string;
}

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('DISCORD_BOT_TOKEN environment variable is required');
  throw new Error('DISCORD_BOT_TOKEN environment variable is required');
}
if (!process.env.DISCORD_GUILD_ID) {
  console.error('DISCORD_GUILD_ID environment variable is required');
  throw new Error('DISCORD_GUILD_ID environment variable is required');
}

if (!process.env.SERVER_API_KEY) {
  console.error('SERVER_API_KEY environment variable is required');
  throw new Error('SERVER_API_KEY environment variable is required');
}

if (!process.env.SUPABASE_PROJECT_URL) {
  console.error('SUPABASE_PROJECT_URL environment variable is required');
  throw new Error('SUPABASE_PROJECT_URL environment variable is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

export const variables: EnvironmentVariables = {
  DISCORD_ADMIN_SHARE_REVIEW_CHANNEL:
    process.env.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  DISCORD_GENERAL_VOICE_ID: process.env.DISCORD_GENERAL_VOICE_ID,
  ALLOW_SELF_KUDOS: process.env.ALLOW_SELF_KUDOS,
  SEND_TWEETS: process.env.SEND_TWEETS === 'TRUE' || false,
  SERVER_API_KEY: process.env.SERVER_API_KEY,
  TWITTER_ACCESS_TOKEN_KEY: process.env.TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  EMAIL_ALERTS_ON: process.env.EMAIL_ALERTS_ON,
  EMAIL_ALERTS_RECIPIENT: process.env.EMAIL_ALERTS_RECIPIENT,
  EMAIL_ALERTS_SENDER: process.env.EMAIL_ALERTS_SENDER,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  PORT: process.env.PORT,
  ENABLE_EVENTS_SCHEDULER:
    process.env.ENABLE_EVENTS_SCHEDULER === 'TRUE' || false,
  EVENT_SCHEDULER_CRON: process.env.EVENT_SCHEDULER_CRON,
  POST_WEEKLY_DISCUSSION_QUESTION:
    process.env.POST_WEEKLY_DISCUSSION_QUESTION === 'TRUE' || false,
  DISCORD_DISCUSSIONS_CHANNEL_ID: process.env.DISCORD_DISCUSSIONS_CHANNEL_ID,
  HIGHLIGHT_PROJECT_ID: process.env.HIGHLIGHT_PROJECT_ID,
};
