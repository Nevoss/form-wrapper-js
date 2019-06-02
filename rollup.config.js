import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    { file: pkg.main, name: 'formWrapperJs', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    sourceMaps()
  ]
}
