import {ActionTypes, BaseModelHandlers, BaseModelState, effect} from '@medux/react-web-router';
import {ListItem, ListSearch, ListSummary} from 'entity/message';

import {RouteParams} from './meta';
import api from './api';
import {simpleEqual} from 'common/utils';

// 定义本模块的State类型
export interface State extends BaseModelState<RouteParams> {
  listItems?: ListItem[];
  listSummary?: ListSummary;
}

// 定义本模块State的初始值
export const initModelState: State = {};

export class ModelHandlers extends BaseModelHandlers<State, RootState> {
  @effect()
  public async searchList(options: Partial<ListSearch> = {}) {
    const listSearch: ListSearch = {...this.state.routeParams!.listSearch!, ...options};
    const {listItems, listSummary} = await api.searchList(listSearch);
    const _listKey = this.rootState.route.data.params.messages!._listKey;
    const routeParams = {...this.state.routeParams!, listSearch, _listKey};
    this.updateState({routeParams, listItems, listSummary});
  }

  // 同时监听初始化INIT和路由变化的action
  // 参数 null 表示不需要监控loading状态，searchList时会监控loading
  @effect(null)
  protected async [`this/${ActionTypes.MInit},${ActionTypes.RouteChange}`]() {
    if (this.rootState.route.data.views.messages) {
      const {
        views,
        params: {messages},
      } = this.rootState.route.data;
      const thisParams = this.state.routeParams!;
      const routeParams = messages!;
      if (views.messages!.List) {
        if (!this.state.listItems || thisParams._listKey !== routeParams._listKey || !simpleEqual(thisParams.listSearch, routeParams.listSearch)) {
          await this.dispatch(this.actions.searchList(routeParams.listSearch));
        }
      }
    }
  }
}
