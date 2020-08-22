import rollup from 'rollup'
import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import postcss from 'rollup-plugin-postcss'
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
    extract: `${packageName}.css`,
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  license({ banner }),
]

const watcher = rollup.watch({
  input: 'src/index.js',
  output: {
    file: `dist/${packageName}.min.js`,
    format: 'umd',
    name: packageName,
    sourcemap: true,
  },
  plugins: plugins,
})

watcher.on('event', (event) => {
  switch (event.code) {
    case 'START':
      console.log('监听器正在启动（重启）')
      break
    case 'BUNDLE_START':
      console.log('构建单个文件束')
      break
    case 'BUNDLE_END':
      console.log('完成文件束构建')
      break
    case 'END':
      console.log('完成所有文件束构建')
      break
    case 'ERROR':
      console.log('构建时遇到错误')
      break
    case 'FATAL':
      console.log('FATAL')
      break
  }
})

export default {
  input: 'src/index.js',
  output: {
    file: `dist/${packageName}.js`,
    format: 'umd',
    name: packageName,
    sourcemap: true,
  },
  plugins: plugins,
}
