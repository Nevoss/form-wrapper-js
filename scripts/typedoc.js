/**
 * This file will generate Api reference doc for specific files
 */

const TypeDoc = require('typedoc')
const rimraf = require('rimraf')
const pkj = require('../package.json')

const getDocsVersion = () => `${pkj.version.split('.')[0]}.x`

const input = '../src'
const output = `../docs/${getDocsVersion()}/api-reference`

const files = ['Form', 'FormCollection', 'options']

const options = {
  mode: 'file',
  logger: 'console',
  target: 'ES5',
  module: 'ES5',
  experimentalDecorators: true,
  theme: 'markdown',
  exclude: `**/!(${files.join('|')}).ts`,
}

const removeOutputDir = output => rimraf.sync(output)

const generateDocs = (options, input, output) => {
  const app = new TypeDoc.Application(options)
  const project = app.convert(app.expandInputFiles([input]))

  if (!project) {
    return
  }

  app.generateDocs(project, output)
}

// Removes the old docs dir
removeOutputDir(output)

generateDocs(options, input, output)

// Removes extra files (didnt find a way to not generate it)
removeOutputDir(`${output}/README.md`)
removeOutputDir(`${output}/interfaces/optionaloptions.md`)
