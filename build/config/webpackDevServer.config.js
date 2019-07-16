const devServer = require('@medux/dev-utils/dist/express-middleware/dev-server').default;
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock').default;
const path = require('path');
const pathsConfig = require('./path.conifg');

const appPackage = require(path.join(pathsConfig.rootPath, './package.json'));

const config = {
  contentBase: pathsConfig.publicPath,
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: !appPackage.devServer.ssr,
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
  proxy: appPackage.devServer.proxy,
  before: app => {
    app.use(devServer(appPackage.devServer.ssr, appPackage.devServer.proxy));
    app.use(devMock(appPackage.devServer.mock, appPackage.devServer.proxy, true));
  },
};
module.exports = config;
