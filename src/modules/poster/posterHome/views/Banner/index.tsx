import './index.less';

import {Icon} from 'antd';
import {Link} from 'react-router-dom';
import React from 'react';

interface StateProps {}

class Component extends React.PureComponent<StateProps> {
  public render() {
    return (
      <div className="posterHome-Banner g-banner">
        <div className="g-doc">
          <h2>静态页面Demo</h2>
          <p>本页面主要演示静态页面的服务器渲染，静态页面中图片和内容Hardcode在代码中</p>
          <Link className="primaryBtn" to={metaKeys.UserHomePathname}>
            马上咨询 <Icon type="right" />
          </Link>
        </div>
      </div>
    );
  }
}

export default Component;
