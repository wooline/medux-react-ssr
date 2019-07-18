import {defaultRouteParams, transformRoute} from 'common/route';

import {buildApp} from '@medux/react-web-router';
import {mergeDefaultParamsMiddleware} from '@medux/web-route-plan-a';
import {moduleGetter} from 'modules';
import {setInited} from 'common/utils';

// 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
const env = getInitEnv();
window.InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath.client,
};

buildApp(moduleGetter, 'app', transformRoute, {middlewares: [mergeDefaultParamsMiddleware], defaultRouteParams}).then(() => {
  setInited();
});
