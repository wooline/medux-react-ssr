const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const proxyMiddleware = require('http-proxy-middleware');
const ssrServer = require('@medux/dev-utils/dist/express-middleware/prod-demo');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const mainModule = require('./server/main');
const htmlTpl = fs.readFileSync('./index.html', 'utf8');
const {proxy, server, mock} = require('./env.json');
const app = express();
const [, , port] = server.split(/:\/*/);

function replaceTpl(req, html) {
  return html.replace(/%\w+%/gm, flag => {
    const wd = flag.substr(1, flag.length - 2);
    if (wd === 'title') {
      return initEnv.pageNames[req.url.split('?')[0]] || 'SSR Demo';
    }
    return '';
  });
}

app.use('/client', express.static('./client', {fallthrough: false}));
app.use(devMock(mock, proxy, true));
app.use('/ajax', proxyMiddleware(proxy['/ajax/**']));
app.use(ssrServer(htmlTpl, mainModule, proxy, replaceTpl));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${server}/} \n`));
