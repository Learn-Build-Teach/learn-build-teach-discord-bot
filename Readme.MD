# Learn Build Teach Discord Bot

This bot allows [Learn Build Teach Discord](https://discord.gg/vM2bagU) members to share a piece of content (article, video, etc.) that will potentially be shared on Twitter and in the James Q Quick email newsletter.

## How to run

### 1) Install dependencies

```sh
npm install
```

### 2) Get the API keys/credentials

You can get the API keys from the following websites

- [Discord](https://discord.com/developers/applications)
- [Discord Guide](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- [Twitter API Docs](https://developer.twitter.com/en/docs/twitter-api)
- [PlanetScale Connection String](https://docs.planetscale.com/concepts/connection-strings)
- [Running MySql locally (instead of planetscale)](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing)

### 3) Set the environment variables

```env
DISCORD_GUILD_ID=""
DISCORD_BOT_TOKEN=""
COMMANDS_DIR="" #OPTIONAL
# ADD ONLY IF YOU WANT TO DO TWEET STUFF
SEND_TWEETS=""
TWITTER_CONSUMER_KEY=""
TWITTER_CONSUMER_SECRET=""
TWITTER_ACCESS_TOKEN_KEY=""
TWITTER_ACCESS_TOKEN_SECRET=""
# CONNECT TO PLANETSCALE(MYSQL) DATABASE
DATABASE_URL=""
```

### 4) Run the bot

```sh
npm run dev
```

## Commands

### updateProfile

Update your profile with the following flags. I will use these pieces of information to help share your content.

- `twitter`: your Twitter handle
- `twitch`: your Twitch username
- `youtube`: your YouTube URL
- `instagram`: your Instagram username
- `github`: your Github username
- `website`: your personal website URL

### profile

Get profile details about you or another discord member.

### resetProfile

Clear your existing profile in case your display name has changed, you entered incorrect info, etc.

### share

Share a piece of content (article, video, etc.) by including a valid URL. I will consider sharing this on Twitter and/or my newsletter. You can (optionally) include a suggested tweet text after the URL.

ex. `/share https://www.jamesqquick.com/ This is a suggested tweet text`

### kudo

Give Kudos to another user

If have emojis named 'learn' | 'build' | 'teach' those will also give a kudo
