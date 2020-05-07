const {baseConf} = require('../package.json');
const {siteName, clientPublicPath, version, mock, server, proxy} = baseConf;

const clientGlobal = {
  version,
  siteName,
  staticPath: clientPublicPath + 'client/',
  apiServerPath: {'/api/': '/api/'},
  pageNames: {
    '/': 'Demo@medux-ssr',
    '/login': '登录@medux-ssr',
    '/register': '注册@medux-ssr',
    '/article/home': '帮助中心@medux-ssr',
    '/article/service': '用户服务@medux-ssr',
    '/article/about': '关于我们@medux-ssr',
    '/admin/home': '管理中心@medux-ssr',
    '/admin/role/list': '角色列表@medux-ssr',
    '/admin/member/list': '用户列表@medux-ssr',
    '/admin/post/list': '信息列表@medux-ssr',
  },
};
const serverGlobal = {
  ...clientGlobal,
  apiServerPath: {'/api/': `${server}/api/`},
};
module.exports = {
  proxy,
  server,
  mock,
  clientGlobal,
  serverGlobal,
  clientPublicPath,
};
