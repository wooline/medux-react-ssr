const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {createProxyMiddleware} = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const prodServer = require('@medux/dev-utils/dist/express-middleware/prod-server');
const mainModule = require('./server/main');
const htmlTpl = fs.readFileSync('./index.html', 'utf8');
const {proxy, server, mock} = require('./env.json');
const app = express();
const [, , port] = server.split(/:\/*/);

function replaceTpl(req, html) {
  return html.replace(/%\w+%/gm, (flag) => {
    const wd = flag.substr(1, flag.length - 2);
    if (wd === 'title') {
      return initEnv.pageNames[req.url.split('?')[0]] || initEnv.pageNames['/'];
    }
    return '';
  });
}

app.use('/client', express.static('./client', {fallthrough: false}));
app.use((req, res, next) => {
  const fileName = req.url + '.html';
  const htmlDir = path.resolve('./html');
  const file = path.join(htmlDir, fileName);
  if (req.method === 'GET' && initEnv.pageNames[req.url] && fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    next();
  }
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(devMock(mock, proxy, true));
app.use('/api', createProxyMiddleware(proxy['/api/**']));
app.use(prodServer(htmlTpl, mainModule, replaceTpl));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${server}/} \n`));
process.send && process.send(1);
