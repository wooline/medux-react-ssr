import {Anchor} from 'antd';
import React from 'react';

const Link = Anchor.Link;
interface StateProps {
  navs: string[][];
}

class Component extends React.PureComponent<StateProps> {
  private onClick(e: React.MouseEvent) {
    e.preventDefault();
  }
  public render() {
    return (
      <Anchor className="g-anchor" onClick={this.onClick}>
        {this.props.navs.map((item, idx) => (
          <Link key={idx} href={`#${item[1]}`} className="sub-nav-title" title={item[0]} />
        ))}
      </Anchor>
    );
  }
}

export default Component;
