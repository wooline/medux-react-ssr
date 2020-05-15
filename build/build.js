const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const axios = require('axios');
const pathsConfig = require('./path.conifg');
const webpackConfig = require('./webpack.config');
const jsonFormat = require('json-format');
const childProcess = require('child_process');

require('asset-require-hook')({
  extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
});

const {baseConf} = require(path.join(pathsConfig.rootPath, './package.json'));

const compiler = webpack(baseConf.ssr ? webpackConfig : webpackConfig[0]);

fs.emptyDirSync(pathsConfig.distPath);
fs.copySync(pathsConfig.publicPath, pathsConfig.distPath, {dereference: true});
fs.copySync(pathsConfig.envPublicPath, pathsConfig.distPath, {dereference: true});
fs.copySync(pathsConfig.mockPath, path.join(pathsConfig.distPath, './mock'), {dereference: true});

const env = require(path.join(pathsConfig.envPath, './env'));
const envFile = path.join(pathsConfig.distPath, './env.json');
fs.writeFileSync(envFile, jsonFormat(env, {type: 'space'}), 'utf8');

async function genHtml(sub, htmlDir, server, pages) {
  for (const pathname of pages) {
    const url = `${server}${pathname}`;
    const fileName = pathname + '.html';
    const res = await axios.get(url);
    console.info(chalk`... {blue ${url}} -> ${fileName}`);
    fs.outputFileSync(path.join(htmlDir, fileName), res.data);
  }
  sub.kill();
}

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
    process.exit(1);
  } else {
    console.info(
      stats.toString({
        entrypoints: false,
        colors: true,
        modules: false,
        excludeAssets: /\.(?!js|html)\w+$/,
        //warningsFilter: '[mini-css-extract-plugin]\nConflicting order between',
      })
    );
    if (stats.hasWarnings()) {
      const statsJSON = stats.toJson();
      // Ignore "Conflicting order between" warning, produced by "mini-css-extract-plugin"
      //const warnings = statsJSON.warnings.filter(_ => _.indexOf('[mini-css-extract-plugin]\nConflicting order between') < 0);
      const warnings = statsJSON.warnings;
      if (warnings.length > 0) {
        process.exit(1);
      }
    }
    fs.copySync(path.join(pathsConfig.distPath, 'server', 'js/main.js'), path.join(pathsConfig.distPath, 'server', 'main.js'));
    fs.removeSync(path.join(pathsConfig.distPath, 'server', 'media'));
    fs.removeSync(path.join(pathsConfig.distPath, 'server', 'js'));

    const server = childProcess.fork(path.join(pathsConfig.distPath, './start.js'), [], {cwd: pathsConfig.distPath});

    server.on('message', async (code) => {
      if (code === 1) {
        console.info(chalk`{red ...正在生成静态Html文件...} \n`);
        const htmlDir = path.join(pathsConfig.distPath, 'html');
        fs.mkdirSync(htmlDir);
        genHtml(server, htmlDir, env.server, ['/login', '/register', '/article/home', '/article/service', '/article/about']);
      }
    });
  }
});
