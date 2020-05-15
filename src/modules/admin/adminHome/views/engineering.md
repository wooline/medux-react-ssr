本项目使用[@medux/react-web-router](https://github.com/wooline/medux/tree/master/packages/react-web-router) + [ANTD 4](https://ant.design/index-cn) 开发，全程使用 React Hooks，并配备了比较完善的脚手架。

## 安装及运行

```
// 注意一下，因为本项目风格检查要求以 LF 为换行符
// 所以请先关闭 Git 配置中 autocrlf
git config --global core.autocrlf false
git clone https://github.com/wooline/medux-react-ssr.git
cd medux-react-ssr
yarn install
```

### 以开发模式运行

- 运行 `yarn start`，会自动启动一个开发服务器
- 开发模式时 React 热更新使用最新的 React Fast Refresh 方案，需要安装最新的 React Developer Tools。

### 以产品模式运行

- 首先运行 yarn build-local，会将代码编译到 /dist/local 目录
- 然后进入 /dist/local 目录下，运行 node start.js，会启动一个产品服务器 Demo，但是真正线上运行建议使用 Nginx，输出目录中有 Nginx 配置样例可供参考
