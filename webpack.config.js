'use strict'
/*
 * webpack build config
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')

const relativeBuildPath = (process.env.BUILD_PATH || 'dist')
const buildPath = path.resolve(__dirname, relativeBuildPath)

const BABEL_CONFIG = {
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-es2016'),
    require.resolve('babel-preset-es2017')
  ]
}

module.exports = {
 node: {
  console: true,
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
 },
 context: path.resolve(__dirname, 'app'),
 // context: __dirname,
 entry: {
  track: "./",
  // track: "./app",
  vendor: [
    // 'd3',
    // 'font-awesome',
    'history',
    // 'numeral',
    // 'prop-types',
    // 'rc-slider',
    // 'rc-tooltip',
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'react-router-redux',
    'react-sortable-hoc',
    'redux',
    'redux-logger',
    'redux-thunk',
    // 'semantic-ui-css',
    // 'semantic-ui-react',
    // 'sortablejs'
  ]
 },
 output: {
  path: buildPath,
  pathinfo: true,
  chunkFilename: '[name].js',
  filename: '[name].js'
 },
 resolve: {
   alias: {
     '@track': path.resolve(__dirname, 'app')
   }
 },
 module: {
   loaders: [
      {
        test: /\.scss/,
        include: [
         path.resolve(__dirname, 'app')
        ],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      }, {
        test: /\.css$/,
        loader: ['style-loader', { loader: 'css-loader', options: { minimize: true }}]
      }, {
         test: /\.js$/,
         include: [
           path.resolve(__dirname, 'app')
         ],
         use: 'babel-loader'
      }, {
         test: /\.jsx$/,
         include: [
           path.resolve(__dirname, 'app')
         ],
         use: 'babel-loader'
      }, {
        test: /\.(woff2?|png|jpg|gif|ico)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(ttf|eot)$/,
        loader: 'file-loader'
      }, {
        test: /\.(svg)$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
   ]
 },
 plugins: [
    // new BabiliPlugin(),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new CaseSensitivePathsWebpackPlugin({
      debug: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   chunks: ['vendor'],
    //   minChunks: 2
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   chunks: [
    //     // 'track',
    //     // 'track-app',
    //     // 'track-store'
    //     'vendor'
    //   ],
    //   minChunks: 2,
    // }),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale/,
      /(en-gb|en-us)\.js/
    ),
    new ExtractTextPlugin('styles.css')
 ]
}
