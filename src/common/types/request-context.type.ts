export interface RequestContext {
  ip: string;
  path: string;
  method: string;
  baseUrl: string;
  startTime: number;
  uuid: string;
  type: string;
}
