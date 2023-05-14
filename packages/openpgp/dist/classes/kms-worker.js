import { KmsWorkerCore } from '@enclavetech/kms-core';
export class KmsWorker extends KmsWorkerCore {
    constructor() {
        super();
        this.worker = new Worker(new URL('../workers/worker.js?worker', import.meta.url), {
            type: 'module',
        });
        this.worker.onmessage = this.handleCompletedJob.bind(this);
    }
}
