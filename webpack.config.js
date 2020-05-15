const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: {
    path: path.resolve(__dirname, 'src/main.ts'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'tinypng.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: path.resolve(__dirname, './tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: [/node_modules\/tinify/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
};
