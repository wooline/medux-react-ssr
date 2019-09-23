import './index.less';

import {RouteComponentProps, withRouter} from 'react-router-dom';

import {CurUser} from 'entity/common';
import React from 'react';
import {connect} from 'react-redux';

interface StateProps {
  curUser?: CurUser;
}

class Component extends React.PureComponent<StateProps & DispatchProp & RouteComponentProps> {
  public render() {
    return <header className="posterLayout-Header">Header</header>;
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const app = state.app!;
  return {
    curUser: app.curUser,
  };
};

export default withRouter(connect(mapStateToProps)(Component));
