var webpack = require('webpack');
var path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');

const SRC_PATH = path.join(__dirname, 'src');
const DIST_PATH = path.join(__dirname, 'dst');

const JS_ENTRY = path.resolve('src', 'js', 'index.js');
const JS_OUTPUT_PATH = path.resolve('dist/js');
const JS_OUTPUT_FILENAME = '[name]-bundle.js';

const SASS_ENTRY = path.resolve('src', 'sass', 'main.scss');
const SASS_OUTPUT_PATH = path.resolve('dist/css');
const SASS_OUTPUT_FILENAME = '[name]-bundle.css';
const SASS_LOADERS = [
  'css-loader?minimize',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + SRC_PATH
];

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

let sassRule = {
  test: /\.(sass|scss)$/,
  use: extractTextPlugin.extract('css-loader!postcss-loader!sass-loader'),
  exclude: /(node_modules)/
};

const jsConfiguration = {
  entry: {
    'js-library': JS_ENTRY
  },
  output: {
    path: JS_OUTPUT_PATH,
    filename: JS_OUTPUT_FILENAME
  },
  module: {
    rules: [esRule,lintRule]
  },
  resolve: {
    modules: [NODE_MODULES]
  }
};

const sassConfiguration = {
  entry: {
    'style': SASS_ENTRY
  },
  output: {
    path: SASS_OUTPUT_PATH,
    filename: SASS_OUTPUT_FILENAME
  },
  module: {
    rules: [sassRule]
  },
  plugins: [
    new extractTextPlugin('[name].min.css')
  ],
  resolve: {
    modules: [NODE_MODULES]
  }
};

module.exports = [
  jsConfiguration,
  sassConfiguration
];
