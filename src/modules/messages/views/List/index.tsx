import './index.less';

import {ListItem, ListSummary} from 'entity/message';

import {Pagination} from 'antd-mobile';
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

class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onPageChange = (page: number) => {
    historyActions.push({extend: this.props.routeData, params: {messages: {listSearch: {page}}}});
  };

  private onSearch = (title: string) => {
    historyActions.push({extend: this.props.routeData, params: {messages: {listSearch: {title, page: 1}}}});
  };

  private onSearchClose = () => {
    this.props.dispatch(actions.app.putShowSearch(false));
    if (this.props.listSearch!.title) {
      this.onSearch('');
    }
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      return (
        <div className={`${moduleNames.messages}-List`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch} />
          <div className="list-items">
            {listItems.map(item => (
              <div key={item.id}>
                <div className="author">{item.author}</div>
                <div className="date">{item.date.toUTCString()}</div>
                <div className="content">{item.content}</div>
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
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const model = state.messages!;
  return {
    showSearch: !!state.app!.showSearch,
    routeData: state.route.data,
    listSearch: model.routeParams!.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default reduxConnect(mapStateToProps)(Component);
