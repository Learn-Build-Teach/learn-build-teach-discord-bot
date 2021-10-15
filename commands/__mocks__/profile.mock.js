export const MockCommandInteraction = {
  user: {
    username: 'username',
    id: 1
  },
  deferReply: jest.fn(),
  editReply: jest.fn(),
};

export const MockCommandInteractionOptionResolver =  {
  user: 'user',
  getMentionable: jest.fn(() => {
    user: {
      username: 'username';
      id: 1
    }
  })
};
