const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const devServer = require('@medux/dev-utils/dist/express-middleware/prod-demo').default;
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock').default;

const pathsConfig = require('./config/path.conifg');
const appPackage = require(path.join(pathsConfig.rootPath, './package.json'));
const mainModule = require(path.join(pathsConfig.distPath, './server', 'main'));
const htmlTpl = fs.readFileSync(path.join(pathsConfig.distPath, './client', 'index.html'), 'utf8');
const [, , port] = appPackage.devServer.url.split(/:\/*/);
const app = express();
app.use('/client', express.static(path.join(pathsConfig.distPath, './client'), {fallthrough: false}));
app.use(devServer(htmlTpl, mainModule, appPackage.devServer.proxy));
app.use(devMock(appPackage.devServer.mock, appPackage.devServer.proxy, true));

app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${appPackage.devServer.url}/} \n`));
