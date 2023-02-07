import dotenv from 'dotenv';
dotenv.config();

interface EnvironmentVariables {
  DISCORD_ADMIN_SHARE_REVIEW_CHANNEL: string | undefined;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  SEND_TWEETS: string | undefined;
  SERVER_API_KEY: string | undefined;
  TWITTER_ACCESS_TOKEN_KEY: string | undefined;
  TWITTER_ACCESS_TOKEN_SECRET: string | undefined;
  TWITTER_CONSUMER_KEY: string | undefined;
  TWITTER_CONSUMER_SECRET: string | undefined;
  EMAIL_ALERTS_ON: string | undefined;
  EMAIL_ALERTS_RECIPIENT: string | undefined;
  EMAIL_ALERTS_SENDER: string | undefined;
  SENDGRID_API_KEY: string | undefined;
  SUPABASE_PROJECT_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  YOUTUBE_API_KEY?: string;
}

// REQUIRED DISCORD CREDENTIALS
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('DISCORD_BOT_TOKEN environment variable is required');
  throw new Error('DISCORD_BOT_TOKEN environment variable is required');
}
if (!process.env.DISCORD_GUILD_ID) {
  console.error('DISCORD_GUILD_ID environment variable is required');
  throw new Error('DISCORD_GUILD_ID environment variable is required');
}

// REQUIRED SUPABASE CREDENTIALS
if (!process.env.SUPABASE_PROJECT_URL) {
  console.error('SUPABASE_PROJECT_URL environment variable is required');
  throw new Error('SUPABASE_PROJECT_URL environment variable is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

// OPTIONAL TWITTER CREDENTIALS
// ALL REQUIRED FOR TWITTER INTERACTION
if (!process.env.SEND_TWEETS) {
  console.warn(
    'SEND_TWEETS environment variable is required for twitter interaction'
  );
}
if (!process.env.SERVER_API_KEY) {
  console.warn(
    'SERVER_API_KEY environment variable is required for twitter interaction'
  );
}
if (!process.env.TWITTER_ACCESS_TOKEN_KEY) {
  console.warn(
    'TWITTER_ACCESS_TOKEN_KEY environment variable is required for twitter interaction'
  );
}
if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) {
  console.warn(
    'TWITTER_ACCESS_TOKEN_SECRET environment variable is required for twitter interaction'
  );
}
if (!process.env.TWITTER_CONSUMER_KEY) {
  console.warn(
    'TWITTER_CONSUMER_KEY environment variable is required for twitter interaction'
  );
}
if (!process.env.TWITTER_CONSUMER_SECRET) {
  console.warn(
    'TWITTER_CONSUMER_SECRET environment variable is required for twitter interaction'
  );
}

// OPTIONAL EMAIL CREDENTIALS
// ALL REQUIRED FOR SENDGRID INTERACTION
if (!process.env.EMAIL_ALERTS_ON) {
  console.warn(
    'EMAIL_ALERTS_ON environment variable is required for Sendgrid integration'
  );
}
if (!process.env.EMAIL_ALERTS_RECIPIENT) {
  console.warn(
    'EMAIL_ALERTS_RECIPIENT environment variable is required for Sendgrid integration'
  );
}
if (!process.env.EMAIL_ALERTS_SENDER) {
  console.warn(
    'EMAIL_ALERTS_SENDER environment variable is required for Sendgrid integration'
  );
}
if (!process.env.SENDGRID_API_KEY) {
  console.warn(
    'SENDGRID_API_KEY environment variable is required for Sendgrid integration'
  );
}

export const variables: EnvironmentVariables = {
  DISCORD_ADMIN_SHARE_REVIEW_CHANNEL:
    process.env.DISCORD_ADMIN_SHARE_REVIEW_CHANNEL,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  SEND_TWEETS: process.env.SEND_TWEETS,
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
};
