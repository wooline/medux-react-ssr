import React from 'react';

interface Props {}

class Component extends React.PureComponent<Props> {
  public render() {
    return <div className="app-LoginPop">login</div>;
  }
}

export default reduxConnect()(Component);
