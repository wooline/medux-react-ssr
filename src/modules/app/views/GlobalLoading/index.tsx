import {LoadingState} from '@medux/react-web-router';
import React from 'react';
import {connect} from 'react-redux';

interface StoreProps {
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<StoreProps> {
  public render() {
    const {globalLoading} = this.props;
    return globalLoading === LoadingState.Start || globalLoading === LoadingState.Depth ? <div>globalLoading</div> : null;
  }
}

const mapStateToProps: (state: RootState) => StoreProps = state => {
  return {
    globalLoading: state.app!.loading.global,
  };
};
export default connect(mapStateToProps)(Component);
