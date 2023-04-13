import type { WorkerResponse } from './response';

export interface WorkerSuccessResponse extends WorkerResponse {
  ok: true;
}
