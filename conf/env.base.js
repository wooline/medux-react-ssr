const {baseConf} = require('../package.json');
const {siteName, clientPublicPath, version, mock, server, proxy} = baseConf;

const clientGlobal = {
  siteName,
  pageNames: {
    '/poster/home': '静态页面Demo',
    '/user/home': '用户中心',
  },
  version,
  staticPath: clientPublicPath + 'client/',
  apiServerPath: {'/ajax/': '/ajax/'},
};
const serverGlobal = {
  ...clientGlobal,
  apiServerPath: {'/ajax/': `${server}/ajax/`},
};
module.exports = {
  proxy,
  server,
  mock,
  clientGlobal,
  serverGlobal,
  clientPublicPath,
};
