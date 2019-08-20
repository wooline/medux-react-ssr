import {CurUser, LoginRequest, LoginResponse} from 'entity/session';

import request from 'common/request';

export class API {
  public getCurUser() {
    return request<CurUser>('get', '/ajax/session').then(user => {
      user.avatarUrl = initEnv.clientPublicPath + user.avatarUrl;
      return user;
    });
  }
  public login(req: LoginRequest) {
    return request<LoginResponse>('put', '/ajax/session', {}, req).then(loginResponse => {
      if (loginResponse.data) {
        loginResponse.data.avatarUrl = initEnv.clientPublicPath + loginResponse.data.avatarUrl;
      }
      return loginResponse;
    });
  }
}

export const api = new API();
