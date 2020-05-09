import {ActionTypes, BaseModelHandlers, BaseModelState, LoadingState, effect, reducer} from '@medux/react-web-router';
import {CommonErrorCode, CustomError, isServer} from 'common';
import {CurUser, LoginRequest, Notices, RegisterRequest, guest} from 'entity/session';

import {HandledError} from 'common';
import {ProjectConfig} from 'entity';
import api from './api';

// 定义本模块的State类型
export interface State extends BaseModelState {
  projectConfig: ProjectConfig;
  curUser: CurUser;
  notices: Notices;
  showLoginOrRegisterPop?: 'login' | 'register';
  showRegistrationAgreement?: boolean;
  loading: {
    global: LoadingState;
  };
}

// 定义本模块State的初始值
export const initModelState: State = {
  notices: {count: 0},
  projectConfig: {tokenRenewalTime: 30000, noticeTimer: 15},
  curUser: {
    id: '',
    username: 'guest',
    hasLogin: false,
    avatar: '',
  },
  loading: {
    global: LoadingState.Stop,
  },
};

// 定义本模块的Handlers
export class ModelHandlers extends BaseModelHandlers<State, RootState> {
  private noticesTimer: number = 0;
  private getNotice() {
    api.getNotices().then((notices) => {
      this.updateState({notices});
    });
  }
  private getNoticeTimer() {
    if (this.state.curUser && this.state.curUser.hasLogin) {
      this.getNotice();
      if (!this.noticesTimer) {
        this.noticesTimer = setInterval(() => {
          this.getNotice();
        }, this.state.projectConfig.noticeTimer * 1000);
      }
    }
  }
  private checkLoginRedirect() {
    if (this.state.curUser && this.state.curUser.hasLogin) {
      let redirect = sessionStorage.getItem(metaKeys.LoginRedirectSessionStorageKey);
      sessionStorage.removeItem(metaKeys.LoginRedirectSessionStorageKey);
      if (redirect === metaKeys.LoginPathname) {
        redirect = metaKeys.UserHomePathname;
      }
      redirect && historyActions.push(redirect);
    }
  }
  @reducer
  public putCurUser(curUser: CurUser): State {
    return {...this.state, curUser};
  }
  @effect()
  public async register(params: RegisterRequest) {
    await api.register(params);
    this.dispatch(this.actions.login(params));
  }
  @effect()
  public async login(params: LoginRequest) {
    const oCurUser = this.state.curUser!;
    const expired = oCurUser.expired || 0;
    const curUser = await api.login(params);
    const isPop = !!this.state.showLoginOrRegisterPop;
    if (isPop && oCurUser.id === curUser.id && Date.now() - expired < this.state.projectConfig.tokenRenewalTime) {
      this.dispatch(this.actions.putCurUser(curUser));
      this.dispatch(this.actions.closesLoginOrRegisterPop());
      this.getNoticeTimer();
    } else {
      location.reload();
    }
  }

  @effect()
  public async logout(expired?: number) {
    if (expired) {
      if (this.noticesTimer) {
        clearInterval(this.noticesTimer);
        this.noticesTimer = 0;
      }
      this.dispatch(this.actions.putCurUser({...this.state.curUser!, expired}));
    } else {
      await api.logout();
      location.reload();
    }
  }
  @reducer
  public closesLoginOrRegisterPop(): State {
    return {...this.state, showLoginOrRegisterPop: undefined};
  }
  @reducer
  public openLoginOrRegisterPop(showLoginOrRegisterPop: 'login' | 'register'): State {
    return {...this.state, showLoginOrRegisterPop};
  }
  @reducer
  public showRegistrationAgreement(showRegistrationAgreement: boolean): State {
    return {...this.state, showRegistrationAgreement};
  }
  @effect(null) // 不需要loading，设置为null
  protected async [ActionTypes.Error](error: CustomError) {
    if (isServer()) {
      if (error.code === CommonErrorCode.redirect) {
        throw {code: '301', detail: error.detail};
      } else {
        //服务器渲染遇到预期的错误时（例如需要登录），服务器终止渲染，改为client端渲染
        throw {code: '303'};
      }
    }
    //如果仅仅是因为token过期而导致的用户退出，在过期时间较短的情况下，允许用户不刷新页面而弹出登录弹窗，重新登录以续期
    //主要为了不强制打断当前的用户操作流
    if (error.code === CommonErrorCode.unauthorized || error.code === CommonErrorCode.authorizeExpired) {
      sessionStorage.setItem(metaKeys.LoginRedirectSessionStorageKey, location.pathname + location.search + location.hash);
      const curUser = this.state.curUser || guest;
      if (curUser.hasLogin) {
        await this.dispatch(this.actions.logout(parseInt(error.detail)));
      }
      if (error.code === CommonErrorCode.authorizeExpired || !error.detail) {
        this.dispatch(this.actions.openLoginOrRegisterPop('login'));
      } else {
        historyActions.push(metaKeys.LoginPathname);
      }
      throw new HandledError(error);
    } else if (error.code === CommonErrorCode.redirect) {
      historyActions.replace(error.detail);
    } else if (error.code === CommonErrorCode.refresh) {
      location.reload();
      throw new HandledError(error);
    } else {
      error.code !== CommonErrorCode.noToast && error.message && message.error(error.message);
      throw new HandledError(error);
    }
  }
  @effect(null)
  protected async ['this.Init']() {
    if (this.state.isHydrate) {
      //如果已经经过SSR服务器渲染，该段代码只会运行在client端
      const curUser = await api.getCurUser();
      this.dispatch(this.actions.putCurUser(curUser));
      if (curUser.hasLogin) {
        this.getNoticeTimer();
        this.checkLoginRedirect();
      }
    } else {
      //如果是初次渲染，可能运行在client端也可能运行在server端
      const projectConfig = await api.getProjectConfig();
      this.updateState({projectConfig});
      if (!isServer()) {
        const curUser = await api.getCurUser();
        this.dispatch(this.actions.putCurUser(curUser));
        if (curUser.hasLogin) {
          this.getNoticeTimer();
          this.checkLoginRedirect();
        }
      }
    }
  }
}
