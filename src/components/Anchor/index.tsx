import './index.less';

import {Anchor} from 'antd';
import React from 'react';

const Link = Anchor.Link;
interface StoreProps {
  navs: string[][];
}

class Component extends React.PureComponent<StoreProps> {
  private onClick(e: React.MouseEvent) {
    e.preventDefault();
    const target = e.target as any;
    const href: string = target.getAttribute('href');
    historyActions.replace(href.replace('#', `${href.indexOf('?') > -1 ? '&' : '?'}${metaKeys.AnchorParamKey}=`));
  }
  public render() {
    return (
      <Anchor className="comp-anchor" onClick={this.onClick}>
        {this.props.navs.map((item, idx) => (
          <Link key={idx} href={`#${item[1]}`} title={item[0]} />
        ))}
      </Anchor>
    );
  }
}

export default Component;
