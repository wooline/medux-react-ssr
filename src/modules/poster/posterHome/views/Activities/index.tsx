import './index.less';

import ImgAD from './imgs/ad.png';
import Logo1 from './imgs/logo1.png';
import Logo2 from './imgs/logo2.png';
import Logo3 from './imgs/logo3.png';
import Logo4 from './imgs/logo4.png';
import React from 'react';

interface StoreProps {}

class Component extends React.PureComponent<StoreProps> {
  public render() {
    return (
      <section className="posterHome-Activities g-doc" id="posterHome-Activities">
        <h2>注意事项</h2>
        <div className="g-activities g-clearfix">
          <article>
            <p>
              IE9不支持History系列Api，只能使用createHashHistory进行路由，因为锚点定位也使用Hash值，所以两者会冲突。为了兼容IE9，本例中将锚点的Hash定位改为Url Search传参定位。
              <br />
              <cite>例如：?anchor=posterHome-Special</cite>
              <br />
              另外一种解决方案是IE9下依然使用createBrowserHistory，锚点Hash定位可以正常使用，但此时IE9下所有路由将会刷新页面，体验不太好。
              <br />
              还要注意不要使用全局的window.location，因为使用Hash路由时它将与逻辑路由出现偏差。
            </p>
          </article>
          <aside>
            <img width="600" height="400" src={ImgAD} />
          </aside>
        </div>
        <ul className="logos g-clearfix">
          <li>
            <img src={Logo4} width="277" height="138" />
          </li>
          <li>
            <img src={Logo2} width="277" height="138" />
          </li>
          <li>
            <img src={Logo3} width="277" height="138" />
          </li>
          <li>
            <img src={Logo1} width="277" height="138" />
          </li>
        </ul>
      </section>
    );
  }
}

export default Component;
