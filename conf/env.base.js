const appPackage = require('../package.json');

const mock = !!appPackage.mock;
const serverUrl = 'http://localhost:7445';
const apiUrl = 'http://localhost:7446';

const clientGlobal = {
  siteName: 'Medux',
  clientPublicPath: '/',
  version: '1.0.0',
  apiServerPath: {'/ajax/': '/ajax/'},
};
const serverGlobal = {
  ...clientGlobal,
  apiServerPath: {'/ajax/': `${serverUrl}/ajax/`},
};
const proxyMaps = {
  '/ajax/**': {
    target: apiUrl,
    pathRewrite: {
      '^/ajax': '',
    },
    xfwd: true,
    secure: false,
    changeOrigin: true,
  },
};
module.exports = {
  proxyMaps,
  serverUrl,
  mock,
  apiUrl,
  clientGlobal,
  serverGlobal,
};
