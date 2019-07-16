import './index.less';

import {DispatchProp, connect} from 'react-redux';
import {RootState, moduleGetter} from 'modules';
import {Route, Switch} from 'react-router-dom';
import {ViewNames, historyActions} from 'common/route';

import {ItemDetail} from 'entity/video';
import {Icon as MIcon} from 'antd-mobile';
import {ModuleNames} from 'modules/names';
import React from 'react';
import {RouteParams} from '../../meta';
import {findDOMNode} from 'react-dom';
import {loadView} from '@medux/react';

const commentsMain = loadView(moduleGetter, 'comments', 'Main');

interface StateProps {
  routeParams: RouteParams;
  itemDetail: ItemDetail | undefined;
}

class Component extends React.PureComponent<StateProps & DispatchProp> {
  private onClose = () => {
    historyActions.push({paths: [ViewNames.appMain, ViewNames.videosList], params: {videos: {...this.props.routeParams, itemId: ''}}});
  };

  public render() {
    const {itemDetail} = this.props;
    if (itemDetail) {
      return (
        <div className={`${ModuleNames.videos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2 />
            <span onClick={this.onClose} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </span>
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

export default connect(mapStateToProps)(Component);
