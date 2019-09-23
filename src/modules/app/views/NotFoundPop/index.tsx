import React from 'react';
import {connect} from 'react-redux';
interface Props {}

class Component extends React.PureComponent<Props> {
  public render() {
    return <div className="app-LoginPop">login</div>;
  }
}

export default connect()(Component);
