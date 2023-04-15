import type { PrivateKey } from '../../types';
import type { WorkerJob } from './job';
export type * from './job';
export type WorkerDecryptJob = WorkerJob<'decrypt', string>;
export type WorkerEncryptJob = WorkerJob<'encrypt', string>;
export type WorkerPutJob = WorkerJob<'put', PrivateKey>;
