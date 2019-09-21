import {CurUser} from 'entity/common';
import request from 'common/request';
export class API {
  public getCurUser(): Promise<CurUser> {
    return request<CurUser>('post', '/ajax/v1/user/UserSession')
      .then(res => {
        return {username: res.username, hasLogin: true};
      })
      .catch(() => {
        return {username: 'guest', hasLogin: false};
      });
  }
  public login(req: {username: string; password: string}): Promise<CurUser> {
    return request<{sessionid: string}>('post', '/ajax/v1/user/Login', {}, req).then(res => {
      sessionStorage.setItem(metaKeys.SessionIDSessionStorageKey, res.sessionid);
      return {username: req.username, hasLogin: true};
    });
  }
  public logout(): Promise<CurUser> {
    sessionStorage.removeItem(metaKeys.SessionIDSessionStorageKey);
    return Promise.resolve({username: 'guest', hasLogin: false});
  }
}

export default new API();
