import './index.less';

import LinkButton from 'components/LinkButton';
import React from 'react';

interface Props {
  baseUrl: string;
  page: number;
  totalPages: number;
}
export default class Component extends React.PureComponent<Props> {
  public render() {
    const {page, totalPages, baseUrl} = this.props;
    return totalPages ? (
      <div className="comp-Pagination">
        <LinkButton href={page > 1 ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page - 1}`) : '#'} className={`am-button am-button-inline prev${page === 1 ? ' disabled' : ''}`}>
          上一页
        </LinkButton>
        <div className="page">
          <span className="active">{page}</span>/{totalPages}
        </div>
        <LinkButton href={page < totalPages ? baseUrl.replace(/(%22page%22%3A)null/, `$1${page + 1}`) : '#'} className={`am-button am-button-inline next${page === totalPages ? ' disabled' : ''}`}>
          下一页
        </LinkButton>
      </div>
    ) : (
      <div className="comp-Pagination">没有更多内容</div>
    );
  }
}
