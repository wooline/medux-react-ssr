import Activities from '../Activities';
import Banner from '../Banner';
import PosterAnchor from 'components/PosterAnchor';
import React from 'react';
import Recommend from '../Recommend';
import Special from '../Special';
import {connect} from 'react-redux';

interface StateProps {
  pathname: string;
}

class Component extends React.PureComponent<StateProps> {
  public render() {
    return (
      <div className="posterHome-Main">
        <Banner />
        <PosterAnchor navs={[['最新活动', 'posterHome-Activities'], ['精品推荐', 'posterHome-Recommend'], ['特惠专区', 'posterHome-Special']]} />
        <Activities />
        <Recommend />
        <Special />
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => any = state => {
  return {
    pathname: state.route.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
