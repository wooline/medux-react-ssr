import {NavLink} from 'react-router-dom';
import React from 'react';
interface Props {
  to: string;
}

class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <NavLink
        isActive={(match, location) => {
          return location.pathname + location.search === this.props.to;
        }}
        to={this.props.to}
      >
        {this.props.children}
      </NavLink>
    );
  }
}

export default Component;
