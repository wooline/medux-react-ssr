import React from 'react';
import {connect} from 'react-redux';
interface Props {}

class Component extends React.PureComponent<Props> {
  public render() {
    return <div className="app-LoginPop">Startup</div>;
  }
}

export default connect()(Component);
