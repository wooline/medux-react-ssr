import {RouteConfig, RoutePayload, buildTransformRoute, fillRouteData, getRouteActions} from '@medux/web-route-plan-a';

import {ModuleNames} from 'modules/names';
import {RootState} from 'modules';
import {defaultRouteParams as comments} from 'modules/comments/meta';
import {getHistoryActions} from '@medux/react-web-router';
import {defaultRouteParams as messages} from 'modules/messages/meta';
import {defaultRouteParams as photos} from 'modules/photos/meta';
import {defaultRouteParams as videos} from 'modules/videos/meta';

export const historyActions = getRouteActions<RootState['route']['data']['params']>(getHistoryActions);

export const defaultRouteParams: {[K in ModuleNames]: any} = {
  app: null,
  photos,
  videos,
  messages,
  comments,
};
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

export const transformRoute = buildTransformRoute(routeConfig);

export function toUrl(routeOptions: RoutePayload<RootState['route']['data']['params']>): string;
export function toUrl(pathname: string, search: string, hash: string): string;
export function toUrl(...args: any[]): string {
  if (args.length === 1) {
    const location = transformRoute.routeToLocation(fillRouteData(args[0] as RoutePayload));
    args = [location.pathname, location.search, location.hash];
  }
  const [pathname, search, hash] = args as [string, string, string];
  let url = pathname;
  if (search) {
    url += '?' + search.replace('?', '');
  }
  if (hash) {
    url += '#' + hash.replace('#', '');
  }
  return url;
}
