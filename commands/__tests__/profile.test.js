import  profile  from '../profile';
import { MockCommandInteraction,  MockCommandInteractionOptionResolver } from '../../__mocks__/profile.mock';

jest.mock('../../utils/Airtable', () => jest.fn());
jest.mock('discord.js', () => jest.fn());
jest.mock('../../utils/Airtable', () => ({
    userTable: {
      select: () => ({  
        firstPage: jest.fn() 
      }),
    },
    minifyRecords: () => jest.fn(),
}));

describe('profile test', () => {
  it('should return the name of the command', () => {
    const name = profile.name;
    expect(name).toBe('profile');
  });

  it('should return the name the right description', () => {
    const description = profile.description;
    expect(description).toBe("Get a user's profile details");
  });

  it('should return the right options', () => {
    const options = profile.options[0];
    expect(options.name).toBe('username');
    expect(options.description).toBe('Tag the user you are looking for.');
    expect(options.required).toBe(false);
    expect(options.type).toBe('MENTIONABLE');
  });
   
  it('should return undefined user', async () => {
    const val = await profile.callback(MockCommandInteraction, MockCommandInteractionOptionResolver);
    expect(val).toBe(undefined);
  });
});
