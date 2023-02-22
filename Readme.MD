# Learn Build Teach Discord Bot

This bot allows [Learn Build Teach Discord](https://discord.gg/vM2bagU) members to share content, give kudos to other members, etc.

For a quick a overview of how to create a Discord Bot with Node.js here are a few resources.

- [Discord Bot Tutorial | JavaScript & Node.js](https://www.youtube.com/watch?v=pDQAn18-2go&ab_channel=Andy%27sTechTutorials)
- [Create a Discord Bot with Node.js](https://www.youtube.com/watch?v=BmKXBVdEV0g&ab_channel=TraversyMedia)
- [Code a Discord Bot with JavaScript - Host for Free in the Cloud](https://www.youtube.com/watch?v=7rU_KyudGBY&t=14s&ab_channel=freeCodeCamp.org)

## Code overview

### Commands

Individual commands have their own file inside of the `/src/commands` directory. Each command should export an object with three properties.

- callback - a callback function that is triggered when the command is used
- name - the name of the command
- description - short description of what the command does

The callback function accepts one parameter which is a `Command Interaction`. Check out [Creating Slash Commands Documentation](https://discordjs.guide/creating-your-bot/slash-commands.html#before-you-continue) for more info.

Here is an example.

```javascript
const resetProfile = async (interaction: CommandInteraction) => {
  //some logic
};
export default {
  callback: resetProfile,
  name: 'resetprofile',
  description: 'Reset your profile settings',
};
```

## Server

The backend is a Node.js and Express app. This is used to handle API requests that are deteailed in the `/src/server/routes` directory.

## Utils

These are utility files for interacting with Discord, Supabase, Twitter, etc.

## How to run

### 1) Install dependencies

```sh
npm install
```

### 2) Get the API keys/credentials

You can get the API keys from the following websites

- [Discord](https://discord.com/developers/applications)
- [Supabase](https://supabase.com/)
- [Discord Guide](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- [Twitter API Docs](https://developer.twitter.com/en/docs/twitter-api)

### 3) Set the environment variables

In a `.env` file, make sure to include the requied environment variables listed below.

You will need to create your own test server in Discord as well as a project in Supabase. We are thinking through easier ways to help with this process if you have ideas.

**_Required Varaiables_**

```env
# api
SERVER_API_KEY=

# discord
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=

# supabase
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_URL=
```

**_Optional Variables_**

```env

#Discord
DISCORD_GENERAL_VOICE_ID=<GENERAL_VOICE_ID>
ALLOW_SELF_KUDOS=<TRUE|FALSE>
ENABLE_EVENTS_SCHEDULER=<TRUE|FALSE>
EVENT_SCHEDULER_CRON=<CRON SYNTAX>

#Api - used for authentication on API requests
SERVER_API_KEY=<API_KEY>

#Email alerts - used to send email alerts based on errors
EMAIL_ALERTS_ON=<TRUE|FALSE>
EMAIL_ALERTS_RECIPIENT=<EMAIL@EMAIL.COM>
EMAIL_ALERTS_SENDER=<EMAIL@EMAIL.COM>
SENDGRID_API_KEY=<API_KEY>

#Twitter - used for sending automatic tweets of content
SEND_TWEETS=<TRUE|FALSE>
TWITTER_ACCESS_TOKEN_KEY=<ACCESS_TOKEN_KEY>
TWITTER_ACCESS_TOKEN_SECRET=<ACCESS_TOKEN_SECRET>
TWITTER_CONSUMER_KEY=<CONSUMER_KEY>
TWITTER_CONSUMER_SECRET=<CONSUMER_KEY>

#Discord Admin - used for reviewing shared content
DISCORD_ADMIN_SHARE_REVIEW_CHANNEL=<REVIEW_CHANNEL_ID>
```

### 4) Run the bot

```sh
npm run dev
```

## Commands

### `/profile`

Get profile details about you or another discord member.

### `/updateProfile`

Update your profile with the following flags. I will use these pieces of information to help share your content.

- `twitter`: Your Twitter handle
- `instagram`: Your Instagram handle
- `youtube`: Your YouTube URL
- `github`: Your Github handle
- `twitch`: Your Twitch handle
- `website`: Your website URL
- `tiktok`: Your TikTok handle
- `linkedin`: Your LinkedIn handle
- `polywork`: Your Polywork handle

### `/resetProfile`

Clear your existing profile in case your display name has changed, you entered incorrect info, etc.

### `/share`

Share a piece of content (article, video, etc.) by including a valid URL. These pieces of content will considered for sharing on Twitter and/or the James Q Quick newsletter. You can (optionally) include a suggested tweet text after the URL.

ex. `/share https://www.jamesqquick.com/ This is a suggested tweet text`

### `/kudo`

Give Kudos to another user. Kudos will be automatically given when reacting to a post using the following emojis: 'learn', 'build', and 'teach'.

### `/kudosLeaderboard`

View the Kudos Leaderboard.
