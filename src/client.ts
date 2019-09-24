import 'Global';

import {createBrowserHistory, createHashHistory} from 'history';
import {moduleGetter, routeConfig} from 'modules';

import {buildApp} from '@medux/react-web-router';
import {setInited} from 'common/utils';

const historyStack = history.pushState ? createBrowserHistory() : createHashHistory();
buildApp(moduleGetter, 'app', historyStack, routeConfig).then(store => {
  setInited(store);
});
