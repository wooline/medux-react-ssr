import 'Global';

import {moduleGetter, routeConfig} from 'modules';

import {buildApp} from '@medux/react-web-router';
import {createBrowserHistory} from 'history';
import {setInited} from 'common/utils';

buildApp(moduleGetter, 'app', createBrowserHistory(), routeConfig).then(store => {
  setInited(store);
});
