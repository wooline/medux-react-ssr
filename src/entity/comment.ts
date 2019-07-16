import {BaseListItem, BaseListSearch, BaseListSummary} from './common';

export interface ListItem extends BaseListItem {
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdTime: string;
  replies: number;
}

export interface ItemDetail extends ListItem {
  repliesList: ListItem[];
}

export interface ListSearch extends BaseListSearch {
  articleType: 'videos' | 'photos';
  articleId: string;
  isNewest: boolean;
}
export type ListSummary = BaseListSummary;

export interface ItemCreateData {
  articleType: string;
  articleId: string;
  commentId: string;
  content: string;
}
