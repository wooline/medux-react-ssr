import './index.less';

import {DispatchProp, connect} from 'react-redux';
import Icon, {IconClass} from 'components/Icon';
import {ListItem, ListSummary} from 'entity/photo';
import {RootState, actions} from 'modules';
import {ViewNames, historyActions} from 'common/route';

import {ModuleNames} from 'modules/names';
import {Pagination} from 'antd-mobile';
import React from 'react';
import {RouteData} from '@medux/react-web-router/types/export';
import {RouteParams} from '../../meta';
import Search from 'components/Search';

interface StateProps {
  routeData: RouteData;
  showSearch: boolean;
  listSearch: RouteParams['listSearch'];
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = 0;

class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onPageChange = (page: number) => {
    historyActions.push({extend: this.props.routeData, params: {photos: {listSearch: {page}}}});
  };
  private onSearch = (title: string) => {
    historyActions.push({extend: this.props.routeData, params: {photos: {listSearch: {title, page: 1}}}});
  };
  private onSearchClose = () => {
    this.props.dispatch(actions.app.putShowSearch(false));
    if (this.props.listSearch.title) {
      this.onSearch('');
    }
  };
  private onItemClick = (itemId: string) => {
    // 记住当前滚动位置
    scrollTop = window.pageYOffset;
    const {routeData} = this.props;
    const paths = routeData.paths.slice(0, -1).concat(ViewNames.photosDetails);
    historyActions.push({extend: routeData, paths, params: {photos: {itemId}}});
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary} = this.props;
    if (listSearch && listItems) {
      return (
        <div className={`${ModuleNames.photos}-List g-pic-list`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch} />
          <div className="list-items">
            {listItems.map(item => (
              <div onClick={() => this.onItemClick(item.id)} key={item.id} className="g-pre-img">
                <div style={{backgroundImage: `url(${item.coverUrl})`}}>
                  <h5 className="title">{item.title}</h5>
                  <div className="listImg" />
                  <div className="props">
                    <Icon type={IconClass.LOCATION} /> {item.departure}
                    <Icon type={IconClass.HEART} /> {item.type}
                  </div>
                  <div className="desc">
                    <span className="hot">
                      人气(<strong>{item.hot}</strong>)
                    </span>
                    <em className="price">
                      <span className="unit">￥</span>
                      {item.price}
                    </em>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination current={listSummary.page} total={listSummary.totalPages} onChange={this.onPageChange} />
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
  const model = state.photos!;
  return {
    showSearch: !!state.app!.showSearch,
    routeData: state.route.data,
    listSearch: model.routeParams!.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
