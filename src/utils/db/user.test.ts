import {
  createUser,
  deleteUser,
  getUserById,
  resetUser,
  upsertUser,
} from '../../utils/db/users';
import { prismaMock } from '../../singleton';
import { faker } from '@faker-js/faker';

const mockUser = {
  id: faker.datatype.uuid(),
  username: faker.name.findName(),
  github: null,
  twitter: null,
  twitch: null,
  youtube: null,
  website: null,
  instagram: null,
  tiktok: null,
  linkedin: null,
  polywork: null,
  numMessages: 0,
  xp: 0,
  lastActiveTimestamp: null,
};

test('should create new user ', async () => {
  prismaMock.user.create.mockResolvedValue(mockUser);

  const returnedUser = await createUser(mockUser.id, mockUser.username);
  //HACK: There has to be a better way to handle this
  returnedUser.lastActiveTimestamp = mockUser.lastActiveTimestamp;
  expect(returnedUser).toMatchObject(mockUser);
});

test('it should return a user ', async () => {
  prismaMock.user.findUnique.mockResolvedValue(mockUser);

  const returnedUser = await getUserById(mockUser.id);
  expect(returnedUser?.id).toEqual(mockUser.id);
});

test('it should update an existing user ', async () => {
  const updatedUser = {
    ...mockUser,
    twitter: faker.internet.url(),
  };
  prismaMock.user.upsert.mockResolvedValue(updatedUser);
  const response = await upsertUser(updatedUser);
  console.log(response);
  expect(response).toMatchObject(updatedUser);
});
test('it should delete a user ', async () => {
  prismaMock.user.delete.mockResolvedValue(mockUser);

  const returnedUser = await deleteUser(mockUser.id);
  expect(returnedUser?.id).toEqual(mockUser.id);
});
test('it should create a new user using upsert', async () => {
  const updatedUser = {
    ...mockUser,
    github: faker.internet.url(),
  };
  prismaMock.user.upsert.mockResolvedValue(updatedUser);
  const returnedUser = await upsertUser(updatedUser);
  expect(returnedUser).toMatchObject(updatedUser);
});
test('it should reset a users profile', async () => {
  prismaMock.user.upsert.mockResolvedValue(mockUser);
  const response = await resetUser(mockUser);
  expect(response).toMatchObject(mockUser);
});
