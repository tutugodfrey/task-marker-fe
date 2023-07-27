import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv-safe';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import * as sass from 'sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    devtool: 'inline-source-map',
    entry: './client/index.js',
    node: {
      __dirname: true
    },
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js',
      publicPath: 'public',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader'],
          exclude: /node_modules/,
        }, {
          test: /\.(css|scss|sass)$/,
          exclude: /ndoe_modules/,
          use: [
            'style-loader',
            {
            loader: 'css-loader',
            options: {
              url: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
              }
            }
          ]

        },
      ]
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        // new UglifyJsPlugin({
        //   cache: true,
        //   parallel: true,
        //   uglifyOptions: {
        //     compress: false,
        //     ecma: 6,
        //     mangle: true
        //   },
        //   sourceMap: true
        // })
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./client/index.html')
      }),
      new webpack.DefinePlugin(envKeys),
    ]
  }
}
