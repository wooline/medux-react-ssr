import './index.less';

import {DispatchProp, connect} from 'react-redux';
import Icon, {IconClass} from 'components/Icon';
import {ViewNames, historyActions, toUrl} from 'common/route';

import React from 'react';
import {RootState} from 'modules';
import {TabBar} from 'antd-mobile';
import {UnauthorizedError} from 'common/Errors';
import {errorAction} from '@medux/react-web-router';
import {uniqueKey} from 'common/utils';

interface Props extends DispatchProp {
  views: RootState['route']['data']['views'];
  hasLogin: boolean;
}

const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault();

class Component extends React.PureComponent<Props> {
  public render() {
    const {views, dispatch} = this.props;
    const photosUrl = toUrl({paths: [ViewNames.appMain, ViewNames.photosList], params: {photos: {_listKey: uniqueKey()}}});
    const videosUrl = toUrl({paths: [ViewNames.appMain, ViewNames.videosList], params: {videos: {_listKey: uniqueKey()}}});
    const messagesUrl = toUrl({paths: [ViewNames.appMain, ViewNames.messagesList], params: {messages: {_listKey: uniqueKey()}}});
    const PhotosLink = (
      <a href={photosUrl} onClick={onClick}>
        <Icon type={IconClass.PICTURE} />
      </a>
    );
    const VideosLink = (
      <a href={videosUrl} onClick={onClick}>
        <Icon type={IconClass.LIVE} />
      </a>
    );
    const MessagesLink = (
      <a href={messagesUrl} onClick={onClick}>
        <Icon type={IconClass.MESSAGE} />
      </a>
    );
    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={PhotosLink}
            selectedIcon={PhotosLink}
            title="组团"
            key="photos"
            selected={!!views.photos}
            onPress={() => {
              historyActions.push(photosUrl);
            }}
          />
          <TabBar.Item
            icon={VideosLink}
            selectedIcon={VideosLink}
            title="分享"
            key="videos"
            selected={!!views.videos}
            onPress={() => {
              historyActions.push(videosUrl);
            }}
          />
          <TabBar.Item
            icon={MessagesLink}
            selectedIcon={MessagesLink}
            title="消息"
            key="messages"
            selected={!!views.messages}
            onPress={() => {
              if (!this.props.hasLogin) {
                dispatch(errorAction(new UnauthorizedError()));
              } else {
                historyActions.push(messagesUrl);
              }
            }}
          />
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    views: state.route.data.views,
    hasLogin: state.app!.curUser!.hasLogin,
  };
};

export default connect(mapStateToProps)(Component);
