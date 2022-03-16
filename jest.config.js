/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    'src/{.*}': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
};
