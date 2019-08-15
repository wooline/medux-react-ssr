import {buildApp} from '@medux/react-web-router';
import {createBrowserHistory} from 'history';
import {moduleGetter} from 'modules';
import {routeConfig} from 'common/route';
import {setInited} from 'common/utils';

// 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
const env = getInitEnv();
window.InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath.client,
};
export const history = createBrowserHistory();
buildApp(moduleGetter, 'app', history, routeConfig).then(() => {
  setInited();
});
