module.exports = {
  preset: 'ts-jest',
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
  },
}
