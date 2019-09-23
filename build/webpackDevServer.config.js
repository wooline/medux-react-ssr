const devServer = require('@medux/dev-utils/dist/express-middleware/dev-server');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const path = require('path');
const pathsConfig = require('./path.conifg');
const {proxy, mock} = require(path.join(pathsConfig.envPath, './env'));
const {baseConf} = require(path.join(pathsConfig.rootPath, './package.json'));

function replaceTpl(req, html) {
  return html;
}

const config = {
  contentBase: [pathsConfig.publicPath, pathsConfig.envPublicPath],
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: !baseConf.ssr,
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
  proxy,
  before: app => {
    app.use(devServer(baseConf.ssr, proxy, replaceTpl));
    app.use(devMock(mock, proxy, true));
  },
};
module.exports = config;
