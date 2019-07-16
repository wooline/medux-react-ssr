import {ListSearch} from 'entity/video';

// 定义本模块的路由参数类型
export interface RouteParams {
  _listKey: string;
  listSearch: ListSearch;
}
export const defaultRouteParams: RouteParams = {
  _listKey: '',
  listSearch: {
    title: '',
    page: 1,
    pageSize: 10,
  },
};
