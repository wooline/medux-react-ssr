import {RootState as BaseState} from '@medux/react-web-router';
import {exportActions} from '@medux/react-web-router';

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

// export type ModuleGetter = typeof moduleGetter;

export const actions = exportActions(moduleGetter);

export type RootState = BaseState<typeof moduleGetter>;

export type RouteDataState = RootState['route']['data'];
