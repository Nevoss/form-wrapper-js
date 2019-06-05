module.exports = [
  {
    title: 'Guide',
    collapsable: true,
    children: [
      ['guide/', 'Getting started'],
      ['guide/field-property', 'Field'],
      ['guide/validation', 'Validation'],
      ['guide/field-events', 'Field Events'],
      ['guide/options', 'Options'],
      ['guide/form-submission', 'Form Submission'],
      ['guide/interceptors', 'Interceptors'],
    ],
  },
  {
    title: 'Api Reference',
    collapsable: true,
    children: [
      ['api-reference/classes/form', 'Form'],
      ['api-reference/classes/formcollection', 'FormCollection'],
      ['api-reference/interfaces/options', 'Options'],
      [
        'api-reference/interfaces/successfulsubmissionoptions',
        'Options - Successful Submission',
      ],
      ['api-reference/interfaces/validationoptions', 'Options - Validation'],
    ],
  },
]
