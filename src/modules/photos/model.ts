import {ActionTypes, BaseModelHandlers, effect} from '@medux/react-web-router';
import {ItemDetail, ListItem, ListSearch, ListSummary} from 'entity/photo';

import {BaseModelState} from '@medux/react-web-router/types/export';
import {RootState} from 'modules';
import {RouteParams} from './meta';
import api from './api';
import {simpleEqual} from 'common/utils';

// 定义本模块的State类型
export interface State extends BaseModelState<RouteParams> {
  listItems?: ListItem[];
  listSummary?: ListSummary;
  itemDetail?: ItemDetail;
}

// 定义本模块State的初始值
export const initModelState: State = {};

export class ModelHandlers extends BaseModelHandlers<State, RootState> {
  @effect()
  public async searchList(options: Partial<ListSearch> = {}) {
    const listSearch: ListSearch = {...this.state.routeParams!.listSearch!, ...options};
    const {listItems, listSummary} = await api.searchList(listSearch);
    const _listKey = this.rootState.route.data.params.photos!._listKey;
    const routeParams = {...this.state.routeParams!, listSearch, _listKey};
    this.updateState({routeParams, listItems, listSummary});
  }
  @effect()
  public async getItemDetail(itemId: string) {
    const [itemDetail] = await Promise.all([api.getItemDetail(itemId), api.hitItem(itemId)]);
    const _detailKey = this.rootState.route.data.params.photos!._detailKey;
    const routeParams = {...this.state.routeParams!, itemId, _detailKey};
    this.updateState({routeParams, itemDetail});
  }

  // 同时监听初始化INIT和路由变化的action
  // 参数 null 表示不需要监控loading状态，searchList时会监控loading
  @effect(null)
  protected async [`this/${ActionTypes.MInit},${ActionTypes.RouteChange}`]() {
    if (this.rootState.route.data.views.photos) {
      const {
        views,
        params: {photos},
      } = this.rootState.route.data;
      const thisParams = this.state.routeParams!;
      const routeParams = photos!;
      if (views.photos!.List) {
        if (!this.state.listItems || thisParams._listKey !== routeParams._listKey || !simpleEqual(thisParams.listSearch, routeParams.listSearch)) {
          await this.dispatch(this.actions.searchList(routeParams.listSearch));
        }
      } else if (views.photos!.Details) {
        if (!this.state.itemDetail || thisParams._detailKey !== routeParams._detailKey || this.state.itemDetail.id !== routeParams.itemId) {
          await this.dispatch(this.actions.getItemDetail(routeParams.itemId));
        }
      }
    }
  }
}
