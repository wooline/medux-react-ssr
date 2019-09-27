import './index.less';

import {Icon} from 'antd';
import ImgAD from './imgs/ad.png';
import {Link} from 'react-router-dom';
import React from 'react';

interface StoreProps {}
// 首屏由服务器渲染，之后的交互过程直接使用浏览器渲染，不再经过SSR服务器，既提升了用户体验，又减少了服务器负载。
class Component extends React.PureComponent<StoreProps> {
  public render() {
    return (
      <section className="posterHome-Recommend" id="posterHome-Recommend">
        <div className="g-doc">
          <h2>精品推荐</h2>
          <div className="g-activities reverse g-clearfix">
            <article>
              <p>
                通常使用SSR服务器渲染主要有两大目的“利于SEO”和“提升页面速度”
                <br />
                如果主要目的是为了搜索引擎SEO，那么某些需要用户登录的页面在服务器端渲染是没有任何意义的，反而加重了SSR服务器的负担，此时服务器仅简单的输出一个Loading组件即可。
                <br />
                <cite>
                  例如本例中：<Link to="/user/home">/user/home</Link> 页面
                </cite>
              </p>
            </article>
            <aside>
              <img width="600" height="350" src={ImgAD} />
            </aside>
          </div>
          <div className="summary g-clearfix">
            <div>
              <Icon type="alert" />
              <h4>行业积累与技术沉淀</h4>
              <p>企业在相应行业和领域中拥有长期的业务积累，对市场与客户需求有深刻理解，并在行业内处于领先地位。</p>
            </div>
            <div>
              <Icon type="bug" />
              <h4>优质产品，业务创新</h4>
              <p>拥有被市场充分验证的优质产品与服务，创新产品形态和经营模式，提升客户价值，共同获得更高的市场收益</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Component;
