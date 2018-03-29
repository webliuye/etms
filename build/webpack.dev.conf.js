'use strict'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var utils = require('./utils')
var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var GenerateAssetPlugin = require('generate-asset-webpack-plugin')
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function(compilation){
  let cfgJson={
    BASE_API:"http://192.168.2.222:8081/etms",
    BASE_API_ROOT:"http://192.168.2.222:8081/ips",
    OAUTH_API:"http://test.etms.com/passport/",
    IPORTAL_API:"http://test.etms.com/iportal/",
    LOCAL_URL:"http://192.168.2.249:8081",
    state:1
  };
  return JSON.stringify(cfgJson);
}

function resolveApp(relativePath) {
    return path.resolve(relativePath);
}
module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    // cheap-source-map is faster for development
    devtool: '#cheap-source-map',
    cache: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery'
        }),
        new GenerateAssetPlugin({
            filename: 'config.json',
            fn: (compilation, cb) => {
                cb(null, createServerConfig(compilation));
            },
            extraFiles: []
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: resolveApp('favicon.ico'),
            inject: true,
            path:config.dev.staticPath
        }),
        new FriendlyErrorsPlugin()
    ]
})
