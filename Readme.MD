# Learn Build Teach Discord Bot

This bot allows [Learn Build Teach Discord](https://discord.gg/vM2bagU) members to share a piece of content (article, video, etc.) that I will consider tweeting about.

## How to run

### 1) Install dependencies

```sh
npm install
```

### 2) Get the API keys

You can get the API keys from the following websites

- [Discord](https://discord.com/developers/applications)
- [Airtable](https://airtable.com/account)
- [Twitter API Docs](https://developer.twitter.com/en/docs/twitter-api)

### 3) Set the environment variables

```py
DISCORD_GUILD_ID=""
DISCORD_BOT_TOKEN=""
AIRTABLE_API_KEY=""
AIRTABLE_SHARE_TABLE_NAME=""
AIRTABLE_USER_TABLE_NAME=""
AIRTABLE_BASE_ID=""
# ADD ONLY IF YOU WANT TO DO TWEET STUFF
COMMANDS_DIR="" #OPTIONAL
SEND_TWEETS=""
TWITTER_CONSUMER_KEY=""
TWITTER_CONSUMER_SECRET=""
TWITTER_ACCESS_TOKEN_KEY=""
TWITTER_ACCESS_TOKEN_SECRET=""
```

### 4) Run the bot

```sh
npm run dev
```

## Commands

**updateProfile**
Update your profile with the following flags. I will use these pieces of information to help share your content.

-   `twitter`: your Twitter handle
-   `twitch`: your Twitch username
-   `youtube`: your YouTube URL
-   `instagram`: your Instagram username
-   `github`: your Github username
-   `website`: your personal website URL

**profile**
Get profile details about you or another discord member.

**resetProfile**
Clear your existing profile in case your display name has changed, you entered incorrect info, etc.

**share**
Share a piece of content (article, video, etc.) by including a valid URL. I will consider sharing this on Twitter and/or my newsletter. You can (optionally) include a suggested tweet text after the URL.

ex. `/share https://www.jamesqquick.com/ This is a suggested tweet text`
