import 'asset/css/global.less';
import './index.less';

import {Redirect, Route, Switch} from 'react-router-dom';

import {ConfigProvider} from 'antd';
import GlobalLoading from '../GlobalLoading';
import LoginPop from '../LoginPop';
import {Modal} from 'antd';
import NotFound from 'components/NotFound';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';

moment.locale('zh-cn');

const PosterLayout = loadView('posterLayout', 'Main');

interface StoreProps {
  showLoginPop: boolean;
  showRegisterPop: boolean;
  showNotFoundPop: boolean;
}
//
class Component extends React.PureComponent<StoreProps & DispatchProp> {
  private onCloseLoginPop = () => {
    this.props.dispatch(actions.app.putShowLoginPop(false));
  };
  private onCloseNotFound = () => {
    this.props.dispatch(actions.app.putShowNotFoundPop(false));
  };
  public render() {
    const {showLoginPop, showNotFoundPop} = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <>
          <Switch>
            <Redirect exact path="/" to={metaKeys.HomePathname} />
            <Redirect exact path="/poster" to={metaKeys.HomePathname} />
            <Redirect exact path="/user" to={metaKeys.UserHomePathname} />
            <Route path="/poster" component={PosterLayout} />
            <Route component={NotFound} />
          </Switch>
          <Modal visible={showLoginPop} onCancel={this.onCloseLoginPop} title="请登录" closable={true}>
            <LoginPop />
          </Modal>
          <Modal visible={showNotFoundPop} onCancel={this.onCloseNotFound} title="未找到" closable={true}>
            <NotFound />
          </Modal>
          <GlobalLoading />
        </>
      </ConfigProvider>
    );
  }
}

const mapStateToProps: (state: RootState) => StoreProps = state => {
  const app = state.app!;
  return {
    showLoginPop: !!app.showLoginPop,
    showRegisterPop: !!app.showRegisterPop,
    showNotFoundPop: !!app.showNotFoundPop,
  };
};

export default connect(mapStateToProps)(Component);
