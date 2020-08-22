import rollup from 'rollup'
import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import sass from 'node-sass'

import packageJson from '../package.json'

const packageName = packageJson.name

const banner = `/**
${' '}* ${packageName} v${packageJson.version}
${' '}*
${' '}* Copyright 2020-${new Date().getFullYear()}, ${packageJson.authors[0]}
${' '}* Licensed under the MIT license
${' '}* http://www.opensource.org/licenses/mit-license
${' '}*
${' '}*/`

const processSass = function (context, payload) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      }
    )
  })
}

const plugins = [
  postcss({
    minimize: true,
    extensions: ['css', 'scss'],
    process: processSass,
    extract: `dist/${packageName}.css`,
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  license({ banner }),
  terser(),
]

export default {
  input: 'src/index.js',
  output: {
    file: `dist/${packageName}.min.js`,
    format: 'umd',
    name: packageName,
    sourcemap: true,
  },
  plugins: plugins,
}
