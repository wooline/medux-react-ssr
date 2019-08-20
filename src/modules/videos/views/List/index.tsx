import './index.less';

import Icon, {IconClass} from 'components/Icon';
import {ListItem, ListSummary} from 'entity/video';

import LinkButton from 'components/LinkButton';
import Pagination from 'components/Pagination';
import React from 'react';
import {RouteParams} from '../../meta';
import Search from 'components/Search';

interface StateProps {
  routeData: BaseRouteData;
  showSearch: boolean;
  listSearch: RouteParams['listSearch'];
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = 0;

class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onSearch = (title: string) => {
    historyActions.push({extend: this.props.routeData, params: {videos: {listSearch: {title, page: 1}}}});
  };
  private onSearchClose = () => {
    this.props.dispatch(actions.app.putShowSearch(false));
    if (this.props.listSearch!.title) {
      this.onSearch('');
    }
  };
  private onItemClick = () => {
    // 记住当前滚动位置
    scrollTop = window.pageYOffset;
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary, routeData} = this.props;
    if (listItems && listSearch) {
      const itemBaseUrl = toUrl({
        extend: routeData,
        paths: [viewNames.appMain, viewNames.videosDetails, viewNames.commentsMain, viewNames.commentsList],
        params: {videos: {itemId: '---'}, comments: {articleType: 'videos', articleId: '---'}},
      });
      return (
        <div className={`${moduleNames.videos}-List g-pic-list`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch} />
          <div className="list-items">
            {listItems.map(item => (
              <LinkButton onClick={this.onItemClick} href={itemBaseUrl.replace(/---/g, item.id)} key={item.id} className="g-pre-img">
                <div style={{backgroundImage: `url(${item.coverUrl})`}}>
                  <h5 className="title">{item.title}</h5>
                  <div className="listImg" />
                  <div className="props">
                    <Icon type={IconClass.HEART} /> {item.hot}
                  </div>
                  <Icon className="icon-palyer" type={IconClass.PLAY_CIRCLE} />
                </div>
              </LinkButton>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination baseUrl={toUrl({extend: this.props.routeData, params: {videos: {listSearch: {page: NaN}}}})} page={listSummary.page} totalPages={listSummary.totalPages} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidMount() {
    this.scroll();
  }
  public componentDidUpdate() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const model = state.videos!;
  return {
    showSearch: !!state.app!.showSearch,
    routeData: state.route.data,
    listSearch: model.routeParams!.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default reduxConnect(mapStateToProps)(Component);
