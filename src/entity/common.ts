export type CommonErrorCode = 'unknown' | 'notFound' | 'unauthorized' | 'redirect';

export interface ErrorEntity<Detail = any> {
  code: string;
  message?: string;
  detail?: Detail;
}

export class CustomError<Detail = any> {
  public constructor(public code: string, public message?: string, public detail?: Detail) {}
}

export class RedirectError extends CustomError {
  public constructor(code: '301' | '302', detail: string) {
    super('redirect', code, detail);
  }
}
export class UnauthorizedError extends CustomError {
  public constructor() {
    super('请登录', '401');
  }
}

export interface Result<Data, Error extends ErrorEntity> {
  data: Data;
  error?: Error;
}

export interface BaseListSummary {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface BaseListSearch {
  page: number;
  pageSize: number;
}
export interface BaseListItem {
  id: string;
}
