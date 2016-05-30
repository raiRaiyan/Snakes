// For info about this file refer to webpack and webpack-hot-middleware documentation
// Rather than having hard coded webpack.config.js for each environment, this
// file generates a webpack config for the environment passed to the getConfig method.
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var developmentEnvironment = 'development' ;
var productionEnvironment = 'production';
var testEnvironment = 'test';

var hostName = "http://localhost:8081/";

const getPlugins = function (env) {
  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env === developmentEnvironment
  };

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
  ];

  switch (env) {
    case productionEnvironment:
      plugins.push(new ExtractTextPlugin('styles.css'));
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin());
      break;

    case developmentEnvironment:
      plugins.push(new webpack.HotModuleReplacementPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      break;
  }

  return plugins;
};

const getEntry = function (env) {
  const entry = [];

  if (env === developmentEnvironment ) { // only want hot reloading when in dev.
    entry.push('webpack-hot-middleware/client?reload=true');
  }

  entry.push('./src/main');

  return entry;
};

const getLoaders = function (env) {

  const loaders = [
    { test: /\.jsx?$/, include: path.join(__dirname, 'src'), loaders: ['babel'] },
    { test: /\.(eot.*|ttf.*|woff.*|woff2.*)$/i, include: path.join(__dirname, 'src'), loaders: ['file'] },
    { test: /\.(jpe?g|gif|png|svg.*)$/i, include: path.join(__dirname, 'src'), loaders:['file','image-webpack']}
  ];

  if (env === productionEnvironment ) {
    // generate separate physical stylesheet for production build using ExtractTextPlugin. This provides separate caching and avoids a flash of unstyled content on load.
    loaders.push({ test: /\.css$/, loader: ExtractTextPlugin.extract("css?sourceMap") });
  } else {
    loaders.push({ test: /\.css$/, loaders: ['style', 'css?sourceMap'] });
  }

  return loaders;
};

function getConfig(env) {
  return {
    debug: true,
    devtool: env === productionEnvironment  ? 'source-map' : 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    noInfo: true, // set to false to see a list of every file being bundled.
    entry: getEntry(env),
    resolve: {extensions: ['','.js','.jsx','.css']},
    target: env === testEnvironment ? 'node' : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
      path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
      publicPath: hostName,
      filename: 'main.js'
    },
    plugins: getPlugins(env),
    module: {
      loaders: getLoaders(env)
    }
  };
}

module.exports = { getConfig };