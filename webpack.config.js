'use strict'
/*
 * webpack build config
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')
// const config = module.exports = {}

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
  context: path.resolve(__dirname, 'app'),
  entry: {
    track: "./"
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
          use: [
            'css-loader',
            'sass-loader'
          ]
        })
      }, {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: [
        'track',
        'track-app',
        'track-store'
      ],
      minChunks: 2,
    }),
    new ExtractTextPlugin('styles.css')
  ]
}
