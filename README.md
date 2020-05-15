# 项目介绍

本项目是 [**medux-react-admin**](https://github.com/wooline/medux-react-admin) 的 SSR(`服务器同构渲染`) 版，你可以从中看到如何将一个 SinglePage(`单页应用`) 快速转换为支持 SEO 的多页应用。

- [**在线预览**](http://medux-react-ssr.80zp.com)

> 请使用鼠标右键点击“查看网页源码”，看是否输出了 Html

- [/login](http://medux-react-ssr.80zp.com/login)
- [/register](http://medux-react-ssr.80zp.com/register)
- [/article/home](http://medux-react-ssr.80zp.com/article/home)
- [/article/service](http://medux-react-ssr.80zp.com/article/service)
- [/article/about](http://medux-react-ssr.80zp.com/article/about)

# 安装及运行

```
// 注意一下，因为本项目风格检查要求以 LF 为换行符
// 所以请先关闭 Git 配置中 autocrlf
git config --global core.autocrlf false
git clone https://github.com/wooline/medux-react-ssr.git
cd medux-react-ssr
yarn install
```

## 以开发模式运行

- 运行 `yarn start`，会自动启动一个开发服务器。
- 开发模式时 React 热更新使用最新的 [React Fast Refresh](https://www.npmjs.com/package/react-refresh) 方案，需要安装最新的 React Developer Tools。

## 以产品模式运行

- 首先运行 yarn build-local，会将代码编译到 /dist/local 目录
- 然后进入 /dist/local 目录下，运行 node start.js，会启动一个产品服务器 Demo，但是真正线上运行建议使用 Nginx，输出目录中有 Nginx 配置样例可供参考

# 查看更多项目介绍

- [语雀](https://www.yuque.com/medux/docs/medux-react-ssr)

---

**欢迎批评指正，觉得还不错的别忘了给个 Star >\_<，如有错误或 Bug 请反馈**

QQ 群交流：929696953

![QQ群交流](https://cdn.nlark.com/yuque/0/2020/png/1294343/1587232895054-aca0f46f-c5d0-46d6-973e-2e9dd76120d4.png)
