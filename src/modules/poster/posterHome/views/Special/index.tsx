import './index.less';

import ImgAD from './imgs/ad.png';
import React from 'react';

interface StateProps {}

class Component extends React.PureComponent<StateProps> {
  public render() {
    return (
      <section className="posterHome-Special g-activities g-doc" id="posterHome-Special">
        <h4>特惠专区</h4>
        <div className="panel g-clearfix">
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
