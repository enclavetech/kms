import type { PrivateKeyID } from '../../types';
import type { WorkerResponse } from './response';

export interface WorkerSuccessResponse extends WorkerResponse {
  ok: true;
  privateKeyID: PrivateKeyID;
}
