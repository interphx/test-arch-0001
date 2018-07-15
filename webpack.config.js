const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: { main: './app.tsx' },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Performance Test',
      template: 'templates/index.html.ejs'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
  }
};