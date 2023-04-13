import type { WorkerSuccessResponse } from './success';

export interface WorkerSuccessDataResponse extends WorkerSuccessResponse {
  data: string;
}
