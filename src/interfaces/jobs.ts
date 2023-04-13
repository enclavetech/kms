import type { KeyManagerAction, PrivateKey, WorkerJobID } from '../types';
import type { KeyManagerRequest } from './requests';

/**
 * Base interface for a worker job request.
 * These are used internally within the package for communication with workers.
 */
export interface WorkerJob<A extends KeyManagerAction, D> extends KeyManagerRequest<A, D> {
  jobID: WorkerJobID;
}

export type WorkerDecryptJob = WorkerJob<'decrypt', string>;
export type WorkerEncryptJob = WorkerJob<'encrypt', string>;
export type WorkerPutJob = WorkerJob<'put', PrivateKey>;
