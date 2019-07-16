const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const PostcssPxtorem = require('postcss-pxtorem');
// const ManifestPlugin = require("webpack-manifest-plugin");
const PostcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const PostcssPresetEnv = require('postcss-preset-env');
const pathsConfig = require('./path.conifg');

const projectConfigPath = path.join(pathsConfig.configPath, process.env.WEBSITE || './dev');
const conEnv = require(path.join(projectConfigPath, './env'));

const htmlReplace = [
  {
    pattern: '$$ENV$$',
    replacement: JSON.stringify(conEnv),
  },
  {
    pattern: '$$CLIENT_PUBLIC_PATH$$',
    replacement: conEnv.clientPublicPath,
  },
];

const tsCompilerOptions = require(path.join(pathsConfig.rootPath, './tsconfig.json')).compilerOptions;
tsCompilerOptions.target = 'es2017';

const getStyleLoaders = (cssOptions, preProcessor, preProcessorOptions) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          PostcssFlexbugsFixes,
          PostcssPresetEnv({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          PostcssPxtorem({
            rootValue: 37.5,
            propList: ['*'],
          }),
        ],
      },
    },
  ];
  if (preProcessor) {
    loaders.push({loader: require.resolve(preProcessor), options: preProcessorOptions});
  }
  return loaders;
};

const clientConfig = {
  mode: 'development',
  entry: [path.join(pathsConfig.srcPath, './client')],
  output: {
    pathinfo: true, // 输入代码添加额外的路径注释，提高代码可读性
    filename: 'client/js/[name].js',
    chunkFilename: 'client/js/[name].chunk.js',
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(pathsConfig.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [pathsConfig.srcPath, 'node_modules'],
    alias: {
      ...pathsConfig.moduleAlias,
      conf: projectConfigPath,
    },
  },
  devtool: 'cheap-module-source-map',
  optimization: {
    runtimeChunk: 'single',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: pathsConfig.moduleSearch,
        loader: 'babel-loader?cacheDirectory=true',
      },
      {
        test: /\.css$/,
        use: getStyleLoaders({
          importLoaders: 1,
        }),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders({importLoaders: 2}, 'less-loader', {javascriptEnabled: true, modifyVars: {hd: '0.026666rem'}}),
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: pathsConfig.srcPath,
        loader: require.resolve('url-loader'),
        query: {
          limit: 50,
          name: 'client/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'client/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['runtime', 'main'],
      chunksSortMode: 'manual',
      template: path.join(pathsConfig.publicPath, './client/index.html'),
    }),
    new HtmlReplaceWebpackPlugin(htmlReplace),
    /* new ManifestPlugin({
      fileName: "client/asset-manifest.json",
      publicPath: "/",
    }), */
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ],
};

const serverConfig = {
  mode: 'production',
  target: 'node',
  bail: true,
  devtool: false,
  entry: [path.join(pathsConfig.srcPath, './server')],
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server/[name].js',
    chunkFilename: 'server/[name].chunk.js',
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(pathsConfig.srcPath, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [pathsConfig.srcPath, 'node_modules'],
    alias: {
      ...pathsConfig.moduleAlias,
      conf: projectConfigPath,
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      // new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // new TsconfigPathsPlugin({ configFile: paths.appTsProdConfig }),
    ],
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
        test: /\.(ts|tsx)$/,
        include: pathsConfig.moduleSearch,
        use: [
          'babel-loader?cacheDirectory=true',
          {
            loader: require.resolve('@medux/dev-utils/dist/webpack-loader/server-replace-async'),
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        loader: 'null-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: pathsConfig.srcPath,
        loader: require.resolve('url-loader'),
        query: {
          limit: 50,
          name: 'client/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.ProgressPlugin()],
};

module.exports = [clientConfig, serverConfig];
