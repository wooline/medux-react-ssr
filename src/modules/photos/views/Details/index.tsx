import './index.less';

import {Carousel, Icon as MIcon} from 'antd-mobile';
import {DispatchProp, connect} from 'react-redux';
import Icon, {IconClass} from 'components/Icon';
import {RootState, moduleGetter} from 'modules';
import {Route, Switch} from 'react-router-dom';
import {ViewNames, toUrl} from 'common/route';

import {ItemDetail} from 'entity/photo';
import LinkButton from 'components/LinkButton';
import {ModuleNames} from 'modules/names';
import React from 'react';
import {RouteParams} from '../../meta';
import {findDOMNode} from 'react-dom';
import {loadView} from '@medux/react';

const commentsMain = loadView(moduleGetter, 'comments', 'Main');

interface StateProps {
  routeParams: RouteParams;
  showComment: boolean;
  itemDetail: ItemDetail | undefined;
}

interface State {
  moreDetail: boolean;
}

class Component extends React.PureComponent<StateProps & DispatchProp, State> {
  public static getDerivedStateFromProps(nextProps: StateProps & DispatchProp): State | null {
    if (!nextProps.itemDetail) {
      return {moreDetail: false};
    }
    return null;
  }
  public state: State = {
    moreDetail: false,
  };

  private onMoreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };
  private onShowComment = (showComment: boolean) => {
    const itemId = this.props.itemDetail!.id;
    if (!showComment) {
      return toUrl({
        paths: [ViewNames.appMain, ViewNames.photosDetails],
        params: {photos: {...this.props.routeParams, itemId}},
      });
    } else {
      return toUrl({
        paths: [ViewNames.appMain, ViewNames.photosDetails, ViewNames.commentsMain, ViewNames.commentsList],
        params: {photos: {...this.props.routeParams}, comments: {articleType: 'photos', articleId: itemId}},
      });
    }
  };

  public render() {
    const {itemDetail, showComment} = this.props;
    const {moreDetail} = this.state;
    if (itemDetail) {
      return (
        <div className={`${ModuleNames.photos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2>{itemDetail.title}</h2>
            <LinkButton href={toUrl({paths: [ViewNames.appMain, ViewNames.photosList], params: {photos: {...this.props.routeParams, itemId: ''}}})} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </LinkButton>
          </div>
          <div className={'remark' + (moreDetail ? ' on' : '')} onClick={this.onMoreRemark}>
            {itemDetail.remark}
          </div>
          <div className="content">
            <Carousel className="player" autoplay={false} infinite={true}>
              {itemDetail.picList.map(url => (
                <div className="g-pre-img" key={url}>
                  <div className="pic" style={{backgroundImage: `url(${url})`}} />
                </div>
              ))}
            </Carousel>
          </div>

          <LinkButton href={this.onShowComment(true)} className="comment-bar">
            <span>
              <Icon type={IconClass.HEART} />
              <br />
              {itemDetail.hot}
            </span>
            <span>
              <Icon type={IconClass.MESSAGE} />
              <br />
              {itemDetail.comments}
            </span>
          </LinkButton>
          <div className={'comments-panel' + (showComment ? ' on' : '')}>
            <LinkButton href={this.onShowComment(false)} className="mask" />
            <div className="dialog">
              <Switch>
                <Route exact={false} path="/:articleType/:articleId/comments" component={commentsMain} />
              </Switch>
            </div>
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
  const model = state.photos!;
  return {
    routeParams: model.routeParams!,
    showComment: !!state.route.data.views.comments,
    itemDetail: model.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
