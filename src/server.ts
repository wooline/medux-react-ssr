import 'Global';

import {defaultRouteParams, moduleGetter, routeConfig} from 'modules';

import {buildSSR} from '@medux/react-web-router';

export default function render(location: string) {
  const [pathname, search] = location.split('?');
  return buildSSR({
    moduleGetter,
    appModuleName: 'app',
    location,
    routeConfig,
    defaultRouteParams,
    beforeRender: ({store, historyActions, toBrowserUrl, transformRoute}) => {
      global['location'] = {pathname, search, hash: ''};
      global['historyActions'] = historyActions;
      global['toUrl'] = toBrowserUrl;
      global['transformRoute'] = transformRoute;
      return store;
    },
  });
}
