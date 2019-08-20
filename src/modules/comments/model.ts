import {ActionTypes, BaseModelHandlers, BaseModelState, effect} from '@medux/react-web-router';
import {ItemCreateData, ItemDetail, ListItem, ListSearch, ListSummary} from 'entity/comment';
import {extract, pickEqual} from 'common/utils';

import {RouteParams} from './meta';
import {Toast} from 'antd-mobile';
import api from './api';

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
    const curRouteParams = this.state.routeParams!;
    // 组合成新的搜索条件
    const newListSearch: ListSearch = {...curRouteParams.listSearch, articleId: curRouteParams.articleId, articleType: curRouteParams.articleType, ...options};
    const {listItems, listSummary} = await api.searchList(newListSearch);
    const {articleId, articleType, $: listSearch} = extract(newListSearch, 'articleId', 'articleType');
    const _listKey = this.rootState.route.data.params.comments!._listKey;
    // 更新结果以及搜索条件
    const routeParams = {...curRouteParams!, articleId, articleType, _listKey, listSearch};
    this.updateState({routeParams, listItems, listSummary});
  }
  @effect()
  public async getItemDetail(itemId: string) {
    const curRouteParams = this.state.routeParams!;
    const itemDetail = await api.getItemDetail(itemId);
    const _detailKey = this.rootState.route.data.params.comments!._detailKey;
    const routeParams = {...curRouteParams, itemId, _detailKey};
    this.updateState({routeParams, itemDetail});
  }

  @effect()
  public async createItem(data: ItemCreateData) {
    const response = await api.createItem(data);
    if (!response.error) {
      Toast.info('操作成功');
      // 如果创建成功，要让用户看到自已发表的评论，必须刷新列表，以创建时间排序
      const routeData = this.rootState.route.data;
      const views = routeData.views;
      if (views.comments && views.comments.List) {
        await this.dispatch(this.actions.searchList({isNewest: true, page: 1}));
      } else if (views.comments && views.comments.Details) {
        await this.dispatch(this.actions.getItemDetail(this.state.itemDetail!.id));
      }
    } else {
      Toast.info(response.error.message);
    }
  }

  // 同时监听初始化INIT和路由变化的action
  // 参数 null 表示不需要监控loading状态，searchList时会监控loading
  @effect(null)
  protected async [`this/${ActionTypes.MInit},${ActionTypes.RouteChange}`]() {
    if (this.rootState.route.data.views.comments) {
      const {
        views,
        params: {comments},
      } = this.rootState.route.data;
      const thisParams = this.state.routeParams!;
      const routeParams = comments!;
      if (views.comments!.List) {
        if (!this.state.listItems || !pickEqual(thisParams, routeParams, ['_listKey', 'articleId', 'articleType', 'listSearch'])) {
          await this.dispatch(this.actions.searchList({...routeParams.listSearch, articleId: routeParams.articleId, articleType: routeParams.articleType}));
        }
      } else if (views.comments!.Details) {
        if (!this.state.itemDetail || thisParams._detailKey !== routeParams._detailKey || this.state.itemDetail.id !== routeParams.itemId) {
          await this.dispatch(this.actions.getItemDetail(routeParams.itemId));
        }
      }
    }
  }
}
