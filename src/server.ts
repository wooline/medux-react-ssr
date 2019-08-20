import 'Global';

import {buildSSR} from '@medux/react-web-router';
import {routeConfig} from 'modules';

export default function render(path: string) {
  // 注意此处应当是main加载完成之后
  // 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
  const env = getInitEnv();
  global.initEnv = {
    clientPublicPath: env.clientPublicPath,
    apiServerPath: env.apiServerPath.server,
  };
  return buildSSR(moduleGetter, 'app', path, routeConfig).then();
}
