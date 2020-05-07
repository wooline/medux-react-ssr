import 'Global';

import {defaultRouteParams, moduleGetter, routeConfig} from 'modules';

import {Store} from 'redux';
import {buildApp} from '@medux/react-web-router';
import {createBrowserHistory} from 'history';
import {metaKeys} from './common';

if (initEnv.production) {
  (window as any).console = {
    log: () => void 0,
    info: () => void 0,
    error: () => void 0,
    warn: () => void 0,
  };
}

let singleStore: Store;
buildApp({
  moduleGetter,
  appModuleName: 'app',
  history: createBrowserHistory(),
  routeConfig,
  defaultRouteParams,
  beforeRender: ({store, historyActions, toBrowserUrl, transformRoute}) => {
    window['historyActions'] = historyActions;
    window['toUrl'] = toBrowserUrl;
    window['transformRoute'] = transformRoute;
    singleStore = store;
    return store;
  },
}).then(() => {
  singleStore.dispatch({type: metaKeys.ClientInitedAction});
  const initLoading = document.getElementById('g-init-loading');
  initLoading && initLoading.parentNode!.removeChild(initLoading);
});
