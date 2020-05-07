const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
const pathsConfig = require('./path.conifg');
const webpackConfig = require('./webpack.config');
const jsonFormat = require('json-format');

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
  for (const pathname in pages) {
    const url = `${server}${pathname}`;
    const fileName = pathname.replace(/\//g, '-') + '.html';
    console.info(chalk`... {blue ${url}} -> ${fileName}`);
    const res = await axios.get(url);
    fs.writeFileSync(path.join(htmlDir, fileName), res.data);
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
    fs.removeSync(path.join(pathsConfig.distPath, 'server', 'media'));

    //const server = childProcess.fork(path.join(pathsConfig.distPath, './start.js'), [], {cwd: pathsConfig.distPath});

    // server.on('message', async (code) => {
    //   if (code === 1) {
    //     console.info(chalk`{red ...正在生成静态Html文件...} \n`);
    //     const htmlDir = path.join(pathsConfig.distPath, 'html');
    //     fs.mkdirSync(htmlDir);
    //     genHtml(server, htmlDir, env.server, env.clientGlobal.pageNames);
    //     // const pages = env.clientGlobal.pageNames;
    //     // const severUrl = env.server;
    //     // console.info(chalk`{red ...正在生成静态Html文件...} \n`);
    //     //
    //     // axios.get('http://localhost/poster/speak/tts').then(res => {
    //     //   console.info(chalk`... {blue /poster/speak/tts} \n`);
    //     //   fs.writeFileSync(path.join(htmlDir, 'index.html'), res.data);
    //     //   server.kill();
    //     // });
    //   }
    // });
  }
});
