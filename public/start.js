const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const devServer = require('@medux/dev-utils/dist/express-middleware/prod-demo');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const mainModule = require('./server/main');
const htmlTpl = fs.readFileSync('./index.html', 'utf8');
const {proxyMaps, serverUrl, ssr} = require('./env.json');
const app = express();
const [, , port] = serverUrl.split(/:\/*/);

function replaceTpl(req, html) {
  return html;
}

app.use('/client', express.static('./client', {fallthrough: false}));
app.use(devServer(htmlTpl, mainModule, proxyMaps, replaceTpl));
app.use(devMock(ssr, proxyMaps, true));
app.use('/ajax', proxy(proxyMaps['/ajax/**']));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${serverUrl}/} \n`));
