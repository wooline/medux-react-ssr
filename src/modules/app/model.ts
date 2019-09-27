import {ActionTypes, BaseModelHandlers, BaseModelState, LoadingState, effect, reducer} from '@medux/react-web-router';
import {CurUser, CustomError, LoginRequest, ProjectConfig, StartupStep} from 'entity/common';

import api from './api';

// 定义本模块的State类型
export interface State extends BaseModelState {
  showLoginPop?: boolean;
  showRegisterPop?: boolean;
  showNotFoundPop?: boolean;
  curUser?: CurUser;
  projectConfig?: ProjectConfig;
  startupStep?: StartupStep;
  loading: {
    global: LoadingState;
  };
}

// 定义本模块State的初始值
export const initModelState: State = {
  loading: {
    global: LoadingState.Stop,
  },
};

// 定义本模块的Handlers
export class ModelHandlers extends BaseModelHandlers<State, RootState> {
  // @reducer
  // public putStartup(startupStep: StartupStep): State {
  //   return {...this.state, startupStep};
  // }
  @reducer
  public putCurUser(curUser: CurUser): State {
    return {...this.state, curUser};
  }
  @reducer
  public putShowLoginPop(showLoginPop: boolean): State {
    return {...this.state, showLoginPop};
  }
  @reducer
  public showRegisterPop(showRegisterPop: boolean): State {
    return {...this.state, showRegisterPop};
  }
  @reducer
  public putShowNotFoundPop(showNotFoundPop: boolean): State {
    return {...this.state, showNotFoundPop};
  }
  @effect()
  public async login(payload: LoginRequest) {
    const curUser = await api.login(payload);
    this.dispatch(this.actions.putCurUser(curUser));
    const redirect = sessionStorage.getItem(metaKeys.LoginRedirectSessionStorageKey) || metaKeys.UserHomePathname;
    sessionStorage.removeItem(metaKeys.LoginRedirectSessionStorageKey);
    historyActions.replace(redirect);
  }
  @effect()
  public async logout() {
    const curUser = await api.logout();
    this.dispatch(this.actions.putCurUser(curUser));
    historyActions.replace(metaKeys.HomePathname);
  }
  @effect(null) // 不需要loading，设置为null
  protected async [ActionTypes.Error](error: CustomError) {
    if (error.code === '401') {
      const location = this.rootState.route.location;
      sessionStorage.setItem(metaKeys.LoginRedirectSessionStorageKey, location.pathname + location.search);
      historyActions.replace(metaKeys.LoginPathname);
    } else {
      console.error(error);
      error.message && message.error(error.message);
    }
  }
  @effect()
  protected async [metaKeys.ClientInitedAction]() {
    const curUser = await api.getCurUser();
    this.dispatch(this.actions.putCurUser(curUser));
  }
}
