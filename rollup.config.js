/* eslint-disable import/no-extraneous-dependencies */
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-legacy');
const legacy = require('@rollup/plugin-legacy');
const { babel } = require('@rollup/plugin-babel');
const alias = require('@rollup/plugin-alias');

const plugins = [
  alias({
    entries: [{
      // Dedupe NodeList.forEach() included in both hmrc-frontend and
      // govuk-frontend
      find: /.*common$/,
      replacement: 'govuk-frontend/govuk-esm/common.mjs'
    },
    {
      find: /.*defineProperty$/,
      replacement: 'govuk-frontend/govuk/vendor/polyfills/Object/defineProperty.js'
    },
    {
      find: /.*bind$/,
      replacement: 'govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind.js'
    }]
  }),
  legacy({}),
  nodeResolve(),
  // HMRC use ES6 js in their TimeoutDialog code, so we need to babel it out
  babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env'],
    include: ['node_modules/hmrc-frontend-src/**/*']
  }),
  terser({ ie8: true })
]

const createConfig = (filename, outputPath, outputFile) => ({
  input: `assets/${filename}.js`,
  output: [
    {
      file: `${outputPath}/js/${outputFile}.js`,
      format: 'umd',
      name: 'GOVUKFrontend'
    }
  ],
  plugins
});

module.exports = [
  createConfig('all', 'static', 'ui-ds1500-frontend'),
  createConfig('govuk-frontend', 'static/public', 'govuk-frontend')
]
