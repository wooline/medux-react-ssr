const path = require('path');
const chalk = require('chalk');
const pathsConfig = require('./config/path.conifg');

const appPackage = require(path.join(pathsConfig.rootPath, './package.json'));

if (!appPackage.devServer.ssr) {
  console.info(chalk.red('The SSR has been disabled. Please enable it on package.json. \n'));
  process.exit(1);
}
