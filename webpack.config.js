const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

var config = {
  mode: 'production',
  entry: {
    'dragon-totem': ['./src/index.ts', './src/dragon-totem.scss'],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ removeFiles: ['dist/umd'] }),
    new MiniCssExtractPlugin({
      filename: './[name].css',
    }),
  ],
  output: {
    library: 'DragonTotem',
    libraryTarget: 'umd',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist/umd'),
  },
}

module.exports = config
