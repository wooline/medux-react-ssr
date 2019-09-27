import Activities from '../Activities';
import Anchor from 'components/Anchor';
import Banner from '../Banner';
import Page from 'components/Page';
import React from 'react';
import Recommend from '../Recommend';
import Special from '../Special';
import {connect} from 'react-redux';

interface StoreProps {}

class Component extends Page<StoreProps> {
  public render() {
    return (
      <div className="posterHome-Main">
        <Banner />
        <Anchor navs={[['注意事项', 'posterHome-Activities'], ['精品推荐', 'posterHome-Recommend'], ['技术优势', 'posterHome-Special']]} />
        <Activities />
        <Recommend />
        <Special />
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => any = () => {
  return {};
};

export default connect(mapStateToProps)(Component);
