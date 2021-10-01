const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',

  optimization: {
    minimizer: [new TerserPlugin({}), new CssMinimizerPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new WorkboxPlugin.GenerateSW({
      // Do not precache images
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],

      // Define runtime caching rules.
      runtimeCaching: [
        {
          // Match any request that ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

          // Apply a cache-first strategy.
          handler: 'CacheFirst',

          options: {
            // Use a custom cache name.
            cacheName: 'images',

            // Only cache 10 images.
            expiration: {
              maxEntries: 10,
            },
          },
        },
      ],
    }),
  ],
});
