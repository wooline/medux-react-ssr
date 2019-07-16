import {ListSearch} from 'entity/comment';
import {OmitSelf} from 'common/utils';

// 定义本模块的路由参数类型
export interface RouteParams {
  itemId: string;
  articleType: 'videos' | 'photos';
  articleId: string;
  _detailKey: string;
  _listKey: string;
  //将搜索条件中的articleType和articleId放在path路径中传递
  listSearch: OmitSelf<ListSearch, 'articleType' | 'articleId'>;
}

export const defaultRouteParams: RouteParams = {
  _detailKey: '',
  _listKey: '',
  itemId: '',
  articleType: 'photos',
  articleId: '',
  listSearch: {
    isNewest: false,
    page: 1,
    pageSize: 10,
  },
};
