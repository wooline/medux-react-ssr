import {isServer, metaKeys} from './common/utils';

import React from 'react';
import {loadView} from '@medux/react-web-router';
const Loading = () => <div className="viewLoader">Loading</div>;
((data: {[key: string]: any}) => {
  const g = isServer() ? global : window;
  Object.keys(data).forEach(key => {
    g[key] = data[key];
  });
})({metaKeys, loadView: (moduleName: string, viewName: string) => (loadView as any)(moduleName, viewName, Loading)});
