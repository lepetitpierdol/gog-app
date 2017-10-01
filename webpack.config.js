const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PROJECT_DIR = path.resolve(__dirname) + '/';
const PORT = process.env.PORT || 3000;
var ENV = process.env.ENV;

if (!ENV) {
  ENV = 'development';
}

const META = {
  ENV: ENV
};

module.exports = {
  devtool: (ENV === 'production') ? 'source-map' : 'eval',
  entry: {
    polyfills: './src/polyfills.ts',
    main: './src/main.ts'
  },
  resolve: {
    modules: [PROJECT_DIR + 'src', PROJECT_DIR + 'node_modules'],
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: PROJECT_DIR + 'dist'
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        loader: 'raw-loader'
      }, {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [PROJECT_DIR + 'src/index.html']
      }, {
        test: PROJECT_DIR + 'src/index.html',
        loader: 'ejs-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      metadata: META,
      inject: true
    }),

    new webpack.DefinePlugin({
      ENV: JSON.stringify(META.ENV)
    }),

    new webpack.HotModuleReplacementPlugin()
  ],
  node: {
    global: true,
    console: true,
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  },
  devServer: {
    contentBase: PROJECT_DIR + 'src',
    port: PORT,
    inline: true,
    clientLogLevel: 'none',
    compress: false,
    stats: 'errors-only',
    watchContentBase: true,
    historyApiFallback: true,
    disableHostCheck: true,
    lazy: false
  }
};