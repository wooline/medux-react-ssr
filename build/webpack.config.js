const path = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const pathsConfig = require('./path.conifg');
const prodModel = process.env.NODE_ENV == 'production';
const {clientGlobal, serverGlobal, clientPublicPath} = require(path.join(pathsConfig.envPath, './env'));

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
  {
    pattern: '$$Title$$',
    replacement: clientGlobal.siteName,
  },
];

const getLocalIdent = (context, localIdentName, localName) => {
  let fileName = context.resourcePath;
  if (fileName.match(/[/\\]global.\w+?$/)) {
    return 'g-' + localName;
  }
  fileName = fileName
    .replace(pathsConfig.srcPath, '')
    .replace(/\W/g, '-')
    .replace(/^-|-index-m-\w+$|-m-\w+$/g, '')
    .replace(/^components-/, 'comp-')
    .replace(/^modules-.*?(\w+)-views(-?)(.*)/, '$1$2$3');
  return localName === 'root' ? fileName : fileName + '_' + localName;
};

const lessLoader = (enableCssModule, ssr) => {
  return [
    !ssr &&
      (prodModel
        ? {
            loader: MiniCssExtractPlugin.loader,
          }
        : {loader: 'style-loader'}),
    {
      loader: 'css-loader',
      options: {
        importLoaders: ssr ? 1 : 2,
        modules: enableCssModule,
        context: pathsConfig.srcPath,
        exportOnlyLocals: ssr,
        getLocalIdent,
        //localIdentName: '[path][name]_[local]',
      },
    },
    !ssr && 'postcss-loader',
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
      },
    },
    {
      loader: 'sass-resources-loader',
      options: {
        resources: [path.join(pathsConfig.srcPath, 'asset/css/vars.less')],
      },
    },
  ].filter(Boolean);
};

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
    modules: [...pathsConfig.moduleSearch, 'node_modules'],
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
              test: /[\\/]node_modules[\\/].+\.(css|less)$/,
              chunks: 'all',
              enforce: true,
            },
            css: {
              name: 'css',
              test: /[\\/]src[\\/].+\.(css|less)$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        // minimize: true,
      }
    : {},
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
        exclude: /\.m\.less$/,
        include: pathsConfig.moduleSearch,
        use: lessLoader(false),
      },
      {
        test: /\.m\.less$/,
        include: pathsConfig.moduleSearch,
        use: lessLoader(true),
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
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(pathsConfig.publicPath, './index.html'),
    }),
    new HtmlReplaceWebpackPlugin(htmlReplace),
    prodModel &&
      new MiniCssExtractPlugin({
        filename: `client/css/${fileName}.css`,
      }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    !prodModel && new webpack.HotModuleReplacementPlugin(),
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
        exclude: /\.m\.less$/,
        loader: 'null-loader',
      },
      {
        test: /\.m\.less$/,
        include: pathsConfig.moduleSearch,
        use: lessLoader(true, true),
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
  plugins: [new webpack.ProgressPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
};

module.exports = [clientConfig, serverConfig];
