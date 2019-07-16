import './index.less';

import {Icon} from 'antd-mobile';
import {LoadingState} from '@medux/react-web-router';
import React from 'react';

interface Props {
  loading: LoadingState;
}

const Component = (props: Props) => {
  const {loading} = props;
  return loading === LoadingState.Start || loading === LoadingState.Depth ? (
    <div className={'app-Loading ' + loading}>
      <Icon className="loading-icon" type="loading" />
      <div className="wrap" />
    </div>
  ) : null;
};
export default Component;
