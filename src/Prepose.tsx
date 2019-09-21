import React from 'react';
import {connect} from 'react-redux';
import {isServer} from './common/utils';
import {loadView} from '@medux/react-web-router';
const Loading = () => <div className="viewLoader">Loading</div>;
((data: {[key: string]: any}) => {
  const g = isServer() ? global : window;
  Object.keys(data).forEach(key => {
    g[key] = data[key];
  });
})({loadView: (moduleName: string, viewName: never) => (loadView as any)(moduleName, viewName, Loading), reduxConnect: connect});
