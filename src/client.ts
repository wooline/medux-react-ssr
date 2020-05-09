import 'Global';

import {buildApp, errorAction} from '@medux/react-web-router';
import {defaultRouteParams, moduleGetter, routeConfig} from 'modules';

import {CommonErrorCode} from './common';
import {Store} from 'redux';
import {createBrowserHistory} from 'history';

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
  window.onunhandledrejection = (e: {reason: any}) => {
    if (e.reason && e.reason.code !== CommonErrorCode.handled) {
      singleStore.dispatch(errorAction(e.reason));
    }
  };
  window.onerror = (message: any, url: any, line: any, column: any, error: any) => {
    if (!error) {
      console.error(message);
      return;
    }
    if (error.code !== CommonErrorCode.handled && !error.dispatched) {
      error.dispatched = true;
      singleStore.dispatch(errorAction(error));
    }
  };
  const initLoading = document.getElementById('g-init-loading');
  initLoading && initLoading.parentNode!.removeChild(initLoading);
});
