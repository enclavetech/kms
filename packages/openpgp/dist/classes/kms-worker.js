import { KmsWorkerCore, DEFAULT_CONFIG } from '@enclavetech/kms-core';
export class KmsWorker extends KmsWorkerCore {
    constructor(config = DEFAULT_CONFIG) {
        super();
        this.config = config;
        this.worker = new Worker(new URL('../workers/worker.js?worker', import.meta.url), {
            type: 'module',
        });
        this.worker.onmessage = this.onmessage.bind(this);
    }
}
