module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__mocks__/prismaMock.ts'],
  roots: ['<rootDir>/src/'],
};
