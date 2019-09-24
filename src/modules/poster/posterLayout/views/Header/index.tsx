import './index.less';

import {RouteComponentProps, withRouter} from 'react-router-dom';

import {CurUser} from 'entity/common';
import {Icon} from 'antd';
import {Link} from 'react-router-dom';
import React from 'react';
import {connect} from 'react-redux';

interface StateProps {
  curUser?: CurUser;
}

class Component extends React.PureComponent<StateProps & DispatchProp & RouteComponentProps> {
  public render() {
    const {curUser} = this.props;
    return (
      <header className="posterLayout-Header">
        <div className="g-doc g-clearfix">
          <div className="main">
            <Link to={metaKeys.HomePathname} className="logo g-clearfix">
              <img height="35" src={`${initEnv.clientPublicPath}client/imgs/logo.svg`} alt={initEnv.siteName} />
              <h2>Medux SSR Demo</h2>
            </Link>
            <nav>
              <Link to={metaKeys.UserHomePathname}>精品线路</Link>
              <Link to={metaKeys.UserHomePathname}>旅程分享</Link>
              <Link to={metaKeys.UserHomePathname}>关于我们</Link>
            </nav>
          </div>
          <div className="sider">
            {curUser && curUser.hasLogin ? (
              <>
                <span>
                  <Icon type="user" /> {curUser.username}
                </span>

                <Link to={metaKeys.UserHomePathname} className="active">
                  个人中心
                </Link>
              </>
            ) : (
              <>
                <Link to={metaKeys.LoginPathname}>登录</Link>
                <Link to={metaKeys.RegisterPathname} className="active">
                  欢迎注册
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const app = state.app!;
  return {
    curUser: app.curUser,
  };
};

export default withRouter(connect(mapStateToProps)(Component));
