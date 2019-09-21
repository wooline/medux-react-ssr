import {LoadingState} from '@medux/react-web-router';
import React from 'react';

interface StateProps {
  globalLoading: LoadingState;
}

class Component extends React.PureComponent<StateProps> {
  public render() {
    const {globalLoading} = this.props;
    return globalLoading === LoadingState.Start || globalLoading === LoadingState.Depth ? <div>globalLoading</div> : null;
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  return {
    globalLoading: state.app!.loading.global,
  };
};
export default reduxConnect(mapStateToProps)(Component);
