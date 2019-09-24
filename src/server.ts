import 'Global';

import {moduleGetter, routeConfig} from 'modules';

import {RedirectError} from 'entity/common';
import {buildSSR} from '@medux/react-web-router';

export default function render(path: string) {
  if (path === '/' || path === '/poster') {
    throw new RedirectError('/poster/home');
  }
  if (path === '/user') {
    throw new RedirectError('/user/home');
  }
  return buildSSR(moduleGetter, 'app', path, routeConfig);
}
