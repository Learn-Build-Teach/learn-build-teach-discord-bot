export interface DiscordUser {
  id: string;
  createdAt: string;
  lastActive: string;
  username: string;
  github?: string;
  twitter?: string;
  twitch?: string;
  youtube?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  polywork?: string;
  numMessages: number;
  xp: number;
}

export interface DiscordUserInsert {
  id?: string;
  createdAt?: string;
  lastActive: string;
  username?: string;
  github?: string;
  twitter?: string;
  twitch?: string;
  youtube?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  polywork?: string;
  numMessages?: number;
  xp?: number;
}

export interface DiscordUserUpdate {
  id?: string;
  createdAt?: string;
  lastActive?: string;
  username?: string;
  github?: string;
  twitter?: string;
  twitch?: string;
  youtube?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  polywork?: string;
  numMessages?: number;
  xp?: number;
}

export interface Kudo {
  id: string;
  createdAt: string;
  category: string;
  description?: string;
  points: number;
  receiverId: string;
  giverId: string;
  multiplier: number;
}

//TODO: can I get around disabling eslint?
export enum KudoCategory {
  // eslint-disable-next-line no-unused-vars
  LEARN = 'LEARN',
  // eslint-disable-next-line no-unused-vars
  BUILD = 'BUILD',
  // eslint-disable-next-line no-unused-vars
  TEACH = 'TEACH',
}

export interface KudoWithUsernames extends Kudo {
  giver: {
    username: string;
  };
  receiver: {
    username: string;
  };
}

export interface KudoInsert {
  id?: string;
  createdAt?: string;
  category?: string;
  description?: string;
  points?: number;
  receiverId: string;
  giverId?: string;
  multiplier?: number;
}

export interface KudoUpdate {
  id?: string;
  createdAt?: string;
  category?: string;
  description?: string;
  points?: number;
  receiverId?: string;
  giverId?: string;
  multiplier?: number;
}

export interface Share {
  id: string;
  createdAt: string;
  link: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tweetable: boolean;
  emailable: boolean;
  tweeted: boolean;
  emailed: boolean;
  discordUserId: string;
}

export interface WithUsername {
  username: string;
}

export interface ShareWithUsername extends Share {
  user: WithUsername;
}

export interface ShareInsert {
  id?: string;
  createdAt?: string;
  link: string;
  title: string;
  description?: string;
  imageUrl: string;
  tweetable?: boolean;
  emailable?: boolean;
  tweeted?: boolean;
  emailed?: boolean;
  discordUserId: string;
}

export interface ShareUpdate {
  id?: string;
  createdAt?: string;
  link?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  tweetable?: boolean;
  emailable?: boolean;
  tweeted?: boolean;
  emailed?: boolean;
  discordUserId?: string;
}

export interface Leader {
  username: string;
  totalPoints: number;
  learnPoints: number;
  buildPoints: number;
  teachPoints: number;
  id: string;
}
