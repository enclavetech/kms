import { KmsWorkerCore, type KmsConfig, DEFAULT_CONFIG } from '@enclavetech/kms-core';

export class KmsWorker extends KmsWorkerCore {
  protected worker: Worker;
  constructor(protected readonly config: KmsConfig = DEFAULT_CONFIG) {
    super();
    this.worker = new Worker(new URL('../workers/worker.js?worker', import.meta.url), {
      type: 'module',
    });
    this.worker.onmessage = this.handleCompletedJob.bind(this);
  }
}
