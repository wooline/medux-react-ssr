const {baseConf} = require('../package.json');
const {siteName, clientPublicPath, version, mock, server, proxy} = baseConf;

const clientGlobal = {
  siteName,
  version,
  clientPublicPath,
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
};
