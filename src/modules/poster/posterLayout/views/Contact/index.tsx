import './index.less';

import {Icon} from 'antd';
import {Link} from 'react-router-dom';
import React from 'react';

class Component extends React.PureComponent {
  public render() {
    return (
      <div className="posterLayout-Contact">
        <div className="g-doc">
          <h2 className="sol-contact-tit">方案与架构咨询</h2>
          <p>关于使用场景和技术架构的更多咨询， 请联系我们的销售和技术支持团队。</p>
          <div>
            <Link className="primaryBtn" to={metaKeys.UserHomePathname}>
              马上咨询 <Icon type="right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
