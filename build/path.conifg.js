const path = require('path');
const rootPath = path.join(__dirname, '../');
const srcPath = path.join(rootPath, './src');
const publicPath = path.join(rootPath, './public');
const configPath = path.join(rootPath, './conf');
const distPath = path.join(rootPath, './dist');
const prodModel = process.env.NODE_ENV == 'production';
const envPath = path.join(configPath, process.env.SITE || (prodModel ? './prod' : './dev'));
const envPublicPath = path.join(envPath, './public');
const moduleSearch = [srcPath];

const moduleAlias = {
  conf: envPath,
};
module.exports = {rootPath, srcPath, configPath, publicPath, distPath, moduleAlias, moduleSearch, envPath, envPublicPath};
