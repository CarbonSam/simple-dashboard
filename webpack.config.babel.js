var webpack = require('webpack');
var path = require('path');

const OUTPUT_PATH = path.resolve('dist/js');
const OUTPUT_FILENAME = '[name]-bundle.js';
const JS_ENTRY = path.resolve('src', 'js', 'index.js');
const NODE_MODULES = path.resolve('node_modules');

let esRule = {
  test: /\.js$/,
  use: 'babel-loader',
  exclude: /(node_modules)/
};

let lintRule = {
  test: /\.js$/,
  use: 'eslint-loader',
  exclude: /(node_modules)/
};

const configuration = {
  entry: {
    'js-library': JS_ENTRY
  },
  output: {
    path: OUTPUT_PATH,
    filename: OUTPUT_FILENAME
  },
  module: {
    rules: [esRule,lintRule]
  },
  resolve: {
    modules: [NODE_MODULES]
  }
};

module.exports = configuration;
