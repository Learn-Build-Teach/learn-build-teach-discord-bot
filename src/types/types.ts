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

export enum SocialType {
  handle = 'handle',
  URL = 'URL',
}
export interface ProfileSocialConfig {
  validator(str: string): boolean;
  validationMessage: string;
  type: SocialType;
  urlPrefix?: string;
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
  LEARN = 'LEARN',
  BUILD = 'BUILD',
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
  storageBucketPath?: string;
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
  storageBucketPath?: string;
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
  storageBucketPath?: string;
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

export interface DiscussionQuestion {
  id: string;
  createdAt: string;
  question: string;
  asked: boolean;
}

export interface DiscussionQuestionInsert {
  question: string;
}

//Wins
export interface Win {
  id: string;
  createdAt: string;
  category: string;
  text: string;
  tweetable: boolean;
  emailable: boolean;
  tweeted: boolean;
  emailed: boolean;
  discordUserId: string;
}

export interface WinWithUsername extends Win {
  user: WithUsername;
}

export interface WinInsert {
  id?: string;
  createdAt?: string;
  category: string;
  text: string;
  tweetable?: boolean;
  emailable?: boolean;
  tweeted?: boolean;
  emailed?: boolean;
  discordUserId: string;
}
