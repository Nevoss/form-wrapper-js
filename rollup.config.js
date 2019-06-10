import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps'
const license = require('rollup-plugin-license');
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    { file: pkg.main, name: 'formWrapperJs', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    sourceMaps(),
    license({
      banner: `Form Wrapper Js (v<%= pkg.version %>) - Written by <%= pkg.author %> (<%= moment().format('YYYY-MM-DD') %>)`,
    })
  ]
}
