import {ListSearch} from 'entity/photo';
// 定义本模块的路由参数类型
export interface RouteParams {
  itemId: string;
  _detailKey: string;
  _listKey: string;
  listSearch: ListSearch;
}
export const defaultRouteParams: RouteParams = {
  _detailKey: '',
  _listKey: '',
  itemId: '',
  listSearch: {
    title: '',
    page: 1,
    pageSize: 10,
  },
};
