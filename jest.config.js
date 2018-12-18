module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: './coverage',
  setupTestFrameworkScriptFile: 'jest-extended',
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
}
