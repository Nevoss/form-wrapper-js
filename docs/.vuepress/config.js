module.exports = {
  title: 'Form Wrapper JS',
  description: 'A lightweight library that creates forms systems in a convenient and easy way, without dependencies and magic code.',
  themeConfig: {
    repo: 'Nevoss/form-wrapper-js',
    nav: [
      { text: 'Guide', link: '/guide/' },
    ],
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [
          [ 'guide/', 'Introduction' ],
          [ 'guide/getting-started', 'Getting started' ],
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
