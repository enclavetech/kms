import type { PrivateKey } from 'openpgp';
import type { WorkerJob } from './job';

export type * from './job';

export type WorkerDecryptJob = WorkerJob<'decrypt', string>;
export type WorkerEncryptJob = WorkerJob<'encrypt', string>;
export type workerImportKeyJob = WorkerJob<'importKey', PrivateKey>;
