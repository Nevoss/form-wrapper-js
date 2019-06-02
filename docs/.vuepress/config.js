const versioning = require('./lib/versioning.js')

module.exports = {
  base: '/form-wrapper-js/',
  title: 'Form Wrapper JS',
  description: 'A lightweight library that creates forms systems in a convenient and easy way, without dependencies and magic code.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    repo: 'Nevoss/form-wrapper-js',
    lastUpdated: 'Last Updated',
    docsDir: 'docs',
    editLinks: true,
    versions: {
      latest: versioning.versions.latest,
      selected: versioning.versions.latest,
      all: versioning.versions.all
    },
    nav: [
      {
        text: `Docs`,
        items: versioning.linksFor('guide/')
      },
    ],
    sidebar: versioning.sidebars
  }
}
