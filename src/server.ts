import 'Global';

import {moduleGetter, routeConfig} from 'modules';

import {buildSSR} from '@medux/react-web-router';

export default function render(path: string) {
  if (path === '/') {
    path = '/poster/home';
  }
  return buildSSR(moduleGetter, 'app', path, routeConfig);
}
