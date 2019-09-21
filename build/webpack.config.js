const path = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const pathsConfig = require('./path.conifg');
const prodModel = process.env.NODE_ENV == 'production';
const appPackage = require(path.join(pathsConfig.rootPath, './package.json'));
const {clientGlobal, serverGlobal} = require(path.join(pathsConfig.envPath, './env'));
clientGlobal.version = serverGlobal.version = appPackage.version;
const clientPublicPath = clientGlobal.clientPublicPath;
const fileName = '[name].[hash:8]';
const htmlReplace = [
  {
    pattern: '$$ClientGlobal$$',
    replacement: JSON.stringify(clientGlobal),
  },
  {
    pattern: '$$ServerGlobal$$',
    replacement: JSON.stringify(serverGlobal),
  },
  {
    pattern: '$$ClientPublicPath$$',
    replacement: clientPublicPath,
  },
];

const clientConfig = {
  mode: prodModel ? 'production' : 'development',
  devtool: prodModel ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
  entry: ['babel-polyfill', path.join(pathsConfig.srcPath, './client')],
  output: {
    path: pathsConfig.distPath,
    filename: `client/js/${fileName}.js`,
    chunkFilename: `client/js/${fileName}.chunk.js`,
    publicPath: clientPublicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(pathsConfig.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: [pathsConfig.srcPath, 'node_modules'],
    alias: {
      ...pathsConfig.moduleAlias,
    },
  },
  optimization: prodModel
    ? {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|less)$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
        runtimeChunk: 'single',
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        // minimize: true,
      }
    : {
        runtimeChunk: 'single',
      },
  stats: {chunkModules: false},
  performance: false,
  module: {
    strictExportPresence: true,
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: pathsConfig.moduleSearch,
        loader: 'source-map-loader',
      },
      {
        test: /\.(tsx|ts)?$/,
        include: pathsConfig.moduleSearch,
        loader: 'babel-loader?cacheDirectory=true',
      },
      {
        test: /\.less$/,
        include: pathsConfig.moduleSearch,
        use: [
          prodModel
            ? {
                loader: MiniCssExtractPlugin.loader,
              }
            : {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          prodModel
            ? {
                loader: MiniCssExtractPlugin.loader,
              }
            : {loader: 'style-loader'},
          {
            loader: 'css-loader',
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: {
          name: `client/media/${fileName}.[ext]`,
        },
      },
      {
        test: /\.(aac|wav|mp3|m4a|flac)$/,
        loader: 'file-loader',
        options: {
          name: prodModel ? `media/${fileName}.[ext]` : `client/media/${fileName}.[ext]`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: `client/media/${fileName}.[ext]`,
        },
      },
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': JSON.stringify(webConf),
    // }),
    new HtmlWebpackPlugin({
      chunks: ['runtime', 'main', 'styles'],
      template: path.join(pathsConfig.publicPath, './index.html'),
      title: clientGlobal.siteName,
    }),
    new HtmlReplaceWebpackPlugin(htmlReplace),
    prodModel &&
      new MiniCssExtractPlugin({
        filename: `client/css/${fileName}.css`,
        chunkFilename: `client/css/${fileName}.chunk.css`,
      }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    !prodModel && new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ].filter(Boolean),
};

const serverConfig = {
  mode: prodModel ? 'production' : 'development',
  target: 'node',
  bail: true,
  devtool: false,
  performance: false,
  entry: [path.join(pathsConfig.srcPath, './server')],
  output: {
    libraryTarget: 'commonjs2',
    path: pathsConfig.distPath,
    filename: 'server/[name].js',
    chunkFilename: 'server/[name].chunk.js',
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(pathsConfig.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    modules: [pathsConfig.srcPath, 'node_modules'],
    alias: {
      ...pathsConfig.moduleAlias,
    },
  },
  optimization: {
    minimize: false,
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
      },
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        include: pathsConfig.moduleSearch,
        use: [
          {
            loader: require.resolve('@medux/dev-utils/dist/webpack-loader/server-replace-async'),
          },
          'babel-loader?cacheDirectory=true',
        ],
      },
      {
        test: /\.(less|css)$/,
        loader: 'null-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: {
          name: `client/media/${fileName}.[ext]`,
        },
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.ProgressPlugin()],
};

module.exports = [clientConfig, serverConfig];
