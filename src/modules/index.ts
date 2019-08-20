import {RootState as BaseState, RouteConfig, ToBrowserUrl, getBrowserHistoryActions, setRouteConfig, toBrowserUrl} from '@medux/react-web-router';

import {defaultRouteParams as comments} from 'modules/comments/meta';
import {exportActions} from '@medux/react-web-router';
import {defaultRouteParams as messages} from 'modules/messages/meta';
import {defaultRouteParams as photos} from 'modules/photos/meta';
import {defaultRouteParams as videos} from 'modules/videos/meta';

export enum moduleNames {
  app = 'app',
  comments = 'comments',
  photos = 'photos',
  videos = 'videos',
  messages = 'messages',
}

const defaultRouteParams: {[K in moduleNames]: any} = {
  app: null,
  photos,
  videos,
  messages,
  comments,
};
setRouteConfig({defaultRouteParams});

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return import(/* webpackChunkName: "app" */ 'modules/app');
  },
  comments: () => {
    return import(/* webpackChunkName: "comments" */ 'modules/comments');
  },
  photos: () => {
    return import(/* webpackChunkName: "photos" */ 'modules/photos');
  },
  videos: () => {
    return import(/* webpackChunkName: "videos" */ 'modules/videos');
  },
  messages: () => {
    return import(/* webpackChunkName: "messages" */ 'modules/messages');
  },
};

export const actions = exportActions(moduleGetter);

export type RootState = BaseState<typeof moduleGetter>;

export const historyActions = getBrowserHistoryActions<RootState['route']['data']['params']>();

export enum viewNames {
  appMain = 'app.Main',
  photosList = 'photos.List',
  photosDetails = 'photos.Details',
  videosList = 'videos.List',
  videosDetails = 'videos.Details',
  commentsMain = 'comments.Main',
  commentsList = 'comments.List',
  commentsDetails = 'comments.Details',
  messagesList = 'messages.List',
}

export const routeConfig: RouteConfig = {
  '/': [
    viewNames.appMain,
    {
      '/photos': viewNames.photosList,
      '/photos/:itemId': [
        viewNames.photosDetails,
        {
          '/:articleType/:articleId/comments': [
            viewNames.commentsMain,
            {
              '/:articleType/:articleId/comments': viewNames.commentsList,
              '/:articleType/:articleId/comments/:itemId': viewNames.commentsDetails,
            },
          ],
        },
      ],
      '/videos': viewNames.videosList,
      '/videos/:itemId': [
        viewNames.videosDetails,
        {
          '/:articleType/:articleId/comments': [
            viewNames.commentsMain,
            {
              '/:articleType/:articleId/comments': viewNames.commentsList,
              '/:articleType/:articleId/comments/:itemId': viewNames.commentsDetails,
            },
          ],
        },
      ],
      '/messages': viewNames.messagesList,
    },
  ],
};

export const toUrl: ToBrowserUrl<RootState['route']['data']['params']> = toBrowserUrl;
