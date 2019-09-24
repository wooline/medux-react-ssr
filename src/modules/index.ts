import {LoadView as BaseLoadView, RootState as BaseState, RouteConfig, exportActions, getBrowserHistory, setRouteConfig} from '@medux/react-web-router';

export enum moduleNames {
  app = 'app',
  posterLayout = 'postLayout',
  posterHome = 'postHome',
}

const defaultRouteParams: {[K in moduleNames]?: any} = {};
setRouteConfig({defaultRouteParams});

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return import(/* webpackChunkName: "app" */ 'modules/app');
  },
  posterLayout: () => {
    return import(/* webpackChunkName: "posterLayout" */ 'modules/poster/posterLayout');
  },
  posterHome: () => {
    return import(/* webpackChunkName: "posterHome" */ 'modules/poster/posterHome');
  },
};

export const actions = exportActions(moduleGetter);

export type RootState = BaseState<typeof moduleGetter>;

export type LoadView = BaseLoadView<typeof moduleGetter, React.ComponentType<any>>;

export const {historyActions, toUrl} = getBrowserHistory<RootState['route']['data']['params']>();

export enum viewNames {
  appMain = 'app.Main',
}

export const routeConfig: RouteConfig = {
  '/': [
    'app.Main',
    {
      '/login': 'app.Login',
      '/register': 'app.Register',
      '/user': [
        'userLayout.Main',
        {
          '/user/requirements': 'requirements.Main',
        },
      ],
      '/poster': [
        'posterLayout.Main',
        {
          '/poster/home': 'posterHome.Main',
          '/poster/voiceprint_1n': 'voiceprint_1n.Main',
          '/poster/voiceprint_11': 'voiceprint_11.Main',
          '/poster/voiceprint_nn': 'voiceprint_nn.Main',
          '/poster/voiceprint_clustering': 'voiceprint_clustering.Main',
          '/poster/expansion_cleaning': 'expansion_cleaning.Main',
          '/poster/expansion_emotion': 'expansion_emotion.Main',
          '/poster/expansion_humanlike': 'expansion_humanlike.Main',
          '/poster/expansion_separation': 'expansion_separation.Main',
          '/poster/expansion_sex': 'expansion_sex.Main',
          '/poster/biometric_asr': 'biometric_asr.Main',
          '/poster/biometric_lip': 'biometric_lip.Main',
          '/poster/biometric_face': 'biometric_face.Main',
          '/poster/biometric_voice': 'biometric_voice.Main',
          '/poster/aap': 'aap.Main',
          '/poster/aat': 'aat.Main',
          '/poster/asrtran': 'asrtran.Main',
          '/poster/nlpanalyze': 'nlpanalyze.Main',
          '/poster/tts': 'tts.Main',
          '/poster/cooperationCase': 'cooperationCase.Main',
          '/poster/ai_open': 'ai_open.Main',
          '/poster/oneStopCustom': 'oneStopCustom.Main',
          '/poster/openEco': 'openEco.Main',
        },
      ],
    },
  ],
};
