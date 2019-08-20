import 'asset/css/global.less';
import './index.less';

import {Redirect, Route, Switch} from 'react-router-dom';

import BottomNav from '../BottomNav';
import Loading from '../Loading';
import {LoadingState} from '@medux/react-web-router';
import LoginPop from '../LoginPop';
import {Modal} from 'antd-mobile';
import NotFound from 'components/NotFound';
import React from 'react';
import {StartupStep} from 'entity/global';
import TopNav from '../TopNav';
import Welcome from '../Welcome';

const photosDetails = loadView(moduleGetter, 'photos', 'Details');
const photosList = loadView(moduleGetter, 'photos', 'List');
const videosDetails = loadView(moduleGetter, 'videos', 'Details');
const videosList = loadView(moduleGetter, 'videos', 'List');
const messagesList = loadView(moduleGetter, 'messages', 'List');

interface StateProps {
  showLoginPop: boolean;
  showNotFoundPop: boolean;
  startupStep: StartupStep;
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onCloseLoginPop = () => {
    this.props.dispatch(actions.app.putShowLoginPop(false));
  };
  private onCloseNotFound = () => {
    this.props.dispatch(actions.app.putShowNotFoundPop(false));
  };

  public render() {
    const {showLoginPop, showNotFoundPop, startupStep, globalLoading} = this.props;
    return (
      <div className={moduleNames.app}>
        {startupStep !== StartupStep.init && (
          <div className="g-page">
            <TopNav />
            <Switch>
              <Redirect exact={true} path="/" to="/photos" />
              <Route exact={true} path="/photos" component={photosList} />
              <Route exact={false} path="/photos/:itemId" component={photosDetails} />
              <Route exact={true} path="/videos" component={videosList} />
              <Route exact={false} path="/videos/:itemId" component={videosDetails} />
              <Route exact={true} path="/messages" component={messagesList} />
              <Route component={NotFound} />
            </Switch>
            <BottomNav />
          </div>
        )}
        {(startupStep === StartupStep.configLoaded || startupStep === StartupStep.startupImageLoaded || startupStep === StartupStep.startupCountEnd) && <Welcome className={startupStep} />}
        <Modal visible={showLoginPop} transparent={true} onClose={this.onCloseLoginPop} title="请登录" closable={true}>
          <LoginPop />
        </Modal>
        <Modal visible={showNotFoundPop} transparent={true} onClose={this.onCloseNotFound} title="找不到" closable={true}>
          <NotFound />
        </Modal>
        <Loading loading={globalLoading} />
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const app = state.app!;
  return {
    showLoginPop: !!(app.showLoginPop && !app.curUser!.hasLogin),
    showNotFoundPop: !!app.showNotFoundPop,
    startupStep: app.startupStep,
    globalLoading: app.loading.global,
  };
};

export default reduxConnect(mapStateToProps)(Component);
