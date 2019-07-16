const path = require('path');

const rootPath = path.join(__dirname, '../../');
const srcPath = path.join(rootPath, './src');
const buildPath = path.join(rootPath, './build');
const configPath = path.join(buildPath, './config');
// const scriptsPath = path.join(rootPath, './scripts');
const publicPath = path.join(rootPath, './public');
const distPath = path.join(rootPath, './dist');

const moduleAlias = {
  '@medux/core': '@medux/core/src',
  '@medux/web': '@medux/web/src',
  '@medux/react': '@medux/react/src',
  '@medux/react-web-router': '@medux/react-web-router/src',
  '@medux/web-route-plan-a': '@medux/web-route-plan-a/src',
};
const moduleSearch = [srcPath, path.join(rootPath, './node_modules/@medux')];
module.exports = {rootPath, srcPath, configPath, publicPath, distPath, moduleAlias, moduleSearch};
