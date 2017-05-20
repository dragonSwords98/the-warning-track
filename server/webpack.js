'use strict'
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware= require('webpack-dev-middleware')
const config = require('../webpack.config')
config.output.publicPath = '/'
config.plugins.push(new webpack.NoEmitOnErrorsPlugin())
let router = module.exports = new express.Router({})
let compiler = webpack(config)
let middlewareOptions = {
  hot: true,
  publicPath: '/',
  watchOptions: {
    poll: true
  }
}
router.use(webpackDevMiddleware(compiler, middlewareOptions))
