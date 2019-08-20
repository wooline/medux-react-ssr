/* eslint-disable react/no-find-dom-node */
import './index.less';

import {ListItem, ListSummary} from 'entity/comment';

import LinkButton from 'components/LinkButton';
import Pagination from 'components/Pagination';
import React from 'react';
import {RouteParams} from '../../meta';
import {findDOMNode} from 'react-dom';

interface StateProps {
  routeData: BaseRouteData;
  listSearch: RouteParams['listSearch'];
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}
let scrollTop = NaN;
class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onSortChange = (isNewest: boolean) => {
    return toUrl({extend: this.props.routeData, params: {comments: {listSearch: {page: 1, isNewest}}}});
  };
  private onItemClick = () => {
    // 记住当前滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    scrollTop = (dom.parentNode as HTMLDivElement).scrollTop;
  };

  public render() {
    const {listSearch, listItems, listSummary, routeData} = this.props;
    if (listItems) {
      const paths = routeData.paths.slice(0, -1).concat(viewNames.commentsDetails);
      const itemBaseUrl = toUrl({extend: routeData, paths, params: {comments: {itemId: '---'}}});
      return (
        <div className={`${moduleNames.comments}-List`}>
          <div className="list-header">
            <LinkButton href={this.onSortChange(false)} className={listSearch.isNewest ? '' : 'on'}>
              最热
            </LinkButton>
            <LinkButton href={this.onSortChange(true)} className={listSearch.isNewest ? 'on' : ''}>
              最新
            </LinkButton>
          </div>
          <div className="list-items">
            {listItems.map(item => (
              <LinkButton onClick={this.onItemClick} href={itemBaseUrl.replace(/---/g, item.id)} className="g-border-top" key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
                <span className="reply">
                  <span className="act">回复</span>({item.replies})
                </span>
              </LinkButton>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination baseUrl={toUrl({extend: this.props.routeData, params: {comments: {listSearch: {page: NaN}}}})} page={listSummary.page} totalPages={listSummary.totalPages} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidUpdate() {
    this.scroll();
  }
  public componentDidMount() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = scrollTop;
      scrollTop = 0;
    }
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const model = state.comments!;
  return {
    routeData: state.route.data,
    listSearch: model.routeParams!.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default reduxConnect(mapStateToProps)(Component);
