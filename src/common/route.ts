import {RouteConfig, ToBrowserUrl} from '@medux/react-web-router/types/export';
import {getBrowserHistoryActions, setRouteConfig, toBrowserUrl} from '@medux/react-web-router';

import {ModuleNames} from 'modules/names';
import {RootState} from 'modules';
import {defaultRouteParams as comments} from 'modules/comments/meta';
import {defaultRouteParams as messages} from 'modules/messages/meta';
import {defaultRouteParams as photos} from 'modules/photos/meta';
import {defaultRouteParams as videos} from 'modules/videos/meta';

export const historyActions = getBrowserHistoryActions<RootState['route']['data']['params']>();

export const defaultRouteParams: {[K in ModuleNames]: any} = {
  app: null,
  photos,
  videos,
  messages,
  comments,
};
setRouteConfig({defaultRouteParams});

export enum ViewNames {
  'appMain' = 'app.Main',
  'photosList' = 'photos.List',
  'photosDetails' = 'photos.Details',
  'videosList' = 'videos.List',
  'videosDetails' = 'videos.Details',
  'commentsMain' = 'comments.Main',
  'commentsList' = 'comments.List',
  'commentsDetails' = 'comments.Details',
  'messagesList' = 'messages.List',
}

export const routeConfig: RouteConfig = {
  '/': [
    ViewNames.appMain,
    {
      '/photos': ViewNames.photosList,
      '/photos/:itemId': [
        ViewNames.photosDetails,
        {
          '/:articleType/:articleId/comments': [
            ViewNames.commentsMain,
            {
              '/:articleType/:articleId/comments': ViewNames.commentsList,
              '/:articleType/:articleId/comments/:itemId': ViewNames.commentsDetails,
            },
          ],
        },
      ],
      '/videos': ViewNames.videosList,
      '/videos/:itemId': [
        ViewNames.videosDetails,
        {
          '/:articleType/:articleId/comments': [
            ViewNames.commentsMain,
            {
              '/:articleType/:articleId/comments': ViewNames.commentsList,
              '/:articleType/:articleId/comments/:itemId': ViewNames.commentsDetails,
            },
          ],
        },
      ],
      '/messages': ViewNames.messagesList,
    },
  ],
};

export const toUrl: ToBrowserUrl<RootState['route']['data']['params']> = toBrowserUrl;

export function linkTo(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute('href') as string;
  if (href && href !== '#') {
    historyActions.push(href);
  }
}
