本 Demo 是基于`@medux/react-web-router`和`@medux/web-route-plan-a`开发的 WebApp 项目

## 关于@medux

请先阅读：[@medux 概述](https://github.com/wooline/medux)

## 关于@medux/core

请先阅读：[@medux/core 概述](https://github.com/wooline/medux/tree/master/packages/core)

## 关于@medux/react-web-router

基于`@medux/react`、`@medux/web`、`react-router`，是 React 开发 WebApp 的方案

参阅：[@medux/react-web-router](https://github.com/wooline/medux/tree/master/packages/react-web-router)

## 关于@medux/web-route-plan-a

基于`@medux/web`，是一套具体的路由序列化与反序列化方案

参阅：[@medux/web-route-plan-a](https://github.com/wooline/medux/tree/master/packages/web-route-plan-a)

## 安装

```
git clone https://github.com/wooline/medux-demo-ssr.git
cd medux-demo-ssr
npm install
npm start
```

## 运行

- `npm start` 以开发模式运行
- `npm run build` 编译生成文件
- `npm run build-demo` 编译生成文件并启用一个 express 做 demo

## 查看在线 Demo

> [点击查看在线 Demo](http://react-coat.ssr.teying.vip/)

留意以下行为：

- 随便点击一个 link，打开一个新页面，刷新一下浏览器，看是否能保持当前页面内容。
- 在某个 link 上用鼠标左键点击，看是否是单页的用户体验，用右键点击选择在`新窗口中打开`，看是否可以用多页的方式跳转。
- 查看网页源码，看服务器是否输出静态的 Html。

## 单页同构 SSR

对于 React 的 Server-Side Rendering 也许你会说：这不已经有 next.js，还有 prerender 么？可是亲，你真的用过它们做过稍复杂一点的项目么？而我们的目标要更进一步，不仅要 SSR，还要有 Single Page（单页）的用户体验，和 isomorphic（同构）的工程化方案，所以我们给自已提 8 个要求：

1. 浏览器与服务器复用同一套代码与路由。
2. 编译出来的代码要便于部署，不要太多依赖。
3. 浏览器载入的首屏由服务器渲染完成，以提高加载速度和利于 SEO。
4. 浏览器不再重复做服务器已完成的渲染工作（包括不再重复的请求数据）。
5. 首屏后不再整体刷新，而是通过 ajax 局部更新，带来单页的用户体验。
6. 在交互过程中，随时刷新页面，可以通过 URL 重现当前内容（包括打开弹窗等动作）。
7. 所有的路由跳转 link 回归到原始的\<a href="..."\>，方便让搜索引擎爬取。
8. JS 拦截所有\<a href="..."\>的浏览器跳转行为，改用单页方式打开。

对于以上的最后两点要求，可以用这种方法来验证：

> 在某个 link 上用鼠标左键点击，看是否是单页的用户体验，用右键点击选择在`新窗口中打开`，看是否可以用多页的方式跳转。

## 浏览器渲染？服务器渲染？一键切换

打开项目根下的./package.json，在"devServer"项中，将 ssr 设为 true 将启用服务器渲染，设为 false 仅使用浏览器渲染

```
"devServer": {
    "url": "http://localhost:7445",
    "ssr": true, // 是否启用服务器渲染
    "mock": true,
    "proxy": {
      "/ajax/**": {
        "target": "http://localhost:7446/",
        "secure": false,
        "changeOrigin": true
      }
    }
  }
```

## 一套代码、两个入口、两套输出

浏览器和服务器代码 99% 是共用的，除了入口文件稍有不同。我们在`/src/`下分别为其建立不同的入口文件。

- client.ts 浏览器端入口文件
- server.ts 服务器端入口文件

> npm run build

- /dist/client 输出成浏览器运行的代码，JS 会按模块做代码分割，生成多个 bundle 以按需加载。
- /dist/server 输出成服务器运行的代码，服务器端运行不需要代码分割，所以仅生成一个 main.js 文件，简单又方便。

### 浏览器端部属运行

我们生成了`/dist/client`这个目录，里面是浏览器运行所需的 Html、Js、Css、Imgs 等，是纯静态的资源，所以你只需将整个目录上传到 nginx 发布目录中即可。

### 服务端部属运行

我们生成了`/dist/server/main.js`这个服务器端运行文件，它包含了应用的服务器渲染逻辑，你只需要将它 copy 到你的 web server 框架中执行，比如 express 为例：

```JS
const mainModule = require("./server/main.js");// build生成的 main.js
const app = express();

app.use((req, res, next)=>{
  const errorHandler = (err) => {
      if (err.code === "301" || err.code === "302") {
          // 服务器路由跳转还得靠 express
          res.redirect(parseInt(err.code, 10), err.detail);
      } else {
          res.send(err.message || "服务器错误！");
      }
  };
  try {
      mainModule.default(req.url).then(result => {
          const { ssrInitStoreKey, data, html } = result;
          // html 渲染出的 html 字符串
          // data 脱水数据，也就是 redux store 的 state
          // ssrInitStoreKey 脱水数据的 key
          ...

      }).catch(errorHandler);
  }catch (err) {
      errorHandler(err);
  }
});
app.listen(3000);

```

## 单向数据流

在服务器渲染时，React 不会 Rerender，数据流一定是单向的，从 Redux Store->React，不要企图 Store->React->Store->React，也就是在渲染 React 之前，我们得把所有数据都准备好，严格执行 UI(State) 纯函数，而不能依赖 React 生命周期勾子去取数据。

正好 @medux 已经把数据逻辑全部都封装在 Model 里面。而且自始自终强调 Model 的独立性，不要依赖 View，甚至脱离 View，Model 也能运行。

所以...服务器渲染的流程比较纯粹：

- 首先 Build model
- 然后 Render view

## 使用 Transfer-Encoding: chunked

使用 SSR，意味着首屏你看到的是需要先经过服务器运算后返回的，为了减少白屏等待时间你可以使用 Http 的 Transfer-Encoding: chunked，先让服务器返回一个静态的 Loading 页面，然后再开始服务器渲染。

但是这样一来，如果后服务器运算出需要 Redirect 重定向，而此时你的 Http 头已经输出了，不能再利用 301 跳转，所以你只能继续输出一段 JS 来让浏览器执行跳转，例如：

```JS
if (err.code === "301" || err.code === "302") {
    if (res.headersSent) {
        res.write(`
        <span>跳转中。。。</span></body>
        <script>window.location.href="${err.detail}"</script>
        </html>`);
        res.end();
    } else {
        res.redirect(parseInt(err.code, 10), err.detail);
    }
}
```

## 学习交流

- Email：[wooline@qq.com](wooline@qq.com)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

  ![QQ群二维码](https://github.com/wooline/react-coat/blob/master/docs/imgs/qr.jpg)

- 欢迎批评指正，觉得还不错的别忘了给个`Star` >\_<，如有错误或 Bug 请反馈
