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
    nav: [
      { text: 'Guide', link: '/guide/' },
    ],
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [
          [ 'guide/', 'Getting started' ],
          [ 'guide/field-property', 'Field' ],
          [ 'guide/validation', 'Validation' ],
          [ 'guide/field-events', 'Field Events' ],
          [ 'guide/options', 'Options' ],
          [ 'guide/form-submission', 'Form Submission' ],
          [ 'guide/interceptors', 'Interceptors' ],
        ]
      },
    ]
  }
}
