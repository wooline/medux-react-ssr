import './index.less';

import ImgAD from './imgs/ad.png';
import React from 'react';

interface StateProps {}

class Component extends React.PureComponent<StateProps> {
  public render() {
    return (
      <section className="posterHome-Recommend g-activities g-doc" id="posterHome-Recommend">
        <h4>精品推荐</h4>
        <div className="panel reverse g-clearfix">
          <p>dsfssf</p>
          <aside>
            <img width="680" height="440" src={ImgAD} />
          </aside>
        </div>
      </section>
    );
  }
}

export default Component;
