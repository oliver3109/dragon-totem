const MiniCssExtractPlugin = require('mini-css-extract-plugin')

var config = {
  entry: {
    'dragon-totem': './src/dragon-totem.scss',
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './[name].css',
    }),
  ],
}

module.exports = config
