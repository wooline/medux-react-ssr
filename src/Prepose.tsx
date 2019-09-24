// 某些全局变量必须前置引入
import {isServer, metaKeys} from './common/utils';

import React from 'react';
import {loadView as baseLoadView} from '@medux/react-web-router';

const DefLoading = () => <div className="viewLoader">Loading</div>;
const loadView = (moduleName: string, viewName: never, loading: React.ComponentType<any> = DefLoading) => baseLoadView(moduleName, viewName, loading);

((data: {[key: string]: any}) => {
  const g = isServer() ? global : window;
  Object.keys(data).forEach(key => {
    g[key] = data[key];
  });
})({metaKeys, loadView});
