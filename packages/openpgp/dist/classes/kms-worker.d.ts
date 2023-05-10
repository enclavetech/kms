import { KmsWorkerCore, type KmsConfig } from '@enclavetech/kms-core';
export declare class KmsWorker extends KmsWorkerCore {
    protected readonly config: KmsConfig;
    protected worker: Worker;
    constructor(config?: KmsConfig);
}
