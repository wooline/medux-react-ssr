import {ProjectConfig} from 'entity/global';
import request from 'common/request';

export class API {
  public getSettings() {
    return request<ProjectConfig>('get', '/ajax/project-config').then(projectConfig => {
      projectConfig.logoUrl = initEnv.clientPublicPath + projectConfig.logoUrl;
      projectConfig.startupPage.imageUrl = initEnv.clientPublicPath + projectConfig.startupPage.imageUrl;
      return projectConfig;
    });
  }

  public reportError(error: any): Promise<boolean> {
    console.log('report', error.message);
    return Promise.resolve(true);
  }
}

export const api = new API();
