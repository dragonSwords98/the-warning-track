'use strict'
/*
 * webpack build config
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
// const BabiliPlugin = require('babili-webpack-plugin')

const relativeBuildPath = (process.env.BUILD_PATH || 'dist')
const buildPath = path.resolve(__dirname, relativeBuildPath)

module.exports = {
 node: {
  console: true,
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
 },
 context: path.resolve(__dirname, 'app'),
 entry: {
  track: "./",
  client: [
    'axios',
    'bluebird'
  ],
  platform: [
    'moment',
    // 'i18next',
    'numeral'
  ],
  core: [
    'prop-types',
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'react-router-redux',
    'redux'
  ],
  data: [
    'redux-thunk'
  ],
  ui: [
    'rc-slider',
    'rc-tooltip',
    'react-sortable-hoc',
    'sortablejs'
  ]
 },
 output: {
  path: buildPath,
  publicPath: '/',
  pathinfo: (process.env.NODE_ENV !== 'production'),
  chunkFilename: '[name].[chunkhash:8].js',
  filename: '[name].[chunkhash:8].js'
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
    // new LodashModuleReplacementPlugin,
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),
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
    //   minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'client',
        'ui',
        'core',
        'platform',
        'data'
      ]
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale/,
      /(en-gb|en-us)\.js/
    ),
    new ExtractTextPlugin('styles.css')
 ]
}

if (process.env.NODE_ENV !== 'production') {
  module.exports.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  }))
}
