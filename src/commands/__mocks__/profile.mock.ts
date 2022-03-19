export const MockCommandInteraction: any = {
  user: {
    username: 'username',
    id: 1,
  },
  deferReply: jest.fn(),
  editReply: jest.fn(),
};

//TODO: Mock out the discord client.
// I found this https://dev.to/heymarkkop/how-to-implement-test-and-mock-discordjs-v13-slash-commands-with-typescript-22lc
//it has links to code examples and appears to mock out all the things we care about and more.
export const MockCommandInteractionOptionResolver = {
  user: 'user',
  getMentionable: jest.fn(() => {
    user: {
      username: 'username';
      id: 1;
    }
  }),
};
