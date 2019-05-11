module.exports = {
  preset: 'ts-jest',
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  // setupTestFrameworkScriptFile: 'jest-extended',
}
