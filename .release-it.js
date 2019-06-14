// Load env files to the process
require('dotenv').config()

module.exports = {
  hooks: {
    'before:init': ['npm run test:prod'],
  },
  git: {
    tagName: 'v${version}',
    changelog: false,
    requireCleanWorkingDir: false,
    commitMessage: 'build: release v${version}',
  },
  github: {
    release: true,
    releaseName: 'v${version}',
  },
}
