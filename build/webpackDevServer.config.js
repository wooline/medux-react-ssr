const devServer = require('@medux/dev-utils/dist/express-middleware/dev-server');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pathsConfig = require('./path.conifg');
const {proxy, mock} = require(path.join(pathsConfig.envPath, './env'));
const {baseConf} = require(path.join(pathsConfig.rootPath, './package.json'));

function replaceTpl(req, html) {
  return html.replace(/%\w+%/gm, (flag) => {
    const wd = flag.substr(1, flag.length - 2);
    if (wd === 'title') {
      return initEnv.pageNames[req.url.split('?')[0]] || initEnv.pageNames['/'];
    }
    return '';
  });
}

const config = {
  contentBase: [pathsConfig.envPublicPath, pathsConfig.publicPath],
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
  before: (app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(devMock(mock, proxy, true));
    app.use(devServer(baseConf.ssr, proxy, replaceTpl));
  },
};
module.exports = config;
