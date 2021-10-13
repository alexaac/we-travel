const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');

// Plugin to process HTML
const htmlPlugin = new HtmlWebPackPlugin({
  filename: 'index.html',
  template: path.join(__dirname, './src/client/views/index.html'),
});

const htmlPlugin_trips = new HtmlWebPackPlugin({
  filename: 'trips.html',
  template: path.join(__dirname, './src/client/views/trips.html'),
});

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

  plugins: [htmlPlugin, htmlPlugin_trips],
};
