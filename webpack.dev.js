const path = require('path');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',

  output: {
    // filename: '[name].bundle.js',

    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'media/[name][ext]',

    libraryTarget: 'var',
    library: 'Client',
  },

  devtool: 'inline-source-map',

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },

    static: {
      directory: path.join(__dirname, 'dist'),
    },

    port: 8008,
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      // Simulate the removal of files
      dry: true,
      // Write Logs to Console
      verbose: true,
      // Automatically remove all unused webpack assets on rebuild
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // new WorkboxPlugin.GenerateSW(),
  ],
});
