module.exports = {
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
