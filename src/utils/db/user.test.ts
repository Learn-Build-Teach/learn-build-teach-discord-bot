import {
  createUser,
  deleteUser,
  getUserById,
  resetUser,
  upsertUser,
} from '../../utils/db/users';
import { prismaMock } from '../../singleton';
import { faker } from '@faker-js/faker';

const user = {
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
  prismaMock.user.create.mockResolvedValue(user);

  const returnedUser = await createUser(user.id, user.username);
  //HACK: There has to be a better way to handle this
  returnedUser.lastActiveTimestamp = user.lastActiveTimestamp;
  expect(returnedUser).toMatchObject(user);
});

test('it should return a user ', async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);

  const returnedUser = await getUserById(user.id);
  expect(returnedUser?.id).toEqual(user.id);
});

test('it should update an existing user ', async () => {
  prismaMock.user.upsert.mockResolvedValue(user);
  const updatedUser = {
    ...user,
    twitter: faker.internet.url(),
  };
  const response = await upsertUser(updatedUser);
  console.log(response);

  expect(response).toHaveProperty('count');
});
test('it should delete a user ', async () => {
  prismaMock.user.delete.mockResolvedValue(user);

  const returnedUser = await deleteUser(user.id);
  expect(returnedUser?.id).toEqual(user.id);
});
test('it should create a new user using upsert', async () => {
  prismaMock.user.upsert.mockResolvedValue(user);
  const updatedUser = {
    ...user,
    github: faker.internet.url(),
  };
  const returnedUser = await upsertUser(updatedUser);
  returnedUser.lastActiveTimestamp = updatedUser.lastActiveTimestamp;

  expect(returnedUser).toMatchObject(updatedUser);
});
test('it should reset a users profile', async () => {
  prismaMock.user.upsert.mockResolvedValue(user);
  const response = await resetUser(user);
  expect(response).toHaveProperty('count');
});
