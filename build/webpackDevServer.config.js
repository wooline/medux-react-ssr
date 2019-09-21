const devServer = require('@medux/dev-utils/dist/express-middleware/dev-server').default;
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock').default;
const path = require('path');
const pathsConfig = require('./path.conifg');
const {proxyMaps} = require(path.join(pathsConfig.envPath, './env'));
const appPackage = require(path.join(pathsConfig.rootPath, './package.json'));

const config = {
  contentBase: [pathsConfig.publicPath, pathsConfig.envPublicPath],
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: !appPackage.ssr,
  hot: true,
  overlay: {
    warnings: true,
    errors: true,
  },
  stats: {
    colors: true,
  },
  // clientLogLevel: 'none',
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  proxy: proxyMaps,
  before: app => {
    app.use(devServer(appPackage.ssr, proxyMaps));
    app.use(devMock(appPackage.mock, proxyMaps, true));
  },
};
module.exports = config;
