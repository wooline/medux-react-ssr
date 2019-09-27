import React from 'react';
import {RouteComponentProps} from 'react-router';

export default class HashPage<P = any, S = any> extends React.PureComponent<P & RouteComponentProps, S> {
  private routeHandler?: () => void;
  private routeFlag: string = '';
  private routeTimer: number = 0;

  public componentDidMount() {
    this.scrollToAnchor(this.props.location);
    this.routeHandler = this.props.history.listen(location => {
      this.scrollToAnchor(location);
    });
    document.title = `${initEnv.pageNames[location.pathname] || ''}-${initEnv.siteName}`;
  }

  public componentWillUnmount() {
    if (this.routeTimer) {
      this.routeTimer && clearTimeout(this.routeTimer);
      this.routeTimer = 0;
    }
    this.routeHandler && this.routeHandler();
  }

  private scrollToAnchor = (location: {pathname: string; search: string}) => {
    const routeFlag = location.pathname + location.search;
    if (!this.routeTimer && routeFlag !== this.routeFlag) {
      this.routeFlag = routeFlag;
      this.routeTimer = setTimeout(() => {
        this.routeTimer = 0;
        const reg = new RegExp(`[?&]${metaKeys.AnchorParamKey}=([^?&]+)`);
        let anchor = location.search.match(reg);
        const anchorTarget = anchor ? document.getElementById(anchor[1]) : null;
        anchorTarget ? anchorTarget.scrollIntoView() : (document.body.scrollTop = document.documentElement.scrollTop = 0);
      }, 100);
    }
  };
}
