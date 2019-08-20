import './index.less';

import {Route, Switch} from 'react-router-dom';

import {ItemDetail} from 'entity/video';
import LinkButton from 'components/LinkButton';
import {Icon as MIcon} from 'antd-mobile';
import React from 'react';
import {RouteParams} from '../../meta';
import {findDOMNode} from 'react-dom';

const commentsMain = loadView(moduleGetter, 'comments', 'Main');

interface StateProps {
  routeParams: RouteParams;
  itemDetail: ItemDetail | undefined;
}

class Component extends React.PureComponent<StateProps & DispatchProp> {
  public render() {
    const {itemDetail} = this.props;
    if (itemDetail) {
      return (
        <div className={`${moduleNames.videos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2 />
            <LinkButton href={toUrl({paths: [viewNames.appMain, viewNames.videosList], params: {videos: {...this.props.routeParams, itemId: ''}}})} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </LinkButton>
          </div>
          <div className="content">
            <video width="100%" height="100%" autoPlay={true} controls={true} preload="auto" muted={false} playsInline={true} poster={itemDetail.coverUrl}>
              <source src={itemDetail.videoUrl} type="video/mp4" />
            </video>
          </div>
          <div className="comments-panel">
            <Switch>
              <Route exact={false} path="/:articleType/:articleId/comments" component={commentsMain} />
            </Switch>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  private fadeIn() {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf('g-enter-in') > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace('g-enter-in', '');
      }, 0);
    }
  }
  public componentDidUpdate() {
    this.fadeIn();
  }
  public componentDidMount() {
    this.fadeIn();
  }
}

const mapStateToProps: (state: RootState) => StateProps = state => {
  const model = state.videos!;
  return {
    routeParams: model.routeParams!,
    itemDetail: model.itemDetail,
  };
};

export default reduxConnect(mapStateToProps)(Component);
