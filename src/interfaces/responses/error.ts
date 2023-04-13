import type { WorkerResponse } from './response';

export interface WorkerErrorResponse extends WorkerResponse {
  error: string;
  ok: false;
}
