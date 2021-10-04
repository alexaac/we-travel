const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|svg|tiff|ico)(\?.*)?$/,
        type: 'asset/resource',
      },
      {
        test: '/.js$/',
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/views/index.html',
      filename: './index.html',
    }),
  ],
};
