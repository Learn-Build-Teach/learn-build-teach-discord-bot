// Copied from https://raw.githubusercontent.com/Markkop/corvo-astral/master/tests/mockDiscord.ts

import {
  Client,
  Guild,
  Channel,
  GuildChannel,
  TextChannel,
  User,
  GuildMember,
  Message,
  MessageReaction,
  CommandInteraction,
} from 'discord.js';

export default class MockDiscord {
  private client!: Client;
  private guild!: Guild;
  private channel!: Channel;
  private guildChannel!: GuildChannel;
  private textChannel!: TextChannel;
  private user!: User;
  private guildMember!: GuildMember;
  public message!: Message;
  public interaction!: CommandInteraction;

  private botPartyChannel!: Channel;
  private botPartyGuildChannel!: GuildChannel;
  private botPartyTextChannel!: TextChannel;

  private reaction!: MessageReaction;
  private reactionUser!: User;

  constructor(options: any) {
    this.mockClient();
    this.mockGuild();
    this.mockChannel();
    this.mockGuildChannel();
    this.mockTextChannel();

    this.mockPartyChannel();
    this.mockBotPartyGuildChannel();
    this.mockBotPartyTextChannel();

    this.mockUser();
    this.mockGuildMember();
    this.mockMessage(options?.message?.content);
    this.mockInteracion(options?.command);

    this.mockPrototypes();

    if (options?.partyChannel?.messages) {
      this.mockPartyMessages(options.partyChannel.messages);
    }

    if (options?.reaction) {
      const lastPartyMessage = this.botPartyTextChannel.messages.cache.last();
      this.mockReaction(options.reaction, lastPartyMessage);
      this.mockReactionUser(options.reaction?.user?.id);
    }

    this.guild.channels.cache.set(
      this.botPartyTextChannel.id,
      this.botPartyTextChannel
    );
    this.client.channels.cache.set(
      this.botPartyTextChannel.id,
      this.botPartyTextChannel
    );
    this.client.guilds.cache.set(this.guild.id, this.guild);
  }

  public getClient(): Client {
    return this.client;
  }

  public getGuild(): Guild {
    return this.guild;
  }

  public getChannel(): Channel {
    return this.channel;
  }

  public getGuildChannel(): GuildChannel {
    return this.guildChannel;
  }

  public getBotPartyGuildChannel(): GuildChannel {
    return this.botPartyGuildChannel;
  }

  public getBotPartyTextChannel(): TextChannel {
    return this.botPartyTextChannel;
  }

  public getTextChannel(): TextChannel {
    return this.textChannel;
  }

  public getUser(): User {
    return this.user;
  }

  public getGuildMember(): GuildMember {
    return this.guildMember;
  }

  public getMessage(): Message {
    return this.message;
  }

  public getInteraction(): CommandInteraction {
    return this.interaction;
  }

  public getReaction(): MessageReaction {
    return this.reaction;
  }

  public getReactionUser(): User {
    return this.reactionUser;
  }

  private mockPrototypes() {
    TextChannel.prototype.send = jest.fn().mockImplementation(() => {
      return {
        react: jest.fn(),
      };
    });

    Message.prototype.edit = jest.fn();
  }

  private mockReaction(reactionOptions: any, message: any): void {
    this.reaction = Reflect.construct(MessageReaction, [
      this.client,
      { emoji: reactionOptions.emoji },
      message,
    ]);
  }

  private mockClient(): void {
    this.client = new Client({ intents: [], restSweepInterval: 0 });
    this.client.login = jest.fn(() => Promise.resolve('LOGIN_TOKEN'));
  }

  private mockGuild(): void {
    this.guild = Reflect.construct(Guild, [
      this.client,
      {
        unavailable: false,
        id: 'guild-id',
        name: 'mocked js guild',
        icon: 'mocked guild icon url',
        splash: 'mocked guild splash url',
        region: 'eu-west',
        member_count: 42,
        large: false,
        features: [],
        application_id: 'application-id',
        afkTimeout: 1000,
        afk_channel_id: 'afk-channel-id',
        system_channel_id: 'system-channel-id',
        embed_enabled: true,
        verification_level: 2,
        explicit_content_filter: 3,
        mfa_level: 8,
        joined_at: new Date('2018-01-01').getTime(),
        owner_id: 'owner-id',
        channels: [],
        roles: [],
        presences: [],
        voice_states: [],
        emojis: [],
      },
    ]);
  }

  private mockChannel(): void {
    this.channel = Reflect.construct(Channel, [
      this.client,
      {
        id: 'channel-id',
      },
    ]);
  }

  private mockPartyChannel(): void {
    this.botPartyChannel = Reflect.construct(Channel, [
      this.client,
      {
        id: 'party-channel-id',
      },
    ]);
  }

  private mockGuildChannel(): void {
    this.guildChannel = Reflect.construct(GuildChannel, [
      this.guild,
      {
        ...this.channel,
        name: 'guild-channel',
        position: 1,
        parent_id: '123456789',
        permission_overwrites: [],
      },
    ]);
  }

  private mockBotPartyTextChannel(): void {
    this.botPartyTextChannel = Reflect.construct(TextChannel, [
      this.guild,
      {
        ...this.botPartyGuildChannel,
        topic: 'topic',
        nsfw: false,
        last_message_id: '123456789',
        lastPinTimestamp: new Date('2019-01-01').getTime(),
        rate_limit_per_user: 0,
      },
    ]);
    this.botPartyTextChannel.messages.fetch = jest
      .fn()
      .mockResolvedValue(this.botPartyTextChannel.messages.cache);
  }

  private mockBotPartyGuildChannel(): void {
    this.botPartyGuildChannel = Reflect.construct(GuildChannel, [
      this.guild,
      {
        ...this.botPartyChannel,
        name: 'listagem-de-grupos',
        position: 2,
        parent_id: '2',
        permission_overwrites: [],
      },
    ]);
  }

  private mockTextChannel(): void {
    this.textChannel = Reflect.construct(TextChannel, [
      this.guild,
      {
        ...this.guildChannel,
        topic: 'topic',
        nsfw: false,
        last_message_id: '123456789',
        lastPinTimestamp: new Date('2019-01-01').getTime(),
        rate_limit_per_user: 0,
      },
    ]);
  }

  private mockUser(): void {
    this.user = Reflect.construct(User, [
      this.client,
      {
        id: 'user-id',
        username: 'USERNAME',
        discriminator: 'user#0000',
        avatar: 'user avatar url',
        bot: false,
      },
    ]);
  }

  private mockReactionUser(userId: string): void {
    this.reactionUser = Reflect.construct(User, [
      this.client,
      {
        id: userId,
        username: `USERNAME-${userId}`,
        discriminator: `user#0000-${userId}`,
        avatar: 'user avatar url',
        bot: false,
      },
    ]);
  }

  private mockGuildMember(): void {
    this.guildMember = Reflect.construct(GuildMember, [
      this.client,
      {
        id: BigInt(1),
        deaf: false,
        mute: false,
        self_mute: false,
        self_deaf: false,
        session_id: 'session-id',
        channel_id: 'channel-id',
        nick: 'nick',
        joined_at: new Date('2020-01-01').getTime(),
        user: this.user,
        roles: [],
      },
      this.guild,
    ]);
  }

  private mockPartyMessages(messages: any): void {
    messages.forEach((message: any) => {
      const msg = Reflect.construct(Message, [
        this.client,
        {
          id: BigInt(10),
          type: 'DEFAULT',
          content: '',
          author: this.user,
          webhook_id: null,
          member: this.guildMember,
          pinned: false,
          tts: false,
          nonce: 'nonce',
          embeds: [message.embed],
          attachments: [],
          edited_timestamp: null,
          reactions: [],
          mentions: [],
          mention_roles: [],
          mention_everyone: [],
          hit: false,
        },
        this.botPartyTextChannel,
      ]);
      msg.channelId = this.botPartyTextChannel.id;
      this.botPartyTextChannel.messages.cache.set(msg.id, msg);
    });
  }

  private mockMessage(content: any): void {
    this.message = Reflect.construct(Message, [
      this.client,
      {
        id: BigInt(10),
        type: 'DEFAULT',
        content: content,
        author: this.user,
        webhook_id: null,
        member: this.guildMember,
        pinned: false,
        tts: false,
        nonce: 'nonce',
        embeds: [],
        attachments: [],
        edited_timestamp: null,
        reactions: [],
        mentions: [],
        mention_roles: [],
        mention_everyone: [],
        hit: false,
      },
      this.textChannel,
    ]);
    this.message.react = jest.fn();
  }

  private mockInteracion(command: any): void {
    if (!command) return;
    this.interaction = Reflect.construct(CommandInteraction, [
      this.client,
      {
        data: command,
        id: BigInt(1),
        user: this.guildMember,
      },
    ]);
    this.interaction.reply = jest.fn();
    this.interaction.guildId = this.guild.id;
    this.interaction.isCommand = jest.fn(() => true);
  }
}
