import React from 'react';
import {connect} from 'react-redux';

interface StateProps {
  pathname: string;
}

class Component extends React.PureComponent<StateProps> {
  public render() {
    return <div className="posterHome-Main">PosterHome</div>;
  }
}

const mapStateToProps: (state: RootState) => any = state => {
  return {
    pathname: state.route.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
