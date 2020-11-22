export type RouteMethod = 'POST' | 'PATCH' | 'PUT' | 'GET' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE';

export interface RouteDoc {
  method: RouteMethod;
  path: string;
}
